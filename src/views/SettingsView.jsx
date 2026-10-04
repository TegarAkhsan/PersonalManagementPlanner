import React from 'react';
import {
  Settings as SettingsIcon,
  RotateCcw,
  Download,
  Moon,
  Sun,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function SettingsView() {
  const {
    resetDemoData,
    projects,
    tasks,
    habits,
    events,
    goals,
    notes,
    theme,
    setTheme
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
          <span>SETTINGS & PREFERENCES</span>
        </h2>
        <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
          Customize your workspace configuration, backup data, or toggle between Soft Bright & Dark mode.
        </p>
      </div>

      <div className="space-y-4">
        {/* Workspace Theme Selector Card */}
        <div className={`p-5 rounded-xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-lg border ${
                isLight ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                {isLight ? <Sun size={18} /> : <Moon size={18} />}
              </div>
              <div>
                <h4 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Appearance & Visual Style
                </h4>
                <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                  Choose between soft eye-friendly bright pastel theme or deep linear dark mode.
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
                <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-amber-600">
                  <Sun size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-100">Soft Bright (Clean & Cozy)</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">Warm ivory, soft slate & amber highlights</p>
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
                <div className="w-6 h-6 rounded-full bg-[#18181D] border border-[#2B2B32] flex items-center justify-center text-amber-400">
                  <Moon size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-zinc-100">Deep Dark (Linear/Notion)</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">Pure dark contrast with glowing accents</p>
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
                Data Export & Backup
              </h4>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                Download your complete workspace database (tasks, habits, OKRs, notes) as JSON.
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
              <Download size={14} /> Export Backup (JSON)
            </button>
          </div>
        </div>

        {/* Reset Demo Data */}
        <div className={`p-5 rounded-xl border space-y-3 ${
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
                Reset to Demo State
              </h4>
              <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                Restore the initial ProjectFlow PRO seed data with creator projects and habits.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Reset all workspace data to original seed demo?')) {
                resetDemoData();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-600 dark:text-rose-300 text-xs font-semibold border border-rose-300 dark:border-rose-500/30 transition-all cursor-pointer"
          >
            <RotateCcw size={14} /> Reset All Data to Initial Demo
          </button>
        </div>
      </div>
    </div>
  );
}
