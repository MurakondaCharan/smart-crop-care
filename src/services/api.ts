import {
  Buyer,
  BuyerEnquiry,
  ColdStorage,
  DiagnosisResult,
  FPO,
  FarmerCrop,
  FarmerProfile,
  LogisticsProvider,
  MarketPrice,
  OfflineQueueItem,
  PaymentTransaction,
  SoilHealthReport,
  StorageRequest,
  TransportRequest,
  TreatmentGuide,
  TreatmentProduct,
} from '../types';
import {
  demoFarmers,
  samplePaymentTransactions,
  sampleSoilHealthReports,
  sampleTreatmentProducts,
} from '../data/seedData';

const OFFLINE_QUEUE_KEY = 'smart_crop_care_offline_queue';

export function getOfflineQueue(): OfflineQueueItem[] {
  try {
    const raw = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToOfflineQueue(item: Omit<OfflineQueueItem, 'id' | 'timestamp'>): OfflineQueueItem {
  const fullItem: OfflineQueueItem = {
    ...item,
    id: `queue-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
  };
  const queue = getOfflineQueue();
  queue.push(fullItem);
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
  return fullItem;
}

export function clearOfflineQueue() {
  localStorage.removeItem(OFFLINE_QUEUE_KEY);
}

export const api = {
  // Profile & Authentication
  async getProfile(): Promise<FarmerProfile> {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      return data.profile;
    } catch {
      const stored = localStorage.getItem('farmer_profile');
      if (stored) return JSON.parse(stored);
      return demoFarmers[0];
    }
  },

  async getDemoAccounts(): Promise<FarmerProfile[]> {
    try {
      const res = await fetch('/api/auth/demo-accounts');
      const data = await res.json();
      return data.accounts;
    } catch {
      return demoFarmers;
    }
  },

  async sendOtp(phone: string, channel: 'sms' | 'whatsapp' | 'voice' = 'sms'): Promise<{ success: boolean; message: string; otp?: string; isRegistered?: boolean; farmerName?: string }> {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, channel }),
      });
      return await res.json();
    } catch {
      // Local fallback in offline mode
      return {
        success: true,
        message: `OTP sent via ${channel.toUpperCase()} to +91 ${phone}`,
        otp: '5824',
        isRegistered: phone === '9848012345',
        farmerName: phone === '9848012345' ? 'Venkat Rao' : undefined,
      };
    }
  },

  async verifyOtp(payload: {
    phone: string;
    otp: string;
    name?: string;
    village?: string;
    district?: string;
    state?: string;
    landSizeAcres?: number;
    cropsGrown?: string[];
  }): Promise<{ success: boolean; profile: FarmerProfile; message: string }> {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.profile) {
        localStorage.setItem('farmer_profile', JSON.stringify(data.profile));
      }
      return data;
    } catch {
      // Offline fallback: match demo profile
      const matched = demoFarmers.find((f) => f.phone === payload.phone) || {
        ...demoFarmers[0],
        name: payload.name || 'Farmer',
        phone: payload.phone,
        village: payload.village || demoFarmers[0].village,
      };
      matched.isLoggedIn = true;
      localStorage.setItem('farmer_profile', JSON.stringify(matched));
      return { success: true, profile: matched, message: `Logged in as ${matched.name}` };
    }
  },

  async switchAccount(farmerId: string): Promise<{ success: boolean; profile: FarmerProfile; message: string }> {
    try {
      const res = await fetch('/api/auth/switch-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farmerId }),
      });
      const data = await res.json();
      if (data.success && data.profile) {
        localStorage.setItem('farmer_profile', JSON.stringify(data.profile));
      }
      return data;
    } catch {
      const matched = demoFarmers.find((f) => f.id === farmerId) || demoFarmers[0];
      matched.isLoggedIn = true;
      localStorage.setItem('farmer_profile', JSON.stringify(matched));
      return { success: true, profile: matched, message: `Switched to ${matched.name}` };
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    const stored = localStorage.getItem('farmer_profile');
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed.isLoggedIn = false;
      localStorage.setItem('farmer_profile', JSON.stringify(parsed));
    }
  },

  async updateProfile(profile: Partial<FarmerProfile>): Promise<FarmerProfile> {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      localStorage.setItem('farmer_profile', JSON.stringify(data.profile));
      return data.profile;
    } catch {
      localStorage.setItem('farmer_profile', JSON.stringify(profile));
      return profile as FarmerProfile;
    }
  },

  // Treatment Products Catalog
  async getTreatmentProducts(crop?: string, disease?: string): Promise<TreatmentProduct[]> {
    try {
      const params = new URLSearchParams();
      if (crop) params.append('crop', crop);
      if (disease) params.append('disease', disease);
      const res = await fetch(`/api/treatment-products?${params.toString()}`);
      const data = await res.json();
      return data.products;
    } catch {
      return sampleTreatmentProducts;
    }
  },

  // Soil Health Reports
  async getSoilHealth(farmerId: string): Promise<SoilHealthReport> {
    try {
      const res = await fetch(`/api/soil-health/${farmerId}`);
      const data = await res.json();
      return data.report;
    } catch {
      return sampleSoilHealthReports.find((r) => r.farmerId === farmerId) || sampleSoilHealthReports[0];
    }
  },

  // Payment Gateway Processing
  async processPayment(payload: {
    farmerId?: string;
    farmerName?: string;
    farmerPhone?: string;
    category: 'treatment_kit' | 'cold_storage_deposit' | 'transport_booking' | 'buyer_token';
    title: string;
    description: string;
    amount: number;
    method: 'upi' | 'kcc' | 'netbanking' | 'cod';
    methodDetails?: string;
    itemDetails?: Record<string, any>;
    relatedEntityId?: string;
  }): Promise<{ success: boolean; message: string; transaction: PaymentTransaction; kccAvailable?: number }> {
    try {
      const res = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.transaction) {
        // Save into local transactions cache as well
        const raw = localStorage.getItem('payment_history');
        const list: PaymentTransaction[] = raw ? JSON.parse(raw) : [];
        list.unshift(data.transaction);
        localStorage.setItem('payment_history', JSON.stringify(list));
      }
      return data;
    } catch {
      // Local fallback transaction creation
      const localTxn: PaymentTransaction = {
        id: `txn-${Date.now()}`,
        farmerId: payload.farmerId || 'farmer-101',
        farmerName: payload.farmerName || 'Venkat Rao',
        farmerPhone: payload.farmerPhone || '9848012345',
        category: payload.category,
        title: payload.title,
        description: payload.description,
        amount: payload.amount,
        method: payload.method,
        methodDetails:
          payload.methodDetails ||
          (payload.method === 'upi'
            ? 'UPI'
            : payload.method === 'kcc'
            ? 'Kisan Credit Card'
            : payload.method === 'netbanking'
            ? 'Net Banking'
            : `Pay ₹${payload.amount} in cash to the delivery driver upon receipt`),
        status: payload.method === 'cod' ? 'CONFIRMED' : 'SUCCESS',
        receiptNo:
          payload.method === 'cod'
            ? `COD-AGRI-2026-${Math.floor(10000 + Math.random() * 90000)}`
            : `REC-AGRI-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        date: new Date().toLocaleDateString('en-GB') + ', ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        relatedEntityId: payload.relatedEntityId,
        itemDetails: payload.itemDetails,
      };
      const raw = localStorage.getItem('payment_history');
      const list: PaymentTransaction[] = raw ? JSON.parse(raw) : [...samplePaymentTransactions];
      list.unshift(localTxn);
      localStorage.setItem('payment_history', JSON.stringify(list));
      return { success: true, message: 'Payment confirmed and recorded successfully!', transaction: localTxn };
    }
  },

  async getPaymentHistory(farmerId?: string): Promise<PaymentTransaction[]> {
    try {
      const res = await fetch(`/api/payments/history/${farmerId || ''}`);
      const data = await res.json();
      if (data.transactions && data.transactions.length > 0) {
        localStorage.setItem('payment_history', JSON.stringify(data.transactions));
        return data.transactions;
      }
    } catch {}
    const raw = localStorage.getItem('payment_history');
    return raw ? JSON.parse(raw) : samplePaymentTransactions;
  },

  // Crops
  async getCrops(): Promise<FarmerCrop[]> {
    try {
      const res = await fetch('/api/crops');
      const data = await res.json();
      localStorage.setItem('cached_crops', JSON.stringify(data.crops));
      return data.crops;
    } catch {
      const cached = localStorage.getItem('cached_crops');
      return cached ? JSON.parse(cached) : [];
    }
  },

  async addCrop(crop: Partial<FarmerCrop>): Promise<FarmerCrop> {
    if (!navigator.onLine) {
      const localCrop: FarmerCrop = {
        id: `local-crop-${Date.now()}`,
        name: crop.name || 'Tomato',
        variety: crop.variety || 'Hybrid',
        season: crop.season || 'Rabi',
        growthStage: crop.growthStage || 'Vegetative',
        healthStatus: 'Healthy',
        acreage: crop.acreage || 1,
        lastDiagnosis: 'Added offline',
        lastDiagnosisDate: 'Today',
      };
      saveToOfflineQueue({ type: 'crop', payload: localCrop });
      return localCrop;
    }
    const res = await fetch('/api/crops', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(crop),
    });
    const data = await res.json();
    return data.crop;
  },

  // Diagnosis
  async analyzeCropImage(params: {
    file: File | Blob;
    cropName?: string;
    diseaseHint?: string;
  }): Promise<DiagnosisResult> {
    const formData = new FormData();
    formData.append('image', params.file);
    if (params.cropName) formData.append('cropName', params.cropName);
    if (params.diseaseHint) formData.append('diseaseHint', params.diseaseHint);

    try {
      const res = await fetch('/api/diagnosis/analyze', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(
          data.message ||
            "We couldn't analyze this image. Please upload a clear photo of the affected crop."
        );
      }
      const diagnosis: DiagnosisResult = {
        id: data.id || `diag-${Date.now()}`,
        crop: data.crop || 'Tomato',
        disease: data.disease || 'Early Blight',
        possibleProblem: data.disease || 'Early Blight',
        confidence: data.confidence || 92,
        severity: data.severity || 'Moderate',
        imageUrl: data.imageUrl,
        symptoms: data.symptoms || [],
        recommendedActions: data.recommendedActions || data.recommendedAction || [],
        recommendedAction: data.recommendedActions || data.recommendedAction || [],
        prevention: data.prevention || [],
        date: data.date || 'Today, Just now',
        treatmentId: data.disease,
      };
      return diagnosis;
    } catch (err: any) {
      if (!navigator.onLine) {
        const reader = new FileReader();
        const fallbackUrl = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve((reader.result as string) || '');
          reader.readAsDataURL(params.file);
        });

        const fallback: DiagnosisResult = {
          id: `diag-offline-${Date.now()}`,
          crop: params.cropName || 'Tomato',
          disease: params.diseaseHint || 'Early Blight',
          possibleProblem: params.diseaseHint || 'Early Blight',
          confidence: 92,
          severity: 'Moderate',
          imageUrl: fallbackUrl,
          symptoms: [
            'Brown/black spots on leaves',
            'Yellow areas around affected spots',
            'Lower leaves may dry',
          ],
          recommendedActions: [
            'Remove severely affected leaves.',
            'Avoid overhead watering.',
            'Maintain proper air circulation.',
            'Follow locally approved agricultural treatment guidance.',
          ],
          recommendedAction: [
            'Remove severely affected leaves.',
            'Avoid overhead watering.',
            'Maintain proper air circulation.',
            'Follow locally approved agricultural treatment guidance.',
          ],
          prevention: [
            'Use healthy seeds',
            'Maintain proper plant spacing',
            'Monitor the crop regularly',
          ],
          date: 'Offline Diagnosis',
          treatmentId: 'Early Blight',
        };
        saveToOfflineQueue({ type: 'diagnosis', payload: fallback });
        return fallback;
      }
      throw err;
    }
  },

  async diagnoseCrop(params: {
    cropName: string;
    base64Image?: string;
    diseaseHint?: string;
  }): Promise<DiagnosisResult> {
    try {
      const res = await fetch('/api/diagnosis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      return data.diagnosis;
    } catch (err) {
      if (!navigator.onLine) {
        // Fallback diagnosis when completely offline
        const fallback: DiagnosisResult = {
          id: `diag-offline-${Date.now()}`,
          crop: params.cropName || 'Tomato',
          disease: params.diseaseHint || 'Early Blight',
          confidence: 89,
          severity: 'Moderate',
          symptoms: [
            'Brown target-like concentric rings on leaves',
            'Yellow chlorosis around infected areas',
            'Lower foliage affected first',
          ],
          recommendedAction: [
            'Prune and destroy infected leaves immediately',
            'Avoid wetting leaves during irrigation',
            'Ensure adequate row spacing for ventilation',
          ],
          prevention: [
            'Use certified disease-resistant seeds',
            'Rotate with pulses or cereal crops',
          ],
          date: 'Offline Diagnosis',
        };
        saveToOfflineQueue({ type: 'diagnosis', payload: fallback });
        return fallback;
      }
      throw err;
    }
  },

  async getDiagnosisHistory(): Promise<DiagnosisResult[]> {
    try {
      const res = await fetch('/api/diagnosis/history');
      const data = await res.json();
      return data.history;
    } catch {
      return [];
    }
  },

  // Treatment
  async getTreatment(disease: string): Promise<TreatmentGuide> {
    try {
      const res = await fetch(`/api/treatments/${encodeURIComponent(disease)}`);
      const data = await res.json();
      return data.guide;
    } catch {
      // Fallback
      return {
        disease,
        crop: 'Vegetables & Crops',
        symptoms: ['Leaf discoloration', 'Spotted foliage', 'Reduced vigor'],
        whatToDoNow: [
          '1. Remove severely infected leaves.',
          '2. Avoid overhead sprinkler irrigation.',
          '3. Clean and sanitize all pruning tools.',
        ],
        treatment: {
          organic: ['Neem oil spray (5ml/L)', 'Trichoderma viride bio-agent soil treatment'],
          chemical: ['Copper oxychloride (2.5g/L) or Mancozeb protective spray'],
          safeHandling: 'Wear mask and rubber gloves when spraying. Spray during calm morning hours.',
        },
        prevention: ['Maintain plant spacing', 'Ensure balanced soil fertility'],
        importantNotice: 'For severe crop damage, consult a local agricultural officer before spraying chemicals.',
      };
    }
  },

  // Market
  async getMarketPrices(filters?: {
    crop?: string;
    district?: string;
    state?: string;
    market?: string;
  }): Promise<{ data: MarketPrice[]; stats: { lowestPrice: number; highestPrice: number; averagePrice: number } }> {
    const params = new URLSearchParams();
    if (filters?.crop) params.append('crop', filters.crop);
    if (filters?.district) params.append('district', filters.district);
    if (filters?.state) params.append('state', filters.state);
    if (filters?.market) params.append('market', filters.market);

    try {
      const res = await fetch(`/api/market-prices?${params.toString()}`);
      const data = await res.json();
      localStorage.setItem('cached_market_prices', JSON.stringify(data));
      return { data: data.data, stats: data.stats };
    } catch {
      const cached = localStorage.getItem('cached_market_prices');
      if (cached) return JSON.parse(cached);
      return { data: [], stats: { lowestPrice: 0, highestPrice: 0, averagePrice: 0 } };
    }
  },

  // Buyers
  async getBuyers(filters?: { crop?: string; buyerType?: string; maxDistance?: number }): Promise<Buyer[]> {
    const params = new URLSearchParams();
    if (filters?.crop) params.append('crop', filters.crop);
    if (filters?.buyerType) params.append('buyerType', filters.buyerType);
    if (filters?.maxDistance) params.append('maxDistance', String(filters.maxDistance));

    try {
      const res = await fetch(`/api/buyers?${params.toString()}`);
      const data = await res.json();
      localStorage.setItem('cached_buyers', JSON.stringify(data.buyers));
      return data.buyers;
    } catch {
      const cached = localStorage.getItem('cached_buyers');
      return cached ? JSON.parse(cached) : [];
    }
  },

  async sendBuyerEnquiry(enquiry: Partial<BuyerEnquiry>): Promise<BuyerEnquiry> {
    if (!navigator.onLine) {
      const localEnq: BuyerEnquiry = {
        id: `enq-local-${Date.now()}`,
        buyerId: enquiry.buyerId || 'buyer-1',
        buyerName: enquiry.buyerName || 'Buyer',
        farmerName: enquiry.farmerName || 'Farmer',
        farmerPhone: enquiry.farmerPhone || '9848012345',
        crop: enquiry.crop || 'Tomato',
        quantity: enquiry.quantity || '1 MT',
        offeredPrice: enquiry.offeredPrice || '₹28/kg',
        message: enquiry.message || 'Direct inquiry',
        status: 'Pending',
        createdAt: 'Saved Offline',
      };
      saveToOfflineQueue({ type: 'enquiry', payload: localEnq });
      return localEnq;
    }

    const res = await fetch('/api/buyers/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiry),
    });
    const data = await res.json();
    return data.enquiry;
  },

  // FPOs
  async getFPOs(filters?: { crop?: string; district?: string }): Promise<FPO[]> {
    const params = new URLSearchParams();
    if (filters?.crop) params.append('crop', filters.crop);
    if (filters?.district) params.append('district', filters.district);

    try {
      const res = await fetch(`/api/fpos?${params.toString()}`);
      const data = await res.json();
      return data.fpos;
    } catch {
      return [];
    }
  },

  // Cold Storage
  async getColdStorage(filters?: { crop?: string; district?: string }): Promise<ColdStorage[]> {
    const params = new URLSearchParams();
    if (filters?.crop) params.append('crop', filters.crop);
    if (filters?.district) params.append('district', filters.district);

    try {
      const res = await fetch(`/api/cold-storage?${params.toString()}`);
      const data = await res.json();
      return data.storages;
    } catch {
      return [];
    }
  },

  async requestColdStorage(req: Partial<StorageRequest>): Promise<StorageRequest> {
    if (!navigator.onLine) {
      const localReq: StorageRequest = {
        id: `sr-local-${Date.now()}`,
        facilityId: req.facilityId || 'cs-1',
        facilityName: req.facilityName || 'Storage',
        farmerName: req.farmerName || 'Farmer',
        farmerPhone: req.farmerPhone || '9848012345',
        crop: req.crop || 'Tomato',
        quantityMT: req.quantityMT || 2,
        durationMonths: req.durationMonths || 1,
        preferredDate: req.preferredDate || 'Immediate',
        status: 'Received',
        createdAt: 'Saved Offline',
      };
      saveToOfflineQueue({ type: 'storage', payload: localReq });
      return localReq;
    }

    const res = await fetch('/api/cold-storage/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    const data = await res.json();
    return data.request;
  },

  // Logistics
  async getLogistics(filters?: { district?: string }): Promise<LogisticsProvider[]> {
    const params = new URLSearchParams();
    if (filters?.district) params.append('district', filters.district);

    try {
      const res = await fetch(`/api/logistics?${params.toString()}`);
      const data = await res.json();
      return data.logistics;
    } catch {
      return [];
    }
  },

  async requestLogistics(req: Partial<TransportRequest>): Promise<TransportRequest> {
    if (!navigator.onLine) {
      const localReq: TransportRequest = {
        id: `tr-local-${Date.now()}`,
        providerId: req.providerId || 'log-1',
        providerName: req.providerName || 'Transporter',
        farmerName: req.farmerName || 'Farmer',
        farmerPhone: req.farmerPhone || '9848012345',
        pickupLocation: req.pickupLocation || 'Village Farm',
        destination: req.destination || 'Mandi Yard',
        crop: req.crop || 'Tomato',
        quantity: req.quantity || '2 MT',
        vehicle: req.vehicle || 'Tata Ace',
        estimatedCost: req.estimatedCost || 2500,
        distanceKm: req.distanceKm || 45,
        status: 'Booked',
        createdAt: 'Saved Offline',
      };
      saveToOfflineQueue({ type: 'transport', payload: localReq });
      return localReq;
    }

    const res = await fetch('/api/logistics/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    const data = await res.json();
    return data.request;
  },

  // Offline Sync
  async syncOfflineQueue(): Promise<{ syncedCount: number; message: string }> {
    const queue = getOfflineQueue();
    if (!queue.length) {
      return { syncedCount: 0, message: 'No offline records to sync' };
    }

    const res = await fetch('/api/sync/offline-queue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: queue }),
    });
    const data = await res.json();
    if (data.success) {
      clearOfflineQueue();
    }
    return data;
  },

  // Admin stats
  async getAdminStats() {
    const res = await fetch('/api/admin/stats');
    return await res.json();
  },
};
