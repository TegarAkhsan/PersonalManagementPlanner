import React from 'react';
import StatCards from '../components/StatCards';
import TasksSection from '../components/TasksSection';
import RightPanel from '../components/RightPanel';

export default function HomeView() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Main Left Content Area: 4 Stat Cards + Tasks Kanban / List */}
      <div className="flex-1 w-full space-y-6 min-w-0">
        {/* Top 4 KPI Stat Cards */}
        <StatCards />

        {/* Tasks Section with Filter Tabs & Kanban/List */}
        <TasksSection />
      </div>

      {/* Right Area: Mini Calendar with dots + Upcoming list */}
      <RightPanel />
    </div>
  );
}
