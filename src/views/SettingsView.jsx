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
  CheckCircle2
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
    startCheckout
  } = useStorage();

  const isLight = theme === 'light';

  const handleExportJSON = () => {
    const data = { projects, tasks, habits, events, goals, notes };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `projectflow-pro-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className={`pb-4 border-b ${isLight ? 'border-slate-200' : 'border-[#24242A]'}`}>
        <h2 className={`text-xl font-extrabold tracking-tight flex items-center gap-2 ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          <span>PENGATURAN & INTEGRASI</span>
        </h2>
        <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
          Kelola koneksi cloud database Supabase, konfigurasi paket SaaS, tema tampilan, dan cadangan data.
        </p>
      </div>

      <div className="space-y-4">
        {/* Supabase Integration Card */}
        <div className={`p-5 rounded-xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-[#222228]">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg border ${
                supabaseConnected
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                  : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
              }`}>
                <Database size={20} />
              </div>
              <div>
                <h4 className={`text-sm font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  <span>Koneksi Supabase Database</span>
                </h4>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                  Integrasi cloud database untuk sinkronisasi proyek, tugas, agenda, habit, target, dan catatan Anda.
                </p>
              </div>
            </div>

            <button
              onClick={syncAllLocalToSupabase}
              disabled={isSyncing}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-xs'
                  : 'bg-[#18181D] hover:bg-[#202026] text-zinc-200 border-[#2A2A32]'
              } ${isSyncing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
              <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Data ke Supabase'}</span>
            </button>
          </div>

          <div className="pt-3 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed space-y-1">
            <p>
              <strong>Tips Netlify Deployment:</strong> Masukkan variabel <code className="text-amber-500 font-mono">VITE_SUPABASE_URL</code> dan <code className="text-amber-500 font-mono">VITE_SUPABASE_ANON_KEY</code> di menu <em>Site Configuration &gt; Environment variables</em> di dashboard Netlify Anda.
            </p>
          </div>
        </div>

        {/* SaaS Plan Management */}
        <div className={`p-5 rounded-xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#222228]">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg border ${
                isLight ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
              }`}>
                <CreditCard size={20} />
              </div>
              <div>
                <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Paket Langganan SaaS
                </h4>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                  Paket aktif Anda saat ini: <span className="font-bold text-amber-500">{currentPlan}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('admin')}
                className="text-xs px-3 py-1.5 rounded-lg font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck size={14} />
                <span>Admin Panel</span>
              </button>

              <button
                onClick={() => setCurrentView('landing')}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all cursor-pointer ${
                  isLight
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                    : 'bg-[#202026] hover:bg-[#282832] text-zinc-200 border-[#2F2F38]'
                }`}
              >
                Halaman Penjualan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3">
            {['Starter', 'Pro', 'Team'].map((pName) => {
              const isP = currentPlan === pName;
              return (
                <button
                  key={pName}
                  onClick={() => {
                    if (pName === 'Starter') {
                      changePlan('Starter');
                    } else {
                      const price = pName === 'Team' ? 249000 : 99000;
                      startCheckout(pName, 'monthly', price);
                    }
                  }}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    isP
                      ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-500/10 ring-1 ring-amber-400'
                      : 'border-slate-200 dark:border-[#2A2A33] hover:border-slate-300 bg-slate-50 dark:bg-[#1A1A20]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">{pName}</span>
                    {isP && <CheckCircle2 size={15} className="text-amber-500" />}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1">
                    {pName === 'Starter' && 'Maks 2 Proyek, Tanpa Kalender Sync'}
                    {pName === 'Pro' && 'Proyek Bebas, Google Sync & Ekspor Dokumen'}
                    {pName === 'Team' && 'Kolaborasi Tim & Dedikasi Database'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Workspace Theme Selector Card */}
        <div className={`p-5 rounded-xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
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
                  Pilih gaya tema visual untuk kenyamanan mata saat bekerja.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Soft Light Option */}
            <button
              onClick={() => setTheme('light')}
              className={`p-3.5 rounded-lg border text-left transition-all flex items-center justify-between ${
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
              className={`p-3.5 rounded-lg border text-left transition-all flex items-center justify-between ${
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

        {/* Data Management & Export */}
        <div className={`p-5 rounded-xl border space-y-4 ${
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
                Cadangan Data (Backup JSON)
              </h4>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                Unduh seluruh isi database (tugas, habit, catatan, target) untuk arsip cadangan.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleExportJSON}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-300'
                  : 'bg-[#202026] hover:bg-[#282832] text-zinc-200 border-[#2F2F38]'
              }`}
            >
              <Download size={14} /> Ekspor Berkas JSON
            </button>
          </div>
        </div>

        {/* Reset Demo Data & Drop All Data */}
        <div className={`p-5 rounded-xl border space-y-4 ${
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
                Kosongkan seluruh data dummy untuk mulai dengan database bersih, atau reset ke contoh demo.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={async () => {
                if (window.confirm('Yakin ingin MENGHAPUS SEMUA DATA (drop dummy data) dari browser dan database cloud Supabase? Database akan menjadi kosong bersih.')) {
                  await clearAllData();
                  alert('Semua data berhasil dibersihkan! Anda sekarang memiliki database kosong siap pakai.');
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <RotateCcw size={14} /> Kosongkan Semua Data Dummy (Clean Slate)
            </button>

            <button
              onClick={() => {
                if (window.confirm('Kembalikan semua data ke pengaturan demo awal?')) {
                  resetDemoData();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-[#1E1E24] dark:hover:bg-[#25252E] text-slate-700 dark:text-zinc-200 text-xs font-semibold border border-slate-300 dark:border-[#2D2D38] transition-all cursor-pointer"
            >
              Reset ke Data Contoh Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
