import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  FolderGit2,
  CheckSquare,
  Target,
  Repeat,
  Calendar as CalendarIcon,
  FileText,
  BarChart3,
  Archive,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Globe,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function Sidebar() {
  const {
    currentView,
    setCurrentView,
    isSidebarOpen,
    setIsSidebarOpen,
    setCreateModalType,
    theme,
    currentPlan,
    supabaseConnected,
    user,
    logoutUser
  } = useStorage();

  const isLight = theme === 'light';
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Ringkasan', icon: LayoutDashboard },
    { id: 'today', label: 'Hari Ini', icon: CalendarCheck },
    { id: 'projects', label: 'Proyek', icon: FolderGit2 },
    { id: 'tasks', label: 'Daftar Tugas', icon: CheckSquare },
    { id: 'goals', label: 'Target / OKR', icon: Target },
    { id: 'habits', label: 'Habit & Rutinitas', icon: Repeat },
    { id: 'calendar', label: 'Kalender Lengkap', icon: CalendarIcon },
    { id: 'notes', label: 'Catatan & Dokumen', icon: FileText },
    { id: 'analytics', label: 'Analitik', icon: BarChart3 }
  ];

  const systemItems = [
    { id: 'archive-habits', label: 'Arsip Habit', icon: Archive },
    { id: 'settings', label: 'Pengaturan & Supabase', icon: Settings }
  ];

  const createOptions = [
    { type: 'task', label: 'Tugas Baru' },
    { type: 'project', label: 'Proyek Baru' },
    { type: 'habit', label: 'Habit Baru' },
    { type: 'event', label: 'Agenda Baru' },
    { type: 'goal', label: 'Target Baru' },
    { type: 'note', label: 'Catatan Baru' }
  ];

  return (
    <aside
      className={`fixed lg:static top-0 bottom-0 left-0 z-40 transition-all duration-300 ease-in-out border-r flex flex-col ${
        isLight
          ? 'bg-[#FFFFFF] border-slate-200 text-slate-800'
          : 'bg-[#121215] border-[#26262B] text-zinc-100'
      } ${isSidebarOpen ? 'w-64' : 'w-20'}`}
    >
      {/* Brand Header */}
      <div className={`h-16 flex items-center ${isSidebarOpen ? 'justify-between px-4' : 'justify-center px-2'} border-b ${
        isLight ? 'border-slate-200' : 'border-[#26262B]'
      }`}>
        {isSidebarOpen ? (
          <>
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 text-white font-extrabold text-lg flex-shrink-0">
                O
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className={`font-bold tracking-tight text-base whitespace-nowrap leading-none ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Orvian
                </span>
                <span className="text-[10px] text-amber-500 font-medium tracking-tight whitespace-nowrap mt-0.5">
                  One space. Every ambition.
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className={`p-1.5 rounded-md transition-colors ${
                isLight
                  ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
                  : 'hover:bg-[#222227] text-zinc-400 hover:text-zinc-200'
              }`}
              title="Sembunyikan navigasi"
            >
              <ChevronLeft size={18} />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center justify-center gap-1 group cursor-pointer focus:outline-none"
            title="Buka navigasi sidebar"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 text-white font-extrabold text-lg flex-shrink-0 group-hover:scale-105 transition-transform">
              O
            </div>
            <ChevronRight size={14} className="text-slate-400 group-hover:text-amber-500 transition-colors -ml-0.5" />
          </button>
        )}
      </div>

      {/* Quick Action Button (+ Create) */}
      <div className="p-2.5 relative space-y-1.5 flex-shrink-0">
        <button
          onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold py-2 px-3 rounded-lg text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
        >
          <Plus size={16} strokeWidth={2.5} />
          {isSidebarOpen && (
            <>
              <span>Tambah Baru</span>
              <ChevronDown size={14} className="ml-auto opacity-70" />
            </>
          )}
        </button>

        {/* Landing Page link */}
        <button
          onClick={() => setCurrentView('landing')}
          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isLight
              ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              : 'bg-[#18181D] hover:bg-[#222228] text-zinc-300 border-[#2A2A32]'
          } ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
          title="Lihat Landing Page & Plans"
        >
          <Globe size={13} className="text-amber-500 flex-shrink-0" />
          {isSidebarOpen && <span>Landing Page SaaS</span>}
        </button>

        {/* Dropdown Menu */}
        {isCreateDropdownOpen && (
          <div
            className={`absolute left-2.5 right-2.5 top-20 rounded-lg shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150 border ${
              isLight
                ? 'bg-white border-slate-200'
                : 'bg-[#1A1A1E] border-[#2B2B32]'
            }`}
            onMouseLeave={() => setIsCreateDropdownOpen(false)}
          >
            {createOptions.map((opt) => (
              <button
                key={opt.type}
                onClick={() => {
                  setCreateModalType(opt.type);
                  setIsCreateDropdownOpen(false);
                }}
                className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center transition-colors ${
                  isLight
                    ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                    : 'text-zinc-300 hover:text-white hover:bg-[#26262D]'
                }`}
              >
                + {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-2 space-y-3 py-1 scrollbar-none">
        {/* Workspace */}
        <div>
          {isSidebarOpen && (
            <div className={`px-2.5 pb-1 text-[9px] font-bold tracking-wider uppercase ${
              isLight ? 'text-slate-400' : 'text-zinc-500'
            }`}>
              WORKSPACE
            </div>
          )}
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  title={!isSidebarOpen ? item.label : undefined}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? isLight
                        ? 'bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : isLight
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#1A1A1E]'
                  } ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
                >
                  <Icon
                    size={16}
                    className={`transition-colors shrink-0 ${
                      isActive
                        ? isLight ? 'text-amber-600' : 'text-amber-400'
                        : isLight ? 'text-slate-400 group-hover:text-slate-700' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  />
                  {isSidebarOpen && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System */}
        <div>
          {isSidebarOpen && (
            <div className={`px-2.5 pb-1 text-[9px] font-bold tracking-wider uppercase ${
              isLight ? 'text-slate-400' : 'text-zinc-500'
            }`}>
              PENGATURAN
            </div>
          )}
          <nav className="space-y-0.5">
            {systemItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  title={!isSidebarOpen ? item.label : undefined}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group ${
                    isActive
                      ? isLight
                        ? 'bg-amber-50 text-amber-800 border border-amber-200/80'
                        : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : isLight
                        ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#1A1A1E]'
                  } ${!isSidebarOpen ? 'justify-center px-0' : ''}`}
                >
                  <Icon
                    size={16}
                    className={`transition-colors shrink-0 ${
                      isActive
                        ? isLight ? 'text-amber-600' : 'text-amber-400'
                        : isLight ? 'text-slate-400 group-hover:text-slate-700' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  />
                  {isSidebarOpen && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Profile Box */}
      {isSidebarOpen ? (
        <div className={`p-2.5 border-t flex-shrink-0 ${
          isLight ? 'border-slate-200 bg-slate-50/80' : 'border-[#26262B] bg-[#0E0E10]/50'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shadow-inner shrink-0">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : 'OR'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className={`text-xs font-semibold truncate ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
                  {user?.name || 'Orvian Workspace'}
                </p>
                <span className="text-[8px] font-extrabold uppercase px-1 py-0.2 rounded bg-amber-500/20 text-amber-500 border border-amber-500/30">
                  ADMIN
                </span>
              </div>
              <p className={`text-[10px] truncate ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                {user?.email || 'One space. Every ambition.'}
              </p>
            </div>

            <button
              onClick={async () => {
                if (window.confirm('Yakin ingin keluar dari akun Anda?')) {
                  await logoutUser();
                  setCurrentView('landing');
                }
              }}
              title="Keluar Akun (Log Out)"
              className={`p-1 rounded-md border transition-all cursor-pointer shrink-0 ${
                isLight
                  ? 'hover:bg-rose-50 text-slate-400 hover:text-rose-600 border-slate-200 hover:border-rose-200'
                  : 'hover:bg-rose-500/10 text-zinc-400 hover:text-rose-400 border-white/5 hover:border-rose-500/20'
              }`}
            >
              <LogOut size={13} />
            </button>
          </div>

          {/* Admin Direct Access Button */}
          <button
            onClick={() => setCurrentView('admin')}
            className={`w-full mt-2 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
              currentView === 'admin'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : isLight
                  ? 'bg-white hover:bg-slate-100 text-indigo-600 border-indigo-200'
                  : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
            }`}
          >
            <ShieldCheck size={12} />
            <span>Admin Control Panel</span>
          </button>
        </div>
      ) : (
        <div className={`p-2 border-t flex flex-col items-center gap-1.5 flex-shrink-0 ${
          isLight ? 'border-slate-200' : 'border-[#26262B]'
        }`}>
          <button
            onClick={() => setCurrentView('admin')}
            title="Buka Admin Control Panel"
            className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all cursor-pointer"
          >
            <ShieldCheck size={14} />
          </button>

          <button
            onClick={async () => {
              if (window.confirm('Yakin ingin keluar dari akun Anda?')) {
                await logoutUser();
                setCurrentView('landing');
              }
            }}
            title="Keluar Akun (Log Out)"
            className="w-7 h-7 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 flex items-center justify-center transition-all cursor-pointer"
          >
            <LogOut size={14} />
          </button>
        </div>
      )}
    </aside>
  );
}
