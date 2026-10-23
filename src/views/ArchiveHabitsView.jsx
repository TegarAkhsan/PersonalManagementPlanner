import React from 'react';
import {
  Archive,
  RotateCcw,
  Trash2
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function ArchiveHabitsView() {
  const { habits, archiveHabit, deleteHabit, theme, showConfirm } = useStorage();
  const isLight = theme === 'light';

  const archivedHabits = habits.filter((h) => h.archived);

  return (
    <div className="space-y-6">
      <div className={`pb-4 border-b ${isLight ? 'border-slate-200' : 'border-[#24242A]'}`}>
        <h2 className={`text-xl font-extrabold tracking-tight flex items-center gap-2 ${
          isLight ? 'text-slate-900' : 'text-white'
        }`}>
          <span>ARCHIVED HABITS</span>
          <span className={`text-xs px-2.5 py-1 rounded-md border ${
            isLight
              ? 'bg-slate-100 text-slate-700 border-slate-300'
              : 'bg-zinc-800 text-zinc-300 border-zinc-700'
          }`}>
            Vault
          </span>
        </h2>
        <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
          Paused or completed habit routines. You can restore them to active tracking anytime.
        </p>
      </div>

      {archivedHabits.length === 0 ? (
        <div className={`rounded-xl p-12 text-center text-xs border ${
          isLight
            ? 'bg-white border-slate-200 text-slate-400'
            : 'bg-[#141417] border-[#24242A] text-zinc-500'
        }`}>
          No habits are currently archived.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {archivedHabits.map((h) => (
            <div
              key={h.id}
              className={`p-4 rounded-xl border flex items-center justify-between ${
                isLight
                  ? 'bg-white border-slate-200 shadow-sm'
                  : 'bg-[#141417] border-[#24242A]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{h.emoji}</span>
                <div>
                  <h4 className={`text-xs font-bold ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>{h.name}</h4>
                  <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    Max streak achieved: {h.maxStreak || 0} days
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => archiveHabit(h.id)}
                  className={`p-1.5 rounded transition-colors ${
                    isLight
                      ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                      : 'bg-[#202026] text-amber-400 hover:bg-amber-500/20'
                  }`}
                  title="Restore habit"
                >
                  <RotateCcw size={14} />
                </button>
                <button
                  onClick={() => {
                    showConfirm({
                      type: 'danger',
                      title: 'Hapus Habit Permanen',
                      message: `Apakah Anda yakin ingin menghapus habit "${h.name || 'ini'}" secara permanen? Data streak tidak akan dapat dipulihkan.`,
                      confirmText: 'Hapus Permanen',
                      cancelText: 'Batal',
                      onConfirm: () => deleteHabit(h.id)
                    });
                  }}
                  className={`p-1.5 rounded transition-colors cursor-pointer ${
                    isLight
                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      : 'bg-[#202026] text-rose-400 hover:bg-rose-500/20'
                  }`}
                  title="Delete permanently"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
