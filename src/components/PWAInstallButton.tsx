import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { t } = useApp();

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    return (
      <button
        id="pwa-install-btn"
        onClick={install}
        className="flex items-center gap-1.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 text-xs font-semibold shadow-sm transition active:scale-95"
        title={t('installAppSubtitle')}
      >
        <Download className="w-3.5 h-3.5" />
        <span>{t('installApp')}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          id="pwa-install-ios-btn"
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-full border border-emerald-600 bg-emerald-50 text-emerald-800 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-100 transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t('installApp')} (iOS)</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-stone-200">
              <h3 className="text-lg font-bold text-stone-900">Install Smart Crop Care on iPhone / iPad</h3>
              <p className="mt-3 text-sm text-stone-600 leading-relaxed">
                1. Tap the <strong>Share</strong> icon in your Safari bottom toolbar.<br />
                2. Scroll down and tap <strong>Add to Home Screen</strong>.<br />
                3. Tap <strong>Add</strong> to access the app anytime offline.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-emerald-700 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800 transition"
              >
                {t('close')}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
