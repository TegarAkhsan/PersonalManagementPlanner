import React, { useState } from 'react';
import {
  X,
  QrCode,
  CreditCard,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Copy,
  Check,
  Clock,
  Sparkles
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';
import { getLocalSettings } from '../lib/invoiceSettingsService';

export default function PaymentModal({ isOpen, onClose, selectedPlan, billingCycle = 'monthly' }) {
  const { changePlan, theme, setCurrentView } = useStorage();
  const isLight = theme === 'light';

  const [paymentMethod, setPaymentMethod] = useState('qris'); // 'qris' | 'bank_transfer' | 'credit_card'
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedText, setCopiedText] = useState(null);
  const adminSettings = getLocalSettings();

  if (!isOpen || !selectedPlan) return null;

  const planName = selectedPlan.name || (selectedPlan === 'Pro' ? 'Pro Creator' : selectedPlan);
  const planId = selectedPlan.id || selectedPlan;
  const isYearly = billingCycle === 'yearly';
  
  // Calculate price
  let basePrice = 99000;
  if (planId === 'Team') basePrice = 249000;
  if (selectedPlan.priceMonthly !== undefined) {
    basePrice = isYearly ? selectedPlan.priceYearly : selectedPlan.priceMonthly;
  }
  const totalAmount = isYearly ? basePrice * 12 : basePrice;
  const [orderId] = useState(() => {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const datePrefix = `${dd}-${mm}-${yyyy}`;
    const randSeq = String(Math.floor(100 + Math.random() * 900));
    return `INV-${datePrefix}-${randSeq}`;
  });

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      changePlan(planId);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setCurrentView('home');
      }, 2500);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 relative animate-in fade-in zoom-in-95 my-8 ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#151518] border-[#2A2A33] text-zinc-100'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b ${
          isLight ? 'border-slate-100' : 'border-[#222228]'
        }`}>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 font-bold">
                <Sparkles size={16} />
              </span>
              <h3 className="text-base font-extrabold tracking-tight">Checkout Paket SaaS</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Upgrade instan ke paket <strong className="text-amber-500">{planName}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Success State */}
        {isSuccess ? (
          <div className="py-10 text-center space-y-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-1">
              <h4 className="text-lg font-black text-emerald-600 dark:text-emerald-400">Pembayaran Berhasil!</h4>
              <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs mx-auto">
                Paket Anda telah aktif sebagai <strong>{planName}</strong>. Semua fitur Pro dan sinkronisasi cloud siap digunakan.
              </p>
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Mengalihkan Anda ke Dashboard...
            </div>
          </div>
        ) : (
          <div className="space-y-5 pt-4">
            {/* Order Summary Card */}
            <div className={`p-4 rounded-xl border flex items-center justify-between ${
              isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#18181D] border-[#25252C]'
            }`}>
              <div>
                <p className="text-xs text-slate-500 dark:text-zinc-400">Ringkasan Tagihan ({orderId})</p>
                <h4 className="text-sm font-bold mt-0.5">{planName} ({isYearly ? 'Tahunan' : 'Bulanan'})</h4>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Akses Proyek Tak Terbatas & Cloud Database
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Total Bayar:</span>
                <span className="text-lg font-black text-amber-500">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold block text-slate-700 dark:text-zinc-300">
                Pilih Metode Pembayaran
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {/* QRIS */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('qris')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'qris'
                      ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-400 font-bold text-amber-500'
                      : isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-[#1A1A20] hover:bg-[#202026] border-[#282830] text-zinc-300'
                  }`}
                >
                  <QrCode size={22} className={paymentMethod === 'qris' ? 'text-amber-500' : 'text-slate-500'} />
                  <span className="text-xs font-bold">QRIS Instant</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500 text-white font-semibold">
                    Semua E-Wallet
                  </span>
                </button>

                {/* Bank Transfer */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-400 font-bold text-amber-500'
                      : isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700' : 'bg-[#1A1A20] hover:bg-[#202026] border-[#282830] text-zinc-300'
                  }`}
                >
                  <Building2 size={22} className={paymentMethod === 'bank_transfer' ? 'text-amber-500' : 'text-slate-500'} />
                  <span className="text-xs font-bold">Virtual Account</span>
                  <span className="text-[9px] text-slate-400">BCA, Mandiri, BRI</span>
                </button>

                {/* Credit Card - Coming Soon */}
                <div
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all select-none opacity-60 cursor-not-allowed ${
                    isLight ? 'bg-slate-100/70 border-slate-200 text-slate-400' : 'bg-[#15151A] border-[#222228] text-zinc-500'
                  }`}
                  title="Metode pembayaran Kartu Debit / Kredit segera hadir"
                >
                  <CreditCard size={22} className="text-slate-400 dark:text-zinc-500" />
                  <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Kartu Debit/Kredit</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 font-bold uppercase tracking-wider">
                    Coming Soon
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details Container */}
            {paymentMethod === 'qris' && (
              <div className={`p-4 rounded-xl border text-center space-y-3 ${
                isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-[#18181D] border-[#25252C]'
              }`}>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
                  <span className="font-semibold text-slate-700 dark:text-zinc-200">Scan QRIS Nasional</span>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-amber-500">
                    <Clock size={12} /> Kadaluarsa dlm 14:59
                  </span>
                </div>

                {/* Interactive Simulated QR Code */}
                <div className="inline-block p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="relative">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=00020101021226590014ID.LINKAJA.WWW01189360091800000000000215ID1020023456789520458125303360540${totalAmount}5802ID5911ProjectFlow6007JAKARTA62070703A016304E85C`}
                      alt="QRIS Payment"
                      className="w-40 h-40 mx-auto rounded"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-md bg-white border border-slate-200 flex items-center justify-center shadow-md text-amber-600 font-black text-xs">
                        QRIS
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-bold text-slate-800 dark:text-zinc-100">
                    Dukung Semua Aplikasi Pembayaran Indonesia
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Gopay, OVO, Dana, ShopeePay, BCA Mobile, Livin Mandiri, BRImo, LinkAja.
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className={`p-4 rounded-xl border space-y-3 ${
                isLight ? 'bg-slate-50/80 border-slate-200' : 'bg-[#18181D] border-[#25252C]'
              }`}>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-[#26262F]">
                  <span className="font-bold">{adminSettings?.bankName || 'BCA Virtual Account (Otomatis)'}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 font-bold">24 Jam</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Nomor Virtual Account:</span>
                    <span className="text-sm font-mono font-bold tracking-wider text-slate-800 dark:text-white">
                      {adminSettings?.bankVaNumber || '80777 0812 3456 7890'}
                    </span>
                    {adminSettings?.bankAccountHolder && (
                      <span className="text-[10px] text-slate-500 dark:text-zinc-400 block mt-0.5">
                        a.n. <strong className="text-slate-700 dark:text-zinc-200">{adminSettings.bankAccountHolder}</strong>
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy((adminSettings?.bankVaNumber || '80777081234567890').replace(/\s+/g, ''), 'va')}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-[#25252E] dark:hover:bg-[#2D2D38] cursor-pointer"
                  >
                    {copiedText === 'va' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    <span>{copiedText === 'va' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  {adminSettings?.bankInstructions || 'Pembayaran akan diverifikasi secara otomatis dalam waktu 1-2 menit setelah transfer selesai.'}
                </p>
              </div>
            )}

            {/* Credit card form removed as method is set to coming soon */}

            {/* Security Guarantee Badge */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400">
              <ShieldCheck size={15} className="text-emerald-500" />
              <span>Transaksi Terenkripsi 256-bit SSL & Garansi Aktivasi Instan</span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-extrabold text-xs shadow-lg shadow-amber-500/25 transition-all cursor-pointer active:scale-98"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Memverifikasi Pembayaran...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Konfirmasi Pembayaran (Rp {totalAmount.toLocaleString('id-ID')})</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
