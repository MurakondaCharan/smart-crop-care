import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, ScanLine, TrendingUp, Handshake, User, CreditCard, LogIn } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, isLoggedIn, t } = useApp();

  const navItems = [
    { id: 'home' as const, label: t('navHome', 'Home'), icon: Home },
    { id: 'cropCare' as const, label: t('navCropCare', 'Crop Doctor'), icon: ScanLine },
    { id: 'payments' as const, label: 'Agri-Pay', icon: CreditCard, highlight: true },
    { id: 'services' as const, label: t('navServices', 'Services'), icon: Handshake },
    { id: 'market' as const, label: t('navMarket', 'Mandi'), icon: TrendingUp },
    {
      id: isLoggedIn ? ('profile' as const) : ('login' as const),
      label: isLoggedIn ? 'Profile' : 'Login',
      icon: isLoggedIn ? User : LogIn,
      badge: !isLoggedIn ? 'OTP' : undefined,
    },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-md border-t border-stone-200 shadow-lg px-2 pb-safe pt-1.5"
    >
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`bottom-nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center min-w-[50px] py-1.5 px-1.5 rounded-xl transition-all relative ${
                isActive
                  ? 'text-emerald-700 font-bold bg-emerald-50/90 scale-105'
                  : item.highlight
                  ? 'text-amber-800 hover:text-amber-900 font-semibold'
                  : 'text-stone-500 hover:text-stone-900 font-medium'
              }`}
            >
              {item.badge && (
                <span className="absolute -top-1 right-1 px-1 py-0.2 rounded-full text-[9px] font-black bg-amber-500 text-stone-950 animate-pulse">
                  {item.badge}
                </span>
              )}
              <Icon
                className={`w-5 h-5 sm:w-5.5 sm:h-5.5 ${
                  isActive ? 'stroke-[2.5]' : item.highlight ? 'stroke-[2.2] text-emerald-700' : 'stroke-[1.8]'
                }`}
              />
              <span className="text-[10px] sm:text-[11px] mt-1 tracking-tight leading-none whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

