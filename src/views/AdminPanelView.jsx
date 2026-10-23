import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  Mail,
  Phone,
  CreditCard,
  ExternalLink,
  ChevronRight,
  Filter,
  DollarSign,
  ArrowLeft,
  Key,
  Database,
  Lock,
  Send,
  SlidersHorizontal,
  FileText,
  QrCode,
  Download,
  Save,
  Upload,
  Building2
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';
import { fetchAllOrders, updateOrderStatus } from '../lib/orderService';
import { downloadInvoice } from '../lib/invoiceGenerator';
import { fetchAdminSettings, saveAdminSettings, getLocalSettings } from '../lib/invoiceSettingsService';

export default function AdminPanelView() {
  const { theme, setCurrentView, changePlan } = useStorage();
  const isLight = theme === 'light';

  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'confirmed' | 'rejected'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [adminNote, setAdminNote] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'settings'

  // Invoice & QRIS Configuration State
  const [settings, setSettings] = useState(getLocalSettings());
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    fetchAdminSettings().then(setSettings);
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await saveAdminSettings(settings);
      setActionSuccessMsg('Pengaturan Template Invoice & QRIS berhasil disimpan ke Supabase!');
      setTimeout(() => setActionSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // Auto refresh every 10 seconds
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    const res = await updateOrderStatus(orderId, newStatus, adminNote);
    if (res) {
      // Update local state
      setOrders((prev) => prev.map((o) => (o.orderId === orderId ? res : o)));
      if (selectedOrder?.orderId === orderId) {
        setSelectedOrder(res);
      }
      setActionSuccessMsg(
        newStatus === 'confirmed'
          ? `Pesanan ${orderId} berhasil DIVERIFIKASI! Akses paket ${res.plan} telah diberikan ke ${res.email}.`
          : `Pesanan ${orderId} telah diperbarui menjadi ${newStatus}.`
      );
      setTimeout(() => setActionSuccessMsg(''), 5000);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.orderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.phone?.includes(searchQuery);

    const matchesStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === 'pending').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    revenue: orders
      .filter((o) => o.status === 'confirmed')
      .reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0)
  };

  return (
    <div className={`min-h-screen font-sans ${isLight ? 'bg-slate-50 text-slate-800' : 'bg-[#0E0E11] text-zinc-100'}`}>
      {/* Admin Top Header Navigation */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between ${
        isLight ? 'bg-white/90 border-slate-200' : 'bg-[#141417]/90 border-[#24242A]'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20">
            <ShieldCheck size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-extrabold tracking-tight">ProjectFlow Admin Control</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-indigo-500/15 text-indigo-500 border border-indigo-500/30">
                RBAC & Billing
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Database Supabase: ewqxehbrcbceirsqaekb (Connected)</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadOrders}
            disabled={isLoading}
            className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' : 'bg-[#1C1C22] hover:bg-[#25252C] text-zinc-300 border-[#2D2D36]'
            }`}
            title="Refresh Data"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin text-amber-500' : ''} />
            <span className="hidden sm:inline">Segarkan Data</span>
          </button>

          <button
            onClick={() => setCurrentView('landing')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300' : 'bg-[#18181D] hover:bg-[#202026] text-zinc-300 border-[#2B2B33]'
            }`}
          >
            <ArrowLeft size={13} />
            <span>Ke Halaman Utama</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#222228] pb-3">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  : 'bg-[#18181D] hover:bg-[#202026] text-zinc-300 border border-[#2B2B33]'
            }`}
          >
            <ShieldCheck size={14} />
            <span>Manajemen Transaksi & Role ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : isLight
                  ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                  : 'bg-[#18181D] hover:bg-[#202026] text-zinc-300 border border-[#2B2B33]'
            }`}
          >
            <QrCode size={14} />
            <span>Kustomisasi QRIS & Template Invoice</span>
          </button>
        </div>

        {/* Tab 1: Orders Management */}
        {activeTab === 'orders' && (
          <>
            {/* 4 Stat Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-[#141417] border-[#24242A]'}`}>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Total Transaksi Masuk</p>
            <p className="text-2xl font-black mt-1 font-mono">{stats.total}</p>
          </div>

          <div className={`p-4 rounded-xl border border-amber-500/30 ${isLight ? 'bg-amber-50/60' : 'bg-amber-950/20'}`}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold uppercase tracking-wider">Perlu Konfirmasi</p>
              <Clock size={16} className="text-amber-500" />
            </div>
            <p className="text-2xl font-black mt-1 font-mono text-amber-600 dark:text-amber-400">{stats.pending}</p>
          </div>

          <div className={`p-4 rounded-xl border border-emerald-500/30 ${isLight ? 'bg-emerald-50/60' : 'bg-emerald-950/20'}`}>
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold uppercase tracking-wider">Akses Terverifikasi</p>
              <CheckCircle2 size={16} className="text-emerald-500" />
            </div>
            <p className="text-2xl font-black mt-1 font-mono text-emerald-600 dark:text-emerald-400">{stats.confirmed}</p>
          </div>

          <div className={`p-4 rounded-xl border ${isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-[#141417] border-[#24242A]'}`}>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Total Pendapatan Terkonfirmasi</p>
            <p className="text-2xl font-black mt-1 font-mono text-indigo-500">
              Rp {stats.revenue.toLocaleString('id-ID')}
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className={`p-4 rounded-xl border flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#141417] border-[#24242A]'
        }`}>
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan No. Invoice, Nama, Email, atau No. HP..."
              className={`w-full pl-9 pr-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#1B1B20] border-[#2B2B32] text-white'
              }`}
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            <Filter size={14} className="text-slate-400 mr-1" />
            {[
              { id: 'all', label: 'Semua Status' },
              { id: 'pending', label: 'Menunggu Konfirmasi' },
              { id: 'confirmed', label: 'Sudah Diberi Akses' },
              { id: 'rejected', label: 'Ditolak' }
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterStatus(f.id)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  filterStatus === f.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : isLight
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    : 'bg-[#1D1D24] text-zinc-400 hover:bg-[#25252E]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Table & Detail View Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols): Table */}
          <div className="lg:col-span-8">
            <div className={`rounded-2xl border overflow-hidden shadow-sm ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#141417] border-[#24242A]'
            }`}>
              <div className="p-4 border-b border-slate-100 dark:border-[#222228] flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Daftar Transaksi ({filteredOrders.length})
                </h3>
                <span className="text-[11px] text-slate-400">Pilih baris untuk melihat detail & atur role</span>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="p-12 text-center text-slate-400 text-xs">
                  {isLoading ? 'Memuat data pesanan...' : 'Tidak ada data pesanan yang cocok.'}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className={`border-b text-[11px] uppercase tracking-wider font-semibold ${
                      isLight ? 'bg-slate-50 text-slate-500 border-slate-200' : 'bg-[#18181D] text-zinc-400 border-[#24242A]'
                    }`}>
                      <tr>
                        <th className="py-3 px-4">Invoice / Tanggal</th>
                        <th className="py-3 px-4">Pelanggan</th>
                        <th className="py-3 px-4">Paket Role</th>
                        <th className="py-3 px-4">Total</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#202026]">
                      {filteredOrders.map((ord) => {
                        const isSelected = selectedOrder?.orderId === ord.orderId;
                        return (
                          <tr
                            key={ord.orderId}
                            onClick={() => setSelectedOrder(ord)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? isLight
                                  ? 'bg-indigo-50/70 font-semibold'
                                  : 'bg-indigo-500/10 font-semibold'
                                : isLight
                                ? 'hover:bg-slate-50'
                                : 'hover:bg-[#1A1A20]'
                            }`}
                          >
                            <td className="py-3 px-4">
                              <p className="font-mono font-bold text-amber-500">{ord.orderId}</p>
                              <p className="text-[10px] text-slate-400">
                                {ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('id-ID') : '-'}
                              </p>
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-bold">{ord.name}</p>
                              <p className="text-[11px] text-slate-400">{ord.email}</p>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                ord.plan === 'Team'
                                  ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400'
                                  : ord.plan === 'Pro'
                                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                  : 'bg-slate-200 text-slate-700'
                              }`}>
                                {ord.plan}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono font-semibold">
                              Rp {(Number(ord.amount) || 0).toLocaleString('id-ID')}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                ord.status === 'confirmed'
                                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                  : ord.status === 'rejected'
                                  ? 'bg-rose-500/15 text-rose-500'
                                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400 animate-pulse'
                              }`}>
                                {ord.status === 'confirmed' && <CheckCircle2 size={11} />}
                                {ord.status === 'rejected' && <XCircle size={11} />}
                                {ord.status === 'pending' && <Clock size={11} />}
                                <span>{ord.status}</span>
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrder(ord);
                                }}
                                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-[#2A2A33] text-slate-400 hover:text-white"
                              >
                                <ChevronRight size={15} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (4 cols): Order Detail & RBAC Control Drawer */}
          <div className="lg:col-span-4 space-y-4">
            {selectedOrder ? (
              <div className={`p-6 rounded-2xl border shadow-sm space-y-5 sticky top-20 ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#141417] border-[#24242A]'
              }`}>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#222228]">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Detail Transaksi</span>
                    <h3 className="text-base font-extrabold text-amber-500 font-mono">{selectedOrder.orderId}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    selectedOrder.status === 'confirmed'
                      ? 'bg-emerald-500/15 text-emerald-500'
                      : 'bg-amber-500/15 text-amber-500'
                  }`}>
                    {selectedOrder.status}
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <p className="text-slate-400 text-[11px]">Nama Pembeli</p>
                    <p className="font-bold text-sm">{selectedOrder.name}</p>
                  </div>

                  <div>
                    <p className="text-slate-400 text-[11px]">Alamat Email</p>
                    <p className="font-mono font-medium flex items-center gap-1.5 text-indigo-500">
                      <Mail size={13} /> {selectedOrder.email}
                    </p>
                  </div>

                  {selectedOrder.phone && (
                    <div>
                      <p className="text-slate-400 text-[11px]">WhatsApp / No. HP</p>
                      <a
                        href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono font-medium flex items-center gap-1.5 text-emerald-500 hover:underline"
                      >
                        <Phone size={13} /> {selectedOrder.phone}
                      </a>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-[#222228]">
                    <div>
                      <p className="text-slate-400 text-[11px]">Paket</p>
                      <p className="font-bold">{selectedOrder.plan}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[11px]">Siklus</p>
                      <p className="font-bold">{selectedOrder.billingCycle || 'Bulanan'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[11px]">Metode Bayar</p>
                      <p className="font-bold uppercase">{selectedOrder.paymentMethod || 'QRIS'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[11px]">Total Tagihan</p>
                      <p className="font-mono font-bold text-amber-500">
                        Rp {(Number(selectedOrder.amount) || 0).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* RBAC Action Button Center */}
                <div className="pt-3 border-t border-slate-100 dark:border-[#222228] space-y-2.5">
                  <p className="text-xs font-bold text-slate-700 dark:text-zinc-200">
                    Otoritas Akses & Role (RBAC)
                  </p>

                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.orderId, 'confirmed')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer active:scale-98"
                  >
                    <CheckCircle2 size={15} />
                    <span>Konfirmasi Pembayaran & Berikan Akses ({selectedOrder.plan})</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.orderId, 'rejected')}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-semibold text-xs border border-rose-500/30 transition-all cursor-pointer"
                  >
                    <XCircle size={15} />
                    <span>Tolak Transaksi / Batalkan Akses</span>
                  </button>

                  <button
                    onClick={() => downloadInvoice(selectedOrder, settings)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
                  >
                    <Download size={14} />
                    <span>Unduh / Cetak Invoice Resmi</span>
                  </button>

                  <a
                    href={`https://wa.me/6285820004069?text=${encodeURIComponent(
                      `Halo Admin, status verifikasi pesanan ${selectedOrder.orderId} atas nama ${selectedOrder.name} (${selectedOrder.email}) telah diproses ke paket ${selectedOrder.plan}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-slate-200 dark:border-[#2B2B33] text-xs font-medium text-slate-600 dark:text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    <Send size={13} />
                    <span>Kirim Notifikasi via WhatsApp Admin</span>
                  </a>

                  {selectedOrder.phone && (
                    <a
                      href={`https://wa.me/${selectedOrder.phone.replace(/[^0-9]/g, '').replace(/^0/, '62')}?text=${encodeURIComponent(
                        `Halo Kak ${selectedOrder.name},\n\nKami dari Tim Orvian ingin mengingatkan bahwa masa aktif langganan Paket ${selectedOrder.plan} Anda akan segera berakhir. Anda dapat memperpanjang paket sekarang untuk menjaga seluruh fitur (Google Calendar sync, unlimited project) tetap berjalan lancar.\n\nPerpanjang sekarang melalui link dashboard Orvian Anda.\nTerima kasih!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold transition-all cursor-pointer"
                    >
                      <Send size={13} />
                      <span>Kirim WhatsApp Reminder ke Pelanggan</span>
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <div className={`p-8 rounded-2xl border text-center space-y-3 ${
                isLight ? 'bg-white border-slate-200' : 'bg-[#141417] border-[#24242A]'
              }`}>
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#1E1E24] text-slate-400 flex items-center justify-center mx-auto">
                  <SlidersHorizontal size={20} />
                </div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-zinc-300">Belum Ada Pesanan Dipilih</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Pilih salah satu baris invoice di tabel sebelah kiri untuk memvalidasi bukti pembayaran, mengatur status akun, dan mengonfirmasi hak akses role paket ke database.
                </p>
              </div>
            )}
          </div>
        </div>
        </>
        )}

        {/* Tab 2: Settings (Custom QRIS & Template Invoice) */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
            {/* Header description */}
            <div className={`p-6 rounded-2xl border space-y-2 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#141417] border-[#24242A]'
            }`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-500 flex items-center justify-center">
                  <QrCode size={18} />
                </div>
                <h3 className={`text-base font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  Pengaturan Kustomisasi QRIS & Template Invoice
                </h3>
              </div>
              <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                Setiap perubahan yang Anda simpan di sini akan disinkronkan ke tabel database Supabase dan langsung diaplikasikan ke halaman Checkout Pembayaran serta file download PDF Invoice pelanggan.
              </p>
            </div>

            {/* QRIS Settings Card */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#141417] border-[#24242A]'
            }`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                isLight ? 'text-slate-900' : 'text-zinc-200'
              }`}>
                <span>1. Konfigurasi Kode QRIS Pembayaran</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                      Link / URL Gambar QRIS Kustom (Opsional)
                    </label>
                    <input
                      type="url"
                      value={settings.qrisImageUrl || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, qrisImageUrl: e.target.value }))}
                      placeholder="https://contoh-link-gambar-qris-anda.jpg"
                      className={`w-full px-3 py-2.5 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#1B1B20] border-[#2B2B32] text-white'
                      }`}
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Jika Anda memiliki barcode QRIS resmi dari BCA/GoPay/Dana/ShopeePay, masukkan URL gambarnya di sini.
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                      Payload QRIS / Data QR
                    </label>
                    <textarea
                      rows={4}
                      value={settings.qrisRawPayload || ''}
                      onChange={(e) => setSettings(prev => ({ ...prev, qrisRawPayload: e.target.value }))}
                      placeholder="00020101021226..."
                      className={`w-full px-3 py-2 rounded-lg border text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#1B1B20] border-[#2B2B32] text-white'
                      }`}
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Data string standar QRIS EMVCo. Digunakan untuk men-generate barcode QR otomatis jika URL gambar kosong.
                    </p>
                  </div>
                </div>

                {/* QRIS Preview Box */}
                <div className={`p-4 rounded-xl border text-center space-y-2 ${
                  isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#1A1A20] border-[#26262F]'
                }`}>
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Preview Tampilan QRIS</p>
                  <div className="inline-block p-3 rounded-xl bg-white border border-slate-300 shadow-md">
                    <img
                      src={
                        settings.qrisImageUrl ||
                        `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                          settings.qrisRawPayload || 'ProjectFlow-QRIS-Sample'
                        )}`
                      }
                      alt="Preview QRIS"
                      className="w-36 h-36 mx-auto rounded object-contain"
                    />
                  </div>
                  <p className="text-[10px] text-emerald-500 font-semibold">
                    {settings.qrisImageUrl ? '✓ Menggunakan Gambar Custom' : '✓ Menggunakan Auto-Generated QRIS'}
                  </p>
                </div>
              </div>
            </div>

            {/* Virtual Account Bank Configuration Card */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#141417] border-[#24242A]'
            }`}>
              <div className="flex items-center justify-between">
                <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                  isLight ? 'text-slate-900' : 'text-zinc-200'
                }`}>
                  <Building2 size={16} className="text-amber-500" />
                  <span>2. Konfigurasi Virtual Account Bank (Pembayaran)</span>
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                  Transfer Bank / VA
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                    Nama Bank / Jenis VA
                  </label>
                  <input
                    type="text"
                    value={settings.bankName || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, bankName: e.target.value }))}
                    placeholder="Contoh: BCA (Bank Central Asia)"
                    className={`w-full px-3 py-2.5 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#1B1B20] border-[#2B2B32] text-white'
                    }`}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Misal: BCA Virtual Account, Mandiri, BRI, atau BNI.
                  </p>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                    Nomor Virtual Account / Rekening
                  </label>
                  <input
                    type="text"
                    value={settings.bankVaNumber || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, bankVaNumber: e.target.value }))}
                    placeholder="Contoh: 80777 0812 3456 7890"
                    className={`w-full px-3 py-2.5 rounded-lg border text-xs font-mono font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#1B1B20] border-[#2B2B32] text-white'
                    }`}
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Nomor rekening/VA yang akan disalin oleh pelanggan saat checkout.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                    Atas Nama Rekening (Account Holder)
                  </label>
                  <input
                    type="text"
                    value={settings.bankAccountHolder || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, bankAccountHolder: e.target.value }))}
                    placeholder="Contoh: PT ORVIAN KREASI DIGITAL"
                    className={`w-full px-3 py-2.5 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#1B1B20] border-[#2B2B32] text-white'
                    }`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                    Petunjuk Pembayaran Pelanggan
                  </label>
                  <textarea
                    rows={2}
                    value={settings.bankInstructions || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, bankInstructions: e.target.value }))}
                    placeholder="Lakukan pembayaran melalui ATM, m-BCA, atau KlikBCA..."
                    className={`w-full px-3 py-2 rounded-lg border text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-[#1B1B20] border-[#2B2B32] text-white'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Invoice Template Settings Card */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isLight ? 'bg-white border-slate-200 shadow-xs' : 'bg-[#141417] border-[#24242A]'
            }`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                isLight ? 'text-slate-900' : 'text-zinc-200'
              }`}>
                <span>3. Identitas Brand & Template Invoice</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                    Nama Usaha / Brand
                  </label>
                  <input
                    type="text"
                    value={settings.companyName || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, companyName: e.target.value }))}
                    className={`w-full px-3 py-2.5 rounded-lg border text-xs ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#1B1B20] border-[#2B2B32] text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                    Slogan / Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.companyTagline || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, companyTagline: e.target.value }))}
                    className={`w-full px-3 py-2.5 rounded-lg border text-xs ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#1B1B20] border-[#2B2B32] text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                    Email Kontak / Billing
                  </label>
                  <input
                    type="email"
                    value={settings.companyEmail || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, companyEmail: e.target.value }))}
                    className={`w-full px-3 py-2.5 rounded-lg border text-xs ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#1B1B20] border-[#2B2B32] text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                    Nomor WhatsApp / CS
                  </label>
                  <input
                    type="text"
                    value={settings.companyPhone || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, companyPhone: e.target.value }))}
                    className={`w-full px-3 py-2.5 rounded-lg border text-xs ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#1B1B20] border-[#2B2B32] text-white'
                    }`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                    Alamat Kantor / Domisili Usaha
                  </label>
                  <input
                    type="text"
                    value={settings.companyAddress || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, companyAddress: e.target.value }))}
                    className={`w-full px-3 py-2.5 rounded-lg border text-xs ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#1B1B20] border-[#2B2B32] text-white'
                    }`}
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-zinc-300">
                    Catatan Kaki Invoice (Terms & Warranty)
                  </label>
                  <textarea
                    rows={2}
                    value={settings.footerNotes || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, footerNotes: e.target.value }))}
                    className={`w-full px-3 py-2 rounded-lg border text-xs ${
                      isLight ? 'bg-slate-50 border-slate-300' : 'bg-[#1B1B20] border-[#2B2B32] text-white'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Submit Save Button */}
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer active:scale-98"
              >
                <Save size={16} />
                <span>{isSavingSettings ? 'Menyimpan ke Supabase...' : 'Simpan Semua Pengaturan ke Supabase'}</span>
              </button>

              <button
                type="button"
                onClick={() => downloadInvoice({
                  orderId: 'INV-SAMPLE-DEMO',
                  name: 'Pelanggan Uji Coba',
                  email: 'pelanggan@demo.com',
                  phone: '08123456789',
                  plan: 'Pro Creator',
                  billingCycle: 'monthly',
                  amount: 99000,
                  paymentMethod: 'qris',
                  status: 'confirmed',
                  createdAt: new Date().toISOString()
                }, settings)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                  isLight ? 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300' : 'bg-[#18181D] hover:bg-[#222228] text-zinc-300 border-[#2B2B33]'
                }`}
              >
                <Download size={15} />
                <span>Tes Download Invoice Preview</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
