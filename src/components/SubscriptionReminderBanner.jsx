import React from 'react';
import { Clock, AlertTriangle, AlertCircle, Sparkles, ChevronRight, X, ShieldAlert } from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function SubscriptionReminderBanner() {
  const {
    currentPlan,
    subscriptionInfo,
    startCheckout,
    theme,
    isAdmin
  } = useStorage();

  const isLight = theme === 'light';

  // Jangan tampilkan jika paket Starter atau jika admin
  if (currentPlan === 'Starter' || isAdmin) return null;
  if (!subscriptionInfo || !subscriptionInfo.expiresAt) return null;

  const now = new Date();
  const expiryDate = new Date(subscriptionInfo.expiresAt);
  const diffMs = expiryDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // Hanya tampilkan jika sisa waktu <= 7 hari atau sedang dalam masa grace period (diffDays >= -7)
  if (diffDays > 7 || diffDays < -7) return null;

  const formattedDate = expiryDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  // 1. Grace Period (Sudah lewat tanggal habis, sisa waktu grace period <= 7 hari)
  if (diffDays <= 0) {
    const graceRemainingDays = 7 + diffDays;
    return (
      <div className={`w-full px-4 py-2.5 border-b text-xs flex flex-wrap items-center justify-between gap-3 transition-colors ${
        isLight
          ? 'bg-rose-50 border-rose-200 text-rose-900'
          : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1 rounded-md bg-rose-500 text-white shrink-0 animate-pulse">
            <ShieldAlert size={14} />
          </div>
          <p className="font-medium leading-tight">
            <strong className="font-bold">Masa Tenggang (Grace Period):</strong> Paket {currentPlan} Anda telah kedaluwarsa pada {formattedDate}. Tersisa <strong>{graceRemainingDays} hari</strong> sebelum otomatis kembali ke Starter. Seluruh data proyek Anda tetap aman!
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <button
            onClick={() => startCheckout(currentPlan, 'monthly', 50000)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Sparkles size={13} />
            <span>Perpanjang Sekarang (Rp 50rb)</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    );
  }

  // 2. Urgent Warning: H-1 (Sisa 24 Jam)
  if (diffDays === 1) {
    return (
      <div className={`w-full px-4 py-2.5 border-b text-xs flex flex-wrap items-center justify-between gap-3 transition-colors ${
        isLight
          ? 'bg-orange-50 border-orange-200 text-orange-950'
          : 'bg-orange-950/40 border-orange-800/60 text-orange-200'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1 rounded-md bg-orange-500 text-white shrink-0 animate-bounce">
            <AlertCircle size={14} />
          </div>
          <p className="font-medium leading-tight">
            <strong className="font-bold">Perhatian Mendesak:</strong> Masa aktif Paket {currentPlan} Anda tersisa <strong>kurang dari 24 jam</strong> (berakhir besok, {formattedDate}). Perpanjang hari ini agar sinkronisasi Google Calendar dan proyek tanpa batas tidak terputus.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <button
            onClick={() => startCheckout(currentPlan, 'monthly', 50000)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <span>Perpanjang 1-Klik</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    );
  }

  // 3. Highlight Perpanjangan: H-3 s/d H-2
  if (diffDays <= 3) {
    return (
      <div className={`w-full px-4 py-2 border-b text-xs flex flex-wrap items-center justify-between gap-3 transition-colors ${
        isLight
          ? 'bg-amber-50 border-amber-200 text-amber-950'
          : 'bg-amber-950/30 border-amber-800/50 text-amber-200'
      }`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="p-1 rounded-md bg-amber-500 text-white shrink-0">
            <Clock size={14} />
          </div>
          <p className="font-medium leading-tight">
            Masa aktif Paket {currentPlan} Anda tersisa <strong>{diffDays} hari lagi</strong> (berakhir {formattedDate}). Perpanjang sekarang agar alur kerja proyek Anda tetap lancar.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <button
            onClick={() => startCheckout(currentPlan, 'monthly', 50000)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Sparkles size={12} />
            <span>Perpanjang Sekarang</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    );
  }

  // 4. Friendly Reminder: H-7 s/d H-4
  return (
    <div className={`w-full px-4 py-2 border-b text-xs flex flex-wrap items-center justify-between gap-3 transition-colors ${
      isLight
        ? 'bg-blue-50/80 border-blue-200 text-blue-900'
        : 'bg-blue-950/30 border-blue-900/40 text-blue-200'
    }`}>
      <div className="flex items-center gap-2.5 min-w-0">
        <Clock size={14} className="text-blue-500 shrink-0" />
        <p className="leading-tight">
          Pengingat langganan: Paket {currentPlan} Anda aktif hingga <strong>{formattedDate}</strong> (sisa {diffDays} hari).
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-auto">
        <button
          onClick={() => startCheckout(currentPlan, 'monthly', 50000)}
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
        >
          Lihat Opsi Perpanjang →
        </button>
      </div>
    </div>
  );
}
