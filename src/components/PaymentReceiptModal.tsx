import React, { useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Printer,
  Download,
  Loader2,
  X,
  ArrowRight,
  Phone,
  User,
  Calendar,
  CreditCard,
  Package,
  MessageSquare,
  Sparkles,
  Truck,
  Info,
} from 'lucide-react';
import { PaymentTransaction } from '../types';
import { useApp } from '../context/AppContext';
import { generateReceiptPDF } from '../utils/receiptPdf';

interface PaymentReceiptModalProps {
  receipt: PaymentTransaction | null;
  paymentMode?: string;
  onClose: () => void;
  onContinue?: () => void;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  receipt,
  paymentMode,
  onClose,
  onContinue,
}) => {
  const { showToast } = useApp();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  if (!receipt) return null;

  // Determine if this is Cash on Delivery
  const currentMode = (paymentMode || receipt.method || '').toUpperCase();
  const isCOD = currentMode === 'COD';

  const handlePrintOrDownload = async () => {
    setIsGeneratingPdf(true);
    try {
      // 1. Generate & download the PDF with dynamic filename Receipt_${receipt.receiptNo}.pdf
      generateReceiptPDF(receipt, paymentMode);
      showToast(`Downloaded Receipt_${receipt.receiptNo}.pdf`);

      // 2. Also trigger window.print() if supported by the browser environment
      try {
        window.print();
      } catch (printErr) {
        console.log('window.print note (sandboxed iframe):', printErr);
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      showToast('Generating printable view...');
      try {
        window.print();
      } catch (printErr) {
        console.error('window.print error:', printErr);
        showToast('Printing unavailable. Please screenshot this voucher.');
      }
    } finally {
      setTimeout(() => {
        setIsGeneratingPdf(false);
      }, 400);
    }
  };

  const handleDone = () => {
    if (onContinue) {
      onContinue();
    } else {
      onClose();
    }
  };

  // Human-readable method label
  const getMethodBadge = (method: string, details?: string) => {
    if (details) return details;
    switch (method?.toLowerCase()) {
      case 'upi':
        return 'UPI • Instant QR & VPA';
      case 'kcc':
        return 'RuPay Kisan Credit Card (4% Subsidy)';
      case 'netbanking':
        return 'Net Banking (Agri Core Banking)';
      case 'cod':
        return 'Cash on Delivery (Pay on Arrival)';
      default:
        return method?.toUpperCase() || 'Agri-Pay Verified';
    }
  };

  return (
    <div
      id="payment-receipt-overlay-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="payment-receipt-modal-container"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-4 sm:my-8 animate-in zoom-in-95 duration-200"
      >
        {/* Top Decorative Header */}
        <div
          className={`p-5 relative overflow-hidden text-white ${
            isCOD
              ? 'bg-gradient-to-r from-amber-800 via-stone-800 to-emerald-900'
              : 'bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800'
          }`}
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              {/* Hide any references to online payment gateways when COD */}
              {!isCOD ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/30 text-emerald-100 border border-emerald-300/30">
                  <ShieldCheck className="w-3 h-3 text-emerald-200" />
                  <span>NPCI UPI 2.0 & RBI Compliant</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/30 text-amber-100 border border-amber-300/30">
                  <Truck className="w-3 h-3 text-amber-200" />
                  <span>Farm-Gate Cash On Delivery</span>
                </span>
              )}
            </div>

            <button
              type="button"
              id="payment-receipt-close-btn"
              onClick={onClose}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition active:scale-95"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-center pt-3 pb-2 relative z-10">
            <div
              className={`w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-lg ring-4 mb-2.5 ${
                isCOD ? 'text-amber-600 ring-amber-400/30' : 'text-emerald-600 ring-emerald-400/30'
              }`}
            >
              {isCOD ? (
                <Truck className="w-9 h-9 text-amber-600 stroke-[2.5]" />
              ) : (
                <CheckCircle2 className="w-10 h-10 text-emerald-600 stroke-[2.5]" />
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {isCOD ? 'Order Placed Successfully (Cash on Delivery)' : 'Payment Successful!'}
            </h3>
            <p className="text-xs text-stone-200 mt-0.5">
              {isCOD
                ? 'Consignment scheduled for dispatch to your farm gate'
                : 'Transaction verified by Ministry Agri-Pay switch & Escrow'}
            </p>
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full font-mono text-xs font-bold text-white border border-white/25">
              <span>{isCOD ? 'Order / Booking ID:' : 'Receipt No:'}</span>
              <span className="text-amber-300 font-extrabold">{receipt.receiptNo}</span>
            </div>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Main Amount Card */}
          <div
            className={`p-4 rounded-2xl border text-center space-y-1 ${
              isCOD
                ? 'bg-amber-50/90 border-amber-200'
                : 'bg-emerald-50/80 border-emerald-200/80'
            }`}
          >
            <span
              className={`text-[11px] font-extrabold uppercase tracking-wider ${
                isCOD ? 'text-amber-900' : 'text-emerald-800'
              }`}
            >
              {isCOD ? 'Amount Payable' : 'Total Amount Paid'}
            </span>
            <div
              className={`text-2xl sm:text-3xl font-black tracking-tight ${
                isCOD ? 'text-amber-950' : 'text-emerald-950'
              }`}
            >
              {isCOD
                ? `₹0 Paid (₹${receipt.amount.toLocaleString('en-IN')} Due on Delivery)`
                : `₹${receipt.amount.toLocaleString('en-IN')}`}
            </div>
            <div
              className={`text-xs font-semibold flex items-center justify-center gap-1 ${
                isCOD ? 'text-amber-800' : 'text-emerald-700'
              }`}
            >
              {isCOD ? (
                <>
                  <Truck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pay cash to driver upon physical inspection at doorstep</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Zero Convenience Fee • 100% Farmer Subsidized</span>
                </>
              )}
            </div>
          </div>

          {/* Detailed Summary Table */}
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-xs sm:text-sm space-y-2.5">
            <div className="flex items-center justify-between py-1 border-b border-stone-200/70">
              <span className="text-stone-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span>Farmer Name:</span>
              </span>
              <span className="font-bold text-stone-900">{receipt.farmerName}</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-stone-200/70">
              <span className="text-stone-500 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>Contact Number:</span>
              </span>
              <span className="font-mono font-semibold text-stone-800">
                +91 {receipt.farmerPhone}
              </span>
            </div>

            <div className="flex items-start justify-between py-1 border-b border-stone-200/70">
              <span className="text-stone-500 flex items-center gap-1.5 shrink-0">
                <Package className="w-3.5 h-3.5 text-stone-400" />
                <span>Service / Product:</span>
              </span>
              <div className="text-right max-w-[220px]">
                <div className="font-bold text-stone-900">{receipt.title}</div>
                {receipt.description && (
                  <div className="text-[11px] text-stone-500 line-clamp-1">{receipt.description}</div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-stone-200/70">
              <span className="text-stone-500 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-stone-400" />
                <span>Payment Mode:</span>
              </span>
              <span className="font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md text-xs">
                {isCOD
                  ? 'Cash on Delivery (Pay on Arrival)'
                  : getMethodBadge(receipt.method, receipt.methodDetails)}
              </span>
            </div>

            <div className="flex items-start justify-between py-1 border-b border-stone-200/70">
              <span className="text-stone-500 flex items-center gap-1.5 shrink-0">
                <Info className="w-3.5 h-3.5 text-stone-400" />
                <span>Channel Details:</span>
              </span>
              <span className="text-right font-medium text-stone-800 text-xs max-w-[240px]">
                {isCOD
                  ? `Pay ₹${receipt.amount.toLocaleString('en-IN')} in cash to the delivery driver upon receipt`
                  : receipt.methodDetails || getMethodBadge(receipt.method)}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-stone-200/70">
              <span className="text-stone-500">Amount Paid:</span>
              <span className="font-bold text-stone-900 text-right">
                {isCOD
                  ? `₹0 Paid (₹${receipt.amount.toLocaleString('en-IN')} Due on Delivery)`
                  : `₹${receipt.amount.toLocaleString('en-IN')}`}
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-stone-200/70">
              <span className="text-stone-500 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>Timestamp:</span>
              </span>
              <span className="text-stone-700 font-medium">{receipt.date}</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-stone-500">
                {isCOD ? 'Order Status:' : 'Transaction Status:'}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isCOD ? 'CONFIRMED (COD)' : (receipt.status || 'SUCCESS')}</span>
              </span>
            </div>
          </div>

          {/* SMS / WhatsApp Alert Confirmation Box */}
          <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50/80 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3 shadow-2xs">
            <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs font-bold text-sm">
              <MessageSquare className="w-4 h-4 text-white" />
            </div>
            <div className="space-y-0.5">
              <div className="font-black text-amber-950 text-xs flex items-center gap-1.5">
                <span>
                  {isCOD
                    ? 'Order Confirmed & Delivery SMS Dispatched!'
                    : 'SMS & WhatsApp Invoice Dispatched!'}
                </span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                {isCOD ? (
                  <>
                    Delivery driver dispatch details and live tracking link have been dispatched via SMS to{' '}
                    <strong className="text-amber-950 font-mono">+91 {receipt.farmerPhone}</strong>.
                    Please keep <strong className="text-amber-950">₹{receipt.amount.toLocaleString('en-IN')}</strong> in cash ready upon arrival.
                  </>
                ) : (
                  <>
                    An official GST invoice and digital delivery tracking link have been dispatched to{' '}
                    <strong className="text-amber-950 font-mono">+91 {receipt.farmerPhone}</strong>.
                    You can review or download receipts anytime in your <strong>Profile &gt; Saved History</strong> tab.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              type="button"
              id="payment-receipt-print-btn"
              onClick={handlePrintOrDownload}
              disabled={isGeneratingPdf}
              className="w-full sm:w-1/2 py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-xs cursor-pointer disabled:opacity-60"
            >
              {isGeneratingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4 text-stone-600" />
                  <span>{isCOD ? 'Print / Save PDF Slip' : 'Print / Save PDF'}</span>
                </>
              )}
            </button>

            <button
              type="button"
              id="payment-receipt-done-btn"
              onClick={handleDone}
              className={`w-full sm:w-1/2 py-3 px-4 rounded-xl text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-md ${
                isCOD
                  ? 'bg-amber-700 hover:bg-amber-800'
                  : 'bg-emerald-700 hover:bg-emerald-800'
              }`}
            >
              <span>Done & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
