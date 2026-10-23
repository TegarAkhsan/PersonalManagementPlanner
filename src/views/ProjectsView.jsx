import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Trash2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  DollarSign,
  TrendingUp,
  Briefcase,
  Edit2,
  X,
  Check
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function ProjectsView() {
  const { projects, tasks, deleteProject, updateProject, setCreateModalType, theme, currentPlan, setCurrentView, showConfirm } = useStorage();
  const isLight = theme === 'light';
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [projectFilterTab, setProjectFilterTab] = useState('all'); // 'all' | 'joki' | 'internal'
  const [editingFeeProjId, setEditingFeeProjId] = useState(null);
  const [tempFee, setTempFee] = useState('');

  const activeProjects = projects.filter((p) => p.status !== 'archived');
  
  // Deteksi project joki (baik dari flag isJoki atau nama yang memuat kata 'joki')
  const isProjectJoki = (p) => p.isJoki || p.name.toLowerCase().includes('joki');
  
  const jokiProjects = activeProjects.filter(isProjectJoki);
  const internalProjects = activeProjects.filter((p) => !isProjectJoki(p));

  const displayedProjects =
    projectFilterTab === 'joki'
      ? jokiProjects
      : projectFilterTab === 'internal'
      ? internalProjects
      : activeProjects;

  // Total Pendapatan dari project joki (termasuk fee level project dan akumulasi fee dari masing-masing task joki)
  const getProjectTotalFee = (proj) => {
    const projBaseFee = Number(proj.fee) || 0;
    const taskFees = tasks
      .filter((t) => t.projectId === proj.id)
      .reduce((sum, t) => sum + (Number(t.fee) || 0), 0);
    return projBaseFee + taskFees;
  };

  const totalRevenue = jokiProjects.reduce((sum, p) => sum + getProjectTotalFee(p), 0);
  const completedJokiCount = jokiProjects.filter((p) => {
    const pTasks = tasks.filter((t) => t.projectId === p.id);
    return pTasks.length > 0 && pTasks.every((t) => t.status === 'done');
  }).length;

  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const projectTasks = tasks.filter((t) => t.projectId === selectedProjectId);

  const completedCount = projectTasks.filter((t) => t.status === 'done').length;
  const progressPct = projectTasks.length > 0 ? Math.round((completedCount / projectTasks.length) * 100) : 0;

  const formatRupiah = (num) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num || 0);
  };

  const handleCreateProjectClick = () => {
    if (currentPlan === 'Starter' && activeProjects.length >= 2) {
      setShowLimitWarning(true);
      return;
    }
    setCreateModalType('project');
  };

  const handleSaveFee = (proj) => {
    updateProject(proj.id, {
      fee: Number(tempFee) || 0,
      isJoki: true
    });
    setEditingFeeProjId(null);
  };

  return (
    <div className="space-y-6">
      {/* Starter Limit Warning Alert */}
      {showLimitWarning && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div>
            <h4 className="text-xs font-bold text-amber-500">Batas Maksimal Paket Starter Tercapai (2 Proyek)</h4>
            <p className="text-[11px] text-slate-600 dark:text-zinc-400 mt-0.5">
              Paket Starter dibatasi maksimal 2 proyek aktif. Upgrade ke paket Pro untuk membuat proyek tanpa batas dan akses cloud database.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentView('landing')}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs shadow-sm cursor-pointer"
            >
              Upgrade ke Pro
            </button>
            <button
              onClick={() => setShowLimitWarning(false)}
              className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
        isLight ? 'border-slate-200' : 'border-[#24242A]'
      }`}>
        <div>
          <h2 className={`text-xl font-extrabold tracking-tight flex items-center gap-2 ${
            isLight ? 'text-slate-900' : 'text-white'
          }`}>
            <span>PROJECTS</span>
            <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${
              isLight
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              {currentPlan === 'Starter' ? `${activeProjects.length}/2 Proyek (Starter)` : 'Active Portfolios'}
            </span>
          </h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Kelola progress milestone, tasks pengerjaan, dan keuangan fee project joki Anda.
          </p>
        </div>

        <button
          onClick={handleCreateProjectClick}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>New Project</span>
        </button>
      </div>

      {/* Joki Revenue & Analytics Dashboard Card */}
      <div className={`p-4 rounded-xl border grid grid-cols-1 md:grid-cols-3 gap-4 shadow-sm ${
        isLight
          ? 'bg-gradient-to-r from-amber-50/60 to-orange-50/40 border-amber-200'
          : 'bg-gradient-to-r from-amber-500/10 via-[#18181D] to-[#141417] border-amber-500/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold">
            <DollarSign size={22} />
          </div>
          <div>
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${
              isLight ? 'text-slate-500' : 'text-zinc-400'
            }`}>
              Total Pendapatan Joki
            </span>
            <h3 className={`text-xl font-extrabold font-mono mt-0.5 ${
              isLight ? 'text-slate-900' : 'text-amber-400'
            }`}>
              {formatRupiah(totalRevenue)}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${
            isLight ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/20 text-blue-400'
          }`}>
            <Briefcase size={20} />
          </div>
          <div>
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${
              isLight ? 'text-slate-500' : 'text-zinc-400'
            }`}>
              Jumlah Project Joki
            </span>
            <p className={`text-lg font-bold mt-0.5 ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
              {jokiProjects.length} <span className="text-xs font-normal text-slate-500">Klien</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold ${
            isLight ? 'bg-emerald-100 text-emerald-600' : 'bg-emerald-500/20 text-emerald-400'
          }`}>
            <TrendingUp size={20} />
          </div>
          <div>
            <span className={`text-[11px] font-semibold uppercase tracking-wider block ${
              isLight ? 'text-slate-500' : 'text-zinc-400'
            }`}>
              Status Pengerjaan
            </span>
            <p className={`text-lg font-bold mt-0.5 ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
              {completedJokiCount}/{jokiProjects.length} Selesai
            </p>
          </div>
        </div>
      </div>

      {/* Project Filter Tabs */}
      <div className="flex items-center gap-2 border-b pb-2 text-xs">
        <button
          onClick={() => setProjectFilterTab('all')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            projectFilterTab === 'all'
              ? 'bg-amber-500 text-white'
              : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-zinc-400 hover:bg-[#1E1E24]'
          }`}
        >
          Semua Proyek ({activeProjects.length})
        </button>
        <button
          onClick={() => setProjectFilterTab('joki')}
          className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
            projectFilterTab === 'joki'
              ? 'bg-amber-500 text-white'
              : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-zinc-400 hover:bg-[#1E1E24]'
          }`}
        >
          <span>🎯 Project Joki</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            projectFilterTab === 'joki' ? 'bg-black/20 text-white' : 'bg-amber-500/20 text-amber-500'
          }`}>
            {jokiProjects.length}
          </span>
        </button>
        <button
          onClick={() => setProjectFilterTab('internal')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
            projectFilterTab === 'internal'
              ? 'bg-amber-500 text-white'
              : isLight ? 'text-slate-600 hover:bg-slate-100' : 'text-zinc-400 hover:bg-[#1E1E24]'
          }`}
        >
          Proyek Internal / Umum ({internalProjects.length})
        </button>
      </div>

      {/* Projects Grid Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {displayedProjects.map((proj) => {
          const pTasks = tasks.filter((t) => t.projectId === proj.id);
          const pDone = pTasks.filter((t) => t.status === 'done').length;
          const pPct = pTasks.length > 0 ? Math.round((pDone / pTasks.length) * 100) : 0;
          const isSelected = selectedProjectId === proj.id;
          const isJoki = isProjectJoki(proj);
          const isEditingFee = editingFeeProjId === proj.id;

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
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-white shadow-inner"
                    style={{ backgroundColor: proj.color || '#F59E0B' }}
                  >
                    <FolderGit2 size={18} />
                  </div>
                  {isJoki && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                      JOKI
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    showConfirm({
                      type: 'danger',
                      title: 'Hapus Proyek',
                      message: `Apakah Anda yakin ingin menghapus proyek "${proj.name}"? Seluruh tugas yang terafiliasi dengan proyek ini akan terpengaruh.`,
                      confirmText: 'Ya, Hapus Proyek',
                      cancelText: 'Batal',
                      onConfirm: () => deleteProject(proj.id)
                    });
                  }}
                  className={`p-1 transition-colors cursor-pointer rounded hover:bg-rose-500/10 ${isLight ? 'text-slate-400 hover:text-rose-600' : 'text-zinc-500 hover:text-rose-400'}`}
                  title="Hapus proyek"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <h3 className={`text-sm font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{proj.name}</h3>
              <p className={`text-xs line-clamp-2 mb-3 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                {proj.description || 'No description'}
              </p>

              {/* Fee Section on Card: HANYA untuk Project Joki */}
              {isJoki && (
                <div className={`p-2 rounded-lg mb-3 flex items-center justify-between text-xs ${
                  isLight ? 'bg-amber-50/60 border border-amber-200' : 'bg-amber-500/10 border border-amber-500/20'
                }`} onClick={(e) => e.stopPropagation()}>
                  <span className={`text-[11px] font-semibold ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                    Fee / Tarif Joki:
                  </span>
                  {isEditingFee ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        autoFocus
                        value={tempFee}
                        onChange={(e) => setTempFee(e.target.value)}
                        placeholder="0"
                        className="w-24 px-1.5 py-0.5 rounded border text-xs font-mono bg-white dark:bg-[#111115] text-slate-900 dark:text-white"
                      />
                      <button
                        onClick={() => handleSaveFee(proj)}
                        className="p-1 rounded bg-amber-500 text-white hover:bg-amber-400"
                      >
                        <Check size={12} />
                      </button>
                      <button
                        onClick={() => setEditingFeeProjId(null)}
                        className="p-1 rounded text-slate-400 hover:text-slate-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className={`font-bold font-mono ${
                        Number(proj.fee) > 0 ? 'text-emerald-500 font-extrabold' : isLight ? 'text-slate-400' : 'text-zinc-500'
                      }`}>
                        {proj.fee ? formatRupiah(proj.fee) : 'Rp 0'}
                      </span>
                      <button
                        onClick={() => {
                          setEditingFeeProjId(proj.id);
                          setTempFee(proj.fee || '');
                        }}
                        className="p-0.5 rounded text-slate-400 hover:text-amber-500 transition-colors"
                        title="Ubah Fee"
                      >
                        <Edit2 size={11} />
                      </button>
                    </div>
                  )}
                </div>
              )}

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
                {(selectedProject.isJoki || selectedProject.name.toLowerCase().includes('joki')) && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-500 border border-amber-500/30">
                    TARGET FEE: {formatRupiah(selectedProject.fee)}
                  </span>
                )}
              </div>
              <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                {selectedProject.description || 'No description'}
              </p>
            </div>
            <div className="flex items-center gap-3 mt-3 sm:mt-0">
              <span className={`text-xs px-3 py-1 rounded-md font-medium border ${
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
                    {Number(t.fee) > 0 && (
                      <span className="font-mono font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded text-[11px] border border-emerald-500/20">
                        {formatRupiah(t.fee)}
                      </span>
                    )}
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
