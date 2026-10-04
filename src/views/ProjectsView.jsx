import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function ProjectsView() {
  const { projects, tasks, deleteProject, setCreateModalType, theme } = useStorage();
  const isLight = theme === 'light';
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || null);

  const activeProjects = projects.filter((p) => p.status !== 'archived');
  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const projectTasks = tasks.filter((t) => t.projectId === selectedProjectId);

  const completedCount = projectTasks.filter((t) => t.status === 'done').length;
  const progressPct = projectTasks.length > 0 ? Math.round((completedCount / projectTasks.length) * 100) : 0;

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
            <span>PROJECTS</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
              isLight
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              Active Portfolios
            </span>
          </h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Manage and track milestones, deliverables, and team sprint tasks.
          </p>
        </div>

        <button
          onClick={() => setCreateModalType('project')}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>+ New Project</span>
        </button>
      </div>

      {/* Projects Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {activeProjects.map((proj) => {
          const pTasks = tasks.filter((t) => t.projectId === proj.id);
          const pDone = pTasks.filter((t) => t.status === 'done').length;
          const pPct = pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0;
          const isSelected = selectedProjectId === proj.id;

          return (
            <div
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? isLight
                    ? 'border-amber-500 bg-amber-50/40 shadow-sm ring-1 ring-amber-400'
                    : 'border-amber-500 bg-[#17171C] shadow-lg shadow-amber-500/5'
                  : isLight
                    ? 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                    : 'bg-[#141417] border-[#24242A] hover:border-[#383844]'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white shadow-inner"
                  style={{ backgroundColor: proj.color || '#F59E0B' }}
                >
                  <FolderGit2 size={18} />
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProject(proj.id);
                  }}
                  className={`p-1 transition-colors ${isLight ? 'text-slate-400 hover:text-rose-600' : 'text-zinc-500 hover:text-rose-400'}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <h3 className={`text-sm font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{proj.name}</h3>
              <p className={`text-xs line-clamp-2 mb-3 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                {proj.description}
              </p>

              <div className={`space-y-1.5 pt-2 border-t ${isLight ? 'border-slate-100' : 'border-[#202026]'}`}>
                <div className="flex justify-between text-[11px]">
                  <span className={isLight ? 'text-slate-500' : 'text-zinc-400'}>Progress</span>
                  <span className={`font-semibold font-mono ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
                    {pPct}% ({pDone}/{pTasks.length} tasks)
                  </span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isLight ? 'bg-slate-100' : 'bg-[#202026]'}`}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${pPct}%`,
                      backgroundColor: proj.color || '#F59E0B'
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Project Detail Section */}
      {selectedProject && (
        <div className={`p-5 rounded-xl border space-y-4 ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <div className={`flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b ${
            isLight ? 'border-slate-100' : 'border-[#24242A]'
          }`}>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: selectedProject.color }}
                />
                <h3 className={`text-base font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {selectedProject.name}
                </h3>
              </div>
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                {selectedProject.description}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-3 sm:mt-0">
              <span className={`text-xs px-3 py-1 rounded-full font-medium border ${
                isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-[#1C1C22] text-zinc-300 border-[#2C2C34]'
              }`}>
                {projectTasks.length} Associated Tasks
              </span>
              <button
                onClick={() => setCreateModalType('task')}
                className={`text-xs px-3 py-1 rounded-md font-semibold border transition-all ${
                  isLight
                    ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                }`}
              >
                + Add Task to Project
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {projectTasks.length === 0 ? (
              <div className={`py-8 text-center text-xs ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                No tasks linked to this project yet.
              </div>
            ) : (
              projectTasks.map((t) => (
                <div
                  key={t.id}
                  className={`p-3 rounded-lg border flex items-center justify-between ${
                    isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#18181D] border-[#24242A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        t.status === 'done' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        t.status === 'done'
                          ? isLight ? 'line-through text-slate-400' : 'line-through text-zinc-500'
                          : isLight ? 'text-slate-800' : 'text-zinc-200'
                      }`}
                    >
                      {t.title}
                    </span>
                  </div>
                  <div className={`flex items-center gap-3 text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    <span className="capitalize">{t.status.replace('_', ' ')}</span>
                    <span className="font-mono text-[11px]">{t.dueDate || 'No date'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
