import React from 'react';
import { useStorage } from './context/StorageContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import CreateModal from './components/CreateModal';
import CommandPalette from './components/CommandPalette';
import ConfirmationModal from './components/ConfirmationModal';
import TasksSection from './components/TasksSection';
import SubscriptionReminderBanner from './components/SubscriptionReminderBanner';

// Views
import HomeView from './views/HomeView';
import TodayView from './views/TodayView';
import ProjectsView from './views/ProjectsView';
import HabitsView from './views/HabitsView';
import GoalsView from './views/GoalsView';
import CalendarFullView from './views/CalendarFullView';
import NotesView from './views/NotesView';
import AnalyticsView from './views/AnalyticsView';
import ArchiveHabitsView from './views/ArchiveHabitsView';
import SettingsView from './views/SettingsView';
import LandingPageView from './views/LandingPageView';
import PaymentView from './views/PaymentView';
import AdminPanelView from './views/AdminPanelView';
import AuthView from './views/AuthView';

export default function App() {
  const { currentView, setCurrentView, theme, isSidebarOpen, setIsSidebarOpen, user, isAdmin } = useStorage();
  const isLight = theme === 'light';

  const renderActiveView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPageView />;
      case 'auth':
        return <AuthView />;
      case 'home':
        return <HomeView />;
      case 'today':
        return <TodayView />;
      case 'projects':
        return <ProjectsView />;
      case 'tasks':
        return (
          <div className="space-y-6">
            <div className={`pb-4 border-b ${isLight ? 'border-slate-200' : 'border-[#24242A]'}`}>
              <h2 className={`text-xl font-extrabold tracking-tight flex items-center gap-2 ${
                isLight ? 'text-slate-900' : 'text-white'
              }`}>
                <span>ALL TASKS</span>
                <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${
                  isLight
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  Global Task Manager
                </span>
              </h2>
            </div>
            <TasksSection />
          </div>
        );
      case 'habits':
        return <HabitsView />;
      case 'goals':
        return <GoalsView />;
      case 'calendar':
        if (currentPlan === 'Starter') {
          return (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold text-2xl">
                📅
              </div>
              <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Halaman Kalender Khusus Paket Pro
              </h3>
              <p className="text-xs text-slate-500 max-w-md leading-relaxed">
                Fitur kalender lengkap, agenda rapat, dan integrasi Google Calendar real-time hanya tersedia untuk pengguna paket Pro dan Team.
              </p>
              <button
                onClick={() => setCurrentView('landing')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold text-xs shadow-md hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer"
              >
                Upgrade ke Pro (Rp 50.000)
              </button>
            </div>
          );
        }
        return <CalendarFullView />;
      case 'notes':
        return <NotesView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'archive-habits':
        return <ArchiveHabitsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <HomeView />;
    }
  };

  // If in auth view, render full split-screen Sign In / Sign Up
  if (currentView === 'auth') {
    return <AuthView />;
  }

  // If in admin view, verify admin permission (RBAC)
  if (currentView === 'admin' || window.location.hash === '#admin') {
    const ADMIN_EMAILS = ['tegarrigger@gmail.com', 'tegarakhsan@gmail.com'];
    const hasAdminAccess = Boolean(
      isAdmin ||
      (user && (user.role === 'admin' || ADMIN_EMAILS.includes((user.email || '').toLowerCase().trim())))
    );

    if (!hasAdminAccess) {
      // Jika bukan admin, tendang ke home atau landing
      return (
        <div className={`min-h-screen flex items-center justify-center p-6 ${
          isLight ? 'bg-slate-50 text-slate-800' : 'bg-[#0B0B0D] text-zinc-100'
        }`}>
          <div className={`max-w-md w-full p-8 rounded-2xl border text-center space-y-4 shadow-xl ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#141417] border-[#24242A]'
          }`}>
            <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center font-black text-xl">
              !
            </div>
            <h2 className="text-xl font-bold">Akses Ditolak (403 Forbidden)</h2>
            <p className="text-xs text-slate-400">
              Halaman Admin Control Panel hanya dapat diakses oleh akun Master Administrator resmi. Akun Anda terdaftar sebagai user biasa.
            </p>
            <button
              onClick={() => {
                if (window.location.hash === '#admin') {
                  window.history.replaceState(null, '', window.location.pathname);
                }
                setCurrentView(user ? 'home' : 'landing');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all cursor-pointer shadow-md shadow-amber-500/20"
            >
              Kembali ke Halaman Utama
            </button>
          </div>
        </div>
      );
    }

    return <AdminPanelView />;
  }

  // If in payment view, provide full dedicated checkout page layout
  if (currentView === 'payment') {
    return (
      <div className={`min-h-screen font-sans antialiased overflow-x-hidden transition-colors duration-200 ${
        isLight ? 'theme-light bg-[#F8FAFC] text-slate-800' : 'theme-dark bg-[#0B0B0D] text-zinc-100'
      }`}>
        <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 sm:px-8 py-3.5 flex items-center justify-between ${
          isLight ? 'bg-white/90 border-slate-200' : 'bg-[#101014]/90 border-[#24242A]'
        }`}>
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentView('landing')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 text-white font-black text-lg">
              O
            </div>
            <span className="font-extrabold text-base tracking-tight">Orvian</span>
            <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
              SECURE CHECKOUT
            </span>
          </div>

          <button
            onClick={() => {
              sessionStorage.removeItem('orvian_payment_success');
              sessionStorage.removeItem('orvian_current_order_id');
              sessionStorage.removeItem('orvian_payment_form');
              sessionStorage.removeItem('orvian_wa_confirmed');
              sessionStorage.removeItem('orvian_payment_unlocked');
              setCurrentView('landing');
            }}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
              isLight ? 'hover:bg-slate-100 text-slate-600 border-slate-200' : 'hover:bg-[#202026] text-zinc-400 border-[#2B2B33]'
            }`}
          >
            Batal & Kembali
          </button>
        </header>

        <main className="min-h-[calc(100vh-60px)]">
          <PaymentView />
        </main>
      </div>
    );
  }

  // If in landing page view, provide a seamless top navigation bar
  if (currentView === 'landing') {
    return (
      <div className={`min-h-screen font-sans antialiased overflow-x-hidden transition-colors duration-200 ${
        isLight
          ? 'theme-light bg-[#F8FAFC] text-slate-800'
          : 'theme-dark bg-[#0B0B0D] text-zinc-100'
      }`}>
        {/* Landing Page Navbar Header */}
        <header className={`sticky top-0 z-40 backdrop-blur-md border-b px-4 sm:px-8 py-3.5 flex items-center justify-between ${
          isLight ? 'bg-white/90 border-slate-200' : 'bg-[#101014]/90 border-[#24242A]'
        }`}>
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setCurrentView('landing')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 text-white font-black text-lg">
              O
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight block leading-none">Orvian</span>
              <span className="text-[10px] text-amber-500 font-medium tracking-tight">One space. Every ambition.</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
            <a href="#fitur" className={`transition-colors ${isLight ? 'text-slate-600 hover:text-amber-600' : 'text-zinc-400 hover:text-amber-400'}`}>
              Fitur Sistem
            </a>
            <a href="#pricing" className={`transition-colors ${isLight ? 'text-slate-600 hover:text-amber-600' : 'text-zinc-400 hover:text-amber-400'}`}>
              Paket & Harga
            </a>
            <a href="#faq" className={`transition-colors ${isLight ? 'text-slate-600 hover:text-amber-600' : 'text-zinc-400 hover:text-amber-400'}`}>
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            {!user ? (
              <button
                onClick={() => setCurrentView('auth')}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
              >
                Sign In / Sign Up
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentView('home')}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  Buka Dashboard
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <LandingPageView />
        </main>

        {/* Landing Page Professional Footer */}
        <footer className={`border-t transition-colors ${
          isLight ? 'bg-white border-slate-200 text-slate-600' : 'bg-[#101014] border-[#222228] text-zinc-400'
        }`}>
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
            {/* Col 1: Brand & Bio */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-bold text-sm">
                  O
                </div>
                <div>
                  <span className={`font-extrabold text-sm tracking-tight block ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Orvian
                  </span>
                  <span className="text-[10px] text-amber-500 font-medium">One space. Every ambition.</span>
                </div>
              </div>
              <p className="leading-relaxed text-[11px] text-slate-500 dark:text-zinc-500">
                Workspace terpadu modern untuk manajemen proyek, rutinitas habit, kalender sinkron, target OKR, dan sinkronisasi cloud real-time.
              </p>
            </div>

            {/* Col 2: Navigasi Cepat */}
            <div className="space-y-2.5">
              <h4 className={`font-bold uppercase tracking-wider text-[11px] ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>
                Navigasi
              </h4>
              <ul className="space-y-1.5 text-[11px]">
                <li>
                  {!user ? (
                    <button onClick={() => setCurrentView('auth')} className="text-amber-500 font-bold hover:underline cursor-pointer">
                      Mulai Gratis (Sign Up)
                    </button>
                  ) : (
                    <button onClick={() => setCurrentView('home')} className="text-amber-500 font-bold hover:underline cursor-pointer">
                      Dashboard Utama
                    </button>
                  )}
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView(user ? 'home' : 'auth')}
                    className="hover:text-amber-500 transition-colors cursor-pointer text-left"
                  >
                    Dashboard Ringkasan
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView(user ? 'tasks' : 'auth')}
                    className="hover:text-amber-500 transition-colors cursor-pointer text-left"
                  >
                    Kanban Board & Tugas
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView(user ? 'calendar' : 'auth')}
                    className="hover:text-amber-500 transition-colors cursor-pointer text-left"
                  >
                    Kalender & Google Sync
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setCurrentView(user ? 'notes' : 'auth')}
                    className="hover:text-amber-500 transition-colors cursor-pointer text-left"
                  >
                    Catatan & Ekspor Dokumen
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Keamanan & Status */}
            <div className="space-y-2.5">
              <h4 className={`font-bold uppercase tracking-wider text-[11px] ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>
                Keamanan & Garansi
              </h4>
              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-zinc-500">
                Data terenkripsi end-to-end dengan Row Level Security (RLS) PostgreSQL. Fitur backup & ekspor JSON tersedia kapan pun.
              </p>
            </div>
          </div>

          <div className={`border-t py-4 px-4 sm:px-8 text-center text-[11px] ${
            isLight ? 'border-slate-100 text-slate-500' : 'border-[#1E1E23] text-zinc-500'
          }`}>
            © {new Date().getFullYear()} Orvian — One space. Every ambition. Hak Cipta Dilindungi.
          </div>
        </footer>
        <ConfirmationModal />
      </div>
    );
  }

  return (
    <div className={`flex h-screen overflow-hidden font-sans antialiased transition-colors duration-200 ${
      theme === 'light'
        ? 'theme-light bg-[#F8FAFC] text-slate-800'
        : 'theme-dark bg-[#0B0B0D] text-zinc-100'
    }`}>
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-35 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Navbar with live clock, Ctrl+K search, layout toggles */}
        <TopBar />

        {/* In-App Subscription Lifecycle & Grace Period Banner */}
        <SubscriptionReminderBanner />

        {/* Dynamic Page Content with independent scrollbar */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals & Palettes */}
      <CreateModal />
      <CommandPalette />
      <ConfirmationModal />
    </div>
  );
}
