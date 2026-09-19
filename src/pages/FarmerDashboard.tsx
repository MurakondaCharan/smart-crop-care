import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Camera,
  FileText,
  TrendingUp,
  Handshake,
  Building2,
  Snowflake,
  Truck,
  Plus,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
  MapPin,
  CreditCard,
  BadgeCheck,
  Receipt,
  History,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { FarmerCrop } from '../types';

export const FarmerDashboard: React.FC = () => {
  const {
    profile,
    isLoggedIn,
    crops,
    addCrop,
    t,
    setActiveTab,
    setServicesSubTab,
    startJourney,
    latestDiagnosis,
    soilHealth,
    paymentHistory,
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newCropName, setNewCropName] = useState('Tomato');
  const [newVariety, setNewVariety] = useState('Hybrid');
  const [newSeason, setNewSeason] = useState<'Kharif' | 'Rabi' | 'Zaid'>('Rabi');
  const [newStage, setNewStage] = useState<'Germination' | 'Vegetative' | 'Flowering' | 'Fruiting' | 'Harvesting'>('Vegetative');
  const [newAcreage, setNewAcreage] = useState('1.5');

  const handleAddCropSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCrop({
      name: newCropName,
      variety: newVariety,
      season: newSeason,
      growthStage: newStage,
      healthStatus: 'Healthy',
      acreage: Number(newAcreage) || 1,
    });
    setShowAddModal(false);
  };

  const quickActions = [
    {
      id: 'check-crop',
      label: t('actionCheckCrop'),
      sub: 'AI Leaf Diagnosis',
      icon: Camera,
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      badge: 'Step 1',
      action: () => startJourney('Tomato'),
    },
    {
      id: 'treatment-advice',
      label: t('actionTreatment'),
      sub: 'Safe Bio & Fungicides',
      icon: FileText,
      color: 'bg-green-700 hover:bg-green-800 text-white',
      badge: 'Step 2',
      action: () => setActiveTab('treatment'),
    },
    {
      id: 'market-prices',
      label: t('actionMarketPrices'),
      sub: 'Mandi Benchmarks',
      icon: TrendingUp,
      color: 'bg-amber-600 hover:bg-amber-700 text-white',
      badge: 'Step 3',
      action: () => setActiveTab('market'),
    },
    {
      id: 'find-buyers',
      label: t('actionFindBuyers'),
      sub: 'Direct Trade Enquiries',
      icon: Handshake,
      color: 'bg-teal-700 hover:bg-teal-800 text-white',
      badge: 'Step 4',
      action: () => {
        setActiveTab('services');
        setServicesSubTab('buyers');
      },
    },
    {
      id: 'find-fpo',
      label: t('actionFindFPO'),
      sub: 'Farmer Cooperatives',
      icon: Building2,
      color: 'bg-blue-700 hover:bg-blue-800 text-white',
      badge: 'Members',
      action: () => {
        setActiveTab('services');
        setServicesSubTab('fpos');
      },
    },
    {
      id: 'cold-storage',
      label: t('actionColdStorage'),
      sub: 'Preserve Perishables',
      icon: Snowflake,
      color: 'bg-cyan-700 hover:bg-cyan-800 text-white',
      badge: 'Step 5',
      action: () => {
        setActiveTab('services');
        setServicesSubTab('coldStorage');
      },
    },
    {
      id: 'transport',
      label: t('actionTransport'),
      sub: 'Mini-Truck Dispatch',
      icon: Truck,
      color: 'bg-lime-700 hover:bg-lime-800 text-white',
      badge: 'Step 6',
      action: () => {
        setActiveTab('services');
        setServicesSubTab('logistics');
      },
    },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Welcome Banner */}
      <section className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-800 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {t('greeting')}, {profile.name} 👋
              </h1>
              {isLoggedIn ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-emerald-100 flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3 text-emerald-300" /> Logged In
                </span>
              ) : (
                <button
                  type="button"
                  id="dashboard-login-link-btn"
                  onClick={() => setActiveTab('login')}
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-900 hover:bg-amber-300 transition-colors"
                >
                  Sign In with OTP
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-3 text-emerald-100 text-xs sm:text-sm">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                {profile.village}, {profile.district} ({profile.state})
              </span>
              <span>•</span>
              <span>{profile.landSizeAcres} Acres</span>
              <span>•</span>
              <span className="bg-emerald-900/60 px-2 py-0.5 rounded-full text-emerald-200 text-xs font-semibold">
                {profile.cropsGrown.join(', ')}
              </span>
            </div>

            {/* Quick Summary Pill for KCC & Saved History */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                id="view-soil-kcc-btn"
                onClick={() => setActiveTab('profile')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-xl text-white text-[11px] font-semibold border border-white/20 transition-colors"
              >
                <CreditCard className="w-3 h-3 text-amber-300" />
                <span>KCC Credit: ₹{(profile.kccAvailable ?? 165000).toLocaleString('en-IN')}</span>
              </button>

              <button
                type="button"
                id="view-history-dash-btn"
                onClick={() => setActiveTab('profile')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-xl text-white text-[11px] font-semibold border border-white/20 transition-colors"
              >
                <History className="w-3 h-3 text-emerald-300" />
                <span>Saved History & Soil Card</span>
              </button>

              <button
                type="button"
                id="view-receipts-dash-btn"
                onClick={() => setActiveTab('profile')}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 rounded-xl text-white text-[11px] font-semibold border border-white/20 transition-colors"
              >
                <Receipt className="w-3 h-3 text-teal-300" />
                <span>Receipts ({paymentHistory.length})</span>
              </button>
            </div>
          </div>

          <button
            id="start-full-journey-btn"
            onClick={() => startJourney('Tomato')}
            className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold px-5 py-3 rounded-2xl shadow-md transition active:scale-95 text-sm whitespace-nowrap self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4 text-stone-950" />
            <span>Start Guided Crop Journey</span>
          </button>
        </div>
      </section>

      {/* Prominent Spotlight for Farmer Login and Kisan Agri-Pay Gateway */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Farmer Login */}
        <div className="bg-gradient-to-br from-emerald-50 to-green-100/70 rounded-3xl p-5 sm:p-6 border-2 border-emerald-300 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-700 text-white">
                Farmer Authentication
              </span>
              <span className="text-xs font-bold text-emerald-800">
                {isLoggedIn ? 'Active: ' + profile.name : 'Not Logged In'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-stone-900 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-sm">
                🔑
              </span>
              <span>Farmer Login & Accounts</span>
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Login with your 10-digit mobile number using SMS, WhatsApp, or Voice-guided OTP. Switch between demo farmers (AP, Gujarat, Punjab) to view saved history and soil health cards.
            </p>
          </div>

          <div className="pt-4 mt-2">
            <button
              type="button"
              id="dash-spotlight-login-btn"
              onClick={() => setActiveTab('login')}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl text-xs sm:text-sm shadow-sm transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{isLoggedIn ? 'Switch / View Farmer Account' : 'Open Farmer Login Page'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Card 2: Kisan Agri-Pay */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-100/70 rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-600 text-white">
                Payment Gateway
              </span>
              <span className="text-xs font-bold text-amber-900">
                KCC Limit: ₹{(profile.kccAvailable ?? 165000).toLocaleString('en-IN')}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-stone-900 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm">
                💳
              </span>
              <span>Kisan Agri-Pay & Payment Methods</span>
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Experience the integrated gateway supporting UPI (GPay/PhonePe), RuPay Kisan Credit Card (4% interest subsidy), Core Net Banking, and Cash on Delivery with official receipts.
            </p>
          </div>

          <div className="pt-4 mt-2">
            <button
              type="button"
              id="dash-spotlight-payment-btn"
              onClick={() => setActiveTab('payments')}
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black rounded-xl text-xs sm:text-sm shadow-sm transition active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Open Agri-Pay & Payment Methods</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Latest Diagnosis Alert if available */}
      {latestDiagnosis && (
        <section className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-200 text-amber-900 shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded-full">
                  Recent Leaf Diagnosis
                </span>
                <span className="text-xs text-stone-500">{latestDiagnosis.date}</span>
              </div>
              <h4 className="font-bold text-stone-900 text-base mt-1">
                {latestDiagnosis.crop}: {latestDiagnosis.disease} ({latestDiagnosis.confidence}% Match)
              </h4>
              <p className="text-stone-600 text-xs sm:text-sm mt-0.5 line-clamp-1">
                {latestDiagnosis.recommendedAction[0] || 'Check treatment advice to protect your yield.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('treatment')}
              className="w-full sm:w-auto bg-amber-700 hover:bg-amber-800 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs transition"
            >
              {t('viewTreatment')}
            </button>
          </div>
        </section>
      )}

      {/* Quick Actions (Large Buttons for Farmers) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-stone-900">
            {t('quickActions')}
          </h2>
          <span className="text-xs text-stone-500 font-medium">
            Touch any service to proceed
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((qa) => {
            const Icon = qa.icon;
            return (
              <button
                key={qa.id}
                id={`qa-btn-${qa.id}`}
                onClick={qa.action}
                className={`flex flex-col items-start p-4 rounded-2xl shadow-xs transition active:scale-95 text-left border border-white/20 relative group ${qa.color}`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="p-2.5 bg-white/20 backdrop-blur-xs rounded-xl text-white">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full text-white/90">
                    {qa.badge}
                  </span>
                </div>
                <span className="font-bold text-base sm:text-lg leading-tight">
                  {qa.label}
                </span>
                <span className="text-xs text-white/80 mt-1 line-clamp-1">
                  {qa.sub}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* My Crops Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-stone-900">
              {t('myCrops')}
            </h2>
            <p className="text-xs text-stone-500">
              Current standing crops registered in your farm
            </p>
          </div>

          <button
            id="open-add-crop-modal-btn"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold px-3.5 py-2 rounded-xl text-xs sm:text-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t('addCrop')}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {crops.map((crop) => {
            const isHealthy = crop.healthStatus === 'Healthy';
            const isNeedsAttn = crop.healthStatus === 'Needs Attention';

            return (
              <div
                key={crop.id}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-emerald-400 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-lg text-stone-900">
                        {crop.name}
                      </h3>
                      <p className="text-xs text-stone-500">
                        {crop.variety || 'Desi Hybrid'} • {crop.acreage} Acres
                      </p>
                    </div>

                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                        isHealthy
                          ? 'bg-emerald-100 text-emerald-800'
                          : isNeedsAttn
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {isHealthy ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {crop.healthStatus}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs border-t border-stone-100 pt-3">
                    <div className="flex items-center justify-between text-stone-600">
                      <span>{t('growthStage')}:</span>
                      <span className="font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-sm">
                        {crop.growthStage}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-stone-600">
                      <span>Season:</span>
                      <span className="font-medium text-stone-800">{crop.season}</span>
                    </div>
                    <div className="text-stone-600 pt-1">
                      <span className="block text-stone-500">{t('lastDiagnosis')}:</span>
                      <span className="font-medium text-stone-800 line-clamp-2 mt-0.5">
                        {crop.lastDiagnosis || 'No recent diseases detected'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
                  <button
                    onClick={() => startJourney(crop.name)}
                    className="w-full flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold py-2 rounded-xl transition"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Check Health</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Add Crop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200">
            <h3 className="text-xl font-bold text-stone-900 mb-4">{t('addCrop')}</h3>

            <form onSubmit={handleAddCropSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Crop Name
                </label>
                <select
                  value={newCropName}
                  onChange={(e) => setNewCropName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="Tomato">Tomato</option>
                  <option value="Paddy">Paddy / Rice</option>
                  <option value="Chilli">Chilli</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Potato">Potato</option>
                  <option value="Maize">Maize</option>
                  <option value="Turmeric">Turmeric</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Variety
                </label>
                <input
                  type="text"
                  value={newVariety}
                  onChange={(e) => setNewVariety(e.target.value)}
                  placeholder="e.g. Arka Rakshak / BPT 5204"
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Season
                  </label>
                  <select
                    value={newSeason}
                    onChange={(e) => setNewSeason(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Rabi">Rabi</option>
                    <option value="Kharif">Kharif</option>
                    <option value="Zaid">Zaid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Growth Stage
                  </label>
                  <select
                    value={newStage}
                    onChange={(e) => setNewStage(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Germination">Germination</option>
                    <option value="Vegetative">Vegetative</option>
                    <option value="Flowering">Flowering</option>
                    <option value="Fruiting">Fruiting</option>
                    <option value="Harvesting">Harvesting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Acreage (Acres)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  value={newAcreage}
                  onChange={(e) => setNewAcreage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-stone-700 hover:bg-stone-50"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-700 text-white text-sm font-bold hover:bg-emerald-800 shadow-sm"
                >
                  {t('submit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
