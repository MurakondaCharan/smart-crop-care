import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  ChevronRight,
  Camera,
  FileText,
  TrendingUp,
  Handshake,
  Snowflake,
  Truck,
  Lock,
} from 'lucide-react';

export const JourneyStepper: React.FC = () => {
  const { journey, setActiveTab, setServicesSubTab, completeJourney, latestDiagnosis, showToast } =
    useApp();

  const steps = [
    { num: 1, label: '1. Crop Photo', icon: Camera, tab: 'cropCare' as const },
    { num: 2, label: '2. Diagnosis', icon: CheckCircle2, tab: 'cropCare' as const },
    { num: 3, label: '3. Treatment', icon: FileText, tab: 'treatment' as const },
    { num: 4, label: '4. Market Price', icon: TrendingUp, tab: 'market' as const },
    { num: 5, label: '5. Buyer / FPO', icon: Handshake, tab: 'services' as const, subTab: 'buyers' as const },
    { num: 6, label: '6. Cold Storage', icon: Snowflake, tab: 'services' as const, subTab: 'coldStorage' as const },
    { num: 7, label: '7. Transport', icon: Truck, tab: 'services' as const, subTab: 'logistics' as const },
  ];

  const handleStepClick = (step: (typeof steps)[0]) => {
    // Step 2 (Diagnosis) is locked until user uploads and analyzes
    if (step.num === 2 && !latestDiagnosis && journey.currentStep < 2) {
      showToast('Please upload or capture a crop photo first.');
      setActiveTab('cropCare');
      return;
    }

    // Step 3 (Treatment) is strictly locked until crop diagnosis is completed
    if (step.num === 3 && !latestDiagnosis) {
      showToast('Please upload or capture a crop photo first.');
      setActiveTab('cropCare');
      return;
    }

    setActiveTab(step.tab);
    if (step.subTab) setServicesSubTab(step.subTab);
  };

  return (
    <div className="bg-emerald-900 text-white px-4 py-3 shadow-md border-b border-emerald-800">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-800 text-emerald-300 px-2 py-0.5 rounded-full">
              Farmer Guided Journey
            </span>
            <span className="text-xs text-emerald-200">
              Step {journey.currentStep} of {steps.length}
            </span>
          </div>

          {journey.completed ? (
            <span className="text-xs font-bold text-emerald-300 flex items-center gap-1 bg-emerald-800/80 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Complete
            </span>
          ) : (
            <button
              onClick={completeJourney}
              className="text-xs text-emerald-300 underline hover:text-white"
            >
              Test Completion
            </button>
          )}
        </div>

        {/* Horizontal scrollable stepper */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = journey.currentStep === step.num;
            const isLocked =
              (step.num === 2 && !latestDiagnosis && journey.currentStep < 2) ||
              (step.num === 3 && !latestDiagnosis);
            const isDone =
              (step.num === 1 && (latestDiagnosis !== null || journey.currentStep > 1)) ||
              (step.num > 1 && journey.currentStep > step.num) ||
              journey.completed;

            return (
              <React.Fragment key={step.num}>
                <button
                  id={`journey-step-btn-${step.num}`}
                  onClick={() => handleStepClick(step)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isCurrent
                      ? 'bg-emerald-500 text-stone-950 shadow-sm font-bold scale-105'
                      : isDone
                      ? 'bg-emerald-800 text-emerald-100 hover:bg-emerald-700'
                      : isLocked
                      ? 'bg-emerald-950/50 text-emerald-400/50 cursor-not-allowed'
                      : 'bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900'
                  }`}
                >
                  {isLocked ? (
                    <Lock className="w-3.5 h-3.5 opacity-70" />
                  ) : isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  ) : (
                    <Icon className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {step.label}
                    {isDone ? ' ✓' : ''}
                  </span>
                </button>
                {idx < steps.length - 1 && (
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
