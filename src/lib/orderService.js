import { supabase, isSupabaseConfigured } from './supabase';

const ORDERS_KEY = 'projectflow_orders_database';

// Helper to get local orders cache
export const getLocalOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

// Helper to save local orders cache
export const saveLocalOrders = (orders) => {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

/**
 * Fetch all orders from Supabase (backed by notes table with tag ORDER)
 * Falls back to local storage
 */
export async function fetchAllOrders() {
  const localList = getLocalOrders();

  if (!isSupabaseConfigured || !supabase) {
    return localList;
  }

  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error || !data) {
      console.warn('Failed to fetch orders from Supabase:', error);
      return localList;
    }

    // Filter notes that store order records
    const cloudOrders = data
      .filter((n) => n.id?.startsWith('order_') || n.title?.startsWith('ORDER::'))
      .map((n) => {
        try {
          return typeof n.content === 'string' ? JSON.parse(n.content) : n.content;
        } catch (e) {
          return null;
        }
      })
      .filter(Boolean);

    // Merge cloud and local orders
    const mergedMap = new Map();
    [...localList, ...cloudOrders].forEach((item) => {
      mergedMap.set(item.orderId, item);
    });

    const mergedList = Array.from(mergedMap.values()).sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
    );

    saveLocalOrders(mergedList);
    return mergedList;
  } catch (err) {
    console.error('Error in fetchAllOrders:', err);
    return localList;
  }
}

/**
 * Create a new pending order into Supabase
 */
export async function createOrder(orderPayload) {
  const orderRecord = {
    orderId: orderPayload.orderId,
    name: orderPayload.name,
    email: orderPayload.email,
    phone: orderPayload.phone || '',
    plan: orderPayload.plan, // 'Starter' | 'Pro' | 'Team'
    billingCycle: orderPayload.billingCycle || 'monthly',
    amount: orderPayload.amount,
    paymentMethod: orderPayload.paymentMethod || 'qris',
    status: orderPayload.status || 'pending', // 'pending' | 'confirmed' | 'rejected'
    notes: orderPayload.notes || '',
    createdAt: new Date().toISOString(),
    confirmedAt: null
  };

  // 1. Save to Local Cache
  const localList = getLocalOrders();
  const updatedList = [orderRecord, ...localList.filter((o) => o.orderId !== orderRecord.orderId)];
  saveLocalOrders(updatedList);

  // 2. Persist to Supabase Database
  if (isSupabaseConfigured && supabase) {
    try {
      const noteRow = {
        id: `order_${orderRecord.orderId}`,
        title: `ORDER::${orderRecord.orderId}::${orderRecord.plan}`,
        content: JSON.stringify(orderRecord),
        tags: ['ORDER', `STATUS_${orderRecord.status.toUpperCase()}`, `PLAN_${orderRecord.plan.toUpperCase()}`],
        pinned: orderRecord.status === 'pending',
        updated_at: new Date().toISOString()
      };

      await supabase.from('notes').upsert([noteRow]);
    } catch (err) {
      console.warn('Could not sync new order to Supabase:', err);
    }
  }

  return orderRecord;
}

/**
 * Admin updates order status (Confirm / Grant Access / Reject)
 */
export async function updateOrderStatus(orderId, newStatus, adminNote = '') {
  const localList = getLocalOrders();
  const index = localList.findIndex((o) => o.orderId === orderId);

  let updatedRecord = null;
  if (index !== -1) {
    localList[index] = {
      ...localList[index],
      status: newStatus,
      notes: adminNote || localList[index].notes,
      confirmedAt: newStatus === 'confirmed' ? new Date().toISOString() : localList[index].confirmedAt
    };
    updatedRecord = localList[index];
    saveLocalOrders(localList);
  }

  // Sync to Supabase
  if (isSupabaseConfigured && supabase && updatedRecord) {
    try {
      const noteRow = {
        id: `order_${updatedRecord.orderId}`,
        title: `ORDER::${updatedRecord.orderId}::${updatedRecord.plan}`,
        content: JSON.stringify(updatedRecord),
        tags: ['ORDER', `STATUS_${newStatus.toUpperCase()}`, `PLAN_${updatedRecord.plan.toUpperCase()}`],
        pinned: newStatus === 'pending',
        updated_at: new Date().toISOString()
      };

      await supabase.from('notes').upsert([noteRow]);
    } catch (err) {
      console.warn('Could not update order on Supabase:', err);
    }
  }

  return updatedRecord;
}

/**
 * Check customer's verified access status by email or orderId
 */
export async function checkCustomerAccess(identifier) {
  if (!identifier) return null;
  const cleanId = identifier.trim().toLowerCase();
  const orders = await fetchAllOrders();

  const matched = orders.find(
    (o) =>
      o.orderId.toLowerCase() === cleanId ||
      o.email.toLowerCase() === cleanId ||
      `inv-pf-${cleanId}` === o.orderId.toLowerCase()
  );

  return matched || null;
}
