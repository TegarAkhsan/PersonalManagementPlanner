import React from 'react';
import {
  Target,
  Plus,
  FolderGit2
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function GoalsView() {
  const { goals, projects, habits, updateGoalProgress, setCreateModalType, theme } = useStorage();
  const isLight = theme === 'light';

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
            <span>GOALS & OKRs</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
              isLight
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              Long-term Vision
            </span>
          </h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Connect high-level objectives with active projects and daily habits.
          </p>
        </div>

        <button
          onClick={() => setCreateModalType('goal')}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>+ New Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {goals.map((goal) => {
          const linkedProjects = projects.filter((p) =>
            (goal.linkedProjectIds || []).includes(p.id)
          );
          const linkedHabits = habits.filter((h) =>
            (goal.linkedHabitIds || []).includes(h.id)
          );

          return (
            <div
              key={goal.id}
              className={`p-5 rounded-xl border shadow-sm flex flex-col justify-between transition-all ${
                isLight
                  ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  : 'bg-[#141417] border-[#24242A] hover:border-[#383844]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg border ${
                    isLight
                      ? 'bg-amber-100 text-amber-800 border-amber-300'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    <Target size={18} />
                  </div>
                  <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    Target: {goal.targetDate || 'Q4 2026'}
                  </span>
                </div>

                <h3 className={`text-sm font-bold mb-3 ${isLight ? 'text-slate-900' : 'text-white'}`}>{goal.title}</h3>

                {/* Progress bar and slider */}
                <div className={`space-y-2 mb-4 p-3 rounded-lg border ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#18181D] border-[#24242A]'
                }`}>
                  <div className="flex justify-between items-center text-xs">
                    <span className={isLight ? 'text-slate-600' : 'text-zinc-400'}>Target Progress</span>
                    <span className={`font-bold font-mono ${isLight ? 'text-amber-700' : 'text-amber-400'}`}>
                      {goal.progress}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={goal.progress}
                    onChange={(e) => updateGoalProgress(goal.id, Number(e.target.value))}
                    className="w-full accent-amber-500 h-1.5 bg-slate-200 dark:bg-[#25252E] rounded-lg cursor-pointer"
                  />
                </div>

                {/* Linked Projects */}
                {linkedProjects.length > 0 && (
                  <div className="mb-2">
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                      isLight ? 'text-slate-400' : 'text-zinc-500'
                    }`}>
                      Linked Projects
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {linkedProjects.map((lp) => (
                        <span
                          key={lp.id}
                          className={`px-2 py-0.5 rounded text-[11px] border flex items-center gap-1 ${
                            isLight
                              ? 'bg-slate-100 text-slate-700 border-slate-200'
                              : 'bg-[#222228] text-zinc-300 border-[#2C2C36]'
                          }`}
                        >
                          <FolderGit2 size={10} className="text-amber-500" />
                          {lp.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Linked Habits */}
                {linkedHabits.length > 0 && (
                  <div className="mb-2">
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${
                      isLight ? 'text-slate-400' : 'text-zinc-500'
                    }`}>
                      Supporting Habits
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {linkedHabits.map((lh) => (
                        <span
                          key={lh.id}
                          className={`px-2 py-0.5 rounded text-[11px] border flex items-center gap-1 ${
                            isLight
                              ? 'bg-slate-100 text-slate-700 border-slate-200'
                              : 'bg-[#222228] text-zinc-300 border-[#2C2C36]'
                          }`}
                        >
                          <span>{lh.emoji}</span>
                          {lh.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
