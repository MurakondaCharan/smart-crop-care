import React, { useState } from 'react';
import {
  PhoneCall,
  Copy,
  Check,
  MessageSquare,
  ExternalLink,
  X,
  Building2,
  Handshake,
  Snowflake,
  Truck,
  ShieldCheck,
} from 'lucide-react';
import { cleanPhoneForTel, cleanPhoneForWhatsApp } from '../utils/phoneUtils';
import { useApp } from '../context/AppContext';

export interface ServiceContactInfo {
  title: string;
  organization: string;
  subtitle?: string;
  contact: string;
  category: 'fpo' | 'buyer' | 'storage' | 'logistics';
}

interface ServiceCallModalProps {
  contactInfo: ServiceContactInfo | null;
  onClose: () => void;
}

export const ServiceCallModal: React.FC<ServiceCallModalProps> = ({
  contactInfo,
  onClose,
}) => {
  const { showToast } = useApp();
  const [copied, setCopied] = useState(false);

  if (!contactInfo) return null;

  const telHref = `tel:${cleanPhoneForTel(contactInfo.contact)}`;
  const whatsappHref = `https://wa.me/${cleanPhoneForWhatsApp(contactInfo.contact)}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(contactInfo.contact);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = contactInfo.contact;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      showToast(`Copied ${contactInfo.contact} to clipboard`);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy phone number:', err);
      showToast(`Phone: ${contactInfo.contact}`);
    }
  };

  const getCategoryIcon = () => {
    switch (contactInfo.category) {
      case 'fpo':
        return <Building2 className="w-5 h-5 text-blue-700" />;
      case 'buyer':
        return <Handshake className="w-5 h-5 text-emerald-700" />;
      case 'storage':
        return <Snowflake className="w-5 h-5 text-cyan-700" />;
      case 'logistics':
        return <Truck className="w-5 h-5 text-lime-700" />;
    }
  };

  const getCategoryBadge = () => {
    switch (contactInfo.category) {
      case 'fpo':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'buyer':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'storage':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'logistics':
        return 'bg-lime-100 text-lime-800 border-lime-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200 relative">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          aria-label="Close call dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className="p-3 bg-stone-100 rounded-2xl shrink-0">
            {getCategoryIcon()}
          </div>
          <div className="pr-6">
            <span
              className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mb-1 ${getCategoryBadge()}`}
            >
              {contactInfo.title}
            </span>
            <h3 className="text-lg font-black text-stone-900 leading-tight">
              {contactInfo.organization}
            </h3>
            {contactInfo.subtitle && (
              <p className="text-xs text-stone-500 mt-0.5">
                {contactInfo.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Phone Display Card */}
        <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 mb-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
              Direct Contact Number
            </span>
            <span className="text-xl font-black text-stone-900 tracking-wide font-mono">
              {contactInfo.contact}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className={`p-2.5 rounded-xl border transition-all flex items-center gap-1 text-xs font-bold cursor-pointer ${
              copied
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
            }`}
            title="Copy number to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-500" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 mb-4">
          {/* WhatsApp Call / Chat */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            id="call-whatsapp-btn"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition active:scale-98 shadow-sm cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat or Call on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          {/* Copy Phone Number */}
          <button
            type="button"
            id="copy-phone-btn"
            onClick={handleCopy}
            className="w-full py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 font-bold text-sm flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Phone Number Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-600" />
                <span>Copy Phone Number ({contactInfo.contact})</span>
              </>
            )}
          </button>

          {/* Native System / Computer Dialer */}
          <a
            href={telHref}
            id="open-dialer-btn"
            className="w-full py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition text-center"
          >
            <PhoneCall className="w-3.5 h-3.5 text-stone-500" />
            <span>Open System / Computer Dialer ({contactInfo.contact})</span>
          </a>
        </div>

        {/* Helpful Desktop Context Note */}
        <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-900/80 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p>
            On mobile devices, tapping this button opens your phone keypad
            instantly. On desktop browsers, you can copy the number or connect via
            WhatsApp Web.
          </p>
        </div>

        {/* Done / Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
