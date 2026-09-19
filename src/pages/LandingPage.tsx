import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Camera,
  FileText,
  TrendingUp,
  Handshake,
  Snowflake,
  Truck,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  Wifi,
  Sparkles,
  Users,
  CreditCard,
  LogIn,
} from 'lucide-react';

export const LandingPage: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const { t, setActiveTab, setServicesSubTab, startJourney } = useApp();

  const featureCards = [
    {
      id: 'login',
      title: 'Farmer Login & OTP Auth',
      desc: 'Sign in with phone number via SMS, WhatsApp, or Voice OTP. Save diagnoses and soil cards across sessions.',
      icon: LogIn,
      color: 'bg-emerald-700',
      action: () => setActiveTab('login'),
    },
    {
      id: 'payments',
      title: 'Kisan Agri-Pay Gateway',
      desc: 'Secure payment methods including UPI QR, RuPay Kisan Credit Card (4% interest), Net Banking, and COD.',
      icon: CreditCard,
      color: 'bg-amber-500',
      action: () => setActiveTab('payments'),
    },
    {
      id: 'diagnosis',
      title: t('featureCropDiagnosis', 'Crop Disease Detection'),
      desc: 'Take a photo of sick leaves and get instant AI diagnosis with confidence level.',
      icon: Camera,
      color: 'bg-emerald-500',
      action: () => startJourney('Tomato'),
    },
    {
      id: 'treatment',
      title: t('featureTreatment', 'Treatment Guidance'),
      desc: 'Simple step-by-step remedies with organic options and voice audio support.',
      icon: FileText,
      color: 'bg-green-600',
      action: () => setActiveTab('treatment'),
    },
    {
      id: 'market',
      title: t('featureMarket', 'Market Prices'),
      desc: 'Live daily APMC mandi rates across Andhra Pradesh and Telangana yards.',
      icon: TrendingUp,
      color: 'bg-amber-500',
      action: () => setActiveTab('market'),
    },
    {
      id: 'buyers',
      title: t('featureBuyers', 'Buyers & FPOs'),
      desc: 'Connect directly with verified wholesale buyers, processors, and farmer cooperatives.',
      icon: Handshake,
      color: 'bg-teal-600',
      action: () => {
        setActiveTab('services');
        setServicesSubTab('buyers');
      },
    },
    {
      id: 'storage',
      title: t('featureColdStorage', 'Cold Storage'),
      desc: 'Find nearby refrigerated godowns with real-time available MT space and rates.',
      icon: Snowflake,
      color: 'bg-cyan-600',
      action: () => {
        setActiveTab('services');
        setServicesSubTab('coldStorage');
      },
    },
    {
      id: 'logistics',
      title: t('featureLogistics', 'Transport & Logistics'),
      desc: 'Book farm-gate mini-trucks and tractors with transparent per-km rates.',
      icon: Truck,
      color: 'bg-lime-600',
      action: () => {
        setActiveTab('services');
        setServicesSubTab('logistics');
      },
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-900 text-white p-6 sm:p-12 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/60 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Smart Crop Care & Direct Market Access</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {t('heroTitle')}
          </h1>

          <p className="text-base sm:text-xl text-emerald-100 font-normal leading-relaxed">
            {t('heroSubtitle')}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              id="hero-check-crop-btn"
              onClick={() => startJourney('Tomato')}
              className="flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-6 py-3.5 rounded-2xl shadow-lg shadow-amber-500/20 transition-all active:scale-95 text-sm sm:text-base min-w-[180px]"
            >
              <Camera className="w-5 h-5" />
              <span>{t('checkMyCrop')}</span>
            </button>

            <button
              id="hero-find-market-btn"
              onClick={() => setActiveTab('market')}
              className="flex items-center justify-center gap-2 bg-emerald-900/80 hover:bg-emerald-900 text-white border border-emerald-400/40 font-bold px-6 py-3.5 rounded-2xl transition-all active:scale-95 text-sm sm:text-base"
            >
              <TrendingUp className="w-5 h-5 text-emerald-300" />
              <span>{t('findMarket')}</span>
            </button>

            <button
              id="hero-enter-dashboard-btn"
              onClick={onGetStarted}
              className="flex items-center gap-1.5 text-xs text-emerald-200 hover:text-white px-3 py-2 font-semibold underline underline-offset-4"
            >
              <span>Farmer Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-farmer-login-btn"
              onClick={() => setActiveTab('login')}
              className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span>Farmer Login</span>
            </button>

            <button
              id="hero-agripay-btn"
              onClick={() => setActiveTab('payments')}
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-4 py-2 rounded-xl text-xs transition active:scale-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>Agri-Pay Gateway</span>
            </button>
          </div>

          {/* Quick value badges */}
          <div className="pt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-emerald-600/50 text-xs text-emerald-200">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Basic Phone Friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Works Fully Offline</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Verified APMC Mandis</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - 4-Step Farmer Journey */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {t('howItWorks')}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 mt-1">
            Simple 4-step digital path designed specifically for small and marginal farmers
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-emerald-300 transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg mb-3 group-hover:scale-110 transition">
              1
            </div>
            <h3 className="font-bold text-stone-900 text-base">{t('step1Title')}</h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">{t('step1Desc')}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-emerald-300 transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg mb-3 group-hover:scale-110 transition">
              2
            </div>
            <h3 className="font-bold text-stone-900 text-base">{t('step2Title')}</h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">{t('step2Desc')}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-emerald-300 transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg mb-3 group-hover:scale-110 transition">
              3
            </div>
            <h3 className="font-bold text-stone-900 text-base">{t('step3Title')}</h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">{t('step3Desc')}</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-emerald-300 transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-lg mb-3 group-hover:scale-110 transition">
              4
            </div>
            <h3 className="font-bold text-stone-900 text-base">{t('step4Title')}</h3>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">{t('step4Desc')}</p>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-2xl font-extrabold text-stone-900">
              {t('servicesTitle')}
            </h2>
            <p className="text-sm text-stone-500">
              End-to-end support from seed diagnosis to cold storage and truck dispatch
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:shadow-md hover:border-emerald-400 transition flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl ${feat.color} text-white flex items-center justify-center shadow-md mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-stone-900 text-lg">{feat.title}</h3>
                  <p className="text-stone-600 text-sm mt-2 leading-relaxed">{feat.desc}</p>
                </div>

                <button
                  id={`feature-btn-${feat.id}`}
                  onClick={feat.action}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-800 transition"
                >
                  <span>Open Feature</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Callout Banner */}
      <section className="bg-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
            <Users className="w-3.5 h-3.5" />
            <span>Built For Indian Farmers</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-stone-900">
            Available in English, Telugu (తెలుగు) & Hindi (हिंदी)
          </h3>
          <p className="text-stone-600 text-sm max-w-xl">
            Large touch targets, zero typing requirements, audio speech readout, and automated offline request saving keep your farm connected even in remote villages.
          </p>
        </div>

        <button
          id="cta-start-journey-btn"
          onClick={() => startJourney('Tomato')}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-7 py-3.5 rounded-2xl shadow-md transition active:scale-95 text-sm sm:text-base whitespace-nowrap"
        >
          {t('actionCheckCrop')} Now
        </button>
      </section>
    </div>
  );
};
