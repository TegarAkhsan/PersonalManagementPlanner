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

  // One-time isolation migration: ensure admin tasks are not stored in regular user's cache
  if (typeof window !== 'undefined' && !localStorage.getItem('projectflow_user_data_isolation_v1')) {
    try {
      const savedUserStr = localStorage.getItem('orvian_user');
      const adminEmails = ['tegarrigger@gmail.com', 'tegarakhsan@gmail.com'];
      if (savedUserStr) {
        const u = JSON.parse(savedUserStr);
        const email = (u?.email || '').toLowerCase().trim();
        if (adminEmails.includes(email)) {
          // Move existing projectflow_* items to admin scope
          ['projects', 'tasks', 'events', 'habits', 'goals', 'notes'].forEach(key => {
            const val = localStorage.getItem(`projectflow_${key}`);
            if (val) localStorage.setItem(`projectflow_admin_${key}`, val);
          });
        } else {
          // Regular user: clear leaked admin tasks and start with clean Starter storage
          localStorage.removeItem('projectflow_projects');
          localStorage.removeItem('projectflow_tasks');
          localStorage.removeItem('projectflow_events');
          localStorage.removeItem('projectflow_habits');
          localStorage.removeItem('projectflow_goals');
          localStorage.removeItem('projectflow_notes');
        }
      }
    } catch (e) {}
    localStorage.setItem('projectflow_user_data_isolation_v1', 'true');
  }

  // Daftar email master admin resmi
  const ADMIN_EMAILS = ['tegarrigger@gmail.com', 'tegarakhsan@gmail.com'];

  // Helper to determine active user storage prefix
  const getStoragePrefix = (userObj) => {
    if (!userObj || !userObj.email) return 'guest';
    const emailLower = userObj.email.toLowerCase().trim();
    if (ADMIN_EMAILS.includes(emailLower)) {
      return 'admin';
    }
    // Encode email safely for localStorage keys
    return `usr_${emailLower.replace(/[^a-zA-Z0-9]/g, '_')}`;
  };

  // Authenticated user state initialized first so workspace can be user-scoped
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('orvian_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        const emailLower = (parsed.email || '').toLowerCase().trim();
        if (ADMIN_EMAILS.includes(emailLower)) {
          parsed.role = 'admin';
          localStorage.setItem('orvian_is_admin', 'true');
          localStorage.setItem('projectflow_user_role', 'admin');
        } else {
          // Pastikan user biasa SELALU memiliki role 'user' dan BUKAN admin
          parsed.role = 'user';
          localStorage.removeItem('orvian_is_admin');
          localStorage.setItem('projectflow_user_role', 'user');
        }
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  const checkIsAdmin = (u) => {
    if (!u) return false;
    const email = (u.email || '').toLowerCase().trim();
    if (ADMIN_EMAILS.includes(email)) return true;
    if (u.role === 'admin' && ADMIN_EMAILS.includes(email)) return true;
    return false;
  };

  const isAdmin = checkIsAdmin(user);

  // Helper to read initial data for a specific user
  const loadScopedData = (key, fallback, activeUser) => {
    try {
      const prefix = getStoragePrefix(activeUser);
      // Try user scoped key first
      const scopedVal = localStorage.getItem(`projectflow_${prefix}_${key}`);
      if (scopedVal) return JSON.parse(scopedVal);

      // If user is admin and scoped key doesn't exist yet, fallback to legacy global key
      if (prefix === 'admin') {
        const legacyVal = localStorage.getItem(`projectflow_${key}`);
        if (legacyVal) return JSON.parse(legacyVal);
      }
      return fallback;
    } catch (e) {
      return fallback;
    }
  };

  // Load user-scoped state or clean fallback
  const [projects, setProjects] = useState(() => loadScopedData('projects', initialProjects, user));
  const [tasks, setTasks] = useState(() => loadScopedData('tasks', initialTasks, user));
  const [events, setEvents] = useState(() => loadScopedData('events', initialEvents, user));
  const [habits, setHabits] = useState(() => loadScopedData('habits', initialHabits, user));
  const [goals, setGoals] = useState(() => loadScopedData('goals', initialGoals, user));
  const [notes, setNotes] = useState(() => loadScopedData('notes', initialNotes, user));

  // Current view and layout state
  // Default is 'landing' so new visitors see the SaaS landing page with plans, or can enter 'app'
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('projectflow_last_view') || 'landing';
  });

  const [activeTaskFilter, setActiveTaskFilter] = useState('All Tasks');
  const [taskViewMode, setTaskViewMode] = useState('board'); // 'board' or 'list'
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [createModalType, setCreateModalType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Global Dialog / Modal Notification State (Logout, Delete, Info, Warning, Confirm)
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
    confirmText: '',
    cancelText: 'Batal',
    showCancel: true,
    onConfirm: null,
    onCancel: null
  });

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const openModal = (config) => {
    setModalConfig({
      isOpen: true,
      type: config.type || 'confirm',
      title: config.title || 'Konfirmasi',
      message: config.message || '',
      confirmText: config.confirmText,
      cancelText: config.cancelText || 'Batal',
      showCancel: config.showCancel !== false,
      onConfirm: config.onConfirm || null,
      onCancel: config.onCancel || null
    });
  };

  const showConfirm = ({ title, message, type = 'warning', confirmText = 'Lanjutkan', cancelText = 'Batal', onConfirm, onCancel }) => {
    openModal({
      title,
      message,
      type,
      confirmText,
      cancelText,
      showCancel: true,
      onConfirm,
      onCancel
    });
  };

  const showAlert = ({ title = 'Pemberitahuan', message, type = 'info', confirmText = 'Mengerti', onConfirm }) => {
    openModal({
      title,
      message,
      type,
      confirmText,
      showCancel: false,
      onConfirm
    });
  };


  // Selected SaaS Pricing plan (Starter, Pro, Team)
  // Default is 'Starter' for free users. Only admins or confirmed paid users get Pro/Team.
  const [currentPlan, setCurrentPlan] = useState(() => {
    return localStorage.getItem('projectflow_plan') || 'Starter';
  });

  // Subscription & Expiration tracking (Lifecycle & Grace Period)
  const [subscriptionInfo, setSubscriptionInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('orvian_subscription_info');
      if (saved) return JSON.parse(saved);
      // Default jika plan adalah Pro/Team, buat durasi aktif 30 hari ke depan
      const plan = localStorage.getItem('projectflow_plan');
      if (plan && plan !== 'Starter') {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        const initial = {
          plan,
          startedAt: new Date().toISOString(),
          expiresAt: d.toISOString(),
          status: 'active'
        };
        localStorage.setItem('orvian_subscription_info', JSON.stringify(initial));
        return initial;
      }
      return null;
    } catch (e) {
      return null;
    }
  });

  // Effect untuk memeriksa status kedaluwarsa & Grace Period secara otomatis
  useEffect(() => {
    if (!subscriptionInfo || !subscriptionInfo.expiresAt) return;
    const plan = localStorage.getItem('projectflow_plan');
    if (!plan || plan === 'Starter') return;

    const now = new Date();
    const expiry = new Date(subscriptionInfo.expiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // Jika lewat dari 7 hari masa tenggang (diffDays < -7), otomatis downgrade ke Starter
    if (diffDays < -7) {
      setCurrentPlan('Starter');
      localStorage.setItem('projectflow_plan', 'Starter');
      const updated = { ...subscriptionInfo, status: 'downgraded' };
      setSubscriptionInfo(updated);
      localStorage.setItem('orvian_subscription_info', JSON.stringify(updated));
    } else if (diffDays <= 0 && subscriptionInfo.status !== 'grace_period') {
      const updated = { ...subscriptionInfo, status: 'grace_period' };
      setSubscriptionInfo(updated);
      localStorage.setItem('orvian_subscription_info', JSON.stringify(updated));
    }
  }, [subscriptionInfo]);

  const loginUser = (userData) => {
    const emailLower = (userData?.email || '').toLowerCase().trim();
    const isMasterAdmin = ADMIN_EMAILS.includes(emailLower);

    if (isMasterAdmin) {
      userData.role = 'admin';
      localStorage.setItem('orvian_is_admin', 'true');
      localStorage.setItem('projectflow_user_role', 'admin');
      changePlan('Team');
    } else {
      userData.role = 'user';
      localStorage.removeItem('orvian_is_admin');
      localStorage.setItem('projectflow_user_role', 'user');
      // Non-admin always defaults to Starter plan unless they paid for Pro
      const savedPlan = localStorage.getItem(`projectflow_${getStoragePrefix(userData)}_plan`) || localStorage.getItem('projectflow_plan');
      if (!savedPlan || savedPlan === 'Team') {
        changePlan('Starter');
      } else {
        changePlan(savedPlan);
      }
    }
    setUser(userData);
    localStorage.setItem('orvian_user', JSON.stringify(userData));

    // Load workspace data specifically for this user
    setProjects(loadScopedData('projects', initialProjects, userData));
    setTasks(loadScopedData('tasks', initialTasks, userData));
    setEvents(loadScopedData('events', initialEvents, userData));
    setHabits(loadScopedData('habits', initialHabits, userData));
    setGoals(loadScopedData('goals', initialGoals, userData));
    setNotes(loadScopedData('notes', initialNotes, userData));
  };

  const logoutUser = async () => {
    setUser(null);
    setCurrentPlan('Starter');
    localStorage.removeItem('orvian_user');
    localStorage.removeItem('orvian_is_admin');
    localStorage.removeItem('projectflow_user_role');
    localStorage.removeItem('projectflow_plan');
    sessionStorage.removeItem('orvian_payment_unlocked');
    sessionStorage.removeItem('orvian_payment_success');
    sessionStorage.removeItem('orvian_current_order_id');

    // Reset current active memory state so no residual data shows on logged out state
    setProjects(initialProjects);
    setTasks(initialTasks);
    setEvents(initialEvents);
    setHabits(initialHabits);
    setGoals(initialGoals);
    setNotes(initialNotes);

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

    // Helper to clean access_token / OAuth hash fragment from browser URL
    const cleanAuthHash = () => {
      if (window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('error'))) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    };

    // Sync Supabase Auth session globally (useful for Google OAuth redirect)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const isFreshOAuthRedirect = window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('refresh_token'));
        cleanAuthHash();
        const u = session.user;
        const userData = {
          name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'User',
          email: u.email,
          avatar: u.user_metadata?.avatar_url || '',
          authProvider: u.app_metadata?.provider || 'google',
          registeredAt: u.created_at
        };
        loginUser(userData);
        // Only redirect to home if this was an active OAuth callback redirect (containing access_token)
        if (isFreshOAuthRedirect) {
          setCurrentView('home');
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        const isFreshOAuthRedirect = window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('refresh_token'));
        cleanAuthHash();
        const u = session.user;
        const userData = {
          name: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split('@')[0] || 'User',
          email: u.email,
          avatar: u.user_metadata?.avatar_url || '',
          authProvider: u.app_metadata?.provider || 'google',
          registeredAt: u.created_at
        };
        loginUser(userData);
        // Only redirect if explicitly coming back from OAuth redirect or explicitly signed in from auth page
        if (isFreshOAuthRedirect) {
          setCurrentView('home');
        }
      }
    });

    return () => subscription?.unsubscribe?.();
  }, []);

  // Pending checkout order for dedicated payment page
  const [checkoutData, setCheckoutData] = useState(() => {
    const saved = sessionStorage.getItem('projectflow_checkout_data');
    return saved ? JSON.parse(saved) : { planId: 'Pro', billingCycle: 'monthly', price: 99000 };
  });

  const changePlan = (planName, customExpiryDays = 30) => {
    setCurrentPlan(planName);
    localStorage.setItem('projectflow_plan', planName);

    if (planName !== 'Starter') {
      const d = new Date();
      d.setDate(d.getDate() + customExpiryDays);
      const newSubInfo = {
        plan: planName,
        startedAt: new Date().toISOString(),
        expiresAt: d.toISOString(),
        status: 'active'
      };
      setSubscriptionInfo(newSubInfo);
      localStorage.setItem('orvian_subscription_info', JSON.stringify(newSubInfo));
    } else {
      setSubscriptionInfo(null);
      localStorage.removeItem('orvian_subscription_info');
    }
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

  // Persist state updates to localStorage (scoped to active user)
  useEffect(() => {
    const prefix = getStoragePrefix(user);
    localStorage.setItem(`projectflow_${prefix}_projects`, JSON.stringify(projects));
    if (prefix === 'admin') {
      localStorage.setItem('projectflow_projects', JSON.stringify(projects));
    }
  }, [projects, user]);

  useEffect(() => {
    const prefix = getStoragePrefix(user);
    localStorage.setItem(`projectflow_${prefix}_tasks`, JSON.stringify(tasks));
    if (prefix === 'admin') {
      localStorage.setItem('projectflow_tasks', JSON.stringify(tasks));
    }
  }, [tasks, user]);

  useEffect(() => {
    const prefix = getStoragePrefix(user);
    localStorage.setItem(`projectflow_${prefix}_events`, JSON.stringify(events));
    if (prefix === 'admin') {
      localStorage.setItem('projectflow_events', JSON.stringify(events));
    }
  }, [events, user]);

  useEffect(() => {
    const prefix = getStoragePrefix(user);
    localStorage.setItem(`projectflow_${prefix}_habits`, JSON.stringify(habits));
    if (prefix === 'admin') {
      localStorage.setItem('projectflow_habits', JSON.stringify(habits));
    }
  }, [habits, user]);

  useEffect(() => {
    const prefix = getStoragePrefix(user);
    localStorage.setItem(`projectflow_${prefix}_goals`, JSON.stringify(goals));
    if (prefix === 'admin') {
      localStorage.setItem('projectflow_goals', JSON.stringify(goals));
    }
  }, [goals, user]);

  useEffect(() => {
    const prefix = getStoragePrefix(user);
    localStorage.setItem(`projectflow_${prefix}_notes`, JSON.stringify(notes));
    if (prefix === 'admin') {
      localStorage.setItem('projectflow_notes', JSON.stringify(notes));
    }
  }, [notes, user]);

  // Load from Supabase on start if configured (Cloud database sync is reserved for Master Admin workspace)
  useEffect(() => {
    if (!supabase || !isSupabaseConfigured) return;

    // Only sync master database records if user is admin. Non-admin users have their own clean workspace!
    const isUserAdmin = checkIsAdmin(user);
    if (!isUserAdmin) {
      setSupabaseConnected(true);
      return;
    }

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
        if (pData) {
          setProjects(pData.map(p => {
            let desc = p.description || '';
            let fee = 0;
            let isJoki = false;
            let clientName = '';
            if (desc.includes('__META__')) {
              try {
                const parts = desc.split('__META__');
                desc = parts[0].trim();
                const meta = JSON.parse(parts[1]);
                fee = Number(meta.fee) || 0;
                isJoki = Boolean(meta.isJoki);
                clientName = meta.clientName || '';
              } catch (e) {
                console.error('Failed to parse project meta', e);
              }
            }
            return {
              id: p.id,
              name: p.name,
              color: p.color,
              description: desc,
              status: p.status || 'active',
              fee: p.fee !== undefined ? Number(p.fee) : fee,
              isJoki: p.isJoki !== undefined ? Boolean(p.isJoki) : isJoki,
              clientName: clientName
            };
          }));
        }
        if (tData) {
          setTasks(tData.map(t => {
            let desc = '';
            let fee = 0;
            let label = t.source_label || (t.project_id ? 'Project task' : 'Inbox');
            if (t.source_label && t.source_label.includes('__DESC__')) {
              try {
                const parts = t.source_label.split('__DESC__');
                label = parts[0].trim() || (t.project_id ? 'Project task' : 'Inbox');
                const meta = JSON.parse(parts[1]);
                desc = meta.desc || '';
                fee = Number(meta.fee) || 0;
              } catch (e) {
                console.error('Failed to parse task desc', e);
              }
            }
            return {
              id: t.id,
              title: t.title,
              description: desc,
              fee: t.fee !== undefined ? Number(t.fee) : fee,
              projectId: t.project_id,
              status: t.status,
              priority: t.priority,
              dueDate: t.due_date,
              sourceLabel: label,
              createdAt: t.created_at,
              completedAt: t.completedAt
            };
          }));
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
  }, [user]);

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
      description: newTask.description || '',
      fee: Number(newTask.fee) || 0,
      ...newTask
    };
    setTasks(prev => [item, ...prev]);

    if (supabase && isSupabaseConfigured) {
      try {
        const meta = { desc: item.description || '', fee: item.fee || 0 };
        const labelWithMeta = `${item.sourceLabel || ''}\n__DESC__${JSON.stringify(meta)}`;

        await supabase.from('tasks').insert([{
          id: item.id,
          title: item.title,
          project_id: item.projectId || null,
          status: item.status || 'todo',
          priority: item.priority || 'Medium',
          due_date: item.dueDate || null,
          source_label: labelWithMeta,
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
        const meta = { desc: updatedItem.description || '', fee: Number(updatedItem.fee) || 0 };
        const labelWithMeta = `${updatedItem.sourceLabel || ''}\n__DESC__${JSON.stringify(meta)}`;

        await supabase.from('tasks').update({
          title: updatedItem.title,
          project_id: updatedItem.projectId || null,
          status: updatedItem.status,
          priority: updatedItem.priority,
          due_date: updatedItem.dueDate || null,
          source_label: labelWithMeta,
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
      fee: Number(project.fee) || 0,
      isJoki: Boolean(project.isJoki),
      clientName: project.clientName || '',
      ...project
    };
    setProjects(prev => [...prev, item]);

    if (supabase && isSupabaseConfigured) {
      try {
        const meta = { fee: item.fee, isJoki: item.isJoki, clientName: item.clientName };
        const rawDesc = item.description || '';
        const savedDescription = `${rawDesc}\n__META__${JSON.stringify(meta)}`;

        await supabase.from('projects').insert([{
          id: item.id,
          name: item.name,
          description: savedDescription,
          color: item.color,
          status: item.status
        }]);
      } catch (e) {
        console.error('Supabase addProject error:', e);
      }
    }
  };

  const updateProject = async (id, updates) => {
    let updatedProj = null;
    setProjects(prev => prev.map(p => {
      if (p.id === id) {
        updatedProj = { ...p, ...updates };
        return updatedProj;
      }
      return p;
    }));

    if (supabase && isSupabaseConfigured && updatedProj) {
      try {
        const meta = {
          fee: Number(updatedProj.fee) || 0,
          isJoki: Boolean(updatedProj.isJoki),
          clientName: updatedProj.clientName || ''
        };
        const rawDesc = updatedProj.description || '';
        const savedDescription = `${rawDesc}\n__META__${JSON.stringify(meta)}`;

        await supabase.from('projects').update({
          name: updatedProj.name,
          description: savedDescription,
          color: updatedProj.color,
          status: updatedProj.status
        }).eq('id', id);
      } catch (e) {
        console.error('Supabase updateProject error:', e);
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
      showAlert({
        type: 'warning',
        title: 'Konfigurasi Supabase Diperlukan',
        message: 'Kredensial Supabase belum dikonfigurasikan di environment (.env).'
      });
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
      showAlert({
        type: 'success',
        title: 'Sinkronisasi Berhasil',
        message: 'Semua data lokal berhasil disinkronkan ke database cloud Supabase!'
      });
    } catch (err) {
      console.error(err);
      showAlert({
        type: 'danger',
        title: 'Sinkronisasi Gagal',
        message: 'Gagal sinkronisasi data ke Supabase: ' + err.message
      });
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
      // Notification / Alert / Confirmation Modal
      modalConfig,
      openModal,
      closeModal,
      showConfirm,
      showAlert,
      // Supabase & SaaS state
      isSyncing,
      supabaseConnected,
      lastSyncTime,
      syncAllLocalToSupabase,
      currentPlan,
      changePlan,
      subscriptionInfo,
      setSubscriptionInfo,
      user,
      isAdmin,
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
      updateProject,
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
