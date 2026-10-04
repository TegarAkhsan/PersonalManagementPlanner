import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialProjects,
  initialTasks,
  initialEvents,
  initialHabits,
  initialGoals,
  initialNotes
} from '../data/initialData';

const StorageContext = createContext();

export function StorageProvider({ children }) {
  // Load from localStorage or fallback
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('projectflow_projects');
    return saved ? JSON.parse(saved) : initialProjects;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('projectflow_tasks');
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('projectflow_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('projectflow_habits');
    return saved ? JSON.parse(saved) : initialHabits;
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('projectflow_goals');
    return saved ? JSON.parse(saved) : initialGoals;
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('projectflow_notes');
    return saved ? JSON.parse(saved) : initialNotes;
  });

  // Current view and layout state
  const [currentView, setCurrentView] = useState('home'); // home, today, projects, tasks, goals, habits, calendar, notes, analytics, archive-habits, settings
  const [activeTaskFilter, setActiveTaskFilter] = useState('All Tasks');
  const [taskViewMode, setTaskViewMode] = useState('board'); // 'board' or 'list'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState(null); // 'project', 'task', 'habit', 'event', 'note', 'goal'
  const [searchQuery, setSearchQuery] = useState('');

  // Theme state: 'light' (soft bright) or 'dark'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('projectflow_theme');
    return saved ? saved : 'light'; // Default to soft bright
  });

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    localStorage.setItem('projectflow_theme', theme);
  }, [theme]);

  // Persist state updates to localStorage
  useEffect(() => {
    localStorage.setItem('projectflow_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('projectflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('projectflow_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('projectflow_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('projectflow_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('projectflow_notes', JSON.stringify(notes));
  }, [notes]);

  // Global hotkey Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Task actions
  const addTask = (newTask) => {
    const item = {
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      completedAt: newTask.status === 'done' ? new Date().toISOString().split('T')[0] : null,
      sourceLabel: newTask.projectId ? 'Project task' : 'Inbox',
      ...newTask
    };
    setTasks([item, ...tasks]);
  };

  const updateTask = (id, updates) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const statusChangedToDone = updates.status === 'done' && t.status !== 'done';
        const statusChangedFromDone = updates.status && updates.status !== 'done' && t.status === 'done';
        return {
          ...t,
          ...updates,
          completedAt: statusChangedToDone ? new Date().toISOString().split('T')[0] : (statusChangedFromDone ? null : t.completedAt)
        };
      }
      return t;
    }));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  // Habit actions
  const toggleHabitDay = (habitId, dayNumber) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const logs = h.logs || [];
        const isPresent = logs.includes(dayNumber);
        const newLogs = isPresent ? logs.filter(d => d !== dayNumber) : [...logs, dayNumber];
        
        // Recalculate streak
        const todayDate = new Date().getDate();
        let currentStreak = 0;
        let testDay = newLogs.includes(todayDate) ? todayDate : todayDate - 1;
        while (newLogs.includes(testDay) && testDay > 0) {
          currentStreak++;
          testDay--;
        }

        return {
          ...h,
          logs: newLogs,
          streak: currentStreak,
          maxStreak: Math.max(h.maxStreak || 0, currentStreak)
        };
      }
      return h;
    }));
  };

  const toggleChecklistSubItem = (habitId, dateStr, subItemName) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const checklistLogs = { ...(h.checklistLogs || {}) };
        const currentItems = checklistLogs[dateStr] || [];
        const hasItem = currentItems.includes(subItemName);
        const updatedItems = hasItem 
          ? currentItems.filter(item => item !== subItemName)
          : [...currentItems, subItemName];
        
        checklistLogs[dateStr] = updatedItems;
        return {
          ...h,
          checklistLogs
        };
      }
      return h;
    }));
  };

  const addHabit = (newHabit) => {
    setHabits([...habits, {
      id: `habit-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      streak: 0,
      maxStreak: 0,
      logs: [],
      checklistLogs: {},
      archived: false,
      ...newHabit
    }]);
  };

  const archiveHabit = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, archived: !h.archived } : h));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  // Project actions
  const addProject = (project) => {
    setProjects([...projects, {
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
      ...project
    }]);
  };

  const deleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  // Event actions
  const addEvent = (event) => {
    setEvents([...events, {
      id: `evt-${Date.now()}`,
      type: 'event',
      ...event
    }]);
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  // Goal actions
  const addGoal = (goal) => {
    setGoals([...goals, {
      id: `goal-${Date.now()}`,
      ...goal
    }]);
  };

  const updateGoalProgress = (id, progress) => {
    setGoals(goals.map(g => g.id === id ? { ...g, progress } : g));
  };

  // Note actions
  const addNote = (note) => {
    setNotes([...notes, {
      id: `note-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0],
      ...note
    }]);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  // Reset to demo data
  const resetDemoData = () => {
    setProjects(initialProjects);
    setTasks(initialTasks);
    setEvents(initialEvents);
    setHabits(initialHabits);
    setGoals(initialGoals);
    setNotes(initialNotes);
    localStorage.clear();
  };

  return (
    <StorageContext.Provider value={{
      projects,
      tasks,
      events,
      habits,
      goals,
      notes,
      currentView,
      setCurrentView,
      activeTaskFilter,
      setActiveTaskFilter,
      taskViewMode,
      setTaskViewMode,
      theme,
      setTheme,
      toggleTheme,
      isSidebarOpen,
      setIsSidebarOpen,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen,
      createModalType,
      setCreateModalType,
      searchQuery,
      setSearchQuery,
      // actions
      addTask,
      updateTask,
      deleteTask,
      toggleHabitDay,
      toggleChecklistSubItem,
      addHabit,
      archiveHabit,
      deleteHabit,
      addProject,
      deleteProject,
      addEvent,
      deleteEvent,
      addGoal,
      updateGoalProgress,
      addNote,
      deleteNote,
      resetDemoData
    }}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  return useContext(StorageContext);
}
