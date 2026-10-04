import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function NotesView() {
  const { notes, projects, addNote, deleteNote, setCreateModalType, theme } = useStorage();
  const isLight = theme === 'light';
  const [selectedNoteId, setSelectedNoteId] = useState(notes[0]?.id || null);

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

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
            <span>NOTES & BRAINDUMP</span>
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
              isLight
                ? 'bg-amber-100 text-amber-800 border-amber-300'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}>
              Second Brain
            </span>
          </h2>
          <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Capture quick thoughts, content blueprints, formulas, and meeting logs.
          </p>
        </div>

        <button
          onClick={() => setCreateModalType('note')}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Plus size={16} />
          <span>+ New Note</span>
        </button>
      </div>

      {/* 2-Column Split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Notes sidebar */}
        <div className="space-y-2.5">
          {notes.map((note) => {
            const project = projects.find((p) => p.id === note.projectId);
            const isSelected = selectedNoteId === note.id;

            return (
              <div
                key={note.id}
                onClick={() => setSelectedNoteId(note.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? isLight
                      ? 'bg-amber-50/70 border-amber-500 shadow-sm ring-1 ring-amber-400'
                      : 'bg-[#1A1A20] border-amber-500/80 shadow-md'
                    : isLight
                      ? 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
                      : 'bg-[#141417] border-[#24242A] hover:border-[#34343E]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-xs font-bold truncate flex-1 ${
                    isLight ? 'text-slate-900' : 'text-zinc-200'
                  }`}>
                    {note.title}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className={`p-1 transition-colors ${
                      isLight ? 'text-slate-400 hover:text-rose-600' : 'text-zinc-500 hover:text-rose-400'
                    }`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <p className={`text-xs line-clamp-2 mb-2 font-mono text-[11px] ${
                  isLight ? 'text-slate-600' : 'text-zinc-400'
                }`}>
                  {note.content}
                </p>
                <div className={`flex items-center justify-between text-[10px] pt-1 border-t ${
                  isLight ? 'border-slate-100 text-slate-400' : 'border-[#202026] text-zinc-500'
                }`}>
                  <span>{project ? project.name : 'Quick Note'}</span>
                  <span>{note.updatedAt}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note Content Reader */}
        <div className={`md:col-span-2 rounded-xl p-6 min-h-[450px] border shadow-sm ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-[#141417] border-[#24242A] text-zinc-300'
        }`}>
          {selectedNote ? (
            <div className="space-y-4">
              <div className={`border-b pb-3 ${isLight ? 'border-slate-200' : 'border-[#24242A]'}`}>
                <h3 className={`text-lg font-bold mb-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {selectedNote.title}
                </h3>
                <div className={`flex items-center gap-3 text-xs font-mono ${
                  isLight ? 'text-slate-500' : 'text-zinc-500'
                }`}>
                  <span>Updated: {selectedNote.updatedAt}</span>
                </div>
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                {selectedNote.content}
              </div>
            </div>
          ) : (
            <div className={`h-full flex items-center justify-center text-xs ${
              isLight ? 'text-slate-400' : 'text-zinc-500'
            }`}>
              Select or create a note to view contents
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
