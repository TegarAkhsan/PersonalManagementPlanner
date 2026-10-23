import React from 'react';
import { 
  AlertTriangle, 
  Info, 
  CheckCircle2, 
  HelpCircle, 
  LogOut, 
  Trash2, 
  X,
  Bell
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function ConfirmationModal() {
  const { modalConfig, closeModal, theme } = useStorage();
  const isLight = theme === 'light';

  if (!modalConfig?.isOpen) return null;

  const {
    type = 'confirm', // 'confirm' | 'danger' | 'logout' | 'info' | 'success' | 'warning'
    title = 'Konfirmasi',
    message = '',
    confirmText,
    cancelText = 'Batal',
    onConfirm,
    onCancel,
    showCancel = true,
  } = modalConfig;

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    }
    closeModal();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    closeModal();
  };

  // Determine icon & header style based on type
  const renderIconAndStyle = () => {
    switch (type) {
      case 'logout':
        return {
          icon: <LogOut className="w-6 h-6 text-rose-500" />,
          bgBadge: isLight ? 'bg-rose-50 border-rose-200' : 'bg-rose-500/10 border-rose-500/20',
          btnConfirm: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25',
          defaultConfirmText: 'Ya, Keluar Akun'
        };
      case 'danger':
      case 'delete':
        return {
          icon: <Trash2 className="w-6 h-6 text-rose-500" />,
          bgBadge: isLight ? 'bg-rose-50 border-rose-200' : 'bg-rose-500/10 border-rose-500/20',
          btnConfirm: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25',
          defaultConfirmText: 'Hapus'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
          bgBadge: isLight ? 'bg-amber-50 border-amber-200' : 'bg-amber-500/10 border-amber-500/20',
          btnConfirm: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25',
          defaultConfirmText: 'Lanjutkan'
        };
      case 'success':
        return {
          icon: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
          bgBadge: isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-500/10 border-emerald-500/20',
          btnConfirm: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/25',
          defaultConfirmText: 'Oke'
        };
      case 'info':
        return {
          icon: <Info className="w-6 h-6 text-indigo-500" />,
          bgBadge: isLight ? 'bg-indigo-50 border-indigo-200' : 'bg-indigo-500/10 border-indigo-500/20',
          btnConfirm: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/25',
          defaultConfirmText: 'Mengerti'
        };
      default:
        return {
          icon: <HelpCircle className="w-6 h-6 text-amber-500" />,
          bgBadge: isLight ? 'bg-amber-50 border-amber-200' : 'bg-amber-500/10 border-amber-500/20',
          btnConfirm: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/25',
          defaultConfirmText: 'Konfirmasi'
        };
    }
  };

  const currentTheme = renderIconAndStyle();
  const finalConfirmText = confirmText || currentTheme.defaultConfirmText;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleCancel}
      role="dialog"
      aria-modal="true"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-2xl shadow-2xl p-6 relative border animate-in zoom-in-95 duration-200 transition-all ${
          isLight
            ? 'bg-white border-slate-200 text-slate-800'
            : 'bg-[#141418] border-[#2A2A33] text-zinc-100 shadow-black/80'
        }`}
      >
        {/* Close Button top-right */}
        <button
          onClick={handleCancel}
          className={`absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer ${
            isLight
              ? 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              : 'text-zinc-500 hover:text-zinc-200 hover:bg-[#202026]'
          }`}
          aria-label="Tutup"
        >
          <X size={16} />
        </button>

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl border shrink-0 flex items-center justify-center ${currentTheme.bgBadge}`}>
            {currentTheme.icon}
          </div>

          <div className="flex-1 pr-4">
            <h3 className={`text-base font-bold leading-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {title}
            </h3>
            <p className={`mt-2 text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100 dark:border-[#222228]">
          {showCancel && (
            <button
              type="button"
              onClick={handleCancel}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer border ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                  : 'bg-[#1C1C22] hover:bg-[#24242C] text-zinc-300 border-[#2D2D38]'
              }`}
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer active:scale-95 ${currentTheme.btnConfirm}`}
          >
            {finalConfirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
