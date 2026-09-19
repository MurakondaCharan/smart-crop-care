import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Language, PaymentTransaction } from '../types';
import {
  User,
  Phone,
  MapPin,
  Globe,
  Sprout,
  Ruler,
  RefreshCw,
  WifiOff,
  CheckCircle2,
  Trash2,
  Save,
  CreditCard,
  History,
  FileText,
  Activity,
  Receipt,
  Download,
  Printer,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Volume2,
  X,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react';
import { clearOfflineQueue } from '../services/api';
import { demoFarmers } from '../data/seedData';
import { PaymentReceiptModal } from '../components/PaymentReceiptModal';

export const ProfilePage: React.FC = () => {
  const {
    profile,
    updateProfile,
    isLoggedIn,
    switchFarmerAccount,
    logoutFarmer,
    language,
    setLanguage,
    t,
    isOnline,
    offlineQueue,
    syncQueue,
    isSyncing,
    showToast,
    diagnoses,
    soilHealth,
    paymentHistory,
    setActiveTab,
    openPaymentModal,
    speak,
  } = useApp();

  const [activeSubSection, setActiveSubSection] = useState<'history' | 'editProfile' | 'switchFarmer' | 'sync'>('history');
  const [historyTab, setHistoryTab] = useState<'diagnoses' | 'soilHealth' | 'payments'>('diagnoses');
  const [viewingReceipt, setViewingReceipt] = useState<PaymentTransaction | null>(null);

  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [village, setVillage] = useState(profile.village);
  const [district, setDistrict] = useState(profile.district);
  const [state, setState] = useState(profile.state);
  const [landSize, setLandSize] = useState(String(profile.landSizeAcres));
  const [cropsGrown, setCropsGrown] = useState(profile.cropsGrown.join(', '));

  // Sync state when profile changes
  React.useEffect(() => {
    setName(profile.name);
    setPhone(profile.phone);
    setVillage(profile.village);
    setDistrict(profile.district);
    setState(profile.state);
    setLandSize(String(profile.landSizeAcres));
    setCropsGrown(profile.cropsGrown.join(', '));
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name,
      phone,
      village,
      district,
      state,
      landSizeAcres: Number(landSize) || 2,
      cropsGrown: cropsGrown.split(',').map((c) => c.trim()).filter(Boolean),
    });
  };

  const handleClearQueue = () => {
    if (confirm('Clear pending offline queued submissions?')) {
      clearOfflineQueue();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Farmer Account Header Card */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-green-950 text-white rounded-3xl p-6 shadow-md border border-emerald-700 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-700/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center font-black text-2xl shadow-inner">
              {profile.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{profile.name}</h1>
                {isLoggedIn ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" /> Logged In
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Guest Mode
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-emerald-200 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>+91 {profile.phone}</span>
                <span>•</span>
                <span>{profile.village}, {profile.district}</span>
                <span>•</span>
                <span>{profile.landSizeAcres} Acres</span>
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {profile.cropsGrown.map((crop) => (
                  <span
                    key={crop}
                    className="px-2 py-0.5 bg-white/10 text-emerald-100 rounded-md text-[11px] font-semibold border border-white/10"
                  >
                    🌾 {crop}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Kisan Credit Card Quick Balance Pill */}
          <div className="bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl p-3 sm:text-right w-full md:w-auto">
            <div className="flex md:justify-end items-center gap-1.5 text-xs text-emerald-300 font-semibold">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Kisan Credit Card (RuPay)</span>
            </div>
            <div className="text-xl font-black text-white mt-0.5">
              ₹{(profile.kccAvailable ?? 165000).toLocaleString('en-IN')}
            </div>
            <div className="text-[10px] text-emerald-200">
              Total Limit: ₹{(profile.kccLimit ?? 200000).toLocaleString('en-IN')} • 4% Subvention
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Action Bar for Login & Payment Methods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          id="profile-goto-login-page-btn"
          onClick={() => setActiveTab('login')}
          className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-left transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold">
              🔑
            </div>
            <div>
              <div className="text-xs font-black text-emerald-950 group-hover:text-emerald-800">
                Farmer Login & OTP Page
              </div>
              <div className="text-[11px] text-emerald-700">
                Switch demo accounts or log in via SMS/Voice OTP
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition" />
        </button>

        <button
          type="button"
          id="profile-goto-payments-hub-btn"
          onClick={() => setActiveTab('payments')}
          className="p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-left transition flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              💳
            </div>
            <div>
              <div className="text-xs font-black text-stone-900 group-hover:text-amber-900">
                Kisan Agri-Pay & Methods
              </div>
              <div className="text-[11px] text-stone-600">
                View UPI, RuPay KCC, Net Banking & test gateway
              </div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-700 group-hover:translate-x-1 transition" />
        </button>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-stone-200 overflow-x-auto gap-2 bg-stone-100/70 p-1.5 rounded-2xl">
        <button
          type="button"
          id="profile-tab-history"
          onClick={() => setActiveSubSection('history')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubSection === 'history'
              ? 'bg-white text-emerald-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <History className="w-4 h-4 text-emerald-700" />
          <span>Saved History & Cards</span>
        </button>

        <button
          type="button"
          id="profile-tab-edit"
          onClick={() => setActiveSubSection('editProfile')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubSection === 'editProfile'
              ? 'bg-white text-emerald-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <User className="w-4 h-4 text-emerald-700" />
          <span>Farm & Land Details</span>
        </button>

        <button
          type="button"
          id="profile-tab-switch"
          onClick={() => setActiveSubSection('switchFarmer')}
          className={`flex-1 min-w-[140px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubSection === 'switchFarmer'
              ? 'bg-white text-emerald-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <RefreshCw className="w-4 h-4 text-emerald-700" />
          <span>Switch / Login</span>
        </button>

        <button
          type="button"
          id="profile-tab-sync"
          onClick={() => setActiveSubSection('sync')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeSubSection === 'sync'
              ? 'bg-white text-emerald-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <WifiOff className="w-4 h-4 text-emerald-700" />
          <span>Offline Sync ({offlineQueue.length})</span>
        </button>
      </div>

      {/* SECTION 1: SAVED HISTORY & REPORTS */}
      {activeSubSection === 'history' && (
        <div className="space-y-4">
          {/* Sub-Tabs for History */}
          <div className="flex gap-2 border-b border-stone-200 pb-2">
            <button
              type="button"
              id="subtab-diagnoses"
              onClick={() => setHistoryTab('diagnoses')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                historyTab === 'diagnoses'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              Crop Diagnoses History ({diagnoses.length})
            </button>

            <button
              type="button"
              id="subtab-soil"
              onClick={() => setHistoryTab('soilHealth')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                historyTab === 'soilHealth'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Soil Health Card (SHC)
            </button>

            <button
              type="button"
              id="subtab-payments"
              onClick={() => setHistoryTab('payments')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
                historyTab === 'payments'
                  ? 'bg-emerald-700 text-white'
                  : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              Purchase & Payment Receipts ({paymentHistory.length})
            </button>
          </div>

          {/* Sub-Tab 1: Crop Diagnoses History */}
          {historyTab === 'diagnoses' && (
            <div className="space-y-3">
              {diagnoses.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-stone-200">
                  <Sprout className="w-12 h-12 text-emerald-600 mx-auto mb-3 opacity-60" />
                  <h3 className="font-bold text-stone-800 text-base">No Diagnoses Recorded Yet</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
                    Upload or capture a photo of your leaf/crop in Crop Care to diagnose pests and save reports.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('cropCare')}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs"
                  >
                    Start Crop Diagnosis Now
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {diagnoses.map((diag, index) => (
                    <div
                      key={diag.id || index}
                      className="bg-white rounded-2xl p-4 border border-stone-200 hover:border-emerald-300 transition-colors shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            {diag.crop}
                          </span>
                          <span className="text-[11px] font-bold text-stone-500">
                            {diag.date || 'Recent'}
                          </span>
                        </div>
                        <h4 className="font-bold text-stone-900 text-sm mt-1.5">{diag.disease}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              diag.severity === 'Severe'
                                ? 'bg-red-100 text-red-800'
                                : diag.severity === 'Moderate'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            Severity: {diag.severity}
                          </span>
                          <span className="text-[11px] text-stone-500">
                            Confidence: {Math.round(diag.confidence * 100)}%
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-2 line-clamp-2">{diag.symptoms}</p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-[11px] text-stone-500 font-mono">
                          ID: {diag.id ? diag.id.slice(0, 10) : 'diag-rec'}
                        </span>
                        <button
                          type="button"
                          onClick={() => setActiveTab('treatment')}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                        >
                          View Treatment Advice <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Sub-Tab 2: Soil Health Card */}
          {historyTab === 'soilHealth' && (
            <div className="space-y-4">
              {soilHealth ? (
                <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-stone-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded">
                          Soil Health Card (SHC)
                        </span>
                        <span className="text-xs text-stone-500 font-mono">{soilHealth.id}</span>
                      </div>
                      <h3 className="font-extrabold text-stone-900 text-base mt-1">
                        {soilHealth.sampleLocation}
                      </h3>
                      <p className="text-xs text-stone-500">
                        Tested by: {soilHealth.labName} • Sample Date: {soilHealth.sampleDate}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        speak(
                          `మీ భూమి రకం ${soilHealth.soilType}. పిహెచ్ ${soilHealth.pH}. జింక్ లోపం ఉన్నది. ఎకరానికి 10 కేజీల జింక్ సల్ఫేట్ వేయండి.`
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                      Listen Advice
                    </button>
                  </div>

                  {/* Primary Parameters Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                      <span className="text-[11px] text-stone-500 font-semibold block">Soil pH Level</span>
                      <div className="text-xl font-black text-stone-900 mt-0.5">{soilHealth.pH}</div>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                        Optimal Neutral
                      </span>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                      <span className="text-[11px] text-stone-500 font-semibold block">Organic Carbon (OC)</span>
                      <div className="text-xl font-black text-stone-900 mt-0.5">{soilHealth.organicCarbonPercent}%</div>
                      <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.2 rounded">
                        Medium (Target &gt;0.75%)
                      </span>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                      <span className="text-[11px] text-stone-500 font-semibold block">Electrical Conductivity</span>
                      <div className="text-sm font-bold text-stone-900 mt-1">{soilHealth.ecStatus.split(' ')[0]}</div>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded">
                        Non-Saline Safe
                      </span>
                    </div>

                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-center">
                      <span className="text-[11px] text-stone-500 font-semibold block">Soil Texture</span>
                      <div className="text-xs font-bold text-stone-900 mt-1">{soilHealth.soilType}</div>
                      <span className="text-[10px] text-stone-600">High Moisture Retention</span>
                    </div>
                  </div>

                  {/* Macronutrients N-P-K Status */}
                  <div>
                    <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                      Primary Macronutrients (N - P - K)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-stone-800">Nitrogen (N)</span>
                          <span className="font-bold text-amber-700">{soilHealth.nitrogenStatus}</span>
                        </div>
                        <div className="text-lg font-bold text-stone-900 mt-1">{soilHealth.nitrogenKgHa} kg/ha</div>
                        <div className="w-full bg-stone-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-amber-500 h-full w-[55%]"></div>
                        </div>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-stone-800">Phosphorus (P)</span>
                          <span className="font-bold text-emerald-700">{soilHealth.phosphorusStatus}</span>
                        </div>
                        <div className="text-lg font-bold text-stone-900 mt-1">{soilHealth.phosphorusKgHa} kg/ha</div>
                        <div className="w-full bg-stone-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-emerald-500 h-full w-[65%]"></div>
                        </div>
                      </div>

                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-stone-800">Potassium (K)</span>
                          <span className="font-bold text-blue-700">{soilHealth.potassiumStatus}</span>
                        </div>
                        <div className="text-lg font-bold text-stone-900 mt-1">{soilHealth.potassiumKgHa} kg/ha</div>
                        <div className="w-full bg-stone-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                          <div className="bg-blue-600 h-full w-[85%]"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Micronutrients Deficiency Tracker */}
                  <div>
                    <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-2">
                      Micronutrients Deficiency Assessment
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {Object.entries(soilHealth.microNutrients).map(([nutrient, status]) => (
                        <div
                          key={nutrient}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                            status === 'Deficient'
                              ? 'bg-rose-50 border-rose-200 text-rose-900'
                              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          }`}
                        >
                          <span className="font-bold capitalize">{nutrient}</span>
                          <span className="font-semibold text-[10px] px-1.5 py-0.2 rounded bg-white">
                            {status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Laboratory Recommendations */}
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                    <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      Agronomist Soil Management Recommendations
                    </h4>
                    <ul className="space-y-1.5 text-xs text-emerald-900">
                      {soilHealth.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 text-center border border-stone-200">
                  <FileText className="w-10 h-10 text-stone-400 mx-auto mb-2" />
                  <p className="text-xs text-stone-500">No Soil Health Card loaded for this farmer profile.</p>
                </div>
              )}
            </div>
          )}

          {/* Sub-Tab 3: Payment Receipts */}
          {historyTab === 'payments' && (
            <div className="space-y-3">
              {paymentHistory.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-stone-200">
                  <Receipt className="w-12 h-12 text-emerald-600 mx-auto mb-3 opacity-60" />
                  <h3 className="font-bold text-stone-800 text-base">No Payment Receipts Found</h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">
                    Any bio-treatment purchases, cold storage deposits, or transport advances you make will be recorded here with official receipts.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {paymentHistory.map((txn) => (
                    <div
                      key={txn.id}
                      className="bg-white rounded-2xl p-4 border border-stone-200 hover:border-emerald-300 transition-colors shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                          <Receipt className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold bg-stone-100 text-stone-800 px-2 py-0.5 rounded border border-stone-200">
                              {txn.receiptNo}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              {txn.status}
                            </span>
                          </div>
                          <h4 className="font-bold text-stone-900 text-sm mt-1">{txn.title}</h4>
                          <p className="text-xs text-stone-500">{txn.description}</p>
                          <div className="text-[11px] text-stone-500 mt-1 flex flex-wrap items-center gap-2">
                            <span>{txn.date}</span>
                            <span>•</span>
                            <span className="font-mono text-stone-700">{txn.methodDetails}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                        <div className="text-lg font-black text-emerald-700">
                          ₹{txn.amount.toLocaleString('en-IN')}
                        </div>
                        <button
                          type="button"
                          id={`view-receipt-${txn.id}`}
                          onClick={() => setViewingReceipt(txn)}
                          className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold flex items-center gap-1 border border-stone-300"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          View Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: FARM & LAND DETAILS FORM */}
      {activeSubSection === 'editProfile' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xl">
                {name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-stone-900">{name}</h2>
                <p className="text-xs text-stone-500">
                  Registered Farmer ID: {profile.id} • Joined: {profile.joinedDate || '2025'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('farmerName')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('mobileNumber')}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('village')}
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('district')}
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('state')}
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-semibold bg-stone-50 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Haryana">Haryana</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Punjab">Punjab</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('landSize')} (Acres)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {t('preferredLanguage')}
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-semibold bg-stone-50 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="en">English</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="hi">हिंदी (Hindi)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t('cropsGrown')} (Separated by comma)
              </label>
              <input
                type="text"
                value={cropsGrown}
                onChange={(e) => setCropsGrown(e.target.value)}
                placeholder="Tomato, Paddy, Chilli, Wheat"
                className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                id="save-farmer-profile-btn"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>Save Profile Updates</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SECTION 3: SWITCH / LOGIN WITH OTP */}
      {activeSubSection === 'switchFarmer' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <div>
              <h3 className="text-base font-extrabold text-stone-900">Switch Farmer Account</h3>
              <p className="text-xs text-stone-500">
                Switch instantly between pre-configured farmers or log in with mobile OTP
              </p>
            </div>
            <button
              type="button"
              id="open-login-page-btn"
              onClick={() => setActiveTab('login')}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Go to OTP Login Page
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {demoFarmers.map((f) => (
              <div
                key={f.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  profile.id === f.id
                    ? 'bg-emerald-50/80 border-emerald-600 ring-2 ring-emerald-600/30'
                    : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
                      {f.name[0]}
                    </span>
                    {profile.id === f.id && (
                      <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">{f.name}</h4>
                  <p className="text-xs text-stone-600">
                    {f.village}, {f.district} ({f.state})
                  </p>
                  <p className="text-xs font-mono text-stone-500 mt-1">+91 {f.phone}</p>
                  <div className="text-[11px] text-emerald-800 font-semibold mt-2">
                    Land: {f.landSizeAcres} Acres ({f.cropsGrown.slice(0, 2).join(', ')})
                  </div>
                </div>

                <button
                  type="button"
                  id={`switch-to-${f.id}`}
                  disabled={profile.id === f.id}
                  onClick={() => switchFarmerAccount(f.id)}
                  className="mt-4 w-full py-2 bg-white hover:bg-stone-100 disabled:opacity-40 text-stone-800 text-xs font-bold rounded-xl border border-stone-300 shadow-xs"
                >
                  {profile.id === f.id ? 'Currently Active' : 'Switch to this Farmer'}
                </button>
              </div>
            ))}
          </div>

          {/* Logout button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              id="profile-logout-btn"
              onClick={logoutFarmer}
              className="px-4 py-2 text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold border border-rose-200 transition-colors"
            >
              Sign Out of Session
            </button>
          </div>
        </div>
      )}

      {/* SECTION 4: OFFLINE QUEUE MANAGEMENT */}
      {activeSubSection === 'sync' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <RefreshCw className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-stone-900 text-base">
                  Offline Queue & Sync
                </h3>
                <p className="text-xs text-stone-500">
                  {offlineQueue.length} pending operations stored in local cache
                </p>
              </div>
            </div>

            <button
              onClick={syncQueue}
              disabled={!isOnline || isSyncing || offlineQueue.length === 0}
              className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold disabled:opacity-40 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : t('syncNow')}</span>
            </button>
          </div>

          {offlineQueue.length > 0 ? (
            <div className="space-y-2 border-t border-stone-100 pt-3">
              {offlineQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold uppercase text-stone-700 block">
                      Type: {item.type}
                    </span>
                    <span className="text-stone-500">
                      Saved: {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold text-[10px]">
                    Pending Sync
                  </span>
                </div>
              ))}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleClearQueue}
                  className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-bold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Local Queue</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>All farmer requests are fully synchronized with the cloud database.</span>
            </div>
          )}
        </div>
      )}

      {/* Official Payment Receipt / Order Confirmation Modal */}
      <PaymentReceiptModal
        receipt={viewingReceipt}
        paymentMode={viewingReceipt?.method ? viewingReceipt.method.toUpperCase() : undefined}
        onClose={() => setViewingReceipt(null)}
        onContinue={() => setViewingReceipt(null)}
      />
    </div>
  );
};
