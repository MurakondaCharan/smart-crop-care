/**
 * Telephone and Contact Utilities for Farmer Services
 */

export const cleanPhoneForTel = (phone: string): string => {
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (!cleaned.startsWith('+')) {
    if (cleaned.length === 10) return `+91${cleaned}`;
  }
  return cleaned;
};

export const cleanPhoneForWhatsApp = (phone: string): string => {
  let digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    digits = `91${digits}`;
  }
  return digits;
};

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  if (isMobileUA) return true;
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isSmallScreen = window.innerWidth <= 768;
  return hasTouch && isSmallScreen;
};
