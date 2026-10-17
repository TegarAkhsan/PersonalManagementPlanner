import React, { useState, useEffect } from 'react';
import {
  Search,
  LayoutGrid,
  List,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Menu,
  Sparkles,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function TopBar() {
  const {
    taskViewMode,
    setTaskViewMode,
    setIsCommandPaletteOpen,
    isSidebarOpen,
    setIsSidebarOpen,
    theme,
    toggleTheme,
    currentPlan,
    setCurrentView,
    user,
    logoutUser
  } = useStorage();

  const [currentTime, setCurrentTime] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Live real-time clock matching brief format: "Fri, 2 Oct 2026 · 11:26 PM"
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const optionsDate = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
      const datePart = now.toLocaleDateString('en-US', optionsDate);
      const timePart = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      setCurrentTime(`${datePart} · ${timePart}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const isLight = theme === 'light';

  return (
    <header className={`h-16 border-b transition-colors duration-200 px-6 flex items-center justify-between sticky top-0 z-30 ${
      isLight
        ? 'border-slate-200 bg-white/80 backdrop-blur-md'
        : 'border-[#26262B] bg-[#0E0E11]/90 backdrop-blur-md'
    }`}>
      {/* Left: Mobile hamburger menu toggle & Global Command Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 w-full max-w-md">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`lg:hidden p-2 rounded-lg border transition-colors cursor-pointer ${
            isLight
              ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
              : 'bg-[#18181C] border-[#2B2B32] text-zinc-300 hover:bg-[#222228]'
          }`}
          title="Toggle Navigation Menu"
        >
          <Menu size={18} />
        </button>

        <div
          onClick={() => setIsCommandPaletteOpen(true)}
          className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg border cursor-pointer transition-all shadow-inner group ${
            isLight
              ? 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-500'
              : 'bg-[#18181C] border-[#2B2B32] hover:border-zinc-500 text-zinc-400'
          }`}
        >
          <Search size={16} className={`transition-colors ${
            isLight ? 'text-slate-400 group-hover:text-amber-500' : 'text-zinc-500 group-hover:text-amber-400'
          }`} />
          <span className={`text-xs flex-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Search projects, tasks, habits...
          </span>
          <kbd className={`hidden sm:inline-flex items-center gap-0.5 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border ${
            isLight
              ? 'bg-slate-200 text-slate-600 border-slate-300'
              : 'bg-[#24242A] text-zinc-400 border-[#34343D]'
          }`}>
            Ctrl K
          </kbd>
        </div>
      </div>

      {/* Right Tools: Theme Toggle, Live Clock & Layout Controls */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Plan / Role Indicator Badge */}
        <button
          onClick={() => setCurrentView('landing')}
          title={`Paket Aktif: ${currentPlan}. Klik untuk melihat fitur.`}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
            currentPlan === 'Team'
              ? 'bg-gradient-to-r from-purple-500/15 to-indigo-500/15 border-purple-500/30 text-purple-600 dark:text-purple-300'
              : currentPlan === 'Pro'
                ? 'bg-gradient-to-r from-amber-500/15 to-orange-500/15 border-amber-500/30 text-amber-600 dark:text-amber-300'
                : isLight
                  ? 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  : 'bg-[#18181C] border-[#28282F] text-zinc-300 hover:bg-[#222228]'
          }`}
        >
          <Sparkles size={13} className={currentPlan === 'Starter' ? 'text-slate-400' : 'text-amber-500'} />
          <span className="uppercase tracking-wider text-[10px] font-black">{currentPlan} PLAN</span>
        </button>

        {/* Soft Light / Dark Theme Switcher Button */}
        <button
          onClick={toggleTheme}
          title={isLight ? "Switch to Dark Mode" : "Switch to Soft Light Mode"}
          className={`p-2 rounded-lg border transition-all flex items-center gap-1.5 text-xs font-medium ${
            isLight
              ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 shadow-sm'
              : 'bg-[#18181C] text-amber-400 border-[#28282F] hover:bg-[#222228]'
          }`}
        >
          {isLight ? (
            <>
              <Sun size={15} className="text-amber-500" />
              <span className="hidden md:inline text-[11px] font-semibold">Soft Light</span>
            </>
          ) : (
            <>
              <Moon size={15} className="text-amber-400" />
              <span className="hidden md:inline text-[11px] font-semibold">Dark Mode</span>
            </>
          )}
        </button>

        {/* Live Date and Time */}
        <div className={`hidden lg:flex items-center gap-2 text-xs font-medium tracking-wide font-mono px-3 py-1.5 rounded-md border ${
          isLight
            ? 'bg-slate-100 text-slate-700 border-slate-200'
            : 'bg-[#161619] text-zinc-300 border-[#24242A]'
        }`}>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>{currentTime || 'Loading clock...'}</span>
        </div>

        {/* View Layout Mode Buttons */}
        <div className={`flex items-center p-0.5 rounded-lg border ${
          isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#18181C] border-[#28282F]'
        }`}>
          <button
            onClick={() => setTaskViewMode('board')}
            title="Kanban Board View"
            className={`p-1.5 rounded-md transition-all ${
              taskViewMode === 'board'
                ? 'bg-amber-500 text-black shadow-sm font-semibold'
                : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setTaskViewMode('list')}
            title="Table / List View"
            className={`p-1.5 rounded-md transition-all ${
              taskViewMode === 'list'
                ? 'bg-amber-500 text-black shadow-sm font-semibold'
                : isLight ? 'text-slate-500 hover:text-slate-900' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <List size={16} />
          </button>
        </div>

        {/* Fullscreen / Focus Mode */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Keluar Mode Fokus' : 'Mode Fokus'}
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
            isLight
              ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              : 'bg-[#18181C] border-[#28282F] text-zinc-400 hover:text-zinc-200 hover:bg-[#202026]'
          }`}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        {/* User Log Out Quick Action Button */}
        <button
          onClick={async () => {
            if (window.confirm('Yakin ingin keluar dari akun Anda?')) {
              await logoutUser();
              setCurrentView('landing');
            }
          }}
          title="Keluar dari Akun (Log Out)"
          className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
            isLight
              ? 'bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border-slate-200 hover:border-rose-200'
              : 'bg-[#18181C] hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 border-[#28282F] hover:border-rose-500/25'
          }`}
        >
          <LogOut size={16} />
          <span className="hidden xl:inline text-xs font-semibold">Keluar</span>
        </button>
      </div>
    </header>
  );
}
