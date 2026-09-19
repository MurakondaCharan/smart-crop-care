import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { OfflineBanner } from './components/OfflineBanner';
import { JourneyStepper } from './components/JourneyStepper';
import { JourneyCompleteModal } from './components/JourneyCompleteModal';
import { LandingPage } from './pages/LandingPage';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { CropDiagnosisPage } from './pages/CropDiagnosisPage';
import { TreatmentPage } from './pages/TreatmentPage';
import { MarketPricesPage } from './pages/MarketPricesPage';
import { ServicesPage } from './pages/ServicesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { FarmerLoginPage } from './pages/FarmerLoginPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { PaymentModal } from './components/PaymentModal';
import { LayoutDashboard, Compass } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, toast, journey } = useApp();
  const [showLandingView, setShowLandingView] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans antialiased selection:bg-emerald-200">
      {/* Offline Alert Bar */}
      <OfflineBanner />

      {/* Top Application Header */}
      <Header />

      {/* Farmer Guided Journey Progress Bar */}
      {(journey.currentStep > 1 || activeTab === 'cropCare' || activeTab === 'treatment') && (
        <JourneyStepper />
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-4 sm:py-6">
        {/* Toggle between Home Dashboard & Landing / Overview */}
        {activeTab === 'home' && (
          <div className="space-y-4">
            <div className="flex items-center justify-end">
              <button
                id="toggle-home-view-btn"
                onClick={() => setShowLandingView(!showLandingView)}
                className="flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-emerald-800 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-full transition"
              >
                {showLandingView ? (
                  <>
                    <LayoutDashboard className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Go to Farmer Dashboard</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-3.5 h-3.5 text-emerald-700" />
                    <span>App Tour & Features</span>
                  </>
                )}
              </button>
            </div>

            {showLandingView ? (
              <LandingPage onGetStarted={() => setShowLandingView(false)} />
            ) : (
              <FarmerDashboard />
            )}
          </div>
        )}

        {activeTab === 'cropCare' && <CropDiagnosisPage />}
        {activeTab === 'treatment' && <TreatmentPage />}
        {activeTab === 'market' && <MarketPricesPage />}
        {activeTab === 'services' && <ServicesPage />}
        {activeTab === 'profile' && <ProfilePage />}
        {activeTab === 'login' && <FarmerLoginPage />}
        {activeTab === 'payments' && <PaymentsPage />}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Fixed Mobile Bottom Navigation */}
      <BottomNav />

      {/* Celebratory Journey Completion Modal */}
      <JourneyCompleteModal />

      {/* Kisan Agri-Pay Gateway Modal */}
      <PaymentModal />

      {/* Toast Notification Banner */}
      {toast && (
        <aside
          id="app-toast-alert"
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 border border-stone-700 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toast}</span>
        </aside>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
