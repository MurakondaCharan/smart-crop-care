import { jsPDF } from 'jspdf';
import { PaymentTransaction } from '../types';

const cleanText = (str: string | undefined): string => {
  if (!str) return '';
  return str.replace(/₹/g, 'Rs ').replace(/[^\x00-\x7F]/g, ' ');
};

export const generateReceiptPDF = (
  receipt: PaymentTransaction,
  paymentMode?: string
): void => {
  const isCOD = (paymentMode || receipt.method || '').toUpperCase() === 'COD';
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Colors
  const primaryGreen = [16, 120, 72]; // Emerald 700
  const headerBg = isCOD ? [146, 64, 14] : [16, 120, 72]; // Amber 800 vs Emerald 700
  const darkStone = [28, 25, 23];
  const mutedStone = [120, 113, 108];
  const lightBg = [245, 245, 244];

  // Header Banner
  doc.setFillColor(headerBg[0], headerBg[1], headerBg[2]);
  doc.rect(0, 0, 210, 45, 'F');

  // Title in Banner
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  const titleText = isCOD
    ? 'ORDER CONFIRMATION (CASH ON DELIVERY)'
    : 'OFFICIAL PAYMENT RECEIPT';
  doc.text(titleText, 15, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const subtitle = isCOD
    ? 'Smart Crop Care - Farm-Gate Cash on Delivery Consignment'
    : 'Smart Crop Care - Agri-Pay Verified Digital Voucher';
  doc.text(subtitle, 15, 28);

  const complianceText = isCOD
    ? 'Status: ORDER CONFIRMED (DOORSTEP CASH SETTLEMENT)'
    : 'Status: PAYMENT SUCCESSFUL (NPCI UPI 2.0 & RBI COMPLIANT)';
  doc.text(complianceText, 15, 36);

  // Voucher Box (Top Right)
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(140, 12, 55, 24, 3, 3, 'F');
  doc.setTextColor(darkStone[0], darkStone[1], darkStone[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(isCOD ? 'BOOKING ID:' : 'RECEIPT NO:', 145, 19);
  doc.setTextColor(isCOD ? 180 : 16, isCOD ? 83 : 120, isCOD ? 9 : 72);
  doc.setFontSize(10);
  doc.text(receipt.receiptNo, 145, 27);

  // Main Amount Box
  let y = 58;
  doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
  doc.roundedRect(15, y, 180, 28, 4, 4, 'F');
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(15, y, 180, 28, 4, 4, 'S');

  doc.setTextColor(mutedStone[0], mutedStone[1], mutedStone[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(isCOD ? 'AMOUNT PAYABLE ON ARRIVAL' : 'TOTAL AMOUNT PAID', 25, y + 9);

  doc.setFontSize(18);
  if (isCOD) {
    doc.setTextColor(180, 83, 9);
    doc.text(`Rs 0 Paid (Rs ${receipt.amount.toLocaleString('en-IN')} Due on Delivery)`, 25, y + 20);
  } else {
    doc.setTextColor(primaryGreen[0], primaryGreen[1], primaryGreen[2]);
    doc.text(`Rs ${receipt.amount.toLocaleString('en-IN')}`, 25, y + 20);
  }

  // Section Header: Transaction Details
  y = 98;
  doc.setTextColor(darkStone[0], darkStone[1], darkStone[2]);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Voucher & Farmer Information', 15, y);

  doc.setDrawColor(200, 200, 200);
  doc.line(15, y + 3, 195, y + 3);

  // Table-style key-value rows
  y = 110;
  const rowHeight = 12;

  const details = [
    { label: 'Receipt / Booking ID', value: cleanText(receipt.receiptNo) },
    { label: 'Date & Timestamp', value: cleanText(receipt.date) },
    { label: 'Farmer Name', value: cleanText(receipt.farmerName) },
    { label: 'Contact Number', value: `+91 ${cleanText(receipt.farmerPhone)}` },
    { label: 'Service / Product Name', value: cleanText(receipt.title) },
    {
      label: 'Payment Mode',
      value: isCOD ? 'Cash on Delivery (Pay on Arrival)' : cleanText(receipt.methodDetails || receipt.method.toUpperCase()),
    },
    {
      label: 'Channel / Settlement Details',
      value: isCOD
        ? `Pay Rs ${receipt.amount.toLocaleString('en-IN')} in cash to the delivery driver upon receipt`
        : cleanText(receipt.methodDetails || receipt.method.toUpperCase()),
    },
    {
      label: 'Payment / Order Status',
      value: isCOD ? 'CONFIRMED (COD)' : cleanText(receipt.status || 'SUCCESS'),
    },
    {
      label: isCOD ? 'Total Due on Delivery' : 'Total Amount Paid',
      value: `Rs ${receipt.amount.toLocaleString('en-IN')}`,
      highlight: true,
    },
  ];

  details.forEach((row) => {
    // Label column
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(mutedStone[0], mutedStone[1], mutedStone[2]);
    doc.text(row.label, 20, y);

    // Value column
    doc.setFont('helvetica', row.highlight ? 'bold' : 'normal');
    doc.setFontSize(10);
    if (row.highlight) {
      doc.setTextColor(isCOD ? 180 : 16, isCOD ? 83 : 120, isCOD ? 9 : 72);
    } else {
      doc.setTextColor(darkStone[0], darkStone[1], darkStone[2]);
    }
    // Truncate long value if needed
    const wrappedValue = doc.splitTextToSize(row.value, 105);
    doc.text(wrappedValue, 85, y);

    // Subtle divider
    doc.setDrawColor(240, 240, 240);
    const addedHeight = Array.isArray(wrappedValue) && wrappedValue.length > 1 ? wrappedValue.length * 5 : 0;
    doc.line(15, y + 4 + addedHeight, 195, y + 4 + addedHeight);

    y += rowHeight + addedHeight;
  });

  // Notice & Footer box
  y += 8;
  doc.setFillColor(250, 250, 249);
  doc.roundedRect(15, y, 180, 26, 3, 3, 'F');
  doc.setDrawColor(230, 230, 225);
  doc.roundedRect(15, y, 180, 26, 3, 3, 'S');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(mutedStone[0], mutedStone[1], mutedStone[2]);
  if (isCOD) {
    doc.text(
      `Delivery driver dispatch and live tracking updates are forwarded via SMS to +91 ${receipt.farmerPhone}.`,
      20,
      y + 8
    );
    doc.text(
      `Please ensure exact cash of Rs ${receipt.amount.toLocaleString('en-IN')} is available during farm-gate arrival.`,
      20,
      y + 16
    );
  } else {
    doc.text(
      `This is a computer-generated digital receipt issued via Smart Crop Care Agri-Pay Gateway.`,
      20,
      y + 8
    );
    doc.text(
      `Dispatched via SMS & WhatsApp to +91 ${receipt.farmerPhone}. No physical signature is required.`,
      20,
      y + 16
    );
  }

  // Footer Branding
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Smart Crop Care • Agri-Pay Switch & Direct Kisan Payment Services', 15, 285);
  doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, 135, 285);

  // Dynamic Filename as requested: Receipt_${receipt.receiptNo}.pdf
  const filename = `Receipt_${receipt.receiptNo}.pdf`;
  doc.save(filename);
};
