import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CreditCard,
  QrCode,
  Building2,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Receipt,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileText,
  Clock,
  Printer,
  X,
  ExternalLink,
  Lock,
} from 'lucide-react';
import { PaymentTransaction } from '../types';
import { PaymentReceiptModal } from '../components/PaymentReceiptModal';

export const PaymentsPage: React.FC = () => {
  const {
    profile,
    paymentHistory,
    refreshPayments,
    openPaymentModal,
    setActiveTab,
    setServicesSubTab,
    showToast,
    t,
  } = useApp();

  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);
  const [testAmount, setTestAmount] = useState<number>(380);
  const [testCategory, setTestCategory] = useState<
    'treatment_kit' | 'cold_storage_deposit' | 'transport_booking' | 'buyer_token'
  >('treatment_kit');

  // Direct trigger for the Payment Receipt Modal Popup
  const triggerInstantPaymentReceipt = async (options: {
    title: string;
    description: string;
    amount: number;
    category: 'treatment_kit' | 'cold_storage_deposit' | 'transport_booking' | 'buyer_token';
    method: 'upi' | 'kcc' | 'netbanking' | 'cod';
    methodDetails: string;
  }) => {
    const isCOD = options.method === 'cod';
    const newTxn: PaymentTransaction = {
      id: `txn-agri-${Date.now()}`,
      farmerId: profile.id,
      farmerName: profile.name,
      farmerPhone: profile.phone,
      category: options.category,
      title: options.title,
      description: options.description,
      amount: options.amount,
      method: options.method,
      methodDetails: isCOD
        ? `Pay ₹${options.amount} in cash to the delivery driver upon receipt`
        : options.methodDetails,
      status: isCOD ? 'CONFIRMED' : 'SUCCESS',
      receiptNo: isCOD
        ? `COD-AGRI-2026-${Math.floor(10000 + Math.random() * 90000)}`
        : `REC-AGRI-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      date:
        new Date().toLocaleDateString('en-GB') +
        ', ' +
        new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      itemDetails: {
        product: options.title,
        paymentSwitch: isCOD
          ? 'Farm-Gate Cash On Delivery'
          : 'NPCI UPI 2.0 / RBI Compliant Agri-Switch',
      },
    };

    // Save to persistent storage and update global state
    try {
      const raw = localStorage.getItem('payment_history');
      const list: PaymentTransaction[] = raw ? JSON.parse(raw) : [];
      list.unshift(newTxn);
      localStorage.setItem('payment_history', JSON.stringify(list));
      await refreshPayments();
    } catch {}

    // Instantly display the Payment Receipt or Order Confirmation Modal Popup!
    setSelectedReceipt(newTxn);
    if (isCOD) {
      showToast('Order Placed Successfully! (Cash on Delivery)');
    } else {
      showToast('Payment Successful! Receipt generated.');
    }
  };

  const handleLaunchTestGateway = () => {
    let title = 'Bio-Fungicide Treatment Kit (1L)';
    let desc = 'Complete organic fungicide kit for crop disease remediation';
    if (testCategory === 'cold_storage_deposit') {
      title = 'Cold Storage Slot Reservation Token';
      desc = '2 MT capacity booking token for 2 months';
    } else if (testCategory === 'transport_booking') {
      title = 'Farm-Gate Transport Advance Token';
      desc = 'Tata Ace mini-truck dispatch from farm to Guntur APMC yard';
    } else if (testCategory === 'buyer_token') {
      title = 'Direct Trade Token Advance';
      desc = 'Commitment advance for 5 MT Tomato lot with wholesale trader';
    }

    openPaymentModal({
      title,
      description: desc,
      amount: testAmount,
      category: testCategory,
      itemDetails: {
        demoPurpose: 'Interactive Payment Gateway Test',
        farmerName: profile.name,
        phone: profile.phone,
      },
      onSuccess: (txn) => {
        setSelectedReceipt(txn);
      },
    });
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold border border-emerald-400/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>National Agri-Stack Compliant • Kisan Agri-Pay</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Kisan Agri-Pay Gateway & Methods
            </h1>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Designed specifically for Indian farmers. Pay safely using{' '}
              <strong className="text-white">UPI QR</strong>, government-subsidized{' '}
              <strong className="text-white">RuPay Kisan Credit Card (4% p.a.)</strong>,{' '}
              <strong className="text-white">Net Banking</strong>, or{' '}
              <strong className="text-white">Cash on Delivery</strong>.
            </p>
          </div>

          {/* Direct Launch Button */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col gap-3 min-w-[240px]">
            <div className="text-xs font-bold text-emerald-200 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Try Live Gateway Demo</span>
            </div>
            <div className="text-xs text-stone-200">
              Test paying an advance token or input kit right now:
            </div>
            <button
              type="button"
              id="hero-launch-payment-modal-btn"
              onClick={handleLaunchTestGateway}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-stone-950 font-black rounded-xl text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-stone-950" />
              <span>Open Payment Gateway</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 Supported Payment Methods Visual Grid */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-700" />
            <span>Supported Payment Methods</span>
          </h2>
          <p className="text-xs text-stone-500">
            Every transaction is protected with 256-bit encryption, instant SMS receipt, and official GST invoice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Method 1: UPI */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 hover:border-emerald-400 transition-all shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <QrCode className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Instant • 0% Fee
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">UPI & QR Code Payments</h3>
                <p className="text-xs text-stone-600 mt-1">
                  Pay directly from your bank using Google Pay, PhonePe, Paytm, BHIM, or any UPI app.
                </p>
              </div>

              {/* UPI Apps Badge List */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'Amazon Pay', 'Cred'].map((app) => (
                  <span
                    key={app}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-[11px] font-bold border border-stone-200"
                  >
                    {app}
                  </span>
                ))}
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Scan instant dynamic QR code or enter your VPA handle (e.g. yourname@okaxis).</span>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-stone-100">
              <button
                type="button"
                id="test-upi-payment-btn"
                onClick={() => {
                  triggerInstantPaymentReceipt({
                    title: 'Bio-Fungicide Treatment Kit (1L)',
                    description: 'Complete organic fungicide kit for crop disease remediation',
                    amount: 380,
                    category: 'treatment_kit',
                    method: 'upi',
                    methodDetails: 'UPI • Google Pay / PhonePe (Instant QR & VPA)',
                  });
                }}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Test UPI Payment (₹380 Kit)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Method 2: RuPay Kisan Credit Card (KCC) */}
          <div className="bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-teal-500/10 rounded-3xl p-5 border border-amber-300 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-sm">
                  KCC
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  Govt Subsidized 4% p.a.
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">RuPay Kisan Credit Card (KCC)</h3>
                <p className="text-xs text-stone-600 mt-1">
                  Use your sanctioned crop loan credit limit. Pay inputs & cold storage now; settle after harvest!
                </p>
              </div>

              {/* Simulated Card Visual */}
              <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-emerald-950 text-white p-3.5 rounded-2xl shadow-sm border border-stone-700 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold tracking-wider text-amber-300">
                  <span>KISAN CREDIT CARD</span>
                  <span className="text-xs font-black text-white">RuPay ❯</span>
                </div>
                <div className="font-mono text-xs tracking-widest text-stone-200">
                  6074 •••• •••• 3829
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-300">
                  <span>{profile.name}</span>
                  <span>EXP: 12/28</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs px-1">
                <span className="text-stone-600 font-medium">Available KCC Credit:</span>
                <span className="font-black text-emerald-800 text-sm">
                  ₹{(profile.kccAvailable ?? 165000).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-amber-200">
              <button
                type="button"
                id="test-kcc-payment-btn"
                onClick={() => {
                  triggerInstantPaymentReceipt({
                    title: 'Cold Storage Slot Reservation Token',
                    description: '2 MT capacity booking token for 2 months cold chain preservation',
                    amount: 500,
                    category: 'cold_storage_deposit',
                    method: 'kcc',
                    methodDetails: 'RuPay Kisan Credit Card (4% Subsidized Crop Loan Limit)',
                  });
                }}
                className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Pay via RuPay KCC (₹500 Deposit)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Method 3: Net Banking */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 hover:border-blue-400 transition-all shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  Agri-Banking Partners
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Net Banking (Agriculture Core Banking)</h3>
                <p className="text-xs text-stone-600 mt-1">
                  Direct internet banking verification through major national and cooperative banks.
                </p>
              </div>

              {/* Supported Banks Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { name: 'SBI (YONO Krishi)', code: 'sbi' },
                  { name: 'HDFC Agri Banking', code: 'hdfc' },
                  { name: 'ICICI Rural Banking', code: 'icici' },
                  { name: 'Punjab National Bank', code: 'pnb' },
                  { name: 'Bank of Baroda', code: 'bob' },
                  { name: 'Canara Bank', code: 'canara' },
                ].map((b) => (
                  <div
                    key={b.code}
                    className="p-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 font-semibold text-[11px] flex items-center gap-1.5"
                  >
                    <Building2 className="w-3 h-3 text-blue-700 shrink-0" />
                    <span className="truncate">{b.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-stone-100">
              <button
                type="button"
                id="test-netbanking-btn"
                onClick={() => {
                  triggerInstantPaymentReceipt({
                    title: 'Farm-Gate Transport Advance Token',
                    description: 'Tata Ace mini-truck dispatch from farm to Guntur APMC yard',
                    amount: 600,
                    category: 'transport_booking',
                    method: 'netbanking',
                    methodDetails: 'State Bank of India (YONO Krishi Core Banking)',
                  });
                }}
                className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Test Net Banking (₹600 Advance)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Method 4: Cash on Delivery (COD) */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 hover:border-lime-400 transition-all shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-lime-100 text-lime-800 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-lime-50 text-lime-800 border border-lime-200">
                  Farm-Gate Delivery
                </span>
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Cash on Delivery (Pay on Arrival)</h3>
                <p className="text-xs text-stone-600 mt-1">
                  Check your bio-fungicide bottles or inspect the mini-truck before handing cash to the driver.
                </p>
              </div>

              <div className="p-3 bg-lime-50/70 rounded-xl border border-lime-200 text-xs text-lime-950 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-700" />
                  <span>Available for inputs & transport</span>
                </div>
                <p className="text-[11px] text-lime-900">
                  Driver / Delivery executive provides a printed GST invoice and mobile SMS acknowledgement.
                </p>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-stone-100">
              <button
                type="button"
                id="test-cod-btn"
                onClick={() => {
                  triggerInstantPaymentReceipt({
                    title: 'Bio-Fungicide Treatment Kit (1L)',
                    description: 'Farm-gate delivery with on-arrival physical verification',
                    amount: 380,
                    category: 'treatment_kit',
                    method: 'cod',
                    methodDetails: 'Pay ₹380 in cash to the delivery driver upon receipt',
                  });
                }}
                className="w-full py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>Select Cash on Delivery</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Where Payments Are Integrated Across the Platform */}
      <section className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 tracking-tight">
            Where to Use Agri-Pay in Smart Crop Care
          </h2>
          <p className="text-xs text-stone-500">
            You can make payments directly while using any of these core farming workflows:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setActiveTab('treatment')}
            className="p-4 rounded-2xl bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-200 text-left transition-all group"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
              Step 2 • Treatment
            </span>
            <h4 className="font-bold text-stone-900 text-sm mt-2 group-hover:text-emerald-800">
              Bio-Fungicide & Input Kits
            </h4>
            <p className="text-xs text-stone-500 mt-1">
              Order recommended medicines with 1-click Agri-Pay checkout and free village delivery.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('services');
              setServicesSubTab('coldStorage');
            }}
            className="p-4 rounded-2xl bg-cyan-50/50 hover:bg-cyan-50 border border-cyan-200 text-left transition-all group"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded">
              Step 5 • Storage
            </span>
            <h4 className="font-bold text-stone-900 text-sm mt-2 group-hover:text-cyan-800">
              Cold Storage Slot Deposit
            </h4>
            <p className="text-xs text-stone-500 mt-1">
              Pay ₹500 advance deposit to guarantee refrigerated space for perishables during price crashes.
            </p>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('services');
              setServicesSubTab('logistics');
            }}
            className="p-4 rounded-2xl bg-lime-50/50 hover:bg-lime-50 border border-lime-200 text-left transition-all group"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-lime-700 bg-lime-100 px-2 py-0.5 rounded">
              Step 6 • Logistics
            </span>
            <h4 className="font-bold text-stone-900 text-sm mt-2 group-hover:text-lime-800">
              Farm-Gate Vehicle Advance
            </h4>
            <p className="text-xs text-stone-500 mt-1">
              Confirm mini-truck dispatch from farm to mandi with a ₹600 driver advance token.
            </p>
          </button>
        </div>
      </section>

      {/* Transaction Receipts & History */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
              <Receipt className="w-5 h-5 text-teal-700" />
              <span>Payment Receipts & History ({paymentHistory.length})</span>
            </h2>
            <p className="text-xs text-stone-500">
              All confirmed receipts are recorded on-chain and offline-cached for your records.
            </p>
          </div>
        </div>

        {paymentHistory.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 text-stone-500">
            <Receipt className="w-10 h-10 mx-auto text-stone-300 mb-2" />
            <p className="text-sm font-semibold">No transactions recorded yet.</p>
            <p className="text-xs text-stone-400 mt-1">
              Click &quot;Open Payment Gateway&quot; above to simulate your first payment.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 text-stone-500 uppercase text-[10px] font-bold border-b border-stone-200">
                  <tr>
                    <th className="px-4 py-3">Receipt No</th>
                    <th className="px-4 py-3">Title & Item</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {paymentHistory.map((txn) => (
                    <tr key={txn.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-emerald-800">
                        {txn.receiptNo}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-stone-900">{txn.title}</div>
                        <div className="text-[11px] text-stone-500 line-clamp-1">{txn.description}</div>
                      </td>
                      <td className="px-4 py-3 font-medium">
                        <span className="capitalize">{txn.methodDetails || txn.method}</span>
                      </td>
                      <td className="px-4 py-3 text-stone-500 whitespace-nowrap">{txn.date}</td>
                      <td className="px-4 py-3 text-right font-black text-stone-900 text-sm">
                        ₹{txn.amount.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedReceipt(txn)}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 rounded-lg text-xs font-bold text-stone-700 transition"
                        >
                          View Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Payment Receipt / Order Confirmation Modal Popup */}
      <PaymentReceiptModal
        receipt={selectedReceipt}
        paymentMode={selectedReceipt?.method ? selectedReceipt.method.toUpperCase() : undefined}
        onClose={() => setSelectedReceipt(null)}
        onContinue={() => {
          const wasCOD = selectedReceipt?.method?.toUpperCase() === 'COD';
          setSelectedReceipt(null);
          showToast(
            wasCOD
              ? 'Order confirmed and saved to your history.'
              : 'Payment receipt saved to your history.'
          );
        }}
      />
    </div>
  );
};
