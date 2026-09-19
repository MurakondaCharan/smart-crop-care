import React from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { Globe, RefreshCw, ShieldAlert, Volume2, VolumeX, Shield, User, LogIn, BadgeCheck, CreditCard } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    isOnline,
    offlineQueue,
    syncQueue,
    isSyncing,
    isSpeaking,
    stopSpeaking,
    activeTab,
    setActiveTab,
    profile,
    isLoggedIn,
  } = useApp();

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Tagline */}
        <button
          id="header-brand-btn"
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-2.5 text-left group focus:outline-hidden"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center shadow-md shadow-emerald-700/20 text-white font-bold p-1">
            <img src="/icon.svg" alt="Smart Crop Care" className="w-8 h-8 rounded-lg" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-stone-900 text-lg sm:text-xl tracking-tight group-hover:text-emerald-700 transition">
                {t('appName')}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-sm">
                Kisan MVP
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-stone-500 font-medium line-clamp-1">
              {t('tagline')}
            </p>
          </div>
        </button>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Audio TTS toggle indicator */}
          {isSpeaking && (
            <button
              id="stop-audio-btn"
              onClick={stopSpeaking}
              className="flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-semibold animate-pulse"
              title="Stop reading aloud"
            >
              <VolumeX className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Stop Audio</span>
            </button>
          )}

          {/* Online / Offline Status Badge */}
          <div
            id="network-status-badge"
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition ${
              isOnline
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200 animate-pulse'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500' : 'bg-rose-500'}`}
            />
            <span className="hidden xs:inline">{isOnline ? t('online') : t('offlineMode')}</span>
          </div>

          {/* Unsynced Offline Queue Indicator */}
          {offlineQueue.length > 0 && (
            <button
              id="sync-queue-btn"
              onClick={syncQueue}
              disabled={!isOnline || isSyncing}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 rounded-full text-xs font-semibold shadow-xs disabled:opacity-50 transition"
              title="Sync queued data to server"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{offlineQueue.length} unsynced</span>
            </button>
          )}

          {/* PWA Install Button */}
          <PWAInstallButton />

          {/* Language Selector */}
          <div className="relative flex items-center bg-stone-100 rounded-full p-0.5 border border-stone-200 text-xs font-semibold">
            {languages.map((lang) => (
              <button
                key={lang.code}
                id={`lang-btn-${lang.code}`}
                onClick={() => setLanguage(lang.code)}
                className={`px-2.5 py-1 rounded-full transition-all ${
                  language === lang.code
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {lang.native}
              </button>
            ))}
          </div>

          {/* Direct Agri-Pay Gateway Button */}
          <button
            type="button"
            id="header-agripay-btn"
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition ${
              activeTab === 'payments'
                ? 'bg-amber-400 text-stone-950 border-amber-500 shadow-sm'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-950 border-amber-300'
            }`}
            title="Kisan Agri-Pay (UPI, RuPay KCC, Net Banking, COD)"
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-700" />
            <span className="font-extrabold">Agri-Pay</span>
          </button>

          {/* Farmer Account / Login status button */}
          <button
            type="button"
            id="header-farmer-profile-btn"
            onClick={() => setActiveTab(isLoggedIn ? 'profile' : 'login')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition shadow-xs ${
              isLoggedIn
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                : 'bg-emerald-700 text-white border-emerald-800 hover:bg-emerald-800 ring-2 ring-emerald-400/40'
            }`}
            title={isLoggedIn ? 'Farmer Profile & Saved History' : 'Farmer Mobile OTP Login'}
          >
            {isLoggedIn ? (
              <>
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline max-w-[100px] truncate">{profile.name}</span>
                <span className="sm:hidden">Profile</span>
              </>
            ) : (
              <>
                <LogIn className="w-3.5 h-3.5" />
                <span>Farmer Login</span>
              </>
            )}
          </button>

          {/* Admin link */}
          <button
            id="nav-admin-btn"
            onClick={() => setActiveTab(activeTab === 'admin' ? 'home' : 'admin')}
            className={`p-1.5 rounded-full border transition ${
              activeTab === 'admin'
                ? 'bg-stone-800 text-white border-stone-800'
                : 'text-stone-500 border-stone-200 hover:bg-stone-100'
            }`}
            title="Admin Dashboard"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
