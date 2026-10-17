import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  RefreshCw,
  Check
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function NotesView() {
  const { notes, projects, addNote, deleteNote, setCreateModalType, theme, currentPlan } = useStorage();
  const isLight = theme === 'light';
  const [selectedNoteId, setSelectedNoteId] = useState(notes[0]?.id || null);

  // Document Export State & Notification
  const [syncToast, setSyncToast] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  // Real DOCX exporter (generates valid formatted Word document)
  const exportToDocx = (targetNote = null) => {
    const notesToExport = targetNote ? [targetNote] : notes;
    if (notesToExport.length === 0) {
      setSyncToast('Tidak ada catatan yang tersedia untuk diekspor.');
      setTimeout(() => setSyncToast(null), 3000);
      return;
    }

    let docHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset='utf-8'>
        <title>Orvian Workspace Document</title>
        <style>
          body { font-family: 'Calibri', 'Segoe UI', Arial, sans-serif; padding: 40px; color: #222; }
          h1 { color: #d97706; font-size: 24pt; border-bottom: 2px solid #f59e0b; padding-bottom: 8px; }
          h2 { color: #1e293b; font-size: 16pt; margin-top: 24px; margin-bottom: 4px; }
          .meta { color: #64748b; font-size: 10pt; margin-bottom: 14px; font-style: italic; }
          .content { font-size: 11pt; line-height: 1.6; white-space: pre-wrap; margin-bottom: 20px; }
          .footer { margin-top: 40px; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 9pt; color: #94a3b8; }
        </style>
      </head>
      <body>
        <h1>Orvian Workspace — Ringkasan Dokumen</h1>
        <p class="meta">Diekspor pada: ${new Date().toLocaleString('id-ID')}</p>
    `;

    notesToExport.forEach((n, idx) => {
      const proj = projects.find(p => p.id === n.projectId);
      docHtml += `
        <h2>${idx + 1}. ${n.title || 'Untitled Note'}</h2>
        <p class="meta">Proyek: ${proj ? proj.name : 'Umum / Braindump'} | Terakhir Diperbarui: ${n.updatedAt || '-'}</p>
        <div class="content">${(n.content || '').replace(/\n/g, '<br/>')}</div>
        <hr style="border: 0; border-top: 1px dashed #e2e8f0; margin: 20px 0;"/>
      `;
    });

    docHtml += `
        <div class="footer">Dibuat secara otomatis melalui Orvian Workspace OS.</div>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', docHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const filename = targetNote 
      ? `Orvian-${targetNote.title.replace(/[^a-zA-Z0-9]/g, '_')}.docx`
      : `Orvian-Catatan-Lengkap-${new Date().toISOString().split('T')[0]}.docx`;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setSyncToast(`Dokumen Word (.docx) berhasil dibuat dan diunduh!`);
    setTimeout(() => setSyncToast(null), 4000);
  };

  // Real Print / PDF exporter
  const exportToPdf = (targetNote = null) => {
    const notesToExport = targetNote ? [targetNote] : notes;
    if (notesToExport.length === 0) {
      setSyncToast('Tidak ada catatan yang tersedia untuk dicetak/diekspor ke PDF.');
      setTimeout(() => setSyncToast(null), 3000);
      return;
    }

    const printWin = window.open('', '_blank', 'width=800,height=900');
    if (!printWin) {
      alert('Mohon izinkan pop-up browser untuk mencetak / menyimpan PDF');
      return;
    }

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Orvian Document - PDF Export</title>
        <style>
          body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; }
          .header { border-bottom: 2px solid #f59e0b; padding-bottom: 12px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end; }
          .logo { font-size: 22px; font-weight: 800; color: #d97706; }
          .sub { font-size: 12px; color: #64748b; }
          .card { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0; page-break-inside: avoid; }
          .title { font-size: 16px; font-weight: bold; margin-bottom: 4px; color: #0f172a; }
          .meta { font-size: 11px; color: #64748b; margin-bottom: 12px; }
          .body { font-size: 13px; color: #334155; white-space: pre-wrap; }
          @media print {
            body { padding: 15mm; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">ORVIAN</div>
            <div class="sub">One space. Every ambition.</div>
          </div>
          <div class="sub">Tanggal: ${new Date().toLocaleDateString('id-ID')}</div>
        </div>
    `;

    notesToExport.forEach((n, idx) => {
      const proj = projects.find(p => p.id === n.projectId);
      html += `
        <div class="card">
          <div class="title">${idx + 1}. ${n.title}</div>
          <div class="meta">Proyek: ${proj ? proj.name : 'Umum'} | Diperbarui: ${n.updatedAt || '-'}</div>
          <div class="body">${n.content || ''}</div>
        </div>
      `;
    });

    html += `
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWin.document.open();
    printWin.document.write(html);
    printWin.document.close();

    setSyncToast('Jendela print/simpan PDF dibuka.');
    setTimeout(() => setSyncToast(null), 3000);
  };

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
            <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${
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

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Document Export (.docx / PDF) Button */}
          <button
            onClick={() => setShowExportModal(true)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer shadow-xs ${
              isLight
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                : 'bg-[#18181D] hover:bg-[#202026] text-zinc-300 border-[#2A2A32]'
            }`}
            title="Ekspor dokumen catatan ke Word (.docx) atau PDF"
          >
            <FileText size={14} className="text-amber-500" />
            <span>Ekspor Dokumen</span>
          </button>

          <button
            onClick={() => setCreateModalType('note')}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={16} />
            <span>Catatan Baru</span>
          </button>
        </div>
      </div>

      {/* Sync Toast Feedback */}
      {syncToast && (
        <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-900 dark:text-purple-300 text-xs flex items-center justify-between animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Check size={16} className="text-purple-600 dark:text-purple-400" />
            <span className="font-medium">{syncToast}</span>
          </div>
          <button onClick={() => setSyncToast(null)} className="text-xs font-bold opacity-70 hover:opacity-100 cursor-pointer">✕</button>
        </div>
      )}

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

      {/* Document Export (DOCX & PDF) Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl space-y-4 animate-in fade-in zoom-in-95 ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#151518] border-[#2A2A33] text-zinc-100'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#222228]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  <FileText size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Ekspor Dokumen & Catatan</h3>
                  <p className="text-[10px] text-slate-400">Pilih format dokumen resmi yang diinginkan</p>
                </div>
              </div>
              <button onClick={() => setShowExportModal(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Ekstraksi catatan kerja Anda secara rapi dan profesional. Siap dibuka di Microsoft Word atau disimpan sebagai berkas PDF.
            </p>

            <div className="space-y-3 pt-1">
              {/* Export Active Note */}
              {selectedNote && (
                <div className="space-y-2 pb-2 border-b border-slate-100 dark:border-white/5">
                  <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">Catatan yang Dipilih: "{selectedNote.title}"</span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        exportToDocx(selectedNote);
                        setShowExportModal(false);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                    >
                      <span>Simpan .DOCX</span>
                    </button>
                    <button
                      onClick={() => {
                        exportToPdf(selectedNote);
                        setShowExportModal(false);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                    >
                      <span>Cetak / PDF</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Export All Notes */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Semua Catatan Workspace ({notes.length} item)</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      exportToDocx(null);
                      setShowExportModal(false);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs border transition-all cursor-pointer ${
                      isLight ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300' : 'bg-[#1E1E24] hover:bg-[#25252E] text-zinc-200 border-[#2D2D38]'
                    }`}
                  >
                    <span>Semua ke .DOCX</span>
                  </button>
                  <button
                    onClick={() => {
                      exportToPdf(null);
                      setShowExportModal(false);
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-bold text-xs border transition-all cursor-pointer ${
                      isLight ? 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300' : 'bg-[#1E1E24] hover:bg-[#25252E] text-zinc-200 border-[#2D2D38]'
                    }`}
                  >
                    <span>Semua ke PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
