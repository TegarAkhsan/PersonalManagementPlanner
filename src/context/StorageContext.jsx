import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialProjects,
  initialTasks,
  initialEvents,
  initialHabits,
  initialGoals,
  initialNotes
} from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const StorageContext = createContext();

export function StorageProvider({ children }) {
  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(isSupabaseConfigured);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  // One-time local cache reset migration if clean database was requested
  if (typeof window !== 'undefined' && !localStorage.getItem('projectflow_v2_clean_db')) {
    localStorage.removeItem('projectflow_projects');
    localStorage.removeItem('projectflow_tasks');
    localStorage.removeItem('projectflow_events');
    localStorage.removeItem('projectflow_habits');
    localStorage.removeItem('projectflow_goals');
    localStorage.removeItem('projectflow_notes');
    localStorage.setItem('projectflow_v2_clean_db', 'true');
  }

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
  // Default is 'landing' so new visitors see the SaaS landing page with plans, or can enter 'app'
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('projectflow_last_view') || 'landing';
  });

  const [activeTaskFilter, setActiveTaskFilter] = useState('All Tasks');
  const [taskViewMode, setTaskViewMode] = useState('board'); // 'board' or 'list'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Selected SaaS Pricing plan (Free, Pro, Team)
  const [currentPlan, setCurrentPlan] = useState(() => {
    return localStorage.getItem('projectflow_plan') || 'Pro';
  });

  // Authenticated user state
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('orvian_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const loginUser = (userData) => {
    setUser(userData);
    localStorage.setItem('orvian_user', JSON.stringify(userData));
  };

  const logoutUser = async () => {
    setUser(null);
    localStorage.removeItem('orvian_user');
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('Supabase signOut error:', err);
      }
    }
  };

  // Sync Supabase Auth session globally (useful for Google OAuth redirect)
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) return;

    // Check existing active session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !user) {
        const u = session.user;
        const userData = {
          name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'User',
          email: u.email,
          avatar: u.user_metadata?.avatar_url || '',
          authProvider: u.app_metadata?.provider || 'google',
          registeredAt: u.created_at
        };
        loginUser(userData);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        const u = session.user;
        const userData = {
          name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'User',
          email: u.email,
          avatar: u.user_metadata?.avatar_url || '',
          authProvider: u.app_metadata?.provider || 'google',
          registeredAt: u.created_at
        };
        loginUser(userData);
        setCurrentView('home');
      }
    });

    return () => subscription?.unsubscribe?.();
  }, []);

  // Pending checkout order for dedicated payment page
  const [checkoutData, setCheckoutData] = useState(() => {
    const saved = sessionStorage.getItem('projectflow_checkout_data');
    return saved ? JSON.parse(saved) : { planId: 'Pro', billingCycle: 'monthly', price: 99000 };
  });

  const changePlan = (planName) => {
    setCurrentPlan(planName);
    localStorage.setItem('projectflow_plan', planName);
  };

  const startCheckout = (planId, billingCycle = 'monthly', price = 99000) => {
    const data = { planId, billingCycle, price };
    setCheckoutData(data);
    sessionStorage.setItem('projectflow_checkout_data', JSON.stringify(data));
    setCurrentView('payment');
  };

  // Theme state: 'light' (soft bright) or 'dark'
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('projectflow_theme');
    return saved ? saved : 'light';
  });

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    localStorage.setItem('projectflow_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('projectflow_last_view', currentView);
  }, [currentView]);

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

  // Load from Supabase on start if configured
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) return;

    async function fetchFromSupabase() {
      setIsSyncing(true);
      try {
        const [
          { data: pData, error: pErr },
          { data: tData, error: tErr },
          { data: eData, error: eErr },
          { data: hData, error: hErr },
          { data: gData, error: gErr },
          { data: nData, error: nErr }
        ] = await Promise.all([
          supabase.from('projects').select('*'),
          supabase.from('tasks').select('*'),
          supabase.from('events').select('*'),
          supabase.from('habits').select('*'),
          supabase.from('goals').select('*'),
          supabase.from('notes').select('*')
        ]);

        // Reflect database truth: if Supabase returns array (even empty []), update state
        if (pData) setProjects(pData);
        if (tData) {
          setTasks(tData.map(t => ({
            id: t.id,
            title: t.title,
            projectId: t.project_id,
            status: t.status,
            priority: t.priority,
            dueDate: t.due_date,
            sourceLabel: t.source_label,
            createdAt: t.created_at,
            completedAt: t.completed_at
          })));
        }
        if (eData) {
          setEvents(eData.map(e => ({
            id: e.id,
            title: e.title,
            date: e.date,
            startTime: e.start_time,
            endTime: e.end_time,
            location: e.location,
            category: e.category,
            projectId: e.project_id,
            type: e.type || 'event'
          })));
        }
        if (hData) {
          setHabits(hData.map(h => ({
            id: h.id,
            name: h.name,
            type: h.type,
            emoji: h.emoji,
            frequency: h.frequency,
            streak: h.streak,
            maxStreak: h.max_streak,
            createdAt: h.created_at,
            archived: h.archived,
            logs: h.logs || [],
            checklistLogs: h.checklist_logs || {},
            subItems: h.sub_items || []
          })));
        }
        if (gData) setGoals(gData);
        if (nData) {
          // Exclude internal system config notes from normal notes list
          setNotes(nData.filter(n => !n.id?.startsWith('config_') && !n.id?.startsWith('order_')));
        }

        setSupabaseConnected(true);
        setLastSyncTime(new Date().toLocaleTimeString());
      } catch (err) {
        console.warn('Supabase fetch failed, continuing with local store:', err);
      } finally {
        setIsSyncing(false);
      }
    }

    fetchFromSupabase();
  }, []);

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
  const addTask = async (newTask) => {
    const item = {
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      completedAt: newTask.status === 'done' ? new Date().toISOString().split('T')[0] : null,
      sourceLabel: newTask.projectId ? 'Project task' : 'Inbox',
      ...newTask
    };
    setTasks(prev => [item, ...prev]);

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('tasks').insert([{
          id: item.id,
          title: item.title,
          project_id: item.projectId || null,
          status: item.status || 'todo',
          priority: item.priority || 'Medium',
          due_date: item.dueDate || null,
          source_label: item.sourceLabel || null,
          created_at: item.createdAt,
          completed_at: item.completedAt
        }]);
      } catch (e) {
        console.error('Supabase addTask error:', e);
      }
    }
  };

  const updateTask = async (id, updates) => {
    let updatedItem = null;
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const statusChangedToDone = updates.status === 'done' && t.status !== 'done';
        const statusChangedFromDone = updates.status && updates.status !== 'done' && t.status === 'done';
        updatedItem = {
          ...t,
          ...updates,
          completedAt: statusChangedToDone ? new Date().toISOString().split('T')[0] : (statusChangedFromDone ? null : t.completedAt)
        };
        return updatedItem;
      }
      return t;
    }));

    if (supabase && isSupabaseConfigured && updatedItem) {
      try {
        await supabase.from('tasks').update({
          title: updatedItem.title,
          project_id: updatedItem.projectId || null,
          status: updatedItem.status,
          priority: updatedItem.priority,
          due_date: updatedItem.dueDate || null,
          completed_at: updatedItem.completedAt
        }).eq('id', id);
      } catch (e) {
        console.error('Supabase updateTask error:', e);
      }
    }
  };

  const deleteTask = async (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('tasks').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase deleteTask error:', e);
      }
    }
  };

  // Habit actions
  const toggleHabitDay = async (habitId, dayNumber) => {
    let updatedHabit = null;
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const logs = h.logs || [];
        const isPresent = logs.includes(dayNumber);
        const newLogs = isPresent ? logs.filter(d => d !== dayNumber) : [...logs, dayNumber];
        
        const todayDate = new Date().getDate();
        let currentStreak = 0;
        let testDay = newLogs.includes(todayDate) ? todayDate : todayDate - 1;
        while (newLogs.includes(testDay) && testDay > 0) {
          currentStreak++;
          testDay--;
        }

        updatedHabit = {
          ...h,
          logs: newLogs,
          streak: currentStreak,
          maxStreak: Math.max(h.maxStreak || 0, currentStreak)
        };
        return updatedHabit;
      }
      return h;
    }));

    if (supabase && isSupabaseConfigured && updatedHabit) {
      try {
        await supabase.from('habits').update({
          logs: updatedHabit.logs,
          streak: updatedHabit.streak,
          max_streak: updatedHabit.maxStreak
        }).eq('id', habitId);
      } catch (e) {
        console.error('Supabase habit toggle error:', e);
      }
    }
  };

  const toggleChecklistSubItem = async (habitId, dateStr, subItemName) => {
    let updatedHabit = null;
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const checklistLogs = { ...(h.checklistLogs || {}) };
        const currentItems = checklistLogs[dateStr] || [];
        const hasItem = currentItems.includes(subItemName);
        const updatedItems = hasItem 
          ? currentItems.filter(item => item !== subItemName)
          : [...currentItems, subItemName];
        
        checklistLogs[dateStr] = updatedItems;
        updatedHabit = {
          ...h,
          checklistLogs
        };
        return updatedHabit;
      }
      return h;
    }));

    if (supabase && isSupabaseConfigured && updatedHabit) {
      try {
        await supabase.from('habits').update({
          checklist_logs: updatedHabit.checklistLogs
        }).eq('id', habitId);
      } catch (e) {
        console.error('Supabase habit checklist error:', e);
      }
    }
  };

  const addHabit = async (newHabit) => {
    const item = {
      id: `habit-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      streak: 0,
      maxStreak: 0,
      logs: [],
      checklistLogs: {},
      archived: false,
      ...newHabit
    };
    setHabits(prev => [...prev, item]);

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('habits').insert([{
          id: item.id,
          name: item.name,
          type: item.type || 'single',
          emoji: item.emoji || '🎯',
          frequency: item.frequency || 'daily',
          streak: 0,
          max_streak: 0,
          created_at: item.createdAt,
          archived: false,
          logs: [],
          checklist_logs: {},
          sub_items: item.subItems || []
        }]);
      } catch (e) {
        console.error('Supabase addHabit error:', e);
      }
    }
  };

  const archiveHabit = async (id) => {
    let targetArchived = false;
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        targetArchived = !h.archived;
        return { ...h, archived: !h.archived };
      }
      return h;
    }));

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('habits').update({ archived: targetArchived }).eq('id', id);
      } catch (e) {
        console.error('Supabase archiveHabit error:', e);
      }
    }
  };

  const deleteHabit = async (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('habits').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase deleteHabit error:', e);
      }
    }
  };

  // Project actions
  const addProject = async (project) => {
    const item = {
      id: `proj-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
      ...project
    };
    setProjects(prev => [...prev, item]);

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('projects').insert([{
          id: item.id,
          name: item.name,
          description: item.description,
          color: item.color,
          status: item.status
        }]);
      } catch (e) {
        console.error('Supabase addProject error:', e);
      }
    }
  };

  const deleteProject = async (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('projects').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase deleteProject error:', e);
      }
    }
  };

  // Event actions
  const addEvent = async (event) => {
    const item = {
      id: `evt-${Date.now()}`,
      type: 'event',
      ...event
    };
    setEvents(prev => [...prev, item]);

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('events').insert([{
          id: item.id,
          title: item.title,
          date: item.date,
          start_time: item.startTime,
          end_time: item.endTime,
          location: item.location,
          category: item.category,
          project_id: item.projectId || null,
          type: item.type
        }]);
      } catch (e) {
        console.error('Supabase addEvent error:', e);
      }
    }
  };

  const deleteEvent = async (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('events').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase deleteEvent error:', e);
      }
    }
  };

  // Goal actions
  const addGoal = async (goal) => {
    const item = {
      id: `goal-${Date.now()}`,
      ...goal
    };
    setGoals(prev => [...prev, item]);

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('goals').insert([{
          id: item.id,
          title: item.title,
          progress: item.progress || 0,
          target_date: item.targetDate,
          category: item.category,
          color: item.color
        }]);
      } catch (e) {
        console.error('Supabase addGoal error:', e);
      }
    }
  };

  const updateGoalProgress = async (id, progress) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, progress } : g));
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('goals').update({ progress }).eq('id', id);
      } catch (e) {
        console.error('Supabase updateGoal error:', e);
      }
    }
  };

  // Note actions
  const addNote = async (note) => {
    const item = {
      id: `note-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0],
      ...note
    };
    setNotes(prev => [...prev, item]);

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('notes').insert([{
          id: item.id,
          title: item.title,
          content: item.content,
          tags: item.tags || [],
          pinned: item.pinned || false,
          updated_at: item.updatedAt
        }]);
      } catch (e) {
        console.error('Supabase addNote error:', e);
      }
    }
  };

  const deleteNote = async (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('notes').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase deleteNote error:', e);
      }
    }
  };

  // Push seed data directly into Supabase
  const syncAllLocalToSupabase = async () => {
    if (!supabase || !isSupabaseConfigured) {
      alert('Supabase credentials are not configured yet in .env');
      return;
    }
    setIsSyncing(true);
    try {
      // Upsert projects
      for (const p of projects) {
        await supabase.from('projects').upsert({
          id: p.id,
          name: p.name,
          color: p.color,
          description: p.description,
          status: p.status
        });
      }
      // Upsert tasks
      for (const t of tasks) {
        await supabase.from('tasks').upsert({
          id: t.id,
          title: t.title,
          project_id: t.projectId || null,
          status: t.status,
          priority: t.priority,
          due_date: t.dueDate || null,
          source_label: t.sourceLabel || null,
          created_at: t.createdAt,
          completed_at: t.completedAt
        });
      }
      // Upsert events
      for (const e of events) {
        await supabase.from('events').upsert({
          id: e.id,
          title: e.title,
          date: e.date,
          start_time: e.startTime,
          end_time: e.endTime,
          location: e.location,
          category: e.category,
          project_id: e.projectId || null,
          type: e.type || 'event'
        });
      }
      // Upsert habits
      for (const h of habits) {
        await supabase.from('habits').upsert({
          id: h.id,
          name: h.name,
          type: h.type || 'single',
          emoji: h.emoji || '🎯',
          frequency: h.targetFrequency || 'daily',
          streak: h.streak || 0,
          max_streak: h.maxStreak || 0,
          created_at: h.createdAt,
          archived: h.archived || false,
          logs: h.logs || [],
          checklist_logs: h.checklistLogs || {},
          sub_items: h.subItems || []
        });
      }
      // Upsert goals
      for (const g of goals) {
        await supabase.from('goals').upsert({
          id: g.id,
          title: g.title,
          progress: g.progress || 0,
          target_date: g.targetDate || null,
          category: g.category || null,
          color: g.color || '#F59E0B'
        });
      }
      // Upsert notes
      for (const n of notes) {
        await supabase.from('notes').upsert({
          id: n.id,
          title: n.title,
          content: n.content,
          tags: n.tags || [],
          pinned: n.pinned || false,
          updated_at: n.updatedAt
        });
      }

      setLastSyncTime(new Date().toLocaleTimeString());
      alert('Semua data berhasil disinkronkan ke database Supabase!');
    } catch (err) {
      console.error(err);
      alert('Gagal sinkronisasi data ke Supabase: ' + err.message);
    } finally {
      setIsSyncing(false);
    }
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

  // Drop all data (clean slate / fresh start)
  const clearAllData = async () => {
    setProjects([]);
    setTasks([]);
    setEvents([]);
    setHabits([]);
    setGoals([]);
    setNotes([]);
    localStorage.removeItem('projectflow_projects');
    localStorage.removeItem('projectflow_tasks');
    localStorage.removeItem('projectflow_events');
    localStorage.removeItem('projectflow_habits');
    localStorage.removeItem('projectflow_goals');
    localStorage.removeItem('projectflow_notes');

    if (supabase && isSupabaseConfigured) {
      try {
        await Promise.all([
          supabase.from('tasks').delete().neq('id', '_none_'),
          supabase.from('events').delete().neq('id', '_none_'),
          supabase.from('habits').delete().neq('id', '_none_'),
          supabase.from('goals').delete().neq('id', '_none_'),
          supabase.from('notes').delete().neq('id', '_none_'),
        ]);
        await supabase.from('projects').delete().neq('id', '_none_');
      } catch (err) {
        console.error('Failed to clear Supabase cloud data:', err);
      }
    }
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
      // Supabase & SaaS state
      isSyncing,
      supabaseConnected,
      lastSyncTime,
      syncAllLocalToSupabase,
      currentPlan,
      changePlan,
      user,
      loginUser,
      logoutUser,
      checkoutData,
      setCheckoutData,
      startCheckout,
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
      resetDemoData,
      clearAllData
    }}>
      {children}
    </StorageContext.Provider>
  );
}

export function useStorage() {
  return useContext(StorageContext);
}
