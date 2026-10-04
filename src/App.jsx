import React from 'react';
import { useStorage } from './context/StorageContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import CreateModal from './components/CreateModal';
import CommandPalette from './components/CommandPalette';

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
import TasksSection from './components/TasksSection';

export default function App() {
  const { currentView, theme } = useStorage();

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'today':
        return <TodayView />;
      case 'projects':
        return <ProjectsView />;
      case 'tasks':
        return (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#24242A]">
              <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>ALL TASKS</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
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

  return (
    <div className={`flex min-h-screen font-sans antialiased overflow-x-hidden transition-colors duration-200 ${
      theme === 'light'
        ? 'theme-light bg-[#F8FAFC] text-slate-800'
        : 'theme-dark bg-[#0B0B0D] text-zinc-100'
    }`}>
      {/* Collapsible Sidebar */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar with live clock, Ctrl+K search, layout toggles */}
        <TopBar />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals & Palettes */}
      <CreateModal />
      <CommandPalette />
    </div>
  );
}
