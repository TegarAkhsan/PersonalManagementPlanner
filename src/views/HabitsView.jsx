import React, { useState } from 'react';
import {
  Flame,
  Check,
  Plus,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Archive,
  Trash2,
  Repeat
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function HabitsView() {
  const {
    habits,
    toggleHabitDay,
    toggleChecklistSubItem,
    archiveHabit,
    deleteHabit,
    setCreateModalType,
    theme,
    showConfirm
  } = useStorage();

  const isLight = theme === 'light';
  const [activeTab, setActiveTab] = useState('habits');
  const [checklistDate, setChecklistDate] = useState('2026-10-04');

  const currentMonthDays = 31;
  const todayDayNumber = 4;
  const daysHeader = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const firstDayOffset = 3;

  const activeHabits = habits.filter((h) => !h.archived);

  const shiftChecklistDate = (direction) => {
    const d = new Date(checklistDate);
    d.setDate(d.getDate() + direction);
    setChecklistDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Tabs */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
        isLight ? 'border-slate-200' : 'border-[#24242A]'
      }`}>
        <div>
          <h2 className={`text-xl font-extrabold tracking-tight flex items-center gap-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            <span>HABITS & EVENTS</span>
            <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${
              isLight
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              Gamified Workspace
            </span>
          </h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Build compounding consistency through heatmaps, streaks, and prayers checklist.
          </p>
        </div>

        {/* Habits vs Events Switcher */}
        <div className="flex items-center gap-3">
          <div className={`flex items-center p-1 rounded-lg border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#151518] border-[#24242A]'
          }`}>
            <button
              onClick={() => setActiveTab('habits')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'habits'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Habits
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'events'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : isLight ? 'text-slate-600 hover:text-slate-900' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Events
            </button>
          </div>

          <button
            onClick={() => setCreateModalType(activeTab === 'habits' ? 'habit' : 'event')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={15} />
            <span>{activeTab === 'habits' ? 'Habit Baru' : 'Agenda Baru'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Habit Cards */}
      {activeTab === 'habits' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {activeHabits.map((habit) => {
            const isSingle = habit.type === 'single';

            let completedCount = 0;
            let totalPossible = currentMonthDays;
            let progressPct = 0;

            if (isSingle) {
              const logs = habit.logs || [];
              completedCount = logs.length;
              progressPct = Math.round((completedCount / totalPossible) * 100);
            } else {
              const subItemsCount = habit.subItems?.length || 5;
              totalPossible = currentMonthDays * subItemsCount;
              let checkedCount = 0;
              Object.values(habit.checklistLogs || {}).forEach((arr) => {
                checkedCount += arr.length;
              });
              completedCount = checkedCount;
              progressPct = Math.round((completedCount / totalPossible) * 100);
            }

            const isCompletedToday = isSingle
              ? (habit.logs || []).includes(todayDayNumber)
              : (habit.checklistLogs?.[checklistDate]?.length || 0) === (habit.subItems?.length || 5);

            return (
              <div
                key={habit.id}
                className={`rounded-xl p-5 border transition-all flex flex-col justify-between group ${
                  isLight
                    ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow'
                    : 'bg-[#141417] border-[#24242A] hover:border-[#383844] shadow-sm'
                }`}
              >
                <div>
                  {/* Card Header: Icon, Name, Target, Actions */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner border border-white/10"
                        style={{ backgroundColor: `${habit.color}22` }}
                      >
                        {habit.emoji || '⚡'}
                      </div>
                      <div>
                        <h3 className={`text-sm font-bold transition-colors ${
                          isLight ? 'text-slate-800 group-hover:text-amber-700' : 'text-white group-hover:text-amber-300'
                        }`}>
                          {habit.name}
                        </h3>
                        <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                          Target: {habit.targetFrequency === 'daily' ? 'Daily' : habit.targetFrequency}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => archiveHabit(habit.id)}
                        className={`p-1 rounded ${
                          isLight ? 'text-slate-400 hover:text-amber-600 hover:bg-slate-100' : 'text-zinc-500 hover:text-amber-400 hover:bg-[#202026]'
                        }`}
                        title="Archive habit"
                      >
                        <Archive size={14} />
                      </button>
                      <button
                        onClick={() => {
                          showConfirm({
                            type: 'danger',
                            title: 'Hapus Habit',
                            message: `Apakah Anda yakin ingin menghapus habit "${habit.name || 'ini'}"?`,
                            confirmText: 'Ya, Hapus',
                            cancelText: 'Batal',
                            onConfirm: () => deleteHabit(habit.id)
                          });
                        }}
                        className={`p-1 rounded cursor-pointer ${
                          isLight ? 'text-slate-400 hover:text-rose-600 hover:bg-slate-100' : 'text-zinc-500 hover:text-rose-400 hover:bg-[#202026]'
                        }`}
                        title="Delete habit"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Single Habit Heatmap or Checklist view */}
                  {isSingle ? (
                    <div className="my-3">
                      {/* Heatmap Month Grid Header */}
                      <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
                        {daysHeader.map((d, i) => (
                          <span key={i} className={`text-[10px] font-semibold ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                            {d}
                          </span>
                        ))}
                      </div>

                      {/* Heatmap Day Blocks */}
                      <div className="grid grid-cols-7 gap-1.5">
                        {Array.from({ length: firstDayOffset }).map((_, i) => (
                          <div key={`offset-${i}`} className="h-6" />
                        ))}

                        {Array.from({ length: currentMonthDays }).map((_, idx) => {
                          const day = idx + 1;
                          const isDone = (habit.logs || []).includes(day);
                          const isToday = day === todayDayNumber;

                          return (
                            <button
                              key={day}
                              onClick={() => toggleHabitDay(habit.id, day)}
                              title={`October ${day}, 2026 - ${isDone ? 'Completed' : 'Click to toggle'}`}
                              className={`h-6 rounded-md text-[10px] font-semibold flex items-center justify-center transition-all ${
                                isDone
                                  ? 'text-white shadow-xs font-bold'
                                  : isLight
                                    ? 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
                                    : 'bg-[#1C1C22] text-zinc-400 hover:bg-[#272732] hover:text-zinc-200'
                              } ${isToday ? 'ring-2 ring-amber-400' : ''}`}
                              style={{
                                backgroundColor: isDone ? habit.color : undefined
                              }}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* Checklist Sub-Habit View */
                    <div className={`my-3 p-3.5 rounded-lg border space-y-3 ${
                      isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#18181D] border-[#25252C]'
                    }`}>
                      <div className={`flex items-center justify-between pb-2 border-b ${
                        isLight ? 'border-slate-200' : 'border-[#25252D]'
                      }`}>
                        <span className={`text-xs font-semibold ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                          Daily Checklist
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-mono">
                          <button
                            onClick={() => shiftChecklistDate(-1)}
                            className={`p-0.5 rounded ${isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-[#25252F] text-zinc-400 hover:text-white'}`}
                          >
                            <ChevronLeft size={14} />
                          </button>
                          <span className="font-semibold">{checklistDate === '2026-10-04' ? 'Today' : checklistDate}</span>
                          <button
                            onClick={() => shiftChecklistDate(1)}
                            className={`p-0.5 rounded ${isLight ? 'hover:bg-slate-200 text-slate-500' : 'hover:bg-[#25252F] text-zinc-400 hover:text-white'}`}
                          >
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {(habit.subItems || []).map((subItem) => {
                          const checkedItems = habit.checklistLogs?.[checklistDate] || [];
                          const isChecked = checkedItems.includes(subItem);

                          return (
                            <button
                              key={subItem}
                              onClick={() =>
                                toggleChecklistSubItem(habit.id, checklistDate, subItem)
                              }
                              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                isChecked
                                  ? isLight
                                    ? 'bg-cyan-50 text-cyan-800 border border-cyan-300 font-semibold'
                                    : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold'
                                  : isLight
                                    ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                                    : 'bg-[#202026] text-zinc-300 hover:bg-[#272732]'
                              }`}
                            >
                              <span>{subItem}</span>
                              <span
                                className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${
                                  isChecked
                                    ? 'bg-cyan-500 border-cyan-400 text-white font-bold'
                                    : isLight ? 'border-slate-300' : 'border-zinc-600'
                                }`}
                              >
                                {isChecked && <Check size={11} strokeWidth={3} />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Today's Status Button */}
                  <div className="mt-3">
                    {isSingle ? (
                      <button
                        onClick={() => toggleHabitDay(habit.id, todayDayNumber)}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all border ${
                          isCompletedToday
                            ? 'text-white border-transparent shadow-xs'
                            : isLight
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                              : 'bg-[#1C1C22] hover:bg-[#24242D] text-zinc-300 border-[#2B2B34]'
                        }`}
                        style={{
                          backgroundColor: isCompletedToday ? habit.color : undefined,
                          borderColor: isCompletedToday ? habit.color : undefined
                        }}
                      >
                        <Check size={14} strokeWidth={2.5} />
                        <span>{isCompletedToday ? 'Completed Today' : 'Not Completed Yet'}</span>
                      </button>
                    ) : (
                      <div className={`text-center py-1.5 text-xs font-semibold ${
                        isLight ? 'text-cyan-700' : 'text-cyan-400'
                      }`}>
                        {habit.checklistLogs?.[checklistDate]?.length || 0} of{' '}
                        {habit.subItems?.length || 5} completed today
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer: Monthly Progress Bar & Streaks */}
                <div className={`mt-4 pt-3 border-t space-y-2 ${
                  isLight ? 'border-slate-100' : 'border-[#222228]'
                }`}>
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Monthly Progress</span>
                    <span className={`font-bold font-mono ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
                      {progressPct}% ({completedCount}/{totalPossible})
                    </span>
                  </div>

                  <div className={`w-full h-1.5 rounded-full overflow-hidden ${
                    isLight ? 'bg-slate-100' : 'bg-[#202026]'
                  }`}>
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(progressPct, 100)}%`,
                        backgroundColor: habit.color || '#F59E0B'
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                      <Flame size={14} className="fill-amber-500" />
                      <span>{habit.streak || 0} day streak</span>
                    </div>
                    <span className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                      Max: {habit.maxStreak || 0} days
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EventsViewTab />
      )}
    </div>
  );
}

function EventsViewTab() {
  const { events, deleteEvent, theme, showConfirm } = useStorage();
  const isLight = theme === 'light';

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((evt) => (
          <div
            key={evt.id}
            className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
              isLight
                ? 'bg-white border-slate-200 hover:border-amber-400 shadow-sm'
                : 'bg-[#141417] border-[#24242A] hover:border-amber-500/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                  isLight
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                }`}>
                  {evt.category || 'Event'}
                </span>
                <button
                  onClick={() => {
                    showConfirm({
                      type: 'danger',
                      title: 'Hapus Agenda',
                      message: `Apakah Anda yakin ingin menghapus agenda "${evt.title || 'ini'}"?`,
                      confirmText: 'Ya, Hapus',
                      cancelText: 'Batal',
                      onConfirm: () => deleteEvent(evt.id)
                    });
                  }}
                  className={`transition-colors cursor-pointer p-1 rounded hover:bg-rose-500/10 ${isLight ? 'text-slate-400 hover:text-rose-600' : 'text-zinc-500 hover:text-rose-400'}`}
                  title="Hapus agenda"
                >
                  <Trash2 size={13} />
                </button>
              </div>
              <h4 className={`text-sm font-bold mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {evt.title}
              </h4>
              <div className={`space-y-1 text-xs ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                <p className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-amber-500" />
                  <span>{evt.date}</span>
                </p>
                {evt.startTime && (
                  <p>Time: {evt.startTime} - {evt.endTime}</p>
                )}
                {evt.location && (
                  <p>Location: {evt.location}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
