import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../locales/translations';
import {
  Buyer,
  BuyerEnquiry,
  ColdStorage,
  DiagnosisResult,
  FarmerCrop,
  FarmerProfile,
  JourneyState,
  Language,
  LogisticsProvider,
  OfflineQueueItem,
  PaymentRequestData,
  PaymentTransaction,
  SoilHealthReport,
  StorageRequest,
  TransportRequest,
  TreatmentProduct,
} from '../types';
import { api, getOfflineQueue } from '../services/api';
import {
  demoFarmers,
  initialCrops,
  initialFarmerProfile,
  samplePaymentTransactions,
  sampleSoilHealthReports,
  sampleTreatmentProducts,
} from '../data/seedData';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import confetti from 'canvas-confetti';

export type ActiveTabType = 'home' | 'cropCare' | 'market' | 'services' | 'profile' | 'admin' | 'treatment' | 'login' | 'payments';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  isOnline: boolean;
  offlineQueue: OfflineQueueItem[];
  syncQueue: () => Promise<void>;
  isSyncing: boolean;

  // Profile & Authentication
  profile: FarmerProfile;
  isLoggedIn: boolean;
  updateProfile: (data: Partial<FarmerProfile>) => Promise<void>;
  switchFarmerAccount: (farmerId: string) => Promise<void>;
  loginWithOtp: (payload: { phone: string; otp: string; name?: string; village?: string; district?: string }) => Promise<boolean>;
  logoutFarmer: () => Promise<void>;
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;

  // Crops
  crops: FarmerCrop[];
  refreshCrops: () => Promise<void>;
  addCrop: (crop: Partial<FarmerCrop>) => Promise<void>;

  // Diagnoses
  diagnoses: DiagnosisResult[];
  latestDiagnosis: DiagnosisResult | null;
  setLatestDiagnosis: (diag: DiagnosisResult | null) => void;
  addDiagnosis: (diag: DiagnosisResult) => void;

  // Farmer Journey Flow
  journey: JourneyState;
  startJourney: (cropName?: string) => void;
  updateJourney: (data: Partial<JourneyState>) => void;
  resetJourney: () => void;
  completeJourney: () => void;

  // Soil Health Card
  soilHealth: SoilHealthReport | null;
  refreshSoilHealth: () => Promise<void>;

  // Treatment Products Catalog
  treatmentProducts: TreatmentProduct[];
  refreshTreatmentProducts: () => Promise<void>;

  // Payment Gateway & Transactions
  paymentHistory: PaymentTransaction[];
  refreshPayments: () => Promise<void>;
  activePaymentModal: PaymentRequestData | null;
  openPaymentModal: (req: PaymentRequestData) => void;
  closePaymentModal: () => void;

  // Audio / Speech
  isSpeaking: boolean;
  speak: (text: string) => void;
  stopSpeaking: () => void;

  // Toast
  toast: string | null;
  showToast: (msg: string) => void;

  // Active view navigation
  activeTab: ActiveTabType;
  setActiveTab: (tab: ActiveTabType) => void;
  servicesSubTab: 'buyers' | 'fpos' | 'coldStorage' | 'logistics';
  setServicesSubTab: (subTab: 'buyers' | 'fpos' | 'coldStorage' | 'logistics') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialJourney: JourneyState = {
  currentStep: 1,
  completed: false,
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isOnline = useOnlineStatus();
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('smartCropLanguage') as Language) ||
           (localStorage.getItem('smart_crop_lang') as Language) || 'en';
  });

  const [profile, setProfile] = useState<FarmerProfile>(() => {
    const saved = localStorage.getItem('farmer_profile');
    return saved ? JSON.parse(saved) : initialFarmerProfile;
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('farmer_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.isLoggedIn !== false;
      } catch {
        return true;
      }
    }
    return true;
  });

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const [crops, setCrops] = useState<FarmerCrop[]>(() => {
    const saved = localStorage.getItem('cached_crops');
    return saved ? JSON.parse(saved) : initialCrops;
  });

  const [diagnoses, setDiagnoses] = useState<DiagnosisResult[]>([]);
  const [latestDiagnosis, setLatestDiagnosis] = useState<DiagnosisResult | null>(null);

  const [journey, setJourney] = useState<JourneyState>(() => {
    const saved = localStorage.getItem('farmer_journey');
    return saved ? JSON.parse(saved) : initialJourney;
  });

  const [soilHealth, setSoilHealth] = useState<SoilHealthReport | null>(() => {
    return sampleSoilHealthReports.find((s) => s.farmerId === profile.id) || sampleSoilHealthReports[0];
  });

  const [treatmentProducts, setTreatmentProducts] = useState<TreatmentProduct[]>(sampleTreatmentProducts);

  const [paymentHistory, setPaymentHistory] = useState<PaymentTransaction[]>(() => {
    const saved = localStorage.getItem('payment_history');
    return saved ? JSON.parse(saved) : samplePaymentTransactions;
  });

  const [activePaymentModal, setActivePaymentModal] = useState<PaymentRequestData | null>(null);

  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTabType>('home');
  const [servicesSubTab, setServicesSubTab] = useState<'buyers' | 'fpos' | 'coldStorage' | 'logistics'>('buyers');

  // Load initial offline queue & data
  useEffect(() => {
    setOfflineQueue(getOfflineQueue());
    refreshCrops();
    refreshPayments();
    refreshSoilHealth();
    refreshTreatmentProducts();
    api.getDiagnosisHistory().then((hist) => {
      if (hist && hist.length) {
        setDiagnoses(hist);
      }
    }).catch(() => {});
  }, []);

  // Update offline queue whenever window online/offline triggers
  useEffect(() => {
    setOfflineQueue(getOfflineQueue());
    if (isOnline && getOfflineQueue().length > 0) {
      syncQueue();
    }
  }, [isOnline]);

  const refreshPayments = async () => {
    try {
      const list = await api.getPaymentHistory(profile.id);
      if (list && list.length) {
        setPaymentHistory(list);
      }
    } catch {
      // keep fallback
    }
  };

  const refreshSoilHealth = async () => {
    try {
      const report = await api.getSoilHealth(profile.id);
      if (report) setSoilHealth(report);
    } catch {
      // keep fallback
    }
  };

  const refreshTreatmentProducts = async () => {
    try {
      const prods = await api.getTreatmentProducts();
      if (prods && prods.length) setTreatmentProducts(prods);
    } catch {}
  };

  const switchFarmerAccount = async (farmerId: string) => {
    try {
      const res = await api.switchAccount(farmerId);
      if (res.success && res.profile) {
        setProfile(res.profile);
        setIsLoggedIn(true);
        showToast(`Switched account to ${res.profile.name} (${res.profile.village})`);
        refreshPayments();
        refreshSoilHealth();
      }
    } catch {
      const matched = demoFarmers.find((f) => f.id === farmerId) || demoFarmers[0];
      setProfile(matched);
      setIsLoggedIn(true);
      showToast(`Switched account to ${matched.name}`);
    }
  };

  const loginWithOtp = async (payload: { phone: string; otp: string; name?: string; village?: string; district?: string }) => {
    try {
      const res = await api.verifyOtp(payload);
      if (res.success && res.profile) {
        setProfile(res.profile);
        setIsLoggedIn(true);
        setShowLoginModal(false);
        showToast(res.message || `Welcome, ${res.profile.name}!`);
        refreshPayments();
        refreshSoilHealth();
        return true;
      }
      showToast('Login failed: ' + res.message);
      return false;
    } catch (err: any) {
      showToast(err.message || 'OTP verification error');
      return false;
    }
  };

  const logoutFarmer = async () => {
    await api.logout();
    setIsLoggedIn(false);
    showToast('Logged out of farmer session');
  };

  const openPaymentModal = (req: PaymentRequestData) => {
    setActivePaymentModal(req);
  };

  const closePaymentModal = () => {
    setActivePaymentModal(null);
  };

  const setLanguage = (lang: Language) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setLanguageState(lang);
    localStorage.setItem('smartCropLanguage', lang);
    localStorage.setItem('smart_crop_lang', lang);
    showToast(lang === 'te' ? 'భాష తెలుగులోకి మార్చబడింది' : lang === 'hi' ? 'भाषा हिंदी में बदली गई' : 'Language set to English');
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language] || translations.en;
    return langDict[key] || translations.en[key] || fallback || key;
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((current) => (current === msg ? null : current));
    }, 4000);
  };

  const refreshCrops = async () => {
    try {
      const data = await api.getCrops();
      if (data && data.length) setCrops(data);
    } catch {
      // fallback
    }
  };

  const addCrop = async (cropData: Partial<FarmerCrop>) => {
    const newCrop = await api.addCrop(cropData);
    setCrops((prev) => [newCrop, ...prev]);
    setOfflineQueue(getOfflineQueue());
    showToast(t('addCrop') + ' - Success');
  };

  const updateProfile = async (data: Partial<FarmerProfile>) => {
    const updated = await api.updateProfile(data);
    setProfile(updated);
    showToast(t('profileSaved'));
  };

  const addDiagnosis = (diag: DiagnosisResult) => {
    setLatestDiagnosis(diag);
    setDiagnoses((prev) => [diag, ...prev]);
    updateJourney({ diagnosis: diag, currentStep: 2 });
  };

  const startJourney = (cropName = 'Tomato') => {
    const newJourney: JourneyState = {
      currentStep: 1,
      cropSelected: cropName,
      completed: false,
    };
    setLatestDiagnosis(null);
    setJourney(newJourney);
    localStorage.setItem('farmer_journey', JSON.stringify(newJourney));
    setActiveTab('cropCare');
  };

  const updateJourney = (data: Partial<JourneyState>) => {
    setJourney((prev) => {
      const updated = { ...prev, ...data };
      localStorage.setItem('farmer_journey', JSON.stringify(updated));
      return updated;
    });
  };

  const resetJourney = () => {
    const resetState: JourneyState = {
      currentStep: 1,
      completed: false,
    };
    setLatestDiagnosis(null);
    setJourney(resetState);
    localStorage.removeItem('farmer_journey');
  };

  const completeJourney = () => {
    updateJourney({ completed: true, currentStep: 7 });
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#15803d', '#22c55e', '#eab308', '#f97316'],
    });
    showToast(t('journeyCompleteMsg'));
  };

  const syncQueue = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      const res = await api.syncOfflineQueue();
      setOfflineQueue(getOfflineQueue());
      if (res.syncedCount > 0) {
        showToast(res.message);
        refreshCrops();
      }
    } catch (err) {
      console.warn('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  // Text to Speech
  const speak = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      showToast('Audio synthesis not supported on this browser');
      return;
    }
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/[#*•_]/g, ' ').replace(/\s+/g, ' ').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.88; // Slower, comfortable cadence for farmers
    utterance.pitch = 1.0;

    const voiceLanguageMap: Record<Language, string> = {
      en: 'en-IN',
      te: 'te-IN',
      hi: 'hi-IN',
    };
    utterance.lang = voiceLanguageMap[language] || 'en-IN';

    // Attempt to select an authentic native voice for the selected language
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const preferredVoice =
        voices.find((v) => v.lang === utterance.lang) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(language)) ||
        voices.find((v) => v.lang.toLowerCase().includes(language));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    showToast(t('audioPlaying'));
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isOnline,
        offlineQueue,
        syncQueue,
        isSyncing,
        profile,
        isLoggedIn,
        updateProfile,
        switchFarmerAccount,
        loginWithOtp,
        logoutFarmer,
        showLoginModal,
        setShowLoginModal,
        crops,
        refreshCrops,
        addCrop,
        diagnoses,
        latestDiagnosis,
        setLatestDiagnosis,
        addDiagnosis,
        journey,
        startJourney,
        updateJourney,
        resetJourney,
        completeJourney,
        soilHealth,
        refreshSoilHealth,
        treatmentProducts,
        refreshTreatmentProducts,
        paymentHistory,
        refreshPayments,
        activePaymentModal,
        openPaymentModal,
        closePaymentModal,
        isSpeaking,
        speak,
        stopSpeaking,
        toast,
        showToast,
        activeTab,
        setActiveTab,
        servicesSubTab,
        setServicesSubTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
