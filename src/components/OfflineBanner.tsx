import React from 'react';
import { useApp } from '../context/AppContext';
import { WifiOff, RefreshCw } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const { isOnline, offlineQueue, syncQueue, isSyncing, t } = useApp();

  if (isOnline && offlineQueue.length === 0) return null;

  return (
    <aside
      id="offline-alert-banner"
      aria-label="Offline Mode Status"
      className="bg-amber-500 text-stone-950 px-4 py-2 text-xs sm:text-sm font-medium shadow-sm transition-all"
    >
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <WifiOff className="w-4 h-4 text-stone-950 shrink-0" />
          ) : (
            <RefreshCw className="w-4 h-4 text-stone-950 shrink-0" />
          )}
          <span>
            {!isOnline
              ? t('offlineNotice')
              : `${offlineQueue.length} ${t('pendingSync')}`}
          </span>
        </div>

        {isOnline && offlineQueue.length > 0 && (
          <button
            id="offline-banner-sync-btn"
            onClick={syncQueue}
            disabled={isSyncing}
            className="bg-stone-900 text-white hover:bg-stone-800 px-3 py-1 rounded-full text-xs font-semibold shadow-xs disabled:opacity-50 transition"
          >
            {isSyncing ? 'Syncing...' : t('syncNow')}
          </button>
        )}
      </div>
    </aside>
  );
};
