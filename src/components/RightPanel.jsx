import React, { useState } from 'react';
import {
  Calendar as CalIcon,
  ChevronRight,
  Sparkles,
  MapPin,
  Clock,
  ChevronLeft
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function RightPanel() {
  const { tasks, events, projects, theme } = useStorage();
  const isLight = theme === 'light';
  
  // Current Calendar state (October 2026 based on screenshot/demo)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 1)); // Oct 2026

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; 

  const formatDateString = (d) => {
    const mm = (month + 1).toString().padStart(2, '0');
    const dd = d.toString().padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const upcomingItems = [];

  tasks.forEach((t) => {
    if (t.status !== 'done' && t.dueDate && t.dueDate !== '1899-12-30') {
      const proj = projects.find(p => p.id === t.projectId);
      upcomingItems.push({
        id: t.id,
        title: t.title,
        date: t.dueDate,
        type: 'task',
        projectName: proj ? proj.name : 'Personal / Inbox',
        projectColor: proj ? proj.color : '#EC4899',
        priority: t.priority
      });
    }
  });

  events.forEach((e) => {
    if (e.date && e.date !== '1899-12-30') {
      const proj = projects.find(p => p.id === e.projectId);
      upcomingItems.push({
        id: e.id,
        title: e.title,
        date: e.date,
        type: 'event',
        time: e.startTime ? `${e.startTime} - ${e.endTime}` : null,
        projectName: proj ? proj.name : 'Event',
        projectColor: '#F59E0B',
        location: e.location
      });
    }
  });

  upcomingItems.sort((a, b) => new Date(a.date) - new Date(b.date));

  const todayDateNumber = 4;
  const isDemoMonth = year === 2026 && month === 9;

  const getDayDots = (dayNum) => {
    const dStr = formatDateString(dayNum);
    const hasEvent = events.some(e => e.date === dStr);
    const hasTask = tasks.some(t => t.dueDate === dStr && t.status !== 'done');
    return { hasEvent, hasTask };
  };

  const getRelativeDateLabel = (dateStr) => {
    if (dateStr === '2026-10-04') return 'Today';
    if (dateStr === '2026-10-05') return 'Tomorrow';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-6">
      {/* Mini Calendar Card */}
      <div className={`rounded-xl p-4 border transition-all ${
        isLight
          ? 'bg-white border-slate-200 shadow-sm'
          : 'bg-[#141417] border-[#24242A] shadow-sm'
      }`}>
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <h4 className={`text-sm font-bold tracking-wide ${isLight ? 'text-slate-900' : 'text-white'}`}>
            {monthNames[month]} {year}
          </h4>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className={`p-1 rounded transition-colors ${
                isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-[#222227] text-zinc-400 hover:text-white'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextMonth}
              className={`p-1 rounded transition-colors ${
                isLight ? 'hover:bg-slate-100 text-slate-500' : 'hover:bg-[#222227] text-zinc-400 hover:text-white'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Day Header: M T W T F S S */}
        <div className="grid grid-cols-7 text-center mb-2">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i} className={`text-[11px] font-semibold ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
              {d}
            </span>
          ))}
        </div>

        {/* Grid Days */}
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-8" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, idx) => {
            const dayNum = idx + 1;
            const isToday = isDemoMonth && dayNum === todayDateNumber;
            const { hasEvent, hasTask } = getDayDots(dayNum);

            return (
              <div
                key={dayNum}
                className="h-8 flex flex-col items-center justify-center relative cursor-pointer group"
              >
                <div
                  className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-all ${
                    isToday
                      ? 'bg-amber-500 text-white font-bold shadow-md shadow-amber-500/25'
                      : isLight
                        ? 'text-slate-700 hover:bg-slate-100'
                        : 'text-zinc-300 hover:bg-[#222228] hover:text-white'
                  }`}
                >
                  {dayNum}
                </div>
                {/* Dots indicator */}
                <div className="flex items-center justify-center gap-0.5 mt-0.5 absolute bottom-0.5">
                  {hasEvent && (
                    <span className="w-1 h-1 rounded-full bg-amber-500" />
                  )}
                  {hasTask && (
                    <span className="w-1 h-1 rounded-full bg-pink-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Tasks & Events Section */}
      <div className={`rounded-xl p-4 border transition-all ${
        isLight
          ? 'bg-white border-slate-200 shadow-sm'
          : 'bg-[#141417] border-[#24242A] shadow-sm'
      }`}>
        <div className={`flex items-center justify-between pb-3 border-b mb-3 ${
          isLight ? 'border-slate-100' : 'border-[#24242A]'
        }`}>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            <h4 className={`text-xs font-bold tracking-wider uppercase ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
              Upcoming Tasks & Events
            </h4>
          </div>
          <span className={`text-[11px] font-mono ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
            {upcomingItems.length} items
          </span>
        </div>

        {upcomingItems.length === 0 ? (
          <div className={`py-8 text-center text-xs ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
            No upcoming tasks or events.
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {upcomingItems.slice(0, 8).map((item) => (
              <div
                key={item.id}
                className={`p-2.5 rounded-lg border transition-all group ${
                  isLight
                    ? 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80'
                    : 'bg-[#18181C] hover:bg-[#1E1E23] border-[#24242A]'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <span
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{
                      backgroundColor: item.type === 'event' ? '#F59E0B' : '#EC4899'
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-semibold truncate transition-colors ${
                        isLight ? 'text-slate-800 group-hover:text-amber-600' : 'text-zinc-200 group-hover:text-amber-300'
                      }`}>
                        {item.title}
                      </p>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0 border ${
                        isLight
                          ? 'bg-white text-slate-600 border-slate-200'
                          : 'bg-[#24242A] text-zinc-400 border-transparent'
                      }`}>
                        {getRelativeDateLabel(item.date)}
                      </span>
                    </div>

                    <div className={`flex items-center gap-2 mt-1 text-[11px] ${
                      isLight ? 'text-slate-500' : 'text-zinc-400'
                    }`}>
                      <span className="truncate">{item.projectName}</span>
                      {item.type === 'event' && (
                        <span className={`px-1 rounded font-semibold text-[9px] border ${
                          isLight
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}>
                          Event
                        </span>
                      )}
                      {item.time && (
                        <span className="flex items-center gap-1 font-mono text-[10px]">
                          <Clock size={10} /> {item.time}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}
