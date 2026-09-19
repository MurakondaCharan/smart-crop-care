export type Language = 'en' | 'te' | 'hi';

export interface FarmerProfile {
  id: string;
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  language: Language;
  cropsGrown: string[];
  landSizeAcres: number;
  role: 'farmer' | 'admin';
  isLoggedIn?: boolean;
  kccLimit?: number;
  kccAvailable?: number;
  joinedDate?: string;
}

export type PaymentMethod = 'upi' | 'kcc' | 'netbanking' | 'cod';

export interface PaymentTransaction {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  category: 'treatment_kit' | 'cold_storage_deposit' | 'transport_booking' | 'buyer_token';
  title: string;
  description: string;
  amount: number;
  method: PaymentMethod;
  methodDetails: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED' | 'CONFIRMED';
  receiptNo: string;
  date: string;
  relatedEntityId?: string;
  itemDetails?: Record<string, any>;
}

export interface PaymentRequestData {
  category: 'treatment_kit' | 'cold_storage_deposit' | 'transport_booking' | 'buyer_token';
  title: string;
  description: string;
  amount: number;
  relatedEntityId?: string;
  itemDetails?: Record<string, any>;
  onSuccess?: (txn: PaymentTransaction) => void;
}

export interface SoilHealthReport {
  id: string;
  farmerId: string;
  farmerName: string;
  sampleDate: string;
  labName: string;
  sampleLocation: string;
  soilType: string;
  pH: number;
  ecStatus: string;
  organicCarbonPercent: number;
  nitrogenStatus: 'Low' | 'Medium' | 'High';
  nitrogenKgHa: number;
  phosphorusStatus: 'Low' | 'Medium' | 'High';
  phosphorusKgHa: number;
  potassiumStatus: 'Low' | 'Medium' | 'High';
  potassiumKgHa: number;
  microNutrients: {
    zinc: 'Deficient' | 'Sufficient';
    boron: 'Deficient' | 'Sufficient';
    sulphur: 'Deficient' | 'Sufficient';
    iron: 'Deficient' | 'Sufficient';
  };
  recommendations: string[];
}

export interface TreatmentProduct {
  id: string;
  name: string;
  brand: string;
  category: 'Organic Bio-Fungicide' | 'Eco Insecticide' | 'Complete Care Kit';
  targetDisease: string;
  targetCrop: string;
  volume: string;
  price: number;
  originalPrice: number;
  dosage: string;
  safetyRating: string;
  cibApproved: boolean;
  inStock: boolean;
  description: string;
}

export interface FarmerCrop {
  id: string;
  userId?: string;
  name: string;
  variety?: string;
  season: 'Kharif' | 'Rabi' | 'Zaid';
  growthStage: 'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Harvesting';
  healthStatus: 'Healthy' | 'Needs Attention' | 'Infected';
  acreage: number;
  lastDiagnosis?: string;
  lastDiagnosisDate?: string;
}

export interface DiagnosisResult {
  id: string;
  userId?: string;
  crop: string;
  disease: string;
  possibleProblem?: string;
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'High' | 'Severe';
  symptoms: string[];
  recommendedActions?: string[];
  recommendedAction: string[];
  prevention: string[];
  date: string;
  imageUrl?: string;
  treatmentId?: string;
}

export interface TreatmentGuide {
  disease: string;
  crop: string;
  symptoms: string[];
  whatToDoNow: string[];
  treatment: {
    organic: string[];
    chemical: string[];
    safeHandling: string;
  };
  prevention: string[];
  importantNotice: string;
}

export interface MarketPrice {
  id: string;
  crop: string;
  market: string;
  district: string;
  state: string;
  price: number;
  unit: string;
  minPrice: number;
  maxPrice: number;
  trend: 'up' | 'down' | 'steady';
  updatedAt: string;
  isVerifiedDemo: boolean;
}

export interface Buyer {
  id: string;
  name: string;
  buyerType: 'Wholesaler' | 'Food Processor' | 'Retail Chain' | 'Exporter' | 'Local Aggregator';
  cropRequired: string;
  requiredQuantity: string;
  expectedPrice: string;
  location: string;
  district: string;
  state: string;
  distanceKm: number;
  contact: string;
  phone?: string;
  verified: boolean;
  minOrder: string;
  paymentTerms?: string;
}

export interface BuyerEnquiry {
  id: string;
  buyerId: string;
  buyerName: string;
  farmerName: string;
  farmerPhone: string;
  crop: string;
  quantity: string;
  offeredPrice: string;
  message: string;
  status: 'Pending' | 'Accepted' | 'Contacted';
  createdAt: string;
}

export interface FPO {
  id: string;
  name: string;
  location: string;
  district: string;
  state: string;
  cropsHandled: string[];
  memberCount: number;
  membersCount?: number;
  contact: string;
  phone?: string;
  contactPerson?: string;
  services: string[];
  establishedYear: number;
}

export interface ColdStorage {
  id: string;
  name: string;
  location: string;
  district: string;
  state: string;
  distanceKm: number;
  capacityMT: number;
  availableSpaceMT: number;
  suitableFor: string[];
  ratePerMonth: string;
  contact: string;
  phone?: string;
  temperatureRange: string;
}

export interface StorageRequest {
  id: string;
  facilityId: string;
  facilityName: string;
  farmerName: string;
  farmerPhone: string;
  crop: string;
  quantityMT: number;
  durationMonths: number;
  preferredDate: string;
  status: 'Received' | 'Confirmed';
  createdAt: string;
}

export interface LogisticsProvider {
  id: string;
  provider: string;
  vehicle: string;
  capacity: string;
  location: string;
  district: string;
  estimatedCostBase: number;
  perKmRate: number;
  contact: string;
  phone?: string;
  rating: number;
  activeTrips: number;
}

export interface TransportRequest {
  id: string;
  providerId: string;
  providerName: string;
  farmerName: string;
  farmerPhone: string;
  pickupLocation: string;
  destination: string;
  crop: string;
  quantity: string;
  vehicle: string;
  estimatedCost: number;
  distanceKm: number;
  status: 'Booked' | 'Dispatched';
  createdAt: string;
}

export interface OfflineQueueItem {
  id: string;
  type: 'enquiry' | 'storage' | 'transport' | 'crop' | 'diagnosis';
  payload: any;
  timestamp: number;
}

export interface JourneyState {
  currentStep: number;
  cropSelected?: string;
  diagnosis?: DiagnosisResult;
  buyerSelected?: Buyer;
  enquirySent?: BuyerEnquiry;
  storageSelected?: ColdStorage;
  storageRequest?: StorageRequest;
  logisticsSelected?: LogisticsProvider;
  transportRequest?: TransportRequest;
  completed: boolean;
}
