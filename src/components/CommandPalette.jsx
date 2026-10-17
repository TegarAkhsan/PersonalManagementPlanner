import React, { useState } from 'react';
import {
  Search,
  FolderGit2,
  CheckSquare,
  Repeat,
  Calendar,
  FileText,
  Target,
  ArrowRight
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function CommandPalette() {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    tasks,
    projects,
    habits,
    notes,
    setCurrentView,
    setCreateModalType,
    theme
  } = useStorage();

  const isLight = theme === 'light';
  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const closePalette = () => {
    setIsCommandPaletteOpen(false);
    setQuery('');
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredHabits = habits.filter((h) =>
    h.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const filteredNotes = notes.filter((n) =>
    n.title.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  const actions = [
    { label: 'Create New Task', type: 'task' },
    { label: 'Create New Habit', type: 'habit' },
    { label: 'Create New Project', type: 'project' },
    { label: 'Create New Event', type: 'event' }
  ];

  return (
    <div
      onClick={closePalette}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-xl rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 border ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-[#141417] border-[#2B2B34] text-zinc-100'
        }`}
      >
        {/* Search Input Bar */}
        <div className={`flex items-center px-4 py-3.5 border-b gap-3 ${
          isLight ? 'border-slate-100' : 'border-[#24242A]'
        }`}>
          <Search size={18} className="text-amber-500" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search workspace..."
            className={`w-full bg-transparent text-sm focus:outline-none ${
              isLight ? 'text-slate-900 placeholder:text-slate-400' : 'text-white placeholder:text-zinc-500'
            }`}
          />
          <kbd className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
            isLight
              ? 'bg-slate-100 text-slate-500 border-slate-200'
              : 'bg-[#202026] text-zinc-400 border-[#2B2B34]'
          }`}>
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-3 text-xs">
          {/* Quick Actions */}
          {!query && (
            <div>
              <p className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                isLight ? 'text-slate-400' : 'text-zinc-500'
              }`}>
                Quick Actions
              </p>
              <div className="space-y-0.5">
                {actions.map((act) => (
                  <button
                    key={act.type}
                    onClick={() => {
                      setCreateModalType(act.type);
                      closePalette();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      isLight
                        ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                        : 'text-zinc-300 hover:text-white hover:bg-[#1E1E24]'
                    }`}
                  >
                    <span>+ {act.label}</span>
                    <ArrowRight size={13} className={isLight ? 'text-slate-400' : 'text-zinc-500'} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Tasks */}
          {filteredTasks.length > 0 && (
            <div>
              <p className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                isLight ? 'text-slate-400' : 'text-zinc-500'
              }`}>
                Tasks ({filteredTasks.length})
              </p>
              <div className="space-y-0.5">
                {filteredTasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setCurrentView('home');
                      closePalette();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      isLight
                        ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                        : 'text-zinc-300 hover:text-white hover:bg-[#1E1E24]'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <CheckSquare size={13} className="text-amber-500 flex-shrink-0" />
                      <span className="truncate">{t.title}</span>
                    </span>
                    <span className={`text-[10px] capitalize font-mono ${
                      isLight ? 'text-slate-400' : 'text-zinc-500'
                    }`}>
                      {t.status.replace('_', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Projects */}
          {filteredProjects.length > 0 && (
            <div>
              <p className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                isLight ? 'text-slate-400' : 'text-zinc-500'
              }`}>
                Projects ({filteredProjects.length})
              </p>
              <div className="space-y-0.5">
                {filteredProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setCurrentView('projects');
                      closePalette();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      isLight
                        ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                        : 'text-zinc-300 hover:text-white hover:bg-[#1E1E24]'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <FolderGit2 size={13} className="text-blue-500 flex-shrink-0" />
                      <span className="truncate">{p.name}</span>
                    </span>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>Project</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Habits */}
          {filteredHabits.length > 0 && (
            <div>
              <p className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                isLight ? 'text-slate-400' : 'text-zinc-500'
              }`}>
                Habits ({filteredHabits.length})
              </p>
              <div className="space-y-0.5">
                {filteredHabits.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => {
                      setCurrentView('habits');
                      closePalette();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      isLight
                        ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                        : 'text-zinc-300 hover:text-white hover:bg-[#1E1E24]'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <span>{h.emoji}</span>
                      <span className="truncate">{h.name}</span>
                    </span>
                    <span className="text-[10px] text-amber-600 font-mono font-medium">
                      {h.streak || 0}d streak
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Notes */}
          {filteredNotes.length > 0 && (
            <div>
              <p className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                isLight ? 'text-slate-400' : 'text-zinc-500'
              }`}>
                Notes ({filteredNotes.length})
              </p>
              <div className="space-y-0.5">
                {filteredNotes.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      setCurrentView('notes');
                      closePalette();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                      isLight
                        ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                        : 'text-zinc-300 hover:text-white hover:bg-[#1E1E24]'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <FileText size={13} className="text-emerald-500 flex-shrink-0" />
                      <span className="truncate">{n.title}</span>
                    </span>
                    <span className={`text-[10px] font-mono ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>Note</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
