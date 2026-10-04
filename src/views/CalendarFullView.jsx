import React, { useState } from 'react';
import {
  Calendar as CalIcon,
  ChevronLeft,
  ChevronRight,
  Plus
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function CalendarFullView() {
  const { tasks, events, setCreateModalType, theme } = useStorage();
  const isLight = theme === 'light';
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // October 2026

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrev = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNext = () => setCurrentDate(new Date(year, month + 1, 1));

  const daysInMonth = new Date(year, month + 1, 0).getDate();
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
            <span>FULL CALENDAR</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
              isLight
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              Schedule Overview
            </span>
          </h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Month overview blending tasks, events, and milestones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1 p-1 rounded-lg border ${
            isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#141417] border-[#24242A]'
          }`}>
            <button
              onClick={handlePrev}
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
            <span>+ Add Event</span>
          </button>
        </div>
      </div>

      {/* Main Calendar Matrix */}
      <div className={`rounded-xl overflow-hidden border shadow-sm ${
        isLight ? 'bg-white border-slate-200' : 'bg-[#141417] border-[#24242A]'
      }`}>
        {/* Days of week header */}
        <div className={`grid grid-cols-7 text-center border-b py-2.5 ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-[#18181D] border-[#24242A] text-zinc-400'
        }`}>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
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
            <div key={`cal-empty-${i}`} className={`min-h-[100px] ${isLight ? 'bg-slate-50/50' : 'bg-[#0E0E11]/40'}`} />
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const { dayTasks, dayEvents } = getDayItems(day);
            const isToday = year === 2026 && month === 9 && day === 4;

            return (
              <div
                key={`day-${day}`}
                className={`min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                  isLight
                    ? isToday ? 'bg-amber-50/60 hover:bg-amber-50' : 'hover:bg-slate-50/80'
                    : isToday ? 'bg-amber-500/5 hover:bg-[#1A1A20]' : 'hover:bg-[#1A1A20]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
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
                <div className="space-y-1 flex-1 overflow-y-auto max-h-[80px]">
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
                            ? 'bg-pink-50 text-pink-700 border-pink-200'
                            : 'bg-pink-500/15 text-pink-300 border-pink-500/30'
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
    </div>
  );
}
