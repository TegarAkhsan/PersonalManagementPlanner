import React, { useState } from 'react';
import {
  CheckCircle2,
  Calendar,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function TodayView() {
  const { tasks, habits, events, updateTask, toggleHabitDay, setCurrentView, theme } = useStorage();
  const isLight = theme === 'light';

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${(now.getMonth()+1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
  const todayDayNum = now.getDate();

  const dayNamesIndo = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const monthNamesIndo = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const todayLabel = `${dayNamesIndo[now.getDay()]}, ${now.getDate()} ${monthNamesIndo[now.getMonth()]} ${now.getFullYear()}`;

  const todayTasks = tasks.filter((t) => t.dueDate === todayStr);
  const overdueTasks = tasks.filter((t) => t.dueDate && t.dueDate < todayStr && t.status !== 'done');
  const todayEvents = events.filter((e) => e.date === todayStr);
  const activeHabits = habits.filter((h) => !h.archived);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`pb-4 border-b ${isLight ? 'border-slate-200' : 'border-[#24242A]'}`}>
        <h2 className={`text-xl font-extrabold tracking-tight flex items-center gap-2 ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          <span>FOKUS HARI INI</span>
          <span className={`text-xs px-2.5 py-1 rounded font-mono border ${
            isLight
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            {todayLabel}
          </span>
        </h2>
        <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
          Ringkasan prioritas tinggi: tugas jatuh tempo hari ini, agenda rapat, dan kebiasaan harian.
        </p>
      </div>

      {/* Grid of Today Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Today's Tasks */}
        <div className={`rounded-xl p-5 border space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <div className={`flex items-center justify-between pb-2 border-b ${
            isLight ? 'border-slate-100' : 'border-[#222228]'
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
              isLight ? 'text-slate-700' : 'text-zinc-200'
            }`}>
              <span className="w-2 h-2 rounded-sm bg-rose-500"></span>
              Tugas Hari Ini ({todayTasks.length})
            </h3>
            <button
              onClick={() => setCurrentView('tasks')}
              className={`text-xs hover:underline flex items-center gap-1 font-semibold ${
                isLight ? 'text-amber-700' : 'text-amber-400'
              }`}
            >
              Semua Tugas <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-2.5">
            {todayTasks.length === 0 ? (
              <div className={`py-6 text-center text-xs ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                Tidak ada tugas berjadwal untuk hari ini!
              </div>
            ) : (
              todayTasks.map((t) => (
                <div
                  key={t.id}
                  className={`p-3 rounded-lg border flex items-start gap-2.5 ${
                    isLight
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-[#18181D] border-[#25252C]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={t.status === 'done'}
                    onChange={() =>
                      updateTask(t.id, {
                        status: t.status === 'done' ? 'in_progress' : 'done'
                      })
                    }
                    className="mt-1 accent-amber-500 rounded cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-medium ${
                        t.status === 'done'
                          ? isLight ? 'line-through text-slate-400' : 'line-through text-zinc-500'
                          : isLight ? 'text-slate-800' : 'text-zinc-200'
                      }`}
                    >
                      {t.title}
                    </p>
                    <span className={`text-[10px] font-mono mt-0.5 inline-block ${
                      isLight ? 'text-slate-400' : 'text-zinc-500'
                    }`}>
                      Prioritas: {t.priority}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Overdue alert if any */}
          {overdueTasks.length > 0 && (
            <div className={`pt-3 border-t ${isLight ? 'border-slate-100' : 'border-[#222228]'}`}>
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-2">
                Perlu Perhatian: Tugas Terlambat ({overdueTasks.length})
              </p>
              <div className="space-y-2">
                {overdueTasks.map((ot) => (
                  <div
                    key={ot.id}
                    className="p-2.5 rounded bg-rose-50 border border-rose-200 text-xs text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-200 flex justify-between items-center"
                  >
                    <span className="truncate">{ot.title}</span>
                    <span className="text-[10px] font-mono">{ot.dueDate}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Column 2: Today's Habits */}
        <div className={`rounded-xl p-5 border space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <div className={`flex items-center justify-between pb-2 border-b ${
            isLight ? 'border-slate-100' : 'border-[#222228]'
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
              isLight ? 'text-slate-700' : 'text-zinc-200'
            }`}>
              <span className="w-2 h-2 rounded-sm bg-emerald-500"></span>
              Target Rutinitas & Habit
            </h3>
            <button
              onClick={() => setCurrentView('habits')}
              className={`text-xs hover:underline flex items-center gap-1 font-semibold ${
                isLight ? 'text-amber-700' : 'text-amber-400'
              }`}
            >
              Kalender Habit <ArrowRight size={12} />
            </button>
          </div>

          <div className="space-y-2.5">
            {activeHabits.map((h) => {
              const isDone =
                h.type === 'single'
                  ? (h.logs || []).includes(todayDayNum)
                  : (h.checklistLogs?.[todayStr]?.length || 0) === (h.subItems?.length || 5);

              return (
                <div
                  key={h.id}
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#18181D] border-[#25252C]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{h.emoji}</span>
                    <div>
                      <p className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>{h.name}</p>
                      <p className="text-[10px] text-amber-500 font-mono flex items-center gap-1">
                        <Flame size={10} className="fill-amber-500" /> {h.streak || 0} hari berturut-turut
                      </p>
                    </div>
                  </div>

                  {h.type === 'single' ? (
                    <button
                      onClick={() => toggleHabitDay(h.id, todayDayNum)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-all border ${
                        isDone
                          ? isLight
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : isLight
                            ? 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                            : 'bg-[#222228] text-zinc-400 hover:bg-[#2b2b34] hover:text-white border-transparent'
                      }`}
                    >
                      {isDone ? 'Selesai' : 'Check'}
                    </button>
                  ) : (
                    <span className="text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400">
                      {h.checklistLogs?.[todayStr]?.length || 0}/5
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Column 3: Today's Schedule & Events */}
        <div className={`rounded-xl p-5 border space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <div className={`flex items-center justify-between pb-2 border-b ${
            isLight ? 'border-slate-100' : 'border-[#222228]'
          }`}>
            <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
              isLight ? 'text-slate-700' : 'text-zinc-200'
            }`}>
              <span className="w-2 h-2 rounded-sm bg-amber-500"></span>
              Jadwal & Agenda
            </h3>
            <span className={`text-xs font-mono ${isLight ? 'text-slate-400' : 'text-zinc-400'}`}>
              {todayEvents.length} agenda
            </span>
          </div>

          <div className="space-y-3">
            {todayEvents.length === 0 ? (
              <div className={`py-6 text-center text-xs ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                Tidak ada agenda terjadwal untuk hari ini. Waktunya deep work!
              </div>
            ) : (
              todayEvents.map((evt) => (
                <div
                  key={evt.id}
                  className={`p-3.5 rounded-lg border ${
                    isLight
                      ? 'bg-amber-50/50 border-amber-200/80 shadow-xs'
                      : 'bg-[#18181D] border-amber-500/20 shadow-sm'
                  }`}
                >
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                    isLight ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {evt.category || 'Agenda'}
                  </span>
                  <h4 className={`text-xs font-bold mt-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>{evt.title}</h4>
                  <div className={`mt-2 text-xs space-y-0.5 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                    <p>Waktu: {evt.startTime} - {evt.endTime}</p>
                    <p>Lokasi: {evt.location}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
