import React from 'react';
import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  CheckCircle
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function StatCards() {
  const { projects, tasks, theme } = useStorage();
  const isLight = theme === 'light';

  const totalProjects = projects.filter(p => p.status !== 'archived').length;
  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;

  const inProgressPct = totalTasks > 0 ? Math.round((inProgressTasks / totalTasks) * 100) : 0;
  const completedPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      label: 'Total Projects',
      value: totalProjects,
      subText: 'All active projects',
      icon: FolderKanban,
      iconColor: isLight ? 'text-amber-600' : 'text-amber-400',
      iconBg: isLight ? 'bg-amber-50 border-amber-200' : 'bg-amber-500/10 border-amber-500/20'
    },
    {
      label: 'Total Tasks',
      value: totalTasks,
      subText: 'Across all lists',
      icon: CheckCircle2,
      iconColor: isLight ? 'text-indigo-600' : 'text-indigo-400',
      iconBg: isLight ? 'bg-indigo-50 border-indigo-200' : 'bg-indigo-500/10 border-indigo-500/20'
    },
    {
      label: 'In Progress',
      value: inProgressTasks,
      subText: `${inProgressPct}% of total tasks`,
      icon: Clock3,
      iconColor: isLight ? 'text-blue-600' : 'text-blue-400',
      iconBg: isLight ? 'bg-blue-50 border-blue-200' : 'bg-blue-500/10 border-blue-500/20'
    },
    {
      label: 'Completed',
      value: completedTasks,
      subText: `${completedPct}% of total tasks`,
      icon: CheckCircle,
      iconColor: isLight ? 'text-emerald-600' : 'text-emerald-400',
      iconBg: isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl border transition-all flex items-center justify-between group ${
              isLight
                ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow'
                : 'bg-[#141417] border-[#24242A] hover:border-[#383842] shadow-sm'
            }`}
          >
            <div className="space-y-1">
              <p className={`text-xs font-semibold ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                {stat.label}
              </p>
              <h3 className={`text-2xl font-extrabold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {stat.value}
              </h3>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                {stat.subText}
              </p>
            </div>
            <div className={`p-3 rounded-lg border ${stat.iconBg} ${stat.iconColor} group-hover:scale-105 transition-transform`}>
              <Icon size={20} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
