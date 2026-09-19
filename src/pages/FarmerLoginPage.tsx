import React, { useState } from 'react';
import {
  Phone,
  ShieldCheck,
  Volume2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  UserCheck,
  UserPlus,
  RefreshCw,
  Lock,
  Wheat,
  MapPin,
  FileText,
  BadgeCheck,
  Smartphone,
  MessageSquare,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { demoFarmers } from '../data/seedData';

export const FarmerLoginPage: React.FC = () => {
  const {
    profile,
    isLoggedIn,
    loginWithOtp,
    switchFarmerAccount,
    logoutFarmer,
    setActiveTab,
    showToast,
    speak,
    language,
    t,
  } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [phoneNumber, setPhoneNumber] = useState('9848012345');
  const [channel, setChannel] = useState<'sms' | 'whatsapp' | 'voice'>('sms');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [generatedDemoOtp, setGeneratedDemoOtp] = useState('5824');
  const [isLoading, setIsLoading] = useState(false);

  // New Farmer Registration Fields
  const [regName, setRegName] = useState('');
  const [regVillage, setRegVillage] = useState('');
  const [regDistrict, setRegDistrict] = useState('Guntur');
  const [regState, setRegState] = useState('Andhra Pradesh');
  const [regLandSize, setRegLandSize] = useState('3.5');
  const [regCrops, setRegCrops] = useState('Tomato, Chilli, Wheat');

  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      showToast('Please enter a valid 10-digit mobile number');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.sendOtp(phoneNumber, channel);
      if (res.success) {
        setOtpSent(true);
        if (res.otp) {
          setGeneratedDemoOtp(res.otp);
          setOtpCode(res.otp); // Pre-fill test OTP for instantaneous developer and tester evaluation
        }
        showToast(res.message || 'OTP sent successfully!');
        if (channel === 'voice') {
          speakOtpVoice(res.otp || '5824');
        }
      } else {
        showToast(res.message || 'Could not send OTP');
      }
    } catch {
      setOtpSent(true);
      setGeneratedDemoOtp('5824');
      setOtpCode('5824');
      showToast('Demo OTP generated: 5824');
    } finally {
      setIsLoading(false);
    }
  };

  const speakOtpVoice = (code: string) => {
    const digits = code.split('').join(' ');
    const text =
      language === 'te'
        ? `మీ స్మార్ట్ క్రాప్ కేర్ లాగిన్ కోడ్: ${digits}. దయచేసి నమోదు చేయండి.`
        : language === 'hi'
        ? `आपका स्मार्ट क्रॉप केयर लॉगिन कोड है: ${digits}. कृपया दर्ज करें।`
        : `Your Smart Crop Care verification code is ${digits}. Please enter it to continue.`;
    speak(text);
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 4) {
      showToast('Please enter the 4-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const success = await loginWithOtp({
        phone: phoneNumber,
        otp: otpCode,
        name: authMode === 'register' ? regName : undefined,
        village: authMode === 'register' ? regVillage : undefined,
        district: authMode === 'register' ? regDistrict : undefined,
      });

      if (success) {
        setActiveTab('home');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (farmerId: string) => {
    setIsLoading(true);
    try {
      await switchFarmerAccount(farmerId);
      setActiveTab('home');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="farmer-login-page" className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      {/* Top Banner if already logged in */}
      {isLoggedIn && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              {profile.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-emerald-950 text-base">{profile.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900 flex items-center gap-1">
                  <BadgeCheck className="w-3 h-3" /> Active Farmer Session
                </span>
              </div>
              <p className="text-xs text-emerald-800">
                +91 {profile.phone} • {profile.village}, {profile.district} • {profile.landSizeAcres} Acres ({profile.cropsGrown.join(', ')})
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              id="view-saved-history-btn"
              onClick={() => setActiveTab('profile')}
              className="flex-1 sm:flex-initial px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors"
            >
              View Saved History & Cards
            </button>
            <button
              type="button"
              id="logout-farmer-btn"
              onClick={logoutFarmer}
              className="px-3.5 py-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>
      )}

      {/* Main Authentication Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Phone OTP Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Kisan Digital Identity
              </span>
              <h2 className="text-xl font-extrabold text-stone-900 mt-1.5">
                {authMode === 'login' ? 'Farmer Login with Mobile OTP' : 'Register New Farmer Profile'}
              </h2>
            </div>
            <button
              type="button"
              id="speak-login-guide-btn"
              onClick={() =>
                speak(
                  language === 'te'
                    ? 'మీ మొబైల్ నంబర్ నమోదు చేసి ఓటీపీ పొందండి. పాస్‌వర్డ్ అవసరం లేదు.'
                    : language === 'hi'
                    ? 'अपना मोबाइल नंबर दर्ज करें और ओटीपी प्राप्त करें। पासवर्ड की आवश्यकता नहीं है।'
                    : 'Enter your 10 digit phone number to receive an OTP. No password required.'
                )
              }
              className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              title="Voice Instructions"
            >
              <Volume2 className="w-5 h-5 text-emerald-700" />
            </button>
          </div>

          {/* Mode Tabs (Login vs Register) */}
          <div className="flex border-b border-stone-200 mb-5">
            <button
              type="button"
              id="auth-tab-login"
              onClick={() => {
                setAuthMode('login');
                setOtpSent(false);
              }}
              className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                authMode === 'login'
                  ? 'border-emerald-600 text-emerald-900 bg-emerald-50/50'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Existing Farmer Login
            </button>
            <button
              type="button"
              id="auth-tab-register"
              onClick={() => {
                setAuthMode('register');
                setOtpSent(false);
              }}
              className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'border-emerald-600 text-emerald-900 bg-emerald-50/50'
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Register New Farmer
            </button>
          </div>

          {/* Registration Extra Fields */}
          {authMode === 'register' && !otpSent && (
            <div className="space-y-3 mb-4 p-4 bg-stone-50 rounded-xl border border-stone-200">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Farmer Full Name</label>
                <input
                  type="text"
                  id="reg-farmer-name"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g. Balaram Reddy"
                  className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Village / Gram</label>
                  <input
                    type="text"
                    id="reg-farmer-village"
                    value={regVillage}
                    onChange={(e) => setRegVillage(e.target.value)}
                    placeholder="e.g. Pedakakani"
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">District</label>
                  <input
                    type="text"
                    id="reg-farmer-district"
                    value={regDistrict}
                    onChange={(e) => setRegDistrict(e.target.value)}
                    placeholder="e.g. Guntur"
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Land Size (Acres)</label>
                  <input
                    type="number"
                    step="0.5"
                    id="reg-farmer-land"
                    value={regLandSize}
                    onChange={(e) => setRegLandSize(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Crops Cultivated</label>
                  <input
                    type="text"
                    id="reg-farmer-crops"
                    value={regCrops}
                    onChange={(e) => setRegCrops(e.target.value)}
                    placeholder="Tomato, Chilli"
                    className="w-full px-3 py-2 text-sm bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Phone Number Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                Farmer Mobile Number (10 Digits)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 flex items-center gap-1 text-stone-500 text-sm font-semibold border-r border-stone-300 pr-2">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  id="farmer-phone-input"
                  maxLength={10}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="9848012345"
                  disabled={otpSent}
                  className="w-full pl-20 pr-4 py-2.5 text-base font-mono font-medium border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:bg-stone-100 disabled:text-stone-600"
                />
              </div>
            </div>

            {/* OTP Delivery Channel Selector */}
            {!otpSent && (
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5 uppercase tracking-wider">
                  Select Preferred Verification Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    id="channel-sms-btn"
                    onClick={() => setChannel('sms')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      channel === 'sms'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm ring-1 ring-emerald-600'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                    SMS OTP
                  </button>
                  <button
                    type="button"
                    id="channel-whatsapp-btn"
                    onClick={() => setChannel('whatsapp')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      channel === 'whatsapp'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm ring-1 ring-emerald-600'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-green-700" />
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    id="channel-voice-btn"
                    onClick={() => setChannel('voice')}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                      channel === 'voice'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm ring-1 ring-emerald-600'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Volume2 className="w-3.5 h-3.5 text-blue-700" />
                    Voice Call
                  </button>
                </div>
              </div>
            )}

            {/* Send OTP Trigger */}
            {!otpSent ? (
              <button
                type="button"
                id="send-otp-btn"
                disabled={isLoading || phoneNumber.length < 10}
                onClick={handleSendOtp}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
              >
                <span>{isLoading ? 'Generating One-Time Password...' : 'Get Instant Verification OTP'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              /* Step 2: OTP Verification Box */
              <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">
                    Enter 4-Digit OTP Code
                  </span>
                  <button
                    type="button"
                    id="speak-otp-btn"
                    onClick={() => speakOtpVoice(generatedDemoOtp)}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-2 py-1 rounded-md border border-emerald-300 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                    🔊 Voice Readout
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    id="otp-code-input"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="5824"
                    className="w-full text-center tracking-[0.6em] text-2xl font-mono font-bold py-2.5 bg-white border border-emerald-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none text-emerald-950"
                  />
                  <button
                    type="button"
                    id="verify-otp-btn"
                    disabled={isLoading || otpCode.length < 4}
                    onClick={handleVerifyOtp}
                    className="py-3 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-colors shrink-0 shadow-sm disabled:opacity-50"
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Login'}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
                  <span>
                    Test Demo OTP: <strong className="font-mono text-emerald-800">{generatedDemoOtp}</strong>
                  </span>
                  <button
                    type="button"
                    id="change-number-btn"
                    onClick={() => setOtpSent(false)}
                    className="text-emerald-700 hover:underline font-semibold"
                  >
                    Change Number
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: 1-Click Demo Profiles & Why Login Benefits */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Demo Switcher Card */}
          <div className="bg-gradient-to-br from-stone-900 to-stone-800 text-white p-5 rounded-2xl shadow-sm border border-stone-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm text-stone-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                1-Tap Demo Farmer Login
              </h4>
              <span className="text-[10px] font-mono text-stone-400 bg-stone-700 px-2 py-0.5 rounded">
                Instant Access
              </span>
            </div>
            <p className="text-xs text-stone-300 mb-3">
              Tap any verified farmer profile below to test personalized farm profiles, diagnosis records, soil health, and payments:
            </p>

            <div className="space-y-2">
              {demoFarmers.map((farmer) => (
                <button
                  key={farmer.id}
                  type="button"
                  id={`quick-login-${farmer.id}`}
                  onClick={() => handleQuickDemoLogin(farmer.id)}
                  className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                    profile.id === farmer.id && isLoggedIn
                      ? 'bg-emerald-950/80 border-emerald-500 text-white'
                      : 'bg-stone-800/80 hover:bg-stone-700 border-stone-700 text-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-stone-700 text-emerald-400 font-bold flex items-center justify-center text-sm border border-stone-600">
                      {farmer.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        {farmer.name}
                        {profile.id === farmer.id && isLoggedIn && (
                          <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-400">
                        {farmer.village}, {farmer.district} • {farmer.landSizeAcres} Ac
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-amber-300 font-mono">+91 {farmer.phone}</div>
                    <div className="text-[10px] text-stone-400">{farmer.cropsGrown.slice(0, 2).join(', ')}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Feature Benefits List */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2.5 text-xs text-stone-700">
            <h5 className="font-bold text-stone-900 text-sm">Why Farmer Login Matters:</h5>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Personalized Home Dashboard:</strong> Retains your registered acreage, current crops (Tomato, Chilli, Wheat), and geo-weather advisories.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Permanent Saved History:</strong> Access all past AI plant diagnoses, treatment orders, and certified Soil Health cards across sessions.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Integrated Kisan Payments:</strong> Seamlessly pay advance booking tokens, cold storage deposits, and order certified bio-fungicides.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
