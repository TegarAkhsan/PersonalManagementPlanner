import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function CreateModal() {
  const {
    createModalType,
    setCreateModalType,
    theme
  } = useStorage();

  const isLight = theme === 'light';

  if (!createModalType) return null;

  const closeModal = () => setCreateModalType(null);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className={`w-full max-w-lg rounded-xl shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150 border ${
        isLight
          ? 'bg-white border-slate-200 text-slate-800'
          : 'bg-[#141417] border-[#2B2B34] text-zinc-100'
      }`}>
        <div className={`flex items-center justify-between pb-3 mb-4 border-b ${
          isLight ? 'border-slate-100' : 'border-[#24242A]'
        }`}>
          <h3 className={`text-sm font-bold capitalize ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Create New {createModalType}
          </h3>
          <button
            onClick={closeModal}
            className={`p-1 rounded transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100' : 'text-zinc-400 hover:text-white hover:bg-[#202026]'
            }`}
          >
            <X size={16} />
          </button>
        </div>

        {createModalType === 'task' && <CreateTaskForm onClose={closeModal} isLight={isLight} />}
        {createModalType === 'project' && <CreateProjectForm onClose={closeModal} isLight={isLight} />}
        {createModalType === 'habit' && <CreateHabitForm onClose={closeModal} isLight={isLight} />}
        {createModalType === 'event' && <CreateEventForm onClose={closeModal} isLight={isLight} />}
        {createModalType === 'goal' && <CreateGoalForm onClose={closeModal} isLight={isLight} />}
        {createModalType === 'note' && <CreateNoteForm onClose={closeModal} isLight={isLight} />}
      </div>
    </div>
  );
}

function CreateTaskForm({ onClose, isLight }) {
  const { addTask, projects } = useStorage();
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('2026-10-04');
  const [status, setStatus] = useState('in_progress');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask({
      title,
      projectId: projectId || null,
      priority,
      dueDate: dueDate || null,
      status
    });
    onClose();
  };

  const inputClass = `w-full rounded-lg p-2.5 border focus:outline-none focus:border-amber-500 ${
    isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-[#1A1A20] border-[#2B2B34] text-white'
  }`;

  return (
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
            <option value="in_progress">In Progress</option>
            <option value="review">Review</option>
            <option value="done">Done</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={inputClass}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
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
          Create Task
        </button>
      </div>
    </form>
  );
}

function CreateProjectForm({ onClose, isLight }) {
  const { addProject } = useStorage();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#F59E0B');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addProject({ name, description, color });
    onClose();
  };

  const inputClass = `w-full rounded-lg p-2.5 border focus:outline-none focus:border-amber-500 ${
    isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-[#1A1A20] border-[#2B2B34] text-white'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div>
        <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Project Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Launch Notion Template"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Description</label>
        <textarea
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Summary of goals and deliverables"
          className={inputClass}
        />
      </div>

      <div>
        <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Accent Color</label>
        <div className="flex gap-2">
          {['#F59E0B', '#3B82F6', '#10B981', '#EC4899', '#8B5CF6', '#EF4444'].map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setColor(c)}
              className={`w-7 h-7 rounded-full border-2 ${
                color === c ? 'border-amber-500 scale-110' : 'border-transparent'
              }`}
              style={{ backgroundColor: c }}
            />
          ))}
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
          Create Project
        </button>
      </div>
    </form>
  );
}

function CreateHabitForm({ onClose, isLight }) {
  const { addHabit } = useStorage();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🔥');
  const [color, setColor] = useState('#3B82F6');
  const [type, setType] = useState('single');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    addHabit({
      name,
      emoji,
      color,
      type,
      targetFrequency: 'daily',
      subItems: type === 'checklist' ? ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya'] : null
    });
    onClose();
  };

  const inputClass = `w-full rounded-lg p-2.5 border focus:outline-none focus:border-amber-500 ${
    isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-[#1A1A20] border-[#2B2B34] text-white'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div>
        <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Habit Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Gym / Workout 45m"
          required
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Emoji Icon</label>
          <input
            type="text"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            className={`${inputClass} text-center text-base`}
          />
        </div>

        <div>
          <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Habit Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={inputClass}
          >
            <option value="single">Single (Heatmap)</option>
            <option value="checklist">Checklist (5 Waktu Salat / Sub-items)</option>
          </select>
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
          Create Habit
        </button>
      </div>
    </form>
  );
}

function CreateEventForm({ onClose, isLight }) {
  const { addEvent } = useStorage();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-10-04');
  const [startTime, setStartTime] = useState('19:00');
  const [endTime, setEndTime] = useState('20:00');
  const [location, setLocation] = useState('Google Meet');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addEvent({ title, date, startTime, endTime, location, category: 'Event' });
    onClose();
  };

  const inputClass = `w-full rounded-lg p-2.5 border focus:outline-none focus:border-amber-500 ${
    isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-[#1A1A20] border-[#2B2B34] text-white'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div>
        <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Event Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Sync Call Komunitas"
          required
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Location / Link</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className={inputClass}
        />
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
          Save Event
        </button>
      </div>
    </form>
  );
}

function CreateGoalForm({ onClose, isLight }) {
  const { addGoal } = useStorage();
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('2026-12-31');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addGoal({ title, targetDate, progress: 0 });
    onClose();
  };

  const inputClass = `w-full rounded-lg p-2.5 border focus:outline-none focus:border-amber-500 ${
    isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-[#1A1A20] border-[#2B2B34] text-white'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div>
        <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Goal / OKR Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. 1,000 Template Gumroad Sales"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Target Date</label>
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className={inputClass}
        />
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
          Save Goal
        </button>
      </div>
    </form>
  );
}

function CreateNoteForm({ onClose, isLight }) {
  const { addNote, projects } = useStorage();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [projectId, setProjectId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addNote({ title, content, projectId: projectId || null });
    onClose();
  };

  const inputClass = `w-full rounded-lg p-2.5 border focus:outline-none focus:border-amber-500 ${
    isLight ? 'bg-slate-50 border-slate-300 text-slate-800' : 'bg-[#1A1A20] border-[#2B2B34] text-white'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div>
        <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Note Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Hook Video Formula"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Link to Project (Optional)</label>
        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          className={inputClass}
        >
          <option value="">General Notes</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={`block font-medium mb-1 ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>Content</label>
        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write markdown or raw thoughts..."
          className={inputClass}
        />
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
          Save Note
        </button>
      </div>
    </form>
  );
}
