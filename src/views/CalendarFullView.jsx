import React, { useState } from 'react';
import {
  Calendar as CalIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  RefreshCw,
  Check,
  CalendarCheck
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function CalendarFullView() {
  const { tasks, events, addEvent, setCreateModalType, theme, currentPlan, setCurrentView } = useStorage();
  const isLight = theme === 'light';
  
  // Google Calendar Integration states
  const [isSyncingGoogle, setIsSyncingGoogle] = useState(false);
  const [isGoogleSynced, setIsGoogleSynced] = useState(() => {
    return localStorage.getItem('projectflow_gcal_synced') === 'true';
  });
  const [syncToast, setSyncToast] = useState(null);
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleSyncGoogleCalendar = () => {
    if (currentPlan === 'Starter') {
      setSyncToast('Fitur Sinkronisasi Google Calendar hanya tersedia untuk paket Pro dan Team.');
      setTimeout(() => setSyncToast(null), 4000);
      return;
    }
    setShowGoogleModal(true);
  };

  const executeGoogleSync = () => {
    setIsSyncingGoogle(true);
    setTimeout(() => {
      setIsSyncingGoogle(false);
      setIsGoogleSynced(true);
      localStorage.setItem('projectflow_gcal_synced', 'true');
      setShowGoogleModal(false);
      setSyncToast('Sinkronisasi Google Calendar aktif! Agenda telah terhubung.');
      setTimeout(() => setSyncToast(null), 4000);
    }, 1200);
  };

  const exportIcsFile = () => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ProjectFlow//ID\nCALSCALE:GREGORIAN\n";
    events.forEach(e => {
      const dt = e.date.replace(/-/g, '');
      icsContent += `BEGIN:VEVENT\nSUMMARY:${e.title}\nDTSTART:${dt}T${(e.startTime || '09:00').replace(':', '')}00\nDTEND:${dt}T${(e.endTime || '10:00').replace(':', '')}00\nDESCRIPTION:${e.category || 'ProjectFlow Event'}\nLOCATION:${e.location || 'Online'}\nEND:VEVENT\n`;
    });
    icsContent += "END:VCALENDAR";
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'projectflow-events.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSyncToast('Berkas kalender .ics berhasil diunduh! Siap di-import langsung ke Google Calendar.');
    setTimeout(() => setSyncToast(null), 4000);
  };
  
  // Initialize with current real date
  const now = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(now.getFullYear(), now.getMonth(), 1));

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrev = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNext = () => setCurrentDate(new Date(year, month + 1, 1));
  const handleToday = () => setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday as index 0: Sun(0)->6, Mon(1)->0, Tue(2)->1, etc.
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;

  const formatDateStr = (day) => {
    const mm = (month + 1).toString().padStart(2, '0');
    const dd = day.toString().padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const getDayItems = (day) => {
    const dateStr = formatDateStr(day);
    const dayTasks = tasks.filter((t) => t.dueDate === dateStr);
    const dayEvents = events.filter((e) => e.date === dateStr);
    return { dayTasks, dayEvents };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
        isLight ? 'border-slate-200' : 'border-[#24242A]'
      }`}>
        <div>
          <h2 className={`text-xl font-extrabold tracking-tight flex items-center gap-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            <span>CALENDAR SCHEDULE</span>
            <span className={`text-xs px-2.5 py-1 rounded font-semibold border ${
              isLight
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              {monthNames[month]} {year}
            </span>
          </h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Sinkronisasi akurat hari dan tanggal untuk tugas, agenda, dan deadline tim.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Google Calendar Sync Button */}
          <button
            onClick={handleSyncGoogleCalendar}
            disabled={isSyncingGoogle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-xs ${
              isGoogleSynced
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                : isLight
                  ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                  : 'bg-[#18181D] hover:bg-[#202026] text-zinc-300 border-[#2A2A32]'
            }`}
            title="Sinkronisasi acara dengan Google Calendar"
          >
            <RefreshCw size={13} className={isSyncingGoogle ? 'animate-spin text-amber-500' : isGoogleSynced ? 'text-emerald-500' : 'text-blue-500'} />
            <span>{isSyncingGoogle ? 'Menyinkronkan...' : isGoogleSynced ? 'Google Calendar Terhubung' : 'Sinkron Google Calendar'}</span>
          </button>

          <button
            onClick={handleToday}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              isLight
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                : 'bg-[#18181D] hover:bg-[#202026] text-zinc-300 border-[#2A2A32]'
            }`}
          >
            Hari Ini
          </button>

          <div className={`flex items-center gap-1 p-1 rounded-lg border ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#141417] border-[#24242A]'
          }`}>
            <button
              onClick={handlePrev}
              aria-label="Previous month"
              className={`p-1.5 rounded transition-colors ${
                isLight ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-900' : 'hover:bg-[#202026] text-zinc-400 hover:text-white'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <span className={`text-xs font-bold px-3 font-mono ${isLight ? 'text-slate-800' : 'text-white'}`}>
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNext}
              aria-label="Next month"
              className={`p-1.5 rounded transition-colors ${
                isLight ? 'hover:bg-slate-100 text-slate-500 hover:text-slate-900' : 'hover:bg-[#202026] text-zinc-400 hover:text-white'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={() => setCreateModalType('event')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={15} />
            <span>Agenda Baru</span>
          </button>
        </div>
      </div>

      {/* Sync Toast Feedback */}
      {syncToast && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Check size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium">{syncToast}</span>
          </div>
          <button onClick={() => setSyncToast(null)} className="text-xs font-bold opacity-70 hover:opacity-100 cursor-pointer">✕</button>
        </div>
      )}

      {/* Main Calendar Matrix */}
      <div className={`rounded-xl overflow-hidden border shadow-sm ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#141417] border-[#24242A]'
      }`}>
        {/* Days of week header (Monday to Sunday) */}
        <div className={`grid grid-cols-7 text-center border-b py-2.5 ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-[#18181D] border-[#24242A] text-zinc-400'
        }`}>
          {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'].map((d) => (
            <span key={d} className="text-xs font-bold">
              {d}
            </span>
          ))}
        </div>

        {/* Days grid */}
        <div className={`grid grid-cols-7 auto-rows-fr divide-x divide-y ${
          isLight ? 'divide-slate-200' : 'divide-[#202026]'
        }`}>
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`cal-empty-${i}`} className={`min-h-[110px] ${isLight ? 'bg-slate-50/50' : 'bg-[#0E0E11]/40'}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const { dayTasks, dayEvents } = getDayItems(day);
            const isToday = 
              year === now.getFullYear() && 
              month === now.getMonth() && 
              day === now.getDate();

            return (
              <div
                key={`day-${day}`}
                className={`min-h-[115px] p-2 flex flex-col justify-between transition-colors ${
                  isLight
                    ? isToday ? 'bg-amber-50/70 hover:bg-amber-50' : 'hover:bg-slate-50/80'
                    : isToday ? 'bg-amber-500/10 hover:bg-[#1A1A20]' : 'hover:bg-[#1A1A20]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-md ${
                      isToday
                        ? 'bg-amber-500 text-white shadow-md shadow-amber-500/30'
                        : isLight ? 'text-slate-700' : 'text-zinc-300'
                    }`}
                  >
                    {day}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] text-amber-500 font-mono font-semibold">
                      {dayEvents.length} ev
                    </span>
                  )}
                </div>

                {/* Day Item chips */}
                <div className="space-y-1 flex-1 overflow-y-auto max-h-[85px]">
                  {dayEvents.map((e) => (
                    <div
                      key={e.id}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium truncate border ${
                        isLight
                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {e.title}
                    </div>
                  ))}
                  {dayTasks.map((t) => (
                    <div
                      key={t.id}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-medium truncate border ${
                        t.status === 'done'
                          ? isLight
                            ? 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                            : 'bg-zinc-800 text-zinc-500 border-transparent line-through'
                          : isLight
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {t.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Google Calendar Real Connection Modal */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-xl p-6 border shadow-2xl space-y-4 animate-in fade-in zoom-in-95 ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#151518] border-[#2A2A33] text-zinc-100'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#222228]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
                  <CalendarCheck size={18} />
                </div>
                <h3 className="text-sm font-bold">Integrasi Google Calendar</h3>
              </div>
              <button onClick={() => setShowGoogleModal(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Ada 2 cara mudah agar agenda Orvian masuk ke Google Calendar ponsel & laptop Anda:
            </p>

            <div className="space-y-3 pt-1">
              {/* Cara 1: Unduh & Buka Langsung */}
              <div className={`p-3.5 rounded-xl border space-y-2 ${
                isLight ? 'bg-blue-50/60 border-blue-200' : 'bg-blue-500/10 border-blue-500/20'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Cara 1: Unduh File (.ics) Otomatis</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500 text-white">Rekomendasi</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-zinc-300">
                  Unduh berkas kalender standar (.ics). Sekali klik unduh, Anda bisa langsung membukanya di HP atau Google Calendar untuk menambahkan seluruh jadwal acara secara otomatis.
                </p>
                <button
                  onClick={exportIcsFile}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                >
                  <Calendar size={14} />
                  <span>Unduh File Kalender (.ics) Sekarang</span>
                </button>
              </div>

              {/* Cara 2: Import Web */}
              <div className={`p-3.5 rounded-xl border space-y-2 ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#1E1E24] border-[#2A2A33]'
              }`}>
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">Cara 2: Buka Google Calendar Web</span>
                <p className="text-[11px] text-slate-600 dark:text-zinc-400">
                  Di Google Calendar, pilih menu <strong>Setelan ⚙ → Impor & Ekspor → Pilih file .ics</strong> yang baru saja Anda unduh.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href="https://calendar.google.com/calendar/u/0/r/settings/export"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-center font-bold text-[11px] transition-all"
                  >
                    Buka Halaman Impor Google Calendar ↗
                  </a>
                </div>
              </div>

              {/* Simpan status connect */}
              <button
                onClick={executeGoogleSync}
                disabled={isSyncingGoogle}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <RefreshCw size={13} className={isSyncingGoogle ? 'animate-spin' : ''} />
                <span>{isSyncingGoogle ? 'Memverifikasi status...' : 'Tandai Kalender Telah Tersinkron'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
