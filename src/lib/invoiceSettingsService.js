import { supabase, isSupabaseConfigured } from './supabase';

const SETTINGS_KEY = 'projectflow_admin_settings';

export const defaultSettings = {
  companyName: 'Orvian — ProjectFlow',
  companyTagline: 'One space. Every ambition.',
  companyAddress: 'Surabaya, Jawa Timur, Indonesia',
  companyEmail: 'billing@orvian.id',
  companyPhone: '+62 858-2000-4069',
  footerNotes: 'Terima kasih telah mempercayakan alur kerja proyek Anda kepada Orvian. Layanan ini tunduk pada syarat & ketentuan resmi.',
  qrisImageUrl: '', // Optional custom uploaded QRIS image URL or base64
  qrisRawPayload: '00020101021226590014ID.LINKAJA.WWW01189360091800000000000215ID10200234567895204581253033605802ID5911ProjectFlow6007JAKARTA62070703A016304E85C',
  bankName: 'BCA (Bank Central Asia)',
  bankVaNumber: '80777 0812 3456 7890',
  bankAccountHolder: 'PT ORVIAN KREASI DIGITAL',
  bankInstructions: 'Lakukan pembayaran melalui ATM, m-BCA, atau KlikBCA. Sistem otomatis mengaktifkan paket Anda tanpa konfirmasi manual.',
  updatedAt: new Date().toISOString()
};

export const getLocalSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
  } catch (e) {
    return defaultSettings;
  }
};

export const saveLocalSettings = (settings) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export async function fetchAdminSettings() {
  const local = getLocalSettings();
  if (!isSupabaseConfigured || !supabase) return local;

  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', 'config_invoice_qris')
      .maybeSingle();

    if (error || !data) return local;

    const parsed = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
    const merged = { ...defaultSettings, ...local, ...parsed };
    saveLocalSettings(merged);
    return merged;
  } catch (err) {
    console.warn('Could not fetch admin settings from Supabase:', err);
    return local;
  }
}

export async function saveAdminSettings(newSettings) {
  const updated = {
    ...defaultSettings,
    ...newSettings,
    updatedAt: new Date().toISOString()
  };

  saveLocalSettings(updated);

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('notes').upsert([
        {
          id: 'config_invoice_qris',
          title: 'CONFIG::INVOICE_AND_QRIS',
          content: JSON.stringify(updated),
          tags: ['SYSTEM_CONFIG', 'INVOICE_TEMPLATE', 'QRIS_PAYMENT'],
          pinned: true,
          updated_at: new Date().toISOString()
        }
      ]);
    } catch (err) {
      console.warn('Could not persist admin settings to Supabase:', err);
    }
  }

  return updated;
}
