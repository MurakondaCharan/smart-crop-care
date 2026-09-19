import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Camera,
  Image as ImageIcon,
  RotateCcw,
  Trash2,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  PhoneCall,
  TrendingUp,
  AlertCircle,
  Pill,
  RefreshCw,
  Sparkles,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { sampleCropPhotos } from '../data/seedData';
import { api } from '../services/api';
import { DiagnosisResult } from '../types';
import tomatoEarlyBlight from '../assets/crops/tomato-early-blight.jpg';
import fallbackCropImage from '../assets/crops/fallback-crop.svg';
import {
  getLocalizedDiagnosis,
  getLocalizedCropName,
  getLocalizedDiseaseName,
} from '../locales/localization';

export const CropDiagnosisPage: React.FC = () => {
  const {
    t,
    language,
    speak,
    stopSpeaking,
    isSpeaking,
    addDiagnosis,
    latestDiagnosis,
    setActiveTab,
    journey,
    updateJourney,
    showToast,
  } = useApp();

  // Screen states: 'upload' | 'preview' | 'analyzing' | 'result' | 'error'
  // When entering Crop Photo, always default to upload unless an active diagnosis was just analyzed in this session
  const [step, setStep] = useState<'upload' | 'preview' | 'analyzing' | 'result' | 'error'>('upload');
  const [selectedCrop, setSelectedCrop] = useState<string>('Tomato');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showExpertModal, setShowExpertModal] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null);

  // Analysis progress checkpoints (animated during analysis)
  const [analysisChecklist, setAnalysisChecklist] = useState<number>(0);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Validate and handle file input
  const processSelectedFile = (file: File) => {
    setErrorMessage(null);

    // Validate file type (JPG, JPEG, PNG, WEBP)
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const fileName = file.name.toLowerCase();
    const hasValidExtension =
      fileName.endsWith('.jpg') ||
      fileName.endsWith('.jpeg') ||
      fileName.endsWith('.png') ||
      fileName.endsWith('.webp');

    if (!validTypes.includes(file.type) && !hasValidExtension) {
      setErrorMessage('Please upload a JPG, PNG, JPEG, or WEBP image.');
      setStep('error');
      return;
    }

    // Validate size: max 10 MB
    const maxSizeBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMessage('Please upload an image smaller than 10 MB.');
      setStep('error');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
      setStep('preview');
    };
    reader.onerror = () => {
      setErrorMessage("We couldn't read the selected photo. Please try again.");
      setStep('error');
    };
    reader.readAsDataURL(file);
  };

  const handleCameraChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
    // reset input value so user can re-select same file if retaken
    e.target.value = '';
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
    e.target.value = '';
  };

  // Convert sample crop image into a File object for seamless demo
  const handleSelectSample = async (sample: (typeof sampleCropPhotos)[0]) => {
    const sampleSrc =
      sample.crop === 'Tomato' && sample.disease === 'Early Blight'
        ? tomatoEarlyBlight
        : sample.thumbnail;
    try {
      setSelectedCrop(sample.crop);
      setErrorMessage(null);

      // Create a dummy image or fetch thumbnail blob
      const res = await fetch(sampleSrc);
      const blob = await res.blob();
      const file = new File([blob], `${sample.crop.toLowerCase()}_sample.jpg`, {
        type: 'image/jpeg',
      });
      processSelectedFile(file);
    } catch {
      // Direct preview fallback
      setImagePreview(sampleSrc);
      setSelectedCrop(sample.crop);
      setStep('preview');
    }
  };

  // Analyze crop button handler
  const handleAnalyzeCrop = async () => {
    if (!selectedFile && !imagePreview) {
      setErrorMessage('Please upload or capture a crop photo first.');
      setStep('error');
      return;
    }

    setErrorMessage(null);
    setStep('analyzing');
    setAnalysisChecklist(1);

    // Stagger progress animation ticks
    const t1 = setTimeout(() => setAnalysisChecklist(2), 600);
    const t2 = setTimeout(() => setAnalysisChecklist(3), 1200);
    const t3 = setTimeout(() => setAnalysisChecklist(4), 1800);

    try {
      let fileToUpload = selectedFile;
      if (!fileToUpload && imagePreview) {
        // Convert data URL to Blob/File
        const fetchRes = await fetch(imagePreview);
        const blob = await fetchRes.blob();
        fileToUpload = new File([blob], 'crop_photo.jpg', { type: blob.type || 'image/jpeg' });
      }

      if (!fileToUpload) {
        throw new Error('Please upload or capture a crop photo first.');
      }

      const result = await api.analyzeCropImage({
        file: fileToUpload,
        cropName: selectedCrop,
      });

      // Ensure analysis image matches uploaded image preview
      if (!result.imageUrl && imagePreview) {
        result.imageUrl = imagePreview;
      }

      setDiagnosisResult(result);
      addDiagnosis(result);
      showToast('Diagnosis complete!');

      // Short delay so farmer sees all 4 steps checked
      setTimeout(() => {
        setStep('result');
      }, 700);
    } catch (err: any) {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      setErrorMessage(
        err?.message ||
          "We couldn't analyze this image. Please upload a clear photo of the affected crop."
      );
      setStep('error');
    }
  };

  const handleRetake = () => {
    setErrorMessage(null);
    setSelectedFile(null);
    setImagePreview(null);
    setDiagnosisResult(null);
    setStep('upload');
  };

  const handleRemove = () => {
    setErrorMessage(null);
    setSelectedFile(null);
    setImagePreview(null);
    setDiagnosisResult(null);
    setStep('upload');
    showToast('Photo removed.');
  };

  const handleViewTreatment = () => {
    updateJourney({ currentStep: 3 });
    setActiveTab('treatment');
  };

  const handleCheckMarket = () => {
    updateJourney({ currentStep: 4 });
    setActiveTab('market');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16 px-3 sm:px-0">
      {/* Hidden File Inputs */}
      {/* TAKE PHOTO: Opens device camera directly on mobile devices */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleCameraChange}
      />

      {/* UPLOAD FROM GALLERY: File picker for JPG, JPEG, PNG, WEBP */}
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={handleGalleryChange}
      />

      {/* 1. UPLOAD SCREEN */}
      {step === 'upload' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm text-center space-y-2">
            <span className="inline-block text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              {t('step1Title')}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
              {t('diagnosisPageTitle')}
            </h1>
            <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto leading-relaxed">
              {t('uploadInstruction')}
            </p>

            {/* Crop Selector Dropdown */}
            <div className="pt-3 max-w-xs mx-auto">
              <label className="block text-xs font-bold text-stone-700 mb-1 text-left uppercase tracking-wider">
                {t('selectCrop')}
              </label>
              <select
                id="crop-selection-dropdown"
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full p-3 rounded-xl border border-stone-300 text-sm font-semibold bg-stone-50 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option value="Tomato">
                  {language === 'te' ? 'టమాటా (Tomato)' : language === 'hi' ? 'टमाटर (Tomato)' : 'Tomato'}
                </option>
                <option value="Paddy">
                  {language === 'te' ? 'వరి / ధాన్యం (Paddy)' : language === 'hi' ? 'धान / चावल (Paddy)' : 'Paddy / Rice'}
                </option>
                <option value="Chilli">
                  {language === 'te' ? 'మిర్చి (Chilli)' : language === 'hi' ? 'मिर्च (Chilli)' : 'Chilli'}
                </option>
                <option value="Cotton">
                  {language === 'te' ? 'ప్రత్తి (Cotton)' : language === 'hi' ? 'कपास (Cotton)' : 'Cotton'}
                </option>
                <option value="Potato">
                  {language === 'te' ? 'బంగాళాదుంప (Potato)' : language === 'hi' ? 'आलू (Potato)' : 'Potato'}
                </option>
              </select>
            </div>
          </div>

          {/* TWO LARGE BUTTONS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 📷 TAKE PHOTO Button */}
            <button
              id="take-photo-camera-btn"
              onClick={() => cameraInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-8 rounded-3xl bg-emerald-700 hover:bg-emerald-800 text-white shadow-lg active:scale-98 transition group min-h-[180px] border-2 border-emerald-600 cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-3 group-hover:scale-110 transition shadow-inner">
                <Camera className="w-9 h-9 text-white" />
              </div>
              <span className="font-black text-xl text-center tracking-wide">
                📷 {t('takePhoto')}
              </span>
              <span className="text-xs text-emerald-100 mt-1.5 font-medium">
                {language === 'te' ? 'స్మార్ట్‌ఫోన్ కెమెరా తెరవబడుతుంది' : language === 'hi' ? 'फ़ोन का कैमरा खुलेगा' : 'Opens smartphone camera'}
              </span>
            </button>

            {/* 🖼️ UPLOAD FROM GALLERY Button */}
            <button
              id="upload-photo-gallery-btn"
              onClick={() => galleryInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white hover:bg-stone-50 text-stone-900 border-2 border-dashed border-emerald-600 shadow-sm active:scale-98 transition group min-h-[180px] cursor-pointer"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-3 group-hover:scale-110 transition text-emerald-700 border border-emerald-100">
                <ImageIcon className="w-9 h-9" />
              </div>
              <span className="font-black text-xl text-center text-stone-900 tracking-wide">
                🖼️ {t('uploadPhoto')}
              </span>
              <span className="text-xs text-stone-500 mt-1.5 font-medium">
                JPG, JPEG, PNG, WEBP (Max 10 MB)
              </span>
            </button>
          </div>

          {/* Demonstration / Sample Photos */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                {t('testWithSampleCrops')}
              </span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sampleCropPhotos.map((sample, idx) => (
                <button
                  key={idx}
                  id={`sample-leaf-${idx}`}
                  onClick={() => handleSelectSample(sample)}
                  className="bg-white rounded-2xl overflow-hidden border border-stone-200 text-left shadow-xs hover:border-emerald-500 hover:shadow-md transition active:scale-98 flex flex-col group cursor-pointer"
                >
                  <div className="relative h-28 w-full bg-stone-100 overflow-hidden">
                    <img
                      src={
                        sample.crop === 'Tomato' && sample.disease === 'Early Blight'
                          ? tomatoEarlyBlight
                          : sample.thumbnail
                      }
                      alt={
                        sample.crop === 'Tomato' && sample.disease === 'Early Blight'
                          ? 'Tomato leaf showing Early Blight'
                          : `${sample.crop} leaf showing ${sample.disease}`
                      }
                      onError={(e) => {
                        e.currentTarget.src = fallbackCropImage;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-2 left-2 text-[10px] font-bold uppercase text-emerald-900 bg-white/90 px-2 py-0.5 rounded-full shadow-xs">
                      {getLocalizedCropName(sample.crop, language)}
                    </span>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-stone-900 text-xs line-clamp-1">
                      {getLocalizedDiseaseName(sample.disease, language)}
                    </h4>
                    <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                      {sample.crop === 'Tomato' && sample.disease === 'Early Blight'
                        ? (language === 'te'
                            ? 'పసుపు వలయాలతో గోధుమ రంగు మచ్చలు'
                            : language === 'hi'
                            ? 'पीले छल्लों के साथ भूरे धब्बे'
                            : sample.label)
                        : sample.label}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. PREVIEW SCREEN (AFTER IMAGE SELECTION) */}
      {step === 'preview' && imagePreview && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-md space-y-6 text-center">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
              {language === 'te' ? 'ఫోటో ఎంపికైంది' : language === 'hi' ? 'फोटो चुनी गई' : 'Photo Selected'}
            </span>
            <span className="text-xs font-semibold text-stone-500">
              {t('cropLabel')}: <strong className="text-stone-800">{getLocalizedCropName(selectedCrop, language)}</strong>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
            {t('cropPhotoPreview')}
          </h2>

          {/* Large Image Preview */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-stone-200 max-h-[380px] w-full bg-stone-100 flex items-center justify-center shadow-inner">
            <img
              src={imagePreview}
              alt="Crop Photo Preview"
              onError={(e) => {
                e.currentTarget.src = fallbackCropImage;
              }}
              className="w-full max-h-[380px] object-contain rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Buttons: RETAKE, REMOVE, ANALYZE CROP */}
          <div className="space-y-3">
            <button
              id="analyze-crop-btn"
              onClick={handleAnalyzeCrop}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-lg shadow-lg transition active:scale-98 flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <Search className="w-6 h-6 text-emerald-200" />
              <span>🔍 {t('analyzeCrop')}</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                id="retake-photo-btn"
                onClick={() => cameraInputRef.current?.click()}
                className="py-3.5 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold text-sm flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-stone-600" />
                <span>↻ {t('retakePhoto')}</span>
              </button>

              <button
                id="remove-photo-btn"
                onClick={handleRemove}
                className="py-3.5 px-4 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-sm flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>🗑 {t('removePhoto')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. ANALYSIS SCREEN */}
      {step === 'analyzing' && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-md text-center space-y-8">
          <div className="relative w-28 h-28 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
            <div className="absolute inset-2 rounded-full border-4 border-emerald-50 border-b-emerald-400 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Camera className="w-10 h-10 text-emerald-700 animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900">
              Analyzing Your Crop...
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 max-w-sm mx-auto">
              Scanning leaf pathology vectors and generating scientific agricultural guidance.
            </p>
          </div>

          {/* Progress Checklist */}
          <div className="max-w-md mx-auto bg-stone-50 rounded-2xl p-5 border border-stone-200 text-left space-y-3.5">
            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  analysisChecklist >= 1
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                ✓
              </div>
              <span
                className={`text-sm font-bold ${
                  analysisChecklist >= 1 ? 'text-stone-900' : 'text-stone-400'
                }`}
              >
                Reading crop image
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  analysisChecklist >= 2
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                ✓
              </div>
              <span
                className={`text-sm font-bold ${
                  analysisChecklist >= 2 ? 'text-stone-900' : 'text-stone-400'
                }`}
              >
                Identifying crop
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  analysisChecklist >= 3
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                ✓
              </div>
              <span
                className={`text-sm font-bold ${
                  analysisChecklist >= 3 ? 'text-stone-900' : 'text-stone-400'
                }`}
              >
                Checking for disease or pest
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  analysisChecklist >= 4
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-200 text-stone-500'
                }`}
              >
                ✓
              </div>
              <span
                className={`text-sm font-bold ${
                  analysisChecklist >= 4 ? 'text-stone-900' : 'text-stone-400'
                }`}
              >
                Preparing treatment guidance
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. ERROR SCREEN WITH "TRY AGAIN" */}
      {step === 'error' && (
        <div className="bg-white rounded-3xl p-8 border border-rose-200 shadow-md text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-stone-900">
              Notice
            </h3>
            <p className="text-sm sm:text-base text-stone-700 max-w-md mx-auto leading-relaxed">
              {errorMessage ||
                "We couldn't analyze this image. Please upload a clear photo of the affected crop."}
            </p>
          </div>

          <button
            id="try-again-btn"
            onClick={handleRetake}
            className="px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base shadow-md transition active:scale-98 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* 5. DIAGNOSIS RESULT SCREEN (AFTER ANALYSIS) */}
      {step === 'result' && (diagnosisResult || latestDiagnosis) && (
        <div className="space-y-6">
          {(() => {
            const current = diagnosisResult || latestDiagnosis!;
            const displayImage = current.imageUrl || imagePreview;
            const localized = getLocalizedDiagnosis(current, language);

            return (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500 shadow-lg space-y-6">
                {/* ACTUAL UPLOADED CROP IMAGE AT THE TOP */}
                {displayImage && (
                  <div className="space-y-2">
                    <div className="relative rounded-3xl overflow-hidden border border-stone-200 max-h-80 w-full bg-stone-100 flex items-center justify-center shadow-xs">
                      <img
                        src={displayImage}
                        alt="Uploaded Crop Leaf"
                        onError={(e) => {
                          e.currentTarget.src = fallbackCropImage;
                        }}
                        className="w-full max-h-80 object-contain rounded-2xl"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-3 left-3 bg-emerald-900/90 text-white text-xs px-3 py-1 rounded-full font-bold backdrop-blur-xs flex items-center gap-1.5 shadow-sm">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>{t('uploadedCropPhoto')}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* DIAGNOSIS RESULT HEADER & VOICE BUTTON */}
                <div className="border-b border-stone-200 pb-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                      {t('diagnosisResult')}
                    </h2>

                    <div className="flex items-center gap-2.5">
                      {/* Listen To Advice TTS Voice Button */}
                      <button
                        id="diagnosis-listen-advice-btn"
                        onClick={() => {
                          if (isSpeaking) {
                            stopSpeaking();
                          } else {
                            speak(localized.speechText);
                          }
                        }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs shadow-xs transition active:scale-95 whitespace-nowrap cursor-pointer ${
                          isSpeaking
                            ? 'bg-amber-400 text-stone-950 animate-pulse'
                            : 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                        }`}
                      >
                        {isSpeaking ? (
                          <>
                            <VolumeX className="w-4 h-4 text-stone-950" />
                            <span>{t('stopVoice')}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4 text-emerald-800" />
                            <span>{t('listenToAdvice')}</span>
                          </>
                        )}
                      </button>

                      <span className="text-xs text-stone-500 font-medium">
                        {current.date || t('todayJustNow')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-base sm:text-lg">
                    <p className="text-stone-800">
                      <strong className="font-bold text-stone-900">{t('cropLabel')}:</strong> {localized.crop}
                    </p>
                    <p className="text-stone-800">
                      <strong className="font-bold text-stone-900">{t('possibleProblem')}:</strong>{' '}
                      <span className="text-emerald-900 font-extrabold">
                        {localized.disease}
                      </span>
                    </p>
                    <p className="text-stone-800">
                      <strong className="font-bold text-stone-900">{t('confidence')}:</strong> {localized.confidence}%
                    </p>
                    <p className="text-stone-800 flex items-center gap-2">
                      <strong className="font-bold text-stone-900">{t('severity')}:</strong>
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${
                          current.severity === 'Mild'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : current.severity === 'Moderate'
                            ? 'bg-orange-100 text-orange-900 border border-orange-300'
                            : 'bg-rose-100 text-rose-900 border border-rose-300'
                        }`}
                      >
                        {localized.severity}
                      </span>
                    </p>
                  </div>
                </div>

                {/* SYMPTOMS */}
                <div className="space-y-2.5">
                  <h3 className="text-sm font-black text-stone-900 uppercase tracking-wide flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>{t('whatYouSee')}</span>
                  </h3>
                  <ul className="space-y-2 pl-2">
                    {localized.symptoms.map((symptom, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-stone-700 flex items-start gap-2.5"
                      >
                        <span className="text-amber-500 font-black text-base leading-none mt-0.5">
                          •
                        </span>
                        <span>{symptom}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* RECOMMENDED ACTION */}
                <div className="space-y-3 bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200">
                  <h3 className="text-sm font-black text-emerald-900 uppercase tracking-wide flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>{t('whatToDoNow')}</span>
                  </h3>
                  <div className="space-y-2 pl-1">
                    {localized.recommendedActions.map((action, idx) => (
                      <div
                        key={idx}
                        className="text-sm text-stone-800 flex items-start gap-2.5"
                      >
                        <span className="font-extrabold text-emerald-800 shrink-0">
                          {idx + 1}.
                        </span>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PREVENTION */}
                <div className="space-y-2.5">
                  <h3 className="text-sm font-black text-stone-900 uppercase tracking-wide flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>{t('prevention')}</span>
                  </h3>
                  <ul className="space-y-2 pl-2">
                    {localized.prevention.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-stone-700 flex items-start gap-2.5"
                      >
                        <span className="text-emerald-500 font-black text-base leading-none mt-0.5">
                          •
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3 PRIMARY ACTION BUTTONS */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    id="view-treatment-btn"
                    onClick={handleViewTreatment}
                    className="py-4 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-98 cursor-pointer"
                  >
                    <Pill className="w-4 h-4" />
                    <span>{t('viewTreatmentGuidance')}</span>
                  </button>

                  <button
                    id="check-market-price-btn"
                    onClick={handleCheckMarket}
                    className="py-4 px-4 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-98 cursor-pointer"
                  >
                    <TrendingUp className="w-4 h-4" />
                    <span>{t('checkMarket')}</span>
                  </button>

                  <button
                    id="analyze-another-photo-btn"
                    onClick={handleRetake}
                    className="py-4 px-4 rounded-2xl border-2 border-stone-300 hover:bg-stone-50 text-stone-800 font-extrabold text-sm flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-stone-600" />
                    <span>{t('retakePhoto')}</span>
                  </button>
                </div>

                {/* Free Expert Consult Button */}
                <div className="pt-2 text-center">
                  <button
                    onClick={() => setShowExpertModal(true)}
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Free Toll-Free Agricultural Expert Helpline (1800-180-1551)</span>
                  </button>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Expert Consultation Modal */}
      {showExpertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-emerald-700" />
                <span>Agricultural Expert Helpline</span>
              </h3>
              <button
                onClick={() => setShowExpertModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Call free government agricultural extension services for localized disease confirmation and pesticide verification.
            </p>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    Kisan Call Centre (Toll-Free)
                  </h4>
                  <p className="text-xs text-stone-500">
                    National 24/7 Agro-Advisory Helpline
                  </p>
                </div>
                <a
                  href="tel:18001801551"
                  className="call-btn bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>1800-180-1551</span>
                </a>
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">
                    Guntur KVK Officer (District Agro Lab)
                  </h4>
                  <p className="text-xs text-stone-500">
                    Dr. YSR Horticultural University
                  </p>
                </div>
                <a
                  href="tel:0863223344"
                  className="call-btn bg-stone-800 hover:bg-stone-900 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-xs"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Officer</span>
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowExpertModal(false)}
              className="w-full py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 font-bold text-stone-800 text-sm cursor-pointer"
            >
              {t('close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
