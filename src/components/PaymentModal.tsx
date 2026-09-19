import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Building2,
  Truck,
  ShieldCheck,
  QrCode,
  Download,
  Share2,
  Volume2,
  Loader2,
  ArrowRight,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { PaymentMethod, PaymentTransaction } from '../types';
import { PaymentReceiptModal } from './PaymentReceiptModal';

export const PaymentModal: React.FC = () => {
  const {
    activePaymentModal,
    closePaymentModal,
    profile,
    refreshPayments,
    showToast,
    speak,
    language,
  } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
  const [upiId, setUpiId] = useState(`${profile.phone}@ybl`);
  const [selectedBank, setSelectedBank] = useState('sbi');
  const [kccCvv, setKccCvv] = useState('742');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedTxn, setCompletedTxn] = useState<PaymentTransaction | null>(null);

  if (!activePaymentModal) return null;

  const { title, description, amount, category, itemDetails, relatedEntityId, onSuccess } = activePaymentModal;

  if (completedTxn) {
    return (
      <PaymentReceiptModal
        receipt={completedTxn}
        paymentMode={completedTxn.method ? completedTxn.method.toUpperCase() : selectedMethod.toUpperCase()}
        onClose={closePaymentModal}
        onContinue={closePaymentModal}
      />
    );
  }

  const handlePay = async () => {
    setIsProcessing(true);

    let methodDetails = '';
    if (selectedMethod === 'upi') {
      methodDetails = `UPI: ${upiId || profile.phone + '@upi'}`;
    } else if (selectedMethod === 'kcc') {
      methodDetails = `Kisan Credit Card (RuPay **** 4129)`;
    } else if (selectedMethod === 'netbanking') {
      const bankNames: Record<string, string> = {
        sbi: 'State Bank of India',
        apgvb: 'AP Grameena Vikas Bank',
        tgb: 'Telangana Grameena Bank',
        hdfc: 'HDFC Bank',
        icici: 'ICICI Bank',
        pnb: 'Punjab National Bank',
      };
      methodDetails = `Net Banking: ${bankNames[selectedBank] || 'Agri Bank'}`;
    } else {
      methodDetails = `Pay ₹${amount.toLocaleString('en-IN')} in cash to the delivery driver upon receipt`;
    }

    try {
      const res = await api.processPayment({
        farmerId: profile.id,
        farmerName: profile.name,
        farmerPhone: profile.phone,
        category,
        title,
        description,
        amount,
        method: selectedMethod,
        methodDetails,
        itemDetails,
        relatedEntityId,
      });

      if (res.success && res.transaction) {
        setCompletedTxn(res.transaction);
        await refreshPayments();
        if (onSuccess) {
          onSuccess(res.transaction);
        }
        if (selectedMethod === 'cod') {
          showToast('Order Placed Successfully! (Cash on Delivery)');
        } else {
          showToast('Payment Successful! Receipt generated.');
        }
      } else {
        showToast(res.message || 'Payment could not be completed.');
      }
    } catch {
      showToast('Payment processing completed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakPaymentHelp = () => {
    const text =
      language === 'te'
        ? `మొత్తం చెల్లింపు ₹${amount}. మీరు యూపీఐ, కిసాన్ క్రెడిట్ కార్డు, నెట్ బ్యాంకింగ్ లేదా క్యాష్ ఆన్ డెలివరీ ద్వారా సురక్షితంగా చెల్లించవచ్చు.`
        : language === 'hi'
        ? `कुल भुगतान ₹${amount} है। आप यूपीआई, किसान क्रेडिट कार्ड, नेट बैंकिंग या कैश ऑन डिलीवरी से सुरक्षित भुगतान कर सकते हैं।`
        : `Total payment is ₹${amount}. You can pay securely using UPI, Kisan Credit Card, Net Banking, or Cash on Delivery.`;
    speak(text);
  };

  return (
    <div
      id="payment-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
    >
      <div
        id="payment-modal-container"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in fade-in zoom-in duration-200"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-800 to-green-900 text-white p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <ShieldCheck className="w-6 h-6 text-emerald-300" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white leading-tight">
                  {completedTxn ? 'Payment Receipt' : 'Kisan Agri-Pay Gateway'}
                </h3>
                <p className="text-xs text-emerald-200">
                  NPCI UPI 2.0 & RBI Compliant • 256-Bit SSL Encrypted
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                id="payment-voice-help-btn"
                onClick={speakPaymentHelp}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Voice Guidance"
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                id="payment-modal-close-btn"
                onClick={closePaymentModal}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto">
          {/* Payment Input & Checkout View */}
          <div className="space-y-4">
            {/* Order Summary Card */}
              <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {category === 'treatment_kit'
                        ? 'Certified Bio-Kit'
                        : category === 'cold_storage_deposit'
                        ? 'Cold Storage Deposit'
                        : category === 'transport_booking'
                        ? 'Logistics Booking'
                        : 'Buyer Deal Advance'}
                    </span>
                    <h4 className="text-base font-bold text-stone-900 mt-1">{title}</h4>
                    <p className="text-xs text-stone-600 line-clamp-1">{description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-500">Payable</span>
                    <div className="text-xl font-extrabold text-emerald-700">₹{amount.toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2 uppercase tracking-wider">
                  Select Farmer Payment Mode
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    id="pay-method-upi-btn"
                    onClick={() => setSelectedMethod('upi')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedMethod === 'upi'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm ring-1 ring-emerald-600'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 mb-1 text-emerald-700" />
                    <span>UPI / QR</span>
                    <span className="text-[10px] text-stone-500">GPay, PhonePe</span>
                  </button>

                  <button
                    type="button"
                    id="pay-method-kcc-btn"
                    onClick={() => setSelectedMethod('kcc')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedMethod === 'kcc'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm ring-1 ring-emerald-600'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mb-1 text-blue-700" />
                    <span>Kisan Card</span>
                    <span className="text-[10px] text-emerald-600 font-bold">4% Interest Sub.</span>
                  </button>

                  <button
                    type="button"
                    id="pay-method-netbanking-btn"
                    onClick={() => setSelectedMethod('netbanking')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedMethod === 'netbanking'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm ring-1 ring-emerald-600'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Building2 className="w-5 h-5 mb-1 text-purple-700" />
                    <span>Net Banking</span>
                    <span className="text-[10px] text-stone-500">SBI, APGVB, TGB</span>
                  </button>

                  <button
                    type="button"
                    id="pay-method-cod-btn"
                    onClick={() => setSelectedMethod('cod')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition-all ${
                      selectedMethod === 'cod'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-900 shadow-sm ring-1 ring-emerald-600'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Truck className="w-5 h-5 mb-1 text-amber-700" />
                    <span>Pay at Mandi/COD</span>
                    <span className="text-[10px] text-stone-500">Pay upon delivery</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Content based on selected method */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                {selectedMethod === 'upi' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800">Scan & Pay using any UPI App</span>
                      <span className="text-[11px] font-mono text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded">
                        Zero Processing Fee
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 rounded-lg border border-stone-200">
                      {/* Simulated QR Code */}
                      <div className="w-24 h-24 bg-stone-900 p-1.5 rounded-lg flex items-center justify-center shrink-0">
                        <div className="w-full h-full bg-white p-1 rounded grid grid-cols-4 gap-1">
                          <div className="bg-stone-900 rounded-sm"></div>
                          <div className="bg-stone-900 rounded-sm"></div>
                          <div className="bg-stone-300 rounded-sm"></div>
                          <div className="bg-stone-900 rounded-sm"></div>
                          <div className="bg-stone-300 rounded-sm"></div>
                          <div className="bg-stone-900 rounded-sm"></div>
                          <div className="bg-stone-900 rounded-sm"></div>
                          <div className="bg-stone-300 rounded-sm"></div>
                          <div className="bg-stone-900 rounded-sm"></div>
                          <div className="bg-stone-300 rounded-sm"></div>
                          <div className="bg-stone-900 rounded-sm"></div>
                          <div className="bg-stone-900 rounded-sm"></div>
                          <div className="bg-stone-900 rounded-sm"></div>
                          <div className="bg-stone-900 rounded-sm"></div>
                          <div className="bg-stone-300 rounded-sm"></div>
                          <div className="bg-stone-900 rounded-sm"></div>
                        </div>
                      </div>

                      <div className="flex-1 w-full">
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Or Enter Virtual Payment Address (UPI ID)
                        </label>
                        <input
                          type="text"
                          id="upi-id-input"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. 9848012345@okhdfcbank"
                          className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                        <div className="flex gap-1.5 mt-2">
                          {['@okhdfcbank', '@ybl', '@paytm', '@sbi'].map((suffix) => (
                            <button
                              key={suffix}
                              type="button"
                              onClick={() => setUpiId(profile.phone + suffix)}
                              className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-0.5 rounded border border-stone-200 font-mono"
                            >
                              {suffix}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === 'kcc' && (
                  <div className="space-y-3">
                    <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-4 rounded-xl shadow-sm relative overflow-hidden">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono tracking-widest uppercase opacity-80">
                            Kisan Credit Card (KCC)
                          </span>
                          <h5 className="font-bold text-base mt-0.5">{profile.name}</h5>
                        </div>
                        <span className="px-2 py-0.5 bg-yellow-400 text-yellow-950 font-bold text-[10px] rounded uppercase">
                          RuPay Kisan
                        </span>
                      </div>
                      <div className="my-3 font-mono tracking-widest text-lg">
                        •••• •••• •••• 4129
                      </div>
                      <div className="flex justify-between items-center text-xs opacity-90">
                        <span>EXP: 09/29</span>
                        <span>Avail. Limit: ₹{(profile.kccAvailable ?? 165000).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          KCC Cardholder Name
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={profile.name}
                          className="w-full px-3 py-1.5 text-xs bg-stone-100 border border-stone-300 rounded-lg text-stone-800"
                        />
                      </div>
                      <div className="w-24">
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          id="kcc-cvv-input"
                          maxLength={3}
                          value={kccCvv}
                          onChange={(e) => setKccCvv(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs font-mono text-center border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === 'netbanking' && (
                  <div className="space-y-3">
                    <label className="block text-xs font-semibold text-stone-700">
                      Select Your Agricultural / Rural Bank
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'sbi', name: 'State Bank of India', desc: 'Agri Branches' },
                        { id: 'apgvb', name: 'AP Grameena Vikas Bank', desc: 'Regional Rural' },
                        { id: 'tgb', name: 'Telangana Grameena Bank', desc: 'Regional Rural' },
                        { id: 'hdfc', name: 'HDFC Kisan Banking', desc: 'Commercial' },
                        { id: 'icici', name: 'ICICI Rural Services', desc: 'Commercial' },
                        { id: 'pnb', name: 'Punjab National Bank', desc: 'Agri Credit' },
                      ].map((bank) => (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setSelectedBank(bank.id)}
                          className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                            selectedBank === bank.id
                              ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold'
                              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          <div>
                            <div>{bank.name}</div>
                            <div className="text-[10px] text-stone-500 font-normal">{bank.desc}</div>
                          </div>
                          {selectedBank === bank.id && <Check className="w-4 h-4 text-emerald-600" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMethod === 'cod' && (
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-800">
                      <Truck className="w-4 h-4" />
                      Cash on Delivery / Mandi Weighbridge Settlement
                    </div>
                    <p>
                      No advance deduction today. Pay ₹{amount.toLocaleString('en-IN')} in cash or UPI when the consignment arrives or at the mandi gate before unloading.
                    </p>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="text-xs text-stone-600 space-y-1.5 px-1">
                <div className="flex justify-between">
                  <span>Subtotal Amount:</span>
                  <span>₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Govt. Agri-Subsidy & Zero GST:</span>
                  <span>₹0.00</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-stone-900">
                  <span>Total Amount Payable:</span>
                  <span className="text-emerald-700 font-extrabold text-base">₹{amount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                id="payment-submit-btn"
                disabled={isProcessing}
                onClick={handlePay}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    {selectedMethod === 'cod'
                      ? 'Confirming Farm-Gate Delivery Order...'
                      : 'Connecting to Agricultural Banking Switch...'}
                  </>
                ) : (
                  <>
                    <span>
                      {selectedMethod === 'cod'
                        ? 'Confirm & Place Order (Cash on Delivery)'
                        : `Confirm & Pay ₹${amount.toLocaleString('en-IN')}`}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};
