import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  FolderGit2,
  CheckSquare,
  Target,
  Sparkles,
  Calendar as CalendarIcon,
  FileText,
  BarChart3,
  Archive,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function Sidebar() {
  const {
    currentView,
    setCurrentView,
    isSidebarOpen,
    setIsSidebarOpen,
    setCreateModalType,
    theme
  } = useStorage();

  const isLight = theme === 'light';
  const [isCreateDropdownOpen, setIsCreateDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'today', label: 'Today', icon: CalendarCheck },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'habits', label: 'Habits & Schedule', icon: Sparkles },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  const systemItems = [
    { id: 'archive-habits', label: 'Archive Habits', icon: Archive },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const createOptions = [
    { type: 'task', label: 'New Task' },
    { type: 'project', label: 'New Project' },
    { type: 'habit', label: 'New Habit' },
    { type: 'event', label: 'New Event' },
    { type: 'goal', label: 'New Goal' },
    { type: 'note', label: 'New Note' }
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
      <div className={`h-16 flex items-center justify-between px-4 border-b ${
        isLight ? 'border-slate-200' : 'border-[#26262B]'
      }`}>
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 text-white font-extrabold text-lg flex-shrink-0">
            P
          </div>
          {isSidebarOpen && (
            <div className="flex items-center font-bold tracking-tight text-base whitespace-nowrap">
              <span className={isLight ? 'text-slate-900' : 'text-white'}>ProjectFlow</span>
              <span className={`font-extrabold ml-1 px-1.5 py-0.5 rounded text-xs border ${
                isLight
                  ? 'bg-amber-100 text-amber-700 border-amber-300'
                  : 'text-amber-500 bg-amber-500/10 border-amber-500/30'
              }`}>
                PRO
              </span>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`p-1.5 rounded-md transition-colors ${
            isLight
              ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-900'
              : 'hover:bg-[#222227] text-zinc-400 hover:text-zinc-200'
          }`}
          title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
        </button>
      </div>

      {/* Quick Action Button (+ Create) */}
      <div className="p-3 relative">
        <button
          onClick={() => setIsCreateDropdownOpen(!isCreateDropdownOpen)}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold py-2.5 px-3 rounded-lg text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
        >
          <Plus size={18} strokeWidth={2.5} />
          {isSidebarOpen && (
            <>
              <span>Create</span>
              <ChevronDown size={14} className="ml-auto opacity-70" />
            </>
          )}
        </button>

        {/* Dropdown Menu */}
        {isCreateDropdownOpen && (
          <div
            className={`absolute left-3 right-3 top-14 rounded-lg shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 border ${
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
                className={`w-full text-left px-3.5 py-2 text-xs font-medium flex items-center transition-colors ${
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
      <div className="flex-1 overflow-y-auto px-2 space-y-6 py-2">
        {/* Workspace */}
        <div>
          {isSidebarOpen && (
            <div className={`px-3 pb-2 text-[10px] font-bold tracking-wider uppercase ${
              isLight ? 'text-slate-400' : 'text-zinc-500'
            }`}>
              WORKSPACE
            </div>
          )}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  title={!isSidebarOpen ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
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
                    size={18}
                    className={`transition-colors ${
                      isActive
                        ? isLight ? 'text-amber-600' : 'text-amber-400'
                        : isLight ? 'text-slate-400 group-hover:text-slate-700' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  />
                  {isSidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* System */}
        <div>
          {isSidebarOpen && (
            <div className={`px-3 pb-2 text-[10px] font-bold tracking-wider uppercase ${
              isLight ? 'text-slate-400' : 'text-zinc-500'
            }`}>
              SYSTEM
            </div>
          )}
          <nav className="space-y-1">
            {systemItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  title={!isSidebarOpen ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group ${
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
                    size={18}
                    className={`transition-colors ${
                      isActive
                        ? isLight ? 'text-amber-600' : 'text-amber-400'
                        : isLight ? 'text-slate-400 group-hover:text-slate-700' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  />
                  {isSidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Pro Profile Pill */}
      {isSidebarOpen ? (
        <div className={`p-3 border-t flex items-center gap-3 ${
          isLight ? 'border-slate-200 bg-slate-50/80' : 'border-[#26262B] bg-[#0E0E10]/50'
        }`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
            PF
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-semibold truncate ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
              Creator Workspace
            </p>
            <p className={`text-[11px] truncate ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              Solopreneur Edition
            </p>
          </div>
        </div>
      ) : (
        <div className={`p-3 border-t flex justify-center ${
          isLight ? 'border-slate-200' : 'border-[#26262B]'
        }`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
            PF
          </div>
        </div>
      )}
    </aside>
  );
}
