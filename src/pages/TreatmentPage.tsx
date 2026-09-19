import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { getLocalizedTreatment } from '../locales/localization';
import {
  Volume2,
  VolumeX,
  ShieldAlert,
  Leaf,
  FlaskConical,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Camera,
  Lock,
  ShoppingBag,
  CreditCard,
  Truck,
  ShieldCheck,
} from 'lucide-react';

export const TreatmentPage: React.FC = () => {
  const {
    latestDiagnosis,
    language,
    t,
    speak,
    stopSpeaking,
    isSpeaking,
    setActiveTab,
    updateJourney,
    treatmentProducts,
    openPaymentModal,
    showToast,
  } = useApp();

  const guide = useMemo(() => {
    return getLocalizedTreatment(latestDiagnosis || 'Early Blight', language);
  }, [latestDiagnosis, language]);

  if (!latestDiagnosis) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner border border-amber-200">
          <Lock className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
            {language === 'te' ? 'దశ 3: చికిత్స మార్గదర్శకాలు' : language === 'hi' ? 'चरण 3: उपचार मार्गदर्शन' : 'Step 3: Treatment Guidance'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
            {language === 'te'
              ? 'దయచేసి ముందుగా పంట ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి'
              : language === 'hi'
              ? 'कृपया पहले फसल की फोटो लें या अपलोड करें'
              : 'Please Upload or Capture a Crop Photo First'}
          </h2>
          <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
            {language === 'te'
              ? 'మీ పంట ఆకు ఫోటో మరియు వ్యాధి నిర్ధారణ ఆధారంగా సరైన చికిత్స మరియు మందుల మోతాదులు అందించబడతాయి.'
              : language === 'hi'
              ? 'उपचार की सिफारिशें और कीटनाशक की मात्रा आपकी फसल की फोटो और जांच परिणाम के अनुसार निर्धारित की जाती हैं।'
              : 'Treatment recommendations and pesticide dosages are tailored specifically to your crop leaf photo and AI disease diagnosis.'}
          </p>
        </div>
        <button
          id="go-to-crop-photo-btn"
          onClick={() => {
            updateJourney({ currentStep: 1 });
            setActiveTab('cropCare');
          }}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-2xl shadow-md transition active:scale-95 text-base"
        >
          <Camera className="w-5 h-5" />
          <span>{t('step1Title')}</span>
        </button>
      </div>
    );
  }

  const handleReadAloud = () => {
    if (isSpeaking) {
      stopSpeaking();
      return;
    }
    speak(guide.speechText);
  };

  const handleProceedToMarket = () => {
    updateJourney({ currentStep: 4 });
    setActiveTab('market');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-green-700 text-white rounded-3xl p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
              {t('treatmentPageTitle')}
            </span>
            <span className="text-xs text-emerald-100">
              {t('cropLabel')}: {guide.crop}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            {guide.disease}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            {language === 'te'
              ? 'పంట రక్షణ మరియు నివారణ కొరకు ధృవీకరించబడిన మార్గదర్శకాలు'
              : language === 'hi'
              ? 'फसल सुधार के लिए प्रमाणित एकीकृत कीट प्रबंधन दिशानिर्देश'
              : 'Certified integrated pest management guidelines for farm recovery'}
          </p>
        </div>

        {/* Listen to Advice Button */}
        <button
          id="listen-advice-tts-btn"
          onClick={handleReadAloud}
          className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-extrabold text-sm shadow-md transition active:scale-95 whitespace-nowrap ${
            isSpeaking
              ? 'bg-amber-400 text-stone-950 animate-pulse'
              : 'bg-white text-emerald-900 hover:bg-emerald-50'
          }`}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-5 h-5 text-stone-950" />
              <span>{t('stopVoice')}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-5 h-5 text-emerald-700" />
              <span>{t('listenToAdvice')}</span>
            </>
          )}
        </button>
      </div>

      {/* 1. What You See (Symptoms) */}
      <section className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
        <h2 className="text-base font-extrabold text-stone-900 uppercase tracking-wide flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <span>{t('whatYouSee')}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {guide.symptoms.map((sym, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs sm:text-sm text-stone-800 flex items-start gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <span>{sym}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. What To Do Now (Immediate numbered steps) */}
      <section className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h2 className="text-base font-extrabold text-emerald-900 uppercase tracking-wide flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>{t('whatToDoNow')}</span>
        </h2>
        <div className="space-y-3">
          {guide.whatToDoNow.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex items-start gap-3"
            >
              <div className="w-7 h-7 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                {step}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Treatment: Organic & Chemical */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Organic Solutions */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-emerald-800">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <Leaf className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base">{t('organicTreatment')}</h3>
          </div>
          <ul className="space-y-2.5">
            {guide.treatment.organic.map((item, i) => (
              <li key={i} className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Chemical / Safe Spray */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-teal-800">
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-base">{t('chemicalTreatment')}</h3>
          </div>
          <ul className="space-y-2.5">
            {guide.treatment.chemical.map((item, i) => (
              <li key={i} className="text-xs sm:text-sm text-stone-700 flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-600 mt-1.5 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-stone-500 bg-stone-50 p-2.5 rounded-xl border border-stone-200 leading-relaxed">
            <strong>{t('safeApplication')}:</strong> {guide.treatment.safeHandling}
          </p>
        </div>
      </section>

      {/* 4. Prevention */}
      <section className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
        <h2 className="text-base font-extrabold text-stone-900 uppercase tracking-wide flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <span>{t('prevention')}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guide.prevention.map((prev, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-800 flex items-start gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <span>{prev}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recommended Certified Bio-Treatment Products & Order via Kisan Agri-Pay */}
      <section className="bg-gradient-to-br from-emerald-900 via-green-950 to-stone-900 text-white rounded-3xl p-6 border border-emerald-700 shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-md">
                Certified Bio-Agri Inputs
              </span>
              <span className="text-xs text-stone-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> ICAR & NPOP Approved
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">
              Order Verified Treatment Kits with Kisan Agri-Pay
            </h3>
            <p className="text-xs text-emerald-200">
              Pay securely via UPI (GPay/PhonePe), RuPay Kisan Credit Card (4% int.), or Cash on Delivery.
            </p>
          </div>
          <span className="text-xs text-amber-300 bg-amber-950/60 border border-amber-500/40 px-3 py-1 rounded-full font-semibold">
            🚀 Direct Farm Delivery in 24-48 Hrs
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {treatmentProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 flex flex-col justify-between hover:bg-white/15 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase">
                      {prod.category}
                    </span>
                    <h4 className="font-bold text-white text-sm mt-0.5">{prod.name}</h4>
                    <p className="text-xs text-stone-300">By {prod.brand}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-amber-300">₹{prod.price}</div>
                    <span className="text-[10px] text-stone-300 line-through">₹{prod.originalPrice}</span>
                  </div>
                </div>

                <div className="my-2.5 p-2 rounded-xl bg-black/20 border border-white/10 text-xs text-emerald-100 space-y-1">
                  <div><strong>Target:</strong> {prod.targetDisease}</div>
                  <div><strong>Dosage:</strong> {prod.dosage} ({prod.volume})</div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-white/10 gap-2">
                <span className="text-[11px] text-emerald-200 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" /> Free Village Delivery
                </span>
                <button
                  type="button"
                  id={`buy-product-${prod.id}`}
                  onClick={() =>
                    openPaymentModal({
                      title: prod.name,
                      description: `${prod.volume} • Certified ${prod.category} for ${guide.crop}`,
                      amount: prod.price,
                      category: 'treatment_kit',
                      relatedEntityId: prod.id,
                      itemDetails: {
                        productId: prod.id,
                        volume: prod.volume,
                        brand: prod.brand,
                      },
                      onSuccess: () => {
                        showToast(`Order for ${prod.name} confirmed! Receipt generated.`);
                      },
                    })
                  }
                  className="px-3.5 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Agri-Pay ₹{prod.price}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Important Notice */}
      <section className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 flex items-start gap-3.5">
        <ShieldAlert className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <h3 className="font-extrabold text-amber-900 text-sm">
            {t('importantNoticeTitle')}
          </h3>
          <p className="text-xs sm:text-sm text-amber-800 mt-1 leading-relaxed">
            {guide.importantNotice}
          </p>
        </div>
      </section>

      {/* Proceed to Market Button */}
      <div className="pt-2 flex justify-end">
        <button
          id="treatment-proceed-market-btn"
          onClick={handleProceedToMarket}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold px-8 py-4 rounded-2xl shadow-lg transition active:scale-95 text-sm sm:text-base"
        >
          <span>{t('proceedToMarket')}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
