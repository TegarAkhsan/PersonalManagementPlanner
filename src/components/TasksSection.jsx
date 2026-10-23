import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  MoreVertical,
  Plus,
  ChevronDown,
  ChevronUp,
  Tag,
  Trash2,
  Edit2,
  X
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function TasksSection() {
  const {
    tasks,
    projects,
    activeTaskFilter,
    setActiveTaskFilter,
    taskViewMode,
    updateTask,
    deleteTask,
    setCreateModalType,
    theme,
    currentPlan,
    showAlert,
    setCurrentView,
    showConfirm
  } = useStorage();

  const isLight = theme === 'light';
  const [isSectionCollapsed, setIsSectionCollapsed] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const filterTabs = [
    'All Tasks',
    'Today',
    'Yesterday',
    'Overdue',
    'Unrelated Tasks',
    'Inbox',
    'Completed'
  ];

  const todayStr = '2026-10-04';
  const yesterdayStr = '2026-10-03';

  const filteredTasks = tasks.filter((task) => {
    switch (activeTaskFilter) {
      case 'Today':
        return task.dueDate === todayStr;
      case 'Yesterday':
        return task.dueDate === yesterdayStr;
      case 'Overdue':
        return task.dueDate && task.dueDate < todayStr && task.status !== 'done';
      case 'Unrelated Tasks':
        return !task.projectId;
      case 'Inbox':
        return !task.dueDate || task.sourceLabel === 'Inbox';
      case 'Completed':
        return task.status === 'done';
      case 'All Tasks':
      default:
        return true;
    }
  });

  const columns = [
    {
      id: 'ready_to_start',
      title: 'Ready To Start',
      color: isLight ? 'border-sky-200 text-sky-700 bg-sky-50' : 'border-sky-500/30 text-sky-400 bg-sky-500/10',
      icon: Circle,
      status: 'ready_to_start'
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      color: isLight ? 'border-blue-200 text-blue-600 bg-blue-50' : 'border-blue-500/30 text-blue-400 bg-blue-500/10',
      icon: Clock,
      status: 'in_progress'
    },
    {
      id: 'review',
      title: 'Review',
      color: isLight ? 'border-amber-200 text-amber-700 bg-amber-50' : 'border-amber-500/30 text-amber-400 bg-amber-500/10',
      icon: AlertCircle,
      status: 'review'
    },
    {
      id: 'done',
      title: 'Done',
      color: isLight ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10',
      icon: CheckCircle2,
      status: 'done'
    }
  ];

  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, columnStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain') || draggedTaskId;
    if (taskId) {
      updateTask(taskId, { status: columnStatus });
      setDraggedTaskId(null);
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            isLight
              ? 'bg-rose-50 text-rose-600 border-rose-200'
              : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
          }`}>
            High
          </span>
        );
      case 'medium':
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            isLight
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
          }`}>
            Med
          </span>
        );
      case 'low':
      default:
        return (
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
            isLight
              ? 'bg-slate-100 text-slate-600 border-slate-200'
              : 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30'
          }`}>
            Low
          </span>
        );
    }
  };

  return (
    <div className={`rounded-xl p-3 sm:p-5 border transition-all space-y-4 ${
      isLight
        ? 'bg-white border-slate-200 shadow-sm'
        : 'bg-[#141417] border-[#24242A] shadow-sm'
    }`}>
      {/* Header and Filter Controls */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b ${
        isLight ? 'border-slate-100' : 'border-[#24242A]'
      }`}>
        <div className="flex items-center gap-3">
          <h3 className={`text-xs font-bold tracking-wider uppercase ${isLight ? 'text-slate-700' : 'text-zinc-400'}`}>
            TASKS
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-md font-semibold border ${
            isLight
              ? 'bg-slate-100 text-slate-600 border-slate-200'
              : 'bg-[#202026] text-zinc-400 border-[#2E2E36]'
          }`}>
            {filteredTasks.length}
          </span>
          <button
            onClick={() => setIsSectionCollapsed(!isSectionCollapsed)}
            className={`p-1 rounded transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-800 hover:bg-slate-100' : 'text-zinc-400 hover:text-white hover:bg-[#202026]'
            }`}
          >
            {isSectionCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {filterTabs.map((tab) => {
            const isActive = activeTaskFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTaskFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? isLight
                      ? 'text-amber-800 border-b-2 border-amber-500 bg-amber-50 font-bold'
                      : 'text-amber-400 border-b-2 border-amber-500 bg-amber-500/5 font-semibold'
                    : isLight
                      ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#1C1C21]'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {!isSectionCollapsed && (
        <>
          {/* Kanban Board View */}
          {taskViewMode === 'board' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-1">
              {columns.map((col) => {
                const colTasks = filteredTasks.filter((t) => t.status === col.status);
                const Icon = col.icon;

                return (
                  <div
                    key={col.id}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, col.status)}
                    className={`flex flex-col rounded-xl border min-h-[460px] p-3 transition-colors ${
                      isLight
                        ? 'bg-slate-50/70 border-slate-200'
                        : 'bg-[#111114] border-[#202025]'
                    }`}
                  >
                    {/* Column Header */}
                    <div className={`flex items-center justify-between pb-3 mb-3 border-b ${
                      isLight ? 'border-slate-200' : 'border-[#1E1E23]'
                    }`}>
                      <div className="flex items-center gap-2">
                        <span className={`p-1.5 rounded-md border ${col.color}`}>
                          <Icon size={14} />
                        </span>
                        <h4 className={`text-xs font-bold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
                          {col.title}
                        </h4>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                          isLight
                            ? 'bg-white text-slate-600 border-slate-200'
                            : 'bg-[#1A1A20] text-zinc-400 border-[#272730]'
                        }`}>
                          {colTasks.length}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          if (currentPlan === 'Starter' && tasks.length >= 10) {
                            showAlert({
                              type: 'warning',
                              title: 'Batas Tugas Tercapai (10/10)',
                              message: 'Paket Starter dibatasi maksimal 10 tugas aktif. Selesaikan/hapus tugas lama atau upgrade ke paket Pro untuk membuat tugas & Kanban tanpa batas!'
                            });
                            return;
                          }
                          setCreateModalType('task');
                        }}
                        className={`p-1 rounded transition-colors ${
                          isLight ? 'text-slate-400 hover:text-slate-800 hover:bg-white' : 'text-zinc-400 hover:text-white hover:bg-[#1E1E24]'
                        }`}
                        title="Add task in this column"
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    {/* Column Task Cards */}
                    <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[560px] pr-0.5">
                      {colTasks.length === 0 ? (
                        <div className={`h-32 border border-dashed rounded-lg flex items-center justify-center text-xs ${
                          isLight ? 'border-slate-300 text-slate-400' : 'border-[#24242B] text-zinc-600'
                        }`}>
                          Drag tasks here
                        </div>
                      ) : (
                        colTasks.map((task) => {
                          const project = projects.find((p) => p.id === task.projectId);
                          const isDone = task.status === 'done';

                          return (
                            <div
                              key={task.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, task.id)}
                              className={`p-3.5 rounded-lg border shadow-xs hover:shadow transition-all cursor-grab active:cursor-grabbing group relative ${
                                isLight
                                  ? isDone
                                    ? 'opacity-65 bg-slate-100 border-slate-200'
                                    : 'bg-white border-slate-200 hover:border-slate-300'
                                  : isDone
                                    ? 'opacity-70 bg-[#151518] border-[#25252C]'
                                    : 'bg-[#18181D] border-[#25252C] hover:border-[#383844]'
                              }`}
                            >
                              {/* Source / Category Tag */}
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                                  isLight
                                    ? 'text-slate-600 bg-slate-100'
                                    : 'text-zinc-400 bg-[#222228]'
                                }`}>
                                  {task.sourceLabel || (project ? project.name : 'Inbox')}
                                </span>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => setEditingTask(task)}
                                    className={`p-1 rounded ${
                                      isLight
                                        ? 'text-slate-400 hover:text-amber-600 hover:bg-slate-100'
                                        : 'text-zinc-500 hover:text-amber-400 hover:bg-[#25252E]'
                                    }`}
                                    title="Edit task"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      showConfirm({
                                        type: 'danger',
                                        title: 'Hapus Tugas',
                                        message: `Apakah Anda yakin ingin menghapus tugas "${task.title || 'ini'}"? Tindakan ini tidak dapat dibatalkan.`,
                                        confirmText: 'Ya, Hapus',
                                        cancelText: 'Batal',
                                        onConfirm: () => deleteTask(task.id)
                                      });
                                    }}
                                    className={`p-1 rounded cursor-pointer ${
                                      isLight
                                        ? 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
                                        : 'text-zinc-500 hover:text-rose-400 hover:bg-[#25252E]'
                                    }`}
                                    title="Delete task"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </div>

                              {/* Task Title & Status Toggle */}
                              <div className="flex items-start gap-2.5 mb-3">
                                <button
                                  onClick={() =>
                                    updateTask(task.id, {
                                      status: isDone ? 'in_progress' : 'done'
                                    })
                                  }
                                  className={`mt-0.5 transition-colors ${
                                    isLight ? 'text-slate-400 hover:text-emerald-600' : 'text-zinc-500 hover:text-emerald-400'
                                  }`}
                                >
                                  {isDone ? (
                                    <CheckCircle2 size={16} className={isLight ? 'text-emerald-600' : 'text-emerald-400'} />
                                  ) : (
                                    <Circle size={16} />
                                  )}
                                </button>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-xs font-medium leading-snug ${
                                      isDone
                                        ? isLight ? 'line-through text-slate-400' : 'line-through text-zinc-500'
                                        : isLight ? 'text-slate-800 group-hover:text-amber-700' : 'text-zinc-100 group-hover:text-amber-300'
                                    }`}
                                  >
                                    {task.title}
                                  </p>
                                  {task.description && (
                                    <p className={`text-[11px] mt-1 line-clamp-2 leading-relaxed ${
                                      isLight ? 'text-slate-500' : 'text-zinc-400'
                                    }`}>
                                      {task.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Card Footer: Due Date & Priority */}
                              <div className={`flex items-center justify-between pt-2 border-t ${
                                isLight ? 'border-slate-100' : 'border-[#202026]'
                              }`}>
                                <div className={`flex items-center gap-1.5 text-[11px] ${
                                  isLight ? 'text-slate-500' : 'text-zinc-400'
                                }`}>
                                  <Calendar size={12} />
                                  <span>
                                    {task.dueDate && task.dueDate !== '1899-12-30'
                                      ? task.dueDate
                                      : 'No date'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  {Number(task.fee) > 0 && (
                                    <span className="font-mono font-bold text-[10px] text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                      Rp {Number(task.fee).toLocaleString('id-ID')}
                                    </span>
                                  )}
                                  {getPriorityBadge(task.priority)}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table / List View */
            <div className={`overflow-x-auto rounded-lg border ${
              isLight ? 'border-slate-200' : 'border-[#222228]'
            }`}>
              <table className="w-full text-left text-xs">
                <thead className={`border-b ${
                  isLight ? 'bg-slate-50 text-slate-600 border-slate-200' : 'bg-[#18181E] text-zinc-400 border-[#25252E]'
                }`}>
                  <tr>
                    <th className="py-2.5 px-3">Title</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">Project</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  isLight ? 'divide-slate-200' : 'divide-[#202026]'
                }`}>
                  {filteredTasks.map((task) => {
                    const project = projects.find((p) => p.id === task.projectId);
                    const isDone = task.status === 'done';

                    return (
                      <tr
                        key={task.id}
                        className={`transition-colors ${
                          isLight ? 'hover:bg-slate-50' : 'hover:bg-[#1A1A20]'
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateTask(task.id, {
                                  status: isDone ? 'in_progress' : 'done'
                                })
                              }
                            >
                              {isDone ? (
                                <CheckCircle2 size={16} className={isLight ? 'text-emerald-600' : 'text-emerald-400'} />
                              ) : (
                                <Circle size={16} className={isLight ? 'text-slate-400' : 'text-zinc-600'} />
                              )}
                            </button>
                            <span
                              className={`font-medium ${
                                isDone
                                  ? isLight ? 'line-through text-slate-400' : 'line-through text-zinc-500'
                                  : isLight ? 'text-slate-800' : 'text-zinc-200'
                              }`}
                            >
                              {task.title}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 capitalize">
                          <select
                            value={task.status}
                            onChange={(e) => updateTask(task.id, { status: e.target.value })}
                            className={`rounded px-2 py-1 text-xs border ${
                              isLight
                                ? 'bg-white border-slate-300 text-slate-700'
                                : 'bg-[#222228] border-[#2E2E38] text-zinc-300'
                            }`}
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Progress</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                          </select>
                        </td>
                        <td className="py-3 px-3">
                          {getPriorityBadge(task.priority)}
                        </td>
                        <td className={`py-3 px-3 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                          {project ? project.name : 'Personal / Inbox'}
                        </td>
                        <td className={`py-3 px-3 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                          {task.dueDate && task.dueDate !== '1899-12-30'
                            ? task.dueDate
                            : 'No date'}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setEditingTask(task)}
                              className={`p-1 rounded ${
                                isLight ? 'text-slate-400 hover:text-amber-600 hover:bg-slate-100' : 'text-zinc-500 hover:text-amber-400 hover:bg-[#25252E]'
                              }`}
                              title="Edit task"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => {
                                showConfirm({
                                  type: 'danger',
                                  title: 'Hapus Tugas',
                                  message: `Apakah Anda yakin ingin menghapus tugas "${task.title || 'ini'}"? Tindakan ini tidak dapat dibatalkan.`,
                                  confirmText: 'Ya, Hapus',
                                  cancelText: 'Batal',
                                  onConfirm: () => deleteTask(task.id)
                                });
                              }}
                              className={`p-1 rounded cursor-pointer ${
                                isLight ? 'text-slate-400 hover:text-rose-600 hover:bg-slate-100' : 'text-zinc-500 hover:text-rose-400 hover:bg-[#25252E]'
                              }`}
                              title="Delete task"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          projects={projects}
          isLight={isLight}
          onClose={() => setEditingTask(null)}
          onSave={(updates) => {
            updateTask(editingTask.id, updates);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
}

function EditTaskModal({ task, projects, isLight, onClose, onSave }) {
  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [projectId, setProjectId] = useState(task.projectId || '');
  const [priority, setPriority] = useState(task.priority || 'Medium');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [status, setStatus] = useState(task.status || 'in_progress');
  const [fee, setFee] = useState(task.fee || '');

  const selectedProj = projects.find(p => p.id === projectId);
  const isJokiProject = selectedProj && (selectedProj.isJoki || selectedProj.name.toLowerCase().includes('joki'));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      projectId: projectId || null,
      priority,
      dueDate: dueDate || null,
      status,
      fee: isJokiProject ? (Number(fee) || 0) : 0
    });
  };

  const inputClass = `w-full rounded-lg p-2.5 border text-xs focus:outline-none focus:border-amber-500 ${
    isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-[#1A1A20] border-[#2B2B34] text-white'
  }`;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl p-4 sm:p-6 relative animate-in fade-in zoom-in-95 duration-150 border ${
        isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#141417] border-[#2B2B34] text-zinc-100'
      }`}>
        <div className={`flex items-center justify-between pb-3 mb-4 border-b ${
          isLight ? 'border-slate-100' : 'border-[#24242A]'
        }`}>
          <h3 className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Edit Task
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-zinc-400 hover:text-white hover:bg-[#202026]'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Upload video ke TikTok"
              required
              className={inputClass}
            />
          </div>

          <div>
            <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Description / Catatan Task</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsi detail pengerjaan, link referensi, catatan revisi, dll."
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Project</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className={inputClass}
              >
                <option value="">No Project (Unrelated / Inbox)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Status Column</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputClass}
              >
                <option value="ready_to_start">Ready To Start</option>
                <option value="in_progress">In Progress</option>
                <option value="review">Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Kolom Fee Khusus Task Joki */}
          {isJokiProject && (
            <div className={`p-3 rounded-lg border animate-in fade-in ${
              isLight ? 'bg-amber-50/70 border-amber-300' : 'bg-amber-500/10 border-amber-500/30'
            }`}>
              <label className={`block font-bold mb-1 ${isLight ? 'text-amber-800' : 'text-amber-400'}`}>
                🎯 Fee Task Joki Ini (Rp)
              </label>
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                placeholder="e.g. 150000"
                className={inputClass}
              />
              <p className={`text-[10px] mt-1 ${isLight ? 'text-amber-700/80' : 'text-amber-300/70'}`}>
                Fee pada task ini akan otomatis terkalkulasi ke Total Pendapatan Project Joki.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={inputClass}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className={`flex justify-end gap-2 pt-3 border-t ${isLight ? 'border-slate-100' : 'border-[#24242A]'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium border ${
                isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-[#202026] text-zinc-300 border-[#2D2D35]'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-white font-bold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
