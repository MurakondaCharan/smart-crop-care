import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

export const JourneyCompleteModal: React.FC = () => {
  const { journey, resetJourney, setActiveTab, t } = useApp();

  if (!journey.completed) return null;

  const handleClose = () => {
    resetJourney();
    setActiveTab('home');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-stone-200 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Success Milestone</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            {t('journeyCompleteTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
            {t('journeyCompleteMsg')}
          </p>
        </div>

        {/* Milestone Summary Checklist */}
        <div className="bg-stone-50 rounded-2xl p-4 text-left border border-stone-100 text-xs space-y-2">
          <div className="flex items-center gap-2 text-stone-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Crop Health Checked:</strong> {journey.diagnosis ? `${journey.diagnosis.crop} (${journey.diagnosis.disease})` : 'Tomato Foliar Leaf Analysis'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-stone-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Treatment Guidance:</strong> Reviewed Organic & Bio-spray remedies
            </span>
          </div>
          <div className="flex items-center gap-2 text-stone-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>APMC Market Rates:</strong> Compared wholesale mandi rates
            </span>
          </div>
          <div className="flex items-center gap-2 text-stone-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Buyer Trade Connection:</strong> Direct inquiry submitted
            </span>
          </div>
          <div className="flex items-center gap-2 text-stone-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Cold Storage & Transport:</strong> Logistics coordinated
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            id="journey-modal-dashboard-btn"
            onClick={handleClose}
            className="w-full sm:w-1/2 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Back to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="journey-modal-new-check-btn"
            onClick={() => {
              resetJourney();
              setActiveTab('cropCare');
            }}
            className="w-full sm:w-1/2 py-3.5 rounded-2xl border border-stone-300 text-stone-700 hover:bg-stone-50 font-bold text-sm transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>New Crop Check</span>
          </button>
        </div>
      </div>
    </div>
  );
};
