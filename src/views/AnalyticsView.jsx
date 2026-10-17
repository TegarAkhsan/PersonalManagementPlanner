import React from 'react';
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  Clock,
  Flame,
  PieChart,
  Calendar
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function AnalyticsView() {
  const { tasks, habits, projects, theme } = useStorage();
  const isLight = theme === 'light';

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'in_progress').length;
  const reviewTasks = tasks.filter((t) => t.status === 'review').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const highPriorityTasks = tasks.filter((t) => t.priority === 'high').length;
  const mediumPriorityTasks = tasks.filter((t) => t.priority === 'medium').length;
  const lowPriorityTasks = tasks.filter((t) => t.priority === 'low').length;

  const activeHabits = habits.filter((h) => !h.archived);
  const avgStreak = activeHabits.length > 0
    ? Math.round(activeHabits.reduce((acc, h) => acc + (h.streak || 0), 0) / activeHabits.length)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`pb-4 border-b ${isLight ? 'border-slate-200' : 'border-[#24242A]'}`}>
        <h2 className={`text-xl font-extrabold tracking-tight flex items-center gap-2 ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          <span>ANALYTICS & INSIGHTS</span>
          <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${
            isLight
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            Performance Metrics
          </span>
        </h2>
        <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
          Review velocity, completion ratios, priority distribution, and habit consistency.
        </p>
      </div>

      {/* Top Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Overall Task Completion</p>
          <h3 className={`text-2xl font-black mt-1 font-mono ${isLight ? 'text-slate-900' : 'text-white'}`}>{completionRate}%</h3>
          <p className={`text-[11px] mt-1 flex items-center gap-1 ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
            <CheckCircle2 size={12} /> {completedTasks} of {totalTasks} finished
          </p>
        </div>

        <div className={`p-4 rounded-xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Average Habit Streak</p>
          <h3 className="text-2xl font-black text-amber-500 mt-1 font-mono">{avgStreak} days</h3>
          <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
            <Flame size={12} className="fill-amber-500" /> Across {activeHabits.length} habits
          </p>
        </div>

        <div className={`p-4 rounded-xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>High Priority Pipeline</p>
          <h3 className="text-2xl font-black text-rose-500 mt-1 font-mono">{highPriorityTasks}</h3>
          <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Tasks requiring immediate focus</p>
        </div>

        <div className={`p-4 rounded-xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Active Portfolios</p>
          <h3 className="text-2xl font-black text-indigo-500 mt-1 font-mono">{projects.length}</h3>
          <p className={`text-[11px] mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>Solopreneur and routine tracks</p>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <div className={`p-5 rounded-xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-zinc-200'}`}>
            Status Breakdown
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className={isLight ? 'text-slate-600' : 'text-zinc-400'}>Completed (Done)</span>
                <span className="text-emerald-600 font-mono font-bold">{completedTasks}</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#202026]'}`}>
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(completedTasks / (totalTasks || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className={isLight ? 'text-slate-600' : 'text-zinc-400'}>In Progress</span>
                <span className="text-blue-600 font-mono font-bold">{inProgressTasks}</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#202026]'}`}>
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${(inProgressTasks / (totalTasks || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className={isLight ? 'text-slate-600' : 'text-zinc-400'}>In Review</span>
                <span className="text-amber-600 font-mono font-bold">{reviewTasks}</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#202026]'}`}>
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${(reviewTasks / (totalTasks || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className={`p-5 rounded-xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <h3 className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-slate-700' : 'text-zinc-200'}`}>
            Priority Distribution
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-rose-600">High Priority</span>
                <span className="font-mono font-bold">{highPriorityTasks}</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#202026]'}`}>
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${(highPriorityTasks / (totalTasks || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-amber-600">Medium Priority</span>
                <span className="font-mono font-bold">{mediumPriorityTasks}</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#202026]'}`}>
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${(mediumPriorityTasks / (totalTasks || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className={isLight ? 'text-slate-500' : 'text-zinc-400'}>Low Priority</span>
                <span className="font-mono font-bold">{lowPriorityTasks}</span>
              </div>
              <div className={`w-full h-2 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#202026]'}`}>
                <div
                  className="h-full bg-slate-400 dark:bg-zinc-600 rounded-full"
                  style={{ width: `${(lowPriorityTasks / (totalTasks || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
