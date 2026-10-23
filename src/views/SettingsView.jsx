import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  RotateCcw,
  Download,
  Moon,
  Sun,
  ShieldCheck,
  Check,
  Database,
  RefreshCw,
  CreditCard,
  CheckCircle2,
  User,
  Mail,
  Calendar,
  Sparkles,
  Lock,
  ChevronRight,
  SlidersHorizontal,
  Bell
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function SettingsView() {
  const {
    resetDemoData,
    clearAllData,
    projects,
    tasks,
    habits,
    events,
    goals,
    notes,
    theme,
    setTheme,
    supabaseConnected,
    isSyncing,
    lastSyncTime,
    syncAllLocalToSupabase,
    currentPlan,
    changePlan,
    setCurrentView,
    startCheckout,
    user,
    isAdmin,
    showConfirm,
    showAlert
  } = useStorage();

  const isLight = theme === 'light';

  // Check if current user is admin
  const ADMIN_EMAILS = ['tegarrigger@gmail.com', 'tegarakhsan@gmail.com'];
  const isAdminUser = Boolean(
    isAdmin ||
    (user && (user.role === 'admin' || ADMIN_EMAILS.includes((user.email || '').toLowerCase().trim())))
  );

  // User notification & preference states (persisted in local storage)
  const [emailNotifications, setEmailNotifications] = useState(() => {
    return localStorage.getItem('orvian_pref_email_notif') !== 'false';
  });
  const [weeklyReport, setWeeklyReport] = useState(() => {
    return localStorage.getItem('orvian_pref_weekly_report') === 'true';
  });
  const [autoSyncCalendar, setAutoSyncCalendar] = useState(() => {
    return localStorage.getItem('projectflow_gcal_synced') === 'true';
  });

  const handleTogglePref = (key, currentVal, setter) => {
    const newVal = !currentVal;
    setter(newVal);
    localStorage.setItem(key, String(newVal));
  };

  const handleExportJSON = () => {
    const data = { projects, tasks, habits, events, goals, notes };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orvian-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className={`pb-4 border-b ${isLight ? 'border-slate-200' : 'border-[#24242A]'}`}>
        <h2 className={`text-xl font-extrabold tracking-tight flex items-center gap-2 ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          <span>PENGATURAN AKUN & PREFERENSI</span>
        </h2>
        <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
          Kelola profil akun Anda, preferensi antarmuka kerja, paket langganan aktif, dan ekspor data pribadi.
        </p>
      </div>

      <div className="space-y-5">
        {/* 1. Profil Pengguna (User Profile Card) */}
        <div className={`p-5 rounded-2xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-[#222228]">
            <div className="flex items-center gap-3.5">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-xl object-cover border-2 border-amber-500 shadow-sm" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-base shadow-sm">
                  {user?.name ? user.name.slice(0, 2).toUpperCase() : 'OR'}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {user?.name || 'Pengguna Orvian'}
                  </h3>
                  {isAdminUser ? (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center gap-1">
                      <ShieldCheck size={11} /> ADMIN
                    </span>
                  ) : (
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-500 border border-amber-500/25">
                      Paket {currentPlan}
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-0.5 flex items-center gap-1.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                  <Mail size={12} className="text-slate-400" />
                  <span>{user?.email || 'Belum terhubung ke email'}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('landing')}
              className="text-xs px-3.5 py-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-auto active:scale-98"
            >
              <Sparkles size={13} />
              <span>Upgrade / Ganti Paket</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
            <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-[#18181E] border-white/5'}`}>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Status Akun</p>
              <p className="font-bold text-emerald-500 mt-0.5 flex items-center gap-1">
                <CheckCircle2 size={13} /> Aktif & Terverifikasi
              </p>
            </div>
            <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-[#18181E] border-white/5'}`}>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Tipe Langganan</p>
              <p className="font-bold text-amber-500 mt-0.5 font-mono">
                {isAdminUser ? 'Admin (Full Access)' : `Orvian ${currentPlan}`}
              </p>
            </div>
            <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-[#18181E] border-white/5'}`}>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Keamanan Data</p>
              <p className="font-bold text-indigo-400 mt-0.5 flex items-center gap-1">
                <Lock size={12} /> 256-bit Encrypted
              </p>
            </div>
            <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50/70 border-slate-200' : 'bg-[#18181E] border-white/5'}`}>
              <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Proyek</p>
              <p className="font-bold mt-0.5">{projects.length} Proyek Aktif</p>
            </div>
          </div>
        </div>

        {/* 2. Preferensi & Notifikasi Pengguna */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-[#222228]">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
              <SlidersHorizontal size={18} />
            </div>
            <div>
              <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Preferensi Alur Kerja & Notifikasi
              </h4>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                Sesuaikan notifikasi pengingat tugas harian dan sinkronisasi agenda pribadi.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1 text-xs">
            <div className="flex items-center justify-between py-1">
              <div>
                <p className={`font-semibold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
                  Notifikasi Pengingat Deadline & Jadwal
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Kirimkan notifikasi dan rekap tugas prioritas tinggi di dashboard.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePref('orvian_pref_email_notif', emailNotifications, setEmailNotifications)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  emailNotifications ? 'bg-emerald-500' : isLight ? 'bg-slate-300' : 'bg-zinc-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  emailNotifications ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-[#222228]">
              <div>
                <p className={`font-semibold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
                  Laporan Produktivitas Mingguan
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  Ringkasan penyelesaian sprint tugas dan streak habit di menu Analitik.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePref('orvian_pref_weekly_report', weeklyReport, setWeeklyReport)}
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                  weeklyReport ? 'bg-emerald-500' : isLight ? 'bg-slate-300' : 'bg-zinc-700'
                }`}
              >
                <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  weeklyReport ? 'left-6' : 'left-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between py-1 border-t border-slate-100 dark:border-[#222228]">
              <div>
                <p className={`font-semibold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
                  Sinkronisasi Otomatis Google Calendar
                </p>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                  {autoSyncCalendar ? 'Terhubung dengan akun Google Anda.' : 'Kaitkan agenda tugas ke Google Calendar Anda.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCurrentView('calendar')}
                className="text-xs font-bold text-amber-500 hover:underline cursor-pointer"
              >
                {autoSyncCalendar ? 'Kelola di Kalender' : 'Hubungkan Kalender →'}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Tema Tampilan Workspace */}
        <div className={`p-5 rounded-2xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2.5 rounded-lg border ${
              isLight ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}>
              <SettingsIcon size={18} />
            </div>
            <div>
              <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Tema Antarmuka
              </h4>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                Pilih gaya tampilan visual untuk kenyamanan mata saat bekerja.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Soft Light Option */}
            <button
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                isLight
                  ? 'border-amber-500 bg-amber-50/70 shadow-sm ring-1 ring-amber-400'
                  : 'border-[#2A2A33] hover:border-[#383844] bg-[#1A1A20]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-slate-100 border border-slate-300 flex items-center justify-center text-amber-600">
                  <Sun size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-100">Soft Bright (Elegan & Hangat)</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">Ivory modern dengan kontras lembut</p>
                </div>
              </div>
              {isLight && <Check size={16} className="text-amber-600" />}
            </button>

            {/* Dark Mode Option */}
            <button
              onClick={() => setTheme('dark')}
              className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                !isLight
                  ? 'border-amber-500 bg-amber-500/10 shadow-sm ring-1 ring-amber-400'
                  : 'border-slate-200 hover:border-slate-300 bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#18181D] border border-[#2B2B32] flex items-center justify-center text-amber-400">
                  <Moon size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-100">Deep Dark (Linear Pro)</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">Kontras gelap premium hemat baterai</p>
                </div>
              </div>
              {!isLight && <Check size={16} className="text-amber-400" />}
            </button>
          </div>
        </div>

        {/* 4. Khusus Admin: Supabase Database Sync & Developer Settings */}
        {isAdminUser && (
          <div className={`p-5 rounded-2xl border space-y-4 ${
            isLight ? 'bg-slate-50 border-indigo-200 shadow-sm' : 'bg-[#15151C] border-indigo-500/30'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-100 dark:border-indigo-500/20">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  supabaseConnected
                    ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                    : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                }`}>
                  <Database size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      Koneksi Cloud Database Supabase
                    </h4>
                    <span className="text-[9px] px-2 py-0.5 rounded font-black bg-indigo-600 text-white uppercase tracking-wider">
                      ADMIN ONLY
                    </span>
                  </div>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    Konfigurasi backend database dan sinkronisasi cloud real-time.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={syncAllLocalToSupabase}
                  disabled={isSyncing}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    isLight
                      ? 'bg-white hover:bg-slate-100 text-slate-800 border-slate-300 shadow-xs'
                      : 'bg-[#18181D] hover:bg-[#202026] text-zinc-200 border-[#2A2A32]'
                  } ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <RefreshCw size={13} className={isSyncing ? 'animate-spin text-amber-500' : ''} />
                  <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan ke Cloud'}</span>
                </button>

                <button
                  onClick={() => setCurrentView('admin')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all cursor-pointer"
                >
                  <ShieldCheck size={13} />
                  <span>Admin Panel</span>
                </button>
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              <p>
                <strong>Status Supabase:</strong> {supabaseConnected ? '✓ Terhubung' : 'Belum Terhubung'}. Variabel lingkungan backend: <code className="text-amber-500 font-mono">VITE_SUPABASE_URL</code>.
              </p>
            </div>
          </div>
        )}

        {/* 5. Cadangan & Ekspor Data */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg border ${
              isLight ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              <Download size={18} />
            </div>
            <div>
              <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Cadangan Data Pribadi (Export JSON)
              </h4>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                Unduh seluruh data workspace Anda (tugas, habit, catatan, target) sebagai file arsip aman.
              </p>
            </div>
          </div>
          <div className="pt-1">
            <button
              onClick={handleExportJSON}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer active:scale-98 ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-[#202026] hover:bg-[#282832] text-zinc-200 border-[#2F2F38]'
              }`}
            >
              <Download size={14} /> Unduh Berkas JSON Backup
            </button>
          </div>
        </div>

        {/* 6. Pembersihan Data Dummy */}
        <div className={`p-5 rounded-2xl border space-y-4 ${
          isLight ? 'bg-white border-rose-200 shadow-sm' : 'bg-[#141417] border-rose-500/20'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg border ${
              isLight ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              <RotateCcw size={18} />
            </div>
            <div>
              <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Manajemen & Pembersihan Data
              </h4>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                Kosongkan data contoh dummy untuk memulai dengan workspace bersih, atau kembalikan ke data demo.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => {
                showConfirm({
                  type: 'danger',
                  title: 'Hapus Semua Data Dummy?',
                  message: 'Yakin ingin MENGHAPUS SEMUA DATA dummy? Seluruh item tugas, proyek, dan catatan akan dibersihkan.',
                  confirmText: 'Ya, Bersihkan Data',
                  cancelText: 'Batal',
                  onConfirm: async () => {
                    await clearAllData();
                    showAlert({
                      type: 'success',
                      title: 'Data Berhasil Dibersihkan',
                      message: 'Semua data contoh berhasil dikosongkan! Anda sekarang memiliki database bersih siap pakai.'
                    });
                  }
                });
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <RotateCcw size={14} /> Kosongkan Data Dummy (Clean Slate)
            </button>

            <button
              onClick={() => {
                showConfirm({
                  type: 'warning',
                  title: 'Reset ke Data Demo?',
                  message: 'Kembalikan semua item ke konfigurasi data contoh demo awal?',
                  confirmText: 'Ya, Reset Demo',
                  cancelText: 'Batal',
                  onConfirm: () => {
                    resetDemoData();
                    showAlert({
                      type: 'success',
                      title: 'Data Demo Dipulihkan',
                      message: 'Semua contoh proyek, habit, dan tugas demo telah berhasil dimuat kembali.'
                    });
                  }
                });
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1E1E24] dark:hover:bg-[#25252E] text-slate-700 dark:text-zinc-200 text-xs font-semibold border border-slate-300 dark:border-[#2D2D38] transition-all cursor-pointer"
            >
              Reset ke Data Contoh Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
