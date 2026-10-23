import React, { useState } from 'react';
import {
  ArrowLeft,
  QrCode,
  Building2,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Sparkles,
  Lock,
  User,
  Mail,
  Phone,
  Tag,
  Download,
  FileText,
  Printer,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  X
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';
import { createOrder, checkCustomerAccess, getLocalOrders } from '../lib/orderService';
import { downloadInvoice } from '../lib/invoiceGenerator';
import { fetchAdminSettings, getLocalSettings } from '../lib/invoiceSettingsService';

export default function PaymentView() {
  const { checkoutData, changePlan, theme, setCurrentView, showAlert } = useStorage();
  const isLight = theme === 'light';

  // Persistent Checkout Session State (survives browser refresh)
  const [formData, setFormData] = useState(() => {
    try {
      const saved = sessionStorage.getItem('orvian_payment_form');
      return saved ? JSON.parse(saved) : { name: '', email: '', phone: '', referral: '' };
    } catch (e) {
      return { name: '', email: '', phone: '', referral: '' };
    }
  });
  const [errors, setErrors] = useState({});

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState(() => {
    return sessionStorage.getItem('orvian_payment_method') || 'qris';
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(() => {
    return sessionStorage.getItem('orvian_payment_success') === 'true';
  });
  const [copiedText, setCopiedText] = useState(null);
  const [adminSettings, setAdminSettings] = useState(getLocalSettings());

  React.useEffect(() => {
    fetchAdminSettings().then(setAdminSettings);
  }, []);

  const planId = checkoutData?.planId || 'Pro';
  const planName = planId === 'Team' ? 'Team / Business' : 'Pro';
  const billingCycle = checkoutData?.billingCycle || 'monthly';
  const isYearly = billingCycle === 'yearly';

  const monthlyPrice = planId === 'Team' ? 249000 : 99000;
  const yearlyPerMonth = planId === 'Team' ? 199000 : 79000;
  const baseMonthly = isYearly ? yearlyPerMonth : monthlyPrice;
  const subtotal = isYearly ? baseMonthly * 12 : baseMonthly;

  // Referral discount
  const isReferralValid = formData.referral.trim().toUpperCase() === 'DISKON20' || formData.referral.trim().toUpperCase() === 'PROJECTFLOW';
  const discountAmount = isReferralValid ? Math.round(subtotal * 0.1) : 0;
  const totalAmount = subtotal - discountAmount;

  // Generated unique order ID: Format INV-DD-MM-YYYY-XXX (persisted in session)
  const [orderId] = useState(() => {
    const savedOrderId = sessionStorage.getItem('orvian_current_order_id');
    if (savedOrderId) return savedOrderId;

    const now = new Date();
    const dd = String(now.getDate()).padStart(2, '0');
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const yyyy = now.getFullYear();
    const datePrefix = `${dd}-${mm}-${yyyy}`;
    
    // Count existing orders today to determine sequence
    const localOrders = getLocalOrders();
    const todayOrdersCount = localOrders.filter(o => o.orderId && o.orderId.includes(datePrefix)).length;
    
    // Daily sequence key for fallback counter in session
    const storageKey = `orvian_daily_seq_${datePrefix}`;
    let dailySeq = parseInt(sessionStorage.getItem(storageKey) || '0', 10);
    if (!dailySeq) {
      dailySeq = todayOrdersCount + 1;
      sessionStorage.setItem(storageKey, String(dailySeq));
    }
    const seqStr = String(dailySeq).padStart(3, '0');
    const newOrderId = `INV-${datePrefix}-${seqStr}`;
    sessionStorage.setItem('orvian_current_order_id', newOrderId);
    return newOrderId;
  });

  // Keep form data and method synced to session storage
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      sessionStorage.setItem('orvian_payment_form', JSON.stringify(updated));
      return updated;
    });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectPaymentMethod = (method) => {
    setPaymentMethod(method);
    sessionStorage.setItem('orvian_payment_method', method);
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Nama lengkap wajib diisi';
    if (!formData.email.trim()) {
      errs.email = 'Alamat email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Format email tidak valid';
    }
    if (!termsAccepted) {
      errs.terms = 'Anda wajib menyetujui Syarat dan Ketentuan layanan Orvian sebelum melanjutkan pembayaran';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const [waConfirmed, setWaConfirmed] = useState(() => {
    return sessionStorage.getItem('orvian_wa_confirmed') === 'true';
  });

  const getWhatsAppUrl = () => {
    const phoneTarget = '6285820004069';
    const textMsg = `Halo Admin Orvian, saya telah melakukan pembayaran:\n\n` +
      `*No. Invoice:* ${orderId}\n` +
      `*Nama:* ${formData.name}\n` +
      `*Email:* ${formData.email}\n` +
      `*No HP:* ${formData.phone || '-'}\n` +
      `*Paket:* ${planName} (${isYearly ? 'Tahunan' : 'Bulanan'})\n` +
      `*Total Bayar:* Rp ${totalAmount.toLocaleString('id-ID')}\n` +
      `*Metode:* ${paymentMethod.toUpperCase().replace('_', ' ')}\n\n` +
      `Mohon verifikasi aktivasi paket dan pengiriman invoice. Terima kasih!`;
    return `https://wa.me/${phoneTarget}?text=${encodeURIComponent(textMsg)}`;
  };

  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('orvian_payment_unlocked') === 'true';
  });
  const [orderStatus, setOrderStatus] = useState('pending'); // 'pending' | 'confirmed'
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState(null);

  // Status checker function: checks order status in Supabase/Local Database
  const checkConfirmationStatus = async (showFeedback = true) => {
    setIsCheckingStatus(true);
    try {
      const order = await checkCustomerAccess(orderId);
      if (order && order.status === 'confirmed') {
        setOrderStatus('confirmed');
        setIsUnlocked(true);
        sessionStorage.setItem('orvian_payment_unlocked', 'true');
        changePlan(order.plan || planId);
        if (showFeedback) {
          setStatusFeedback({ type: 'success', message: 'Hore! Pembayaran Anda telah terkonfirmasi oleh Admin. Hak akses paket telah aktif.' });
        }
      } else {
        setOrderStatus('pending');
        if (showFeedback) {
          setStatusFeedback({ type: 'pending', message: 'Status pembayaran masih menunggu konfirmasi dari Admin. Silakan konfirmasi via WhatsApp atau cek kembali beberapa saat lagi.' });
        }
      }
    } catch (err) {
      if (showFeedback) {
        setStatusFeedback({ type: 'error', message: 'Gagal memeriksa status. Silakan coba kembali.' });
      }
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Poll status periodically every 10 seconds if isSuccess screen is active and not yet confirmed
  React.useEffect(() => {
    if (!isSuccess || isUnlocked) return;
    checkConfirmationStatus(false);
    const interval = setInterval(() => {
      checkConfirmationStatus(false);
    }, 10000);
    return () => clearInterval(interval);
  }, [isSuccess, isUnlocked, orderId]);

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // 1. Sync order to Supabase Database
      await createOrder({
        orderId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        plan: planId,
        billingCycle,
        amount: totalAmount,
        paymentMethod,
        status: 'pending',
        notes: `Pembelian via checkout web. Referral: ${formData.referral || '-'}`
      });
    } catch (err) {
      console.warn('Error saving order to Supabase:', err);
    }

    setTimeout(() => {
      setIsProcessing(false);
      // Payment recorded in Supabase, awaits admin confirmation
      setIsSuccess(true);
      sessionStorage.setItem('orvian_payment_success', 'true');
    }, 1200);
  };

  const handleGoToDashboard = () => {
    if (!waConfirmed && !isUnlocked) {
      showAlert({
        type: 'warning',
        title: 'Konfirmasi Pembayaran Diperlukan',
        message: 'Mohon konfirmasi pembayaran terlebih dahulu ke WhatsApp Admin (0858-2000-4069) atau tunggu verifikasi dari Admin untuk membuka akses dashboard Anda.'
      });
      return;
    }
    // Activate Role Plan and grant workspace RBAC access
    changePlan(planId);
    setCurrentView('home');
  };

  const handleCancelAndReset = () => {
    sessionStorage.removeItem('orvian_payment_success');
    sessionStorage.removeItem('orvian_current_order_id');
    sessionStorage.removeItem('orvian_payment_form');
    sessionStorage.removeItem('orvian_wa_confirmed');
    sessionStorage.removeItem('orvian_payment_unlocked');
    setCurrentView('landing');
  };

  if (isSuccess) {
    const waUrl = getWhatsAppUrl();

    return (
      <div className="max-w-2xl mx-auto py-12 px-4 space-y-6">
        {/* Success Icon & Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10 animate-in zoom-in duration-300">
            <CheckCircle2 size={36} />
          </div>
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 mb-2">
              Transaksi Terverifikasi
            </span>
            <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Pembayaran Berhasil!
            </h2>
            <p className={`text-xs sm:text-sm max-w-md mx-auto mt-1 leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
              Selamat datang di Orvian! Paket <strong>{planName}</strong> Anda telah aktif dengan akses hak penuh.
            </p>
          </div>
        </div>

        {/* Live Order Confirmation Status Box (Fitur Cek Pembayaran Realtime) */}
        <div className={`p-5 rounded-2xl border transition-all ${
          orderStatus === 'confirmed' || isUnlocked
            ? 'bg-emerald-500/10 border-emerald-500/30'
            : isLight ? 'bg-amber-50/80 border-amber-200' : 'bg-[#18181D] border-[#25252C]'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                orderStatus === 'confirmed' || isUnlocked
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
              }`}>
                {orderStatus === 'confirmed' || isUnlocked ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <Clock size={18} />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-100">
                    Status Verifikasi Admin:
                  </h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                    orderStatus === 'confirmed' || isUnlocked
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-300 dark:border-amber-500/30'
                  }`}>
                    {orderStatus === 'confirmed' || isUnlocked ? '✓ TERKONFIRMASI LUNAS' : '⏳ MENUNGGU KONFIRMASI'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                  ID: <span className="font-mono font-bold text-amber-500">{orderId}</span> • Diperbarui otomatis secara live
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => checkConfirmationStatus(true)}
              disabled={isCheckingStatus}
              className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
                  : 'bg-[#22222A] hover:bg-[#2A2A35] text-zinc-200 border-[#32323D]'
              }`}
            >
              <RefreshCw size={13} className={isCheckingStatus ? 'animate-spin text-amber-500' : 'text-slate-400'} />
              <span>{isCheckingStatus ? 'Memeriksa...' : 'Cek Status Sekarang'}</span>
            </button>
          </div>

          {statusFeedback && (
            <div className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in ${
              statusFeedback.type === 'success'
                ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50'
                : statusFeedback.type === 'pending'
                ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700/50'
                : 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700/50'
            }`}>
              {statusFeedback.type === 'success' ? (
                <CheckCircle2 size={16} className="shrink-0" />
              ) : (
                <AlertCircle size={16} className="shrink-0" />
              )}
              <span>{statusFeedback.message}</span>
            </div>
          )}
        </div>

        {/* Invoice Download Action Banner */}
        <div className={`p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isLight ? 'bg-amber-50/70 border-amber-200 text-slate-800' : 'bg-amber-500/10 border-amber-500/25 text-zinc-100'
        }`}>
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 shadow-md shadow-amber-500/20">
              <FileText size={20} />
            </div>
            <div className="text-xs space-y-1">
              <p className="font-extrabold text-sm text-slate-900 dark:text-white">
                Invoice Resmi Siap Diunduh
              </p>
              <p className="text-slate-600 dark:text-zinc-300">
                Invoice digital telah digenerate otomatis dengan rincian transaksi dan kwitansi resmi.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => downloadInvoice({
              orderId,
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
              plan: planName,
              billingCycle,
              amount: totalAmount,
              paymentMethod,
              status: isUnlocked || waConfirmed ? 'confirmed' : 'pending',
              createdAt: new Date().toISOString()
            }, adminSettings)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/25 transition-all cursor-pointer active:scale-95 shrink-0"
          >
            <Download size={15} />
            <span>Unduh / Cetak Invoice</span>
          </button>
        </div>

        {/* Invoice Summary Box */}
        <div className={`p-5 rounded-xl border space-y-3 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#222228]">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Nomor Invoice</p>
              <p className="font-mono font-bold text-sm text-amber-500">{orderId}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Status Hak Akses</p>
              <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={13} /> {planId.toUpperCase()} ACTIVE
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-slate-400 text-[11px]">Nama Pembeli</p>
              <p className="font-semibold">{formData.name}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[11px]">Metode Pembayaran</p>
              <p className="font-semibold uppercase">{paymentMethod.replace('_', ' ')}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[11px]">Paket Langganan</p>
              <p className="font-semibold">{planName} ({isYearly ? '12 Bulan' : '1 Bulan'})</p>
            </div>
            <div>
              <p className="text-slate-400 text-[11px]">Total Lunas</p>
              <p className="font-mono font-bold text-amber-500">Rp {totalAmount.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>

        {/* Step Wajib: WhatsApp Confirmation to 085820004069 */}
        <div className={`p-5 rounded-2xl border-2 transition-all relative overflow-hidden space-y-4 ${
          waConfirmed || isUnlocked
            ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/30'
            : isLight ? 'border-amber-400 bg-amber-50/50' : 'border-amber-500/40 bg-amber-950/20'
        }`}>
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
              waConfirmed || isUnlocked ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
            }`}>
              {waConfirmed || isUnlocked ? <Check size={20} /> : <Phone size={20} />}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  waConfirmed || isUnlocked ? 'bg-emerald-600 text-white' : 'bg-rose-500 text-white'
                }`}>
                  {waConfirmed || isUnlocked ? 'SUDAH TERKONFIRMASI' : 'WAJIB DILAKUKAN'}
                </span>
                <h4 className="text-sm font-extrabold text-slate-900 dark:text-zinc-100">
                  {waConfirmed || isUnlocked
                    ? 'Pembayaran & Akun Telah Dikonfirmasi'
                    : 'Konfirmasi Pembayaran ke WhatsApp Admin'
                  }
                </h4>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                {waConfirmed || isUnlocked
                  ? 'Akses akun Anda telah divalidasi. Anda kini dapat langsung masuk ke dashboard dengan hak akses penuh.'
                  : 'Untuk mengaktifkan akses dashboard dan lisensi akun, Anda wajib mengirimkan konfirmasi pembayaran ke WhatsApp resmi di 0858-2000-4069.'
                }
              </p>
            </div>
          </div>

          <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                setWaConfirmed(true);
                setIsUnlocked(true);
                sessionStorage.setItem('orvian_wa_confirmed', 'true');
                sessionStorage.setItem('orvian_payment_unlocked', 'true');
                changePlan(planId);
              }}
              className="flex-1 flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 transition-all cursor-pointer active:scale-98"
            >
              <Phone size={16} />
              <span>{waConfirmed || isUnlocked ? 'Konfirmasi WA Terkirim ✓' : 'Kirim Konfirmasi WA (0858-2000-4069)'}</span>
            </a>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText('085820004069');
                showAlert({
                  type: 'success',
                  title: 'Nomor WhatsApp Disalin',
                  message: 'Nomor WhatsApp Admin (0858-2000-4069) berhasil disalin ke clipboard! Status pembayaran Anda telah ditandai.'
                });
                setWaConfirmed(true);
                setIsUnlocked(true);
                sessionStorage.setItem('orvian_wa_confirmed', 'true');
                sessionStorage.setItem('orvian_payment_unlocked', 'true');
                changePlan(planId);
              }}
              className={`px-3 py-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isLight ? 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100' : 'bg-[#18181D] border-[#2A2A33] text-zinc-300 hover:bg-[#202026]'
              }`}
            >
              <Copy size={14} />
              <span>Salin No. WA</span>
            </button>
          </div>
        </div>

        {/* Go to Dashboard Button */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={handleGoToDashboard}
            disabled={!waConfirmed && !isUnlocked}
            className={`w-full flex items-center justify-center py-3.5 px-4 rounded-xl font-black text-sm shadow-lg transition-all cursor-pointer active:scale-98 ${
              waConfirmed || isUnlocked
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-amber-500/25'
                : 'bg-slate-300 dark:bg-zinc-800 text-slate-500 dark:text-zinc-500 cursor-not-allowed opacity-70'
            }`}
          >
            Masuk ke Dashboard
          </button>
          {!waConfirmed && !isUnlocked && (
            <p className="text-[11px] text-rose-500 mt-2 font-medium">
              * Tombol dashboard akan terbuka setelah pembayaran diverifikasi oleh Admin atau setelah konfirmasi ke WhatsApp.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Breadcrumb & Back button */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-[#222228] mb-8">
        <button
          onClick={handleCancelAndReset}
          className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
            isLight
              ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 shadow-2xs'
              : 'bg-[#18181D] hover:bg-[#202026] text-zinc-300 border-[#2A2A32]'
          }`}
        >
          <ArrowLeft size={14} />
          <span>Kembali ke Pilihan Paket</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-zinc-400 font-medium">
          <Lock size={14} className="text-emerald-500" />
          <span>Checkout Aman 256-Bit SSL</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Customer Form & Payment Method */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Data Pembeli */}
          <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#141417] border-[#24242A]'
          }`}>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-[#202026]">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black">
                1
              </span>
              <h3 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Informasi Pelanggan
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Nama */}
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Contoh: Budi Pratama"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors ${
                      errors.name
                        ? 'border-rose-400 bg-rose-50/20'
                        : isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-[#1A1A20] border-[#2A2A33] text-white'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                  Alamat Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="nama@email.com"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors ${
                      errors.email
                        ? 'border-rose-400 bg-rose-50/20'
                        : isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-[#1A1A20] border-[#2A2A33] text-white'
                    }`}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
                <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1">
                  Kredensial aktivasi dan bukti pembayaran akan dikirimkan ke email ini.
                </p>
              </div>

              {/* No HP & Referral Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* No HP */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                    No. Handphone / WhatsApp <span className="text-slate-400 font-normal">(opsional)</span>
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="0812-xxxx-xxxx"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-[#1A1A20] border-[#2A2A33] text-white'
                      }`}
                    />
                  </div>
                </div>

                {/* Referral */}
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                    Kode Referral / Kupon
                  </label>
                  <div className="relative">
                    <Tag size={15} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      name="referral"
                      value={formData.referral}
                      onChange={handleInputChange}
                      placeholder="DISKON20"
                      className={`w-full pl-9 pr-3 py-2.5 rounded-lg border text-xs uppercase font-mono focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors ${
                        isReferralValid
                          ? 'border-emerald-400 bg-emerald-50/20'
                          : isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-[#1A1A20] border-[#2A2A33] text-white'
                      }`}
                    />
                  </div>
                  {isReferralValid && (
                    <p className="text-[10px] text-emerald-500 font-bold mt-1">
                      ✓ Diskon 10% berhasil digunakan!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Metode Pembayaran */}
          <div className={`p-6 rounded-2xl border shadow-sm space-y-4 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#141417] border-[#24242A]'
          }`}>
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 dark:border-[#202026]">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black">
                2
              </span>
              <h3 className={`text-sm font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Pilih Metode Pembayaran
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* QRIS */}
              <button
                type="button"
                onClick={() => handleSelectPaymentMethod('qris')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  paymentMethod === 'qris'
                    ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-400'
                    : isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' : 'bg-[#1A1A20] hover:bg-[#202026] border-[#282830]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <QrCode size={24} className={paymentMethod === 'qris' ? 'text-amber-500' : 'text-slate-500'} />
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500 text-white font-extrabold uppercase">
                    Instan
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold">QRIS Nasional</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5">Semua E-Wallet & Bank</p>
                </div>
              </button>

              {/* Bank Transfer */}
              <button
                type="button"
                onClick={() => handleSelectPaymentMethod('bank_transfer')}
                className={`p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-400'
                    : isLight ? 'bg-slate-50 hover:bg-slate-100 border-slate-200' : 'bg-[#1A1A20] hover:bg-[#202026] border-[#282830]'
                }`}
              >
                <Building2 size={24} className={paymentMethod === 'bank_transfer' ? 'text-amber-500' : 'text-slate-500'} />
                <div className="mt-2">
                  <p className="text-xs font-bold">Virtual Account</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5">BCA, Mandiri, BRI, BNI</p>
                </div>
              </button>

              {/* Credit Card - Coming Soon */}
              <div
                className={`relative p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all select-none opacity-60 cursor-not-allowed ${
                  isLight ? 'bg-slate-100/70 border-slate-200 text-slate-400' : 'bg-[#15151A] border-[#222228] text-zinc-500'
                }`}
                title="Metode pembayaran Kartu Debit / Kredit segera hadir"
              >
                <div className="flex items-center justify-between">
                  <CreditCard size={24} className="text-slate-400 dark:text-zinc-500" />
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                    Coming Soon
                  </span>
                </div>
                <div className="mt-2">
                  <p className="text-xs font-bold text-slate-500 dark:text-zinc-400">Kartu Debit/Kredit</p>
                  <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-0.5">Visa & Mastercard</p>
                </div>
              </div>
            </div>

            {/* Payment Details Container */}
            {paymentMethod === 'qris' && (
              <div className={`p-5 rounded-xl border text-center space-y-3.5 ${
                isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-[#18181D] border-[#25252C]'
              }`}>
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 pb-2 border-b border-slate-200 dark:border-[#26262F]">
                  <span className="font-bold text-slate-800 dark:text-zinc-200">Scan Kode QRIS Nasional</span>
                  <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-amber-500">
                    <Clock size={12} /> Kadaluarsa dlm 14:59
                  </span>
                </div>

                <div className="inline-block p-3 rounded-xl bg-white border border-slate-300 shadow-md">
                  <div className="relative">
                    <img
                      src={
                        adminSettings?.qrisImageUrl ||
                        `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(
                          adminSettings?.qrisRawPayload ||
                            `00020101021226590014ID.LINKAJA.WWW01189360091800000000000215ID1020023456789520458125303360540${totalAmount}5802ID5911ProjectFlow6007JAKARTA62070703A016304E85C`
                        )}`
                      }
                      alt="QRIS Payment"
                      className="w-48 h-48 mx-auto rounded object-contain"
                    />
                    {!adminSettings?.qrisImageUrl && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-9 h-9 rounded-md bg-white border border-slate-300 flex items-center justify-center shadow-md text-amber-600 font-black text-xs">
                          QRIS
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <p className="font-bold text-slate-800 dark:text-zinc-100">
                    Buka Aplikasi E-Wallet / Mobile Banking Anda
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    Mendukung GoPay, OVO, Dana, ShopeePay, LinkAja, BCA Mobile, Livin by Mandiri, BRImo, dan seluruh perbankan yang memiliki menu QRIS.
                  </p>
                </div>
              </div>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className={`p-4 rounded-xl border space-y-3 ${
                isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-[#18181D] border-[#25252C]'
              }`}>
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200 dark:border-[#26262F]">
                  <span className="font-bold">{adminSettings?.bankName || 'BCA Virtual Account (Verifikasi Otomatis)'}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 font-bold">Aktif 24 Jam</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Nomor Virtual Account:</span>
                    <span className="text-base font-mono font-bold tracking-wider text-slate-800 dark:text-white">
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
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-200 hover:bg-slate-300 dark:bg-[#25252E] dark:hover:bg-[#2D2D38] cursor-pointer"
                  >
                    {copiedText === 'va' ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    <span>{copiedText === 'va' ? 'Tersalin' : 'Salin VA'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                  {adminSettings?.bankInstructions || 'Lakukan pembayaran melalui ATM, m-BCA, atau KlikBCA. Sistem otomatis mengaktifkan paket Anda tanpa konfirmasi manual.'}
                </p>
              </div>
            )}

            {/* Credit card form removed as method is set to coming soon */}
          </div>
        </div>

        {/* Right Column (5 cols): Order Summary & Sticky Checkout Button */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className={`p-6 rounded-2xl border shadow-sm space-y-5 ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#141417] border-[#24242A]'
          }`}>
            <h3 className={`text-sm font-bold tracking-tight pb-3 border-b ${
              isLight ? 'border-slate-100 text-slate-900' : 'border-[#202026] text-white'
            }`}>
              Rincian Pesanan
            </h3>

            {/* Plan Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">
                  Paket Pilihan
                </span>
                <h4 className="text-base font-extrabold">{planName}</h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                  Siklus: {isYearly ? 'Tahunan (Hemat 20%)' : 'Bulanan'}
                </p>
              </div>
              <span className="text-sm font-bold font-mono">
                Rp {subtotal.toLocaleString('id-ID')}
              </span>
            </div>

            {/* Included highlights */}
            <ul className="space-y-2 text-xs border-y py-3.5 border-slate-100 dark:border-[#202026]">
              <li className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                <Check size={14} className="text-emerald-500" />
                <span>Proyek & Tasks Tidak Terbatas</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                <Check size={14} className="text-emerald-500" />
                <span>Sinkronisasi Google Calendar Real-time</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                <Check size={14} className="text-emerald-500" />
                <span>Ekspor Dokumen Resmi (.docx & PDF)</span>
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                <Check size={14} className="text-emerald-500" />
                <span>Sinkronisasi Cloud Database Terenkripsi</span>
              </li>
            </ul>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                <span>Subtotal</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Potongan Referral (10%)</span>
                  <span>-Rp {discountAmount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                <span>Biaya Layanan & PPN</span>
                <span className="text-emerald-500 font-bold">GRATIS</span>
              </div>
              <div className="pt-2 border-t border-slate-200 dark:border-[#25252E] flex justify-between items-baseline">
                <span className="font-bold text-sm">Total Tagihan</span>
                <span className="text-xl font-black text-amber-500 font-mono">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Syarat & Ketentuan Checklist */}
            <div className={`p-3.5 rounded-xl border transition-all ${
              errors.terms
                ? 'border-rose-400 bg-rose-50/30 dark:bg-rose-950/20'
                : termsAccepted
                ? 'border-amber-400/60 bg-amber-500/5'
                : isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#18181D] border-[#25252C]'
            }`}>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => {
                    setTermsAccepted(e.target.checked);
                    if (errors.terms && e.target.checked) {
                      setErrors(prev => ({ ...prev, terms: '' }));
                    }
                  }}
                  className="mt-0.5 w-4 h-4 rounded text-amber-500 focus:ring-amber-500 border-slate-300 dark:border-[#383842] accent-amber-500 cursor-pointer shrink-0"
                />
                <div className="text-[11px] leading-relaxed text-slate-600 dark:text-zinc-300">
                  Saya telah membaca dan menyetujui{' '}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsTermsModalOpen(true);
                    }}
                    className="font-bold text-amber-600 dark:text-amber-400 underline hover:text-amber-500 transition-colors inline-block"
                  >
                    Syarat & Ketentuan Layanan
                  </button>{' '}
                  serta kebijakan privasi aktivasi paket Orvian.
                </div>
              </label>

              {errors.terms && (
                <div className="mt-2 text-[10px] text-rose-500 flex items-center gap-1 font-semibold animate-in fade-in">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{errors.terms}</span>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmitPayment}
              disabled={isProcessing}
              className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-black text-xs shadow-lg transition-all cursor-pointer active:scale-98 ${
                termsAccepted
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-amber-500/25'
                  : 'bg-amber-500/80 hover:bg-amber-500 text-white shadow-amber-500/15'
              }`}
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Memverifikasi Pembayaran...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>Bayar Sekarang (Rp {totalAmount.toLocaleString('id-ID')})</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Garansi 100% Kepuasan & Uptime 99.9%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Bacaan Syarat & Ketentuan Layanan */}
      {isTermsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className={`w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#15151A] border-[#272730] text-zinc-100'
          }`}>
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-[#22222A] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-amber-500/20">
                  §
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base">Syarat & Ketentuan Layanan</h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">Platform Workspace Orvian (PT Orvian Kreasi Digital)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(false)}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  isLight ? 'hover:bg-slate-100 text-slate-500 border-slate-200' : 'hover:bg-[#202026] text-zinc-400 border-[#2A2A33]'
                }`}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body / Scrollable Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-600 dark:text-zinc-300">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-[11px]">
                Dengan melanjutkan pembayaran dan mencentang persetujuan, Anda sepakat mematuhi seluruh klausul perjanjian penggunaan layanan Orvian di bawah ini.
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">1. Ketentuan Akun & Lisensi</h4>
                <p>
                  Lisensi paket (Pro atau Team) diberikan kepada pembeli yang terdaftar melalui email yang dicantumkan saat checkout. Akses akun bersifat personal atau tim sesuai kuota paket, dan tidak diperkenankan untuk diperjualbelikan kembali tanpa izin tertulis dari pihak Orvian.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">2. Pembayaran & Konfirmasi</h4>
                <p>
                  Seluruh pembayaran diproses melalui saluran resmi (QRIS Nasional & Virtual Account). Setelah transfer selesai, sistem akan mencatat nomor invoice resmi (misal: <code>INV-DD-MM-YYYY-XXX</code>). Pengguna wajib mengirimkan konfirmasi via WhatsApp atau memasukkan kode aktivasi dari email untuk sinkronisasi instan database cloud.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">3. Keamanan Data & Privasi</h4>
                <p>
                  Seluruh data proyek, catatan, target, habits, dan integrasi Google Calendar disimpan dengan enkripsi standar industri (AES-256 dan protokol SSL aman). Orvian tidak membagikan atau menjual data pribadi pelanggan kepada pihak ketiga mana pun.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">4. Kebijakan Refund & Pembatalan</h4>
                <p>
                  Jika terjadi kendala teknis atau kegagalan aktivasi dari pihak sistem kami yang tidak dapat diselesaikan dalam 1x24 jam kerja, pengguna berhak mengajukan pengembalian dana penuh (100% money-back guarantee) melalui jalur WhatsApp Customer Care.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 dark:text-white text-xs">5. Pembaruan Layanan</h4>
                <p>
                  Orvian berhak memperbarui dan menambahkan fitur baru guna meningkatkan kualitas workspace. Pengguna paket berbayar akan selalu mendapatkan pembaruan fitur eksklusif tanpa biaya tersembunyi tambahan.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-[#22222A] flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-[#121216]">
              <span className="text-[11px] text-slate-500 dark:text-zinc-400">
                Terakhir diperbarui: Oktober 2026
              </span>
              <button
                type="button"
                onClick={() => {
                  setTermsAccepted(true);
                  if (errors.terms) {
                    setErrors(prev => ({ ...prev, terms: '' }));
                  }
                  setIsTermsModalOpen(false);
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                Saya Mengerti & Setujui
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
