import React, { useState } from 'react';
import {
  Check,
  Zap,
  Shield,
  Layers,
  ArrowRight,
  Database,
  BarChart2,
  Calendar,
  CheckCircle2,
  Clock,
  Laptop,
  Users,
  Star,
  ChevronDown,
  Sparkles,
  Play,
  CheckSquare,
  Target,
  Flame,
  Activity
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';

export default function LandingPageView() {
  const { setCurrentView, currentPlan, changePlan, startCheckout, theme, user } = useStorage();
  const isLight = theme === 'light';
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [faqOpen, setFaqOpen] = useState(null);
  const [paymentModalPlan, setPaymentModalPlan] = useState(null);

  const plans = [
    {
      id: 'Starter',
      name: 'Starter',
      badge: 'Solopreneur / Pelajar',
      priceMonthly: 0,
      priceYearly: 0,
      description: 'Solusi esensial untuk manajemen tugas harian dan tracking habit individu.',
      popular: false,
      features: [
        'Hingga 2 Proyek Aktif',
        'Kanban & List Tugas (Maks. 10 Tugas Aktif)',
        'Pelacak Rutinitas (Maks. 2 Habit Harian)',
        'Tanpa Akses Halaman Kalender (Khusus Pro)',
        'Penyimpanan Lokal Browser Otomatis',
        'Dukungan Komunitas'
      ],
      ctaText: 'Mulai Gratis',
      highlightBorder: 'border-slate-300 dark:border-zinc-800'
    },
    {
      id: 'Pro',
      name: 'Pro',
      badge: 'Paling Populer',
      priceMonthly: 99000,
      promoMonthly: 50000,
      priceYearly: 79000,
      promoYearly: 49000,
      description: 'Untuk freelancer, kreator, dan profesional yang butuh kendali penuh atas proyek dan jadwal.',
      popular: true,
      features: [
        'Proyek & Milestone Tanpa Batas',
        'Kalender Real-time & Sinkron Google Calendar',
        'Ekspor Catatan ke Dokumen Word (.docx) & PDF',
        'Sinkronisasi Otomatis Antar Perangkat',
        'Target / OKR & Habit Gamified',
        'Pelacak Agenda Rapat & Sesi Deep Work',
        'Command Palette Keyboard Shortcut (Ctrl+K)',
        'Analitik Produktivitas Komprehensif',
        'Ekspor Cadangan Data (JSON)',
        'Dukungan Prioritas 24/7'
      ],
      ctaText: 'Pilih Paket Pro',
      highlightBorder: 'border-amber-500 shadow-amber-500/10 shadow-lg'
    },
    {
      id: 'Team',
      name: 'Team / Business',
      badge: 'Kolaborasi Tim',
      priceMonthly: 249000,
      priceYearly: 199000,
      description: 'Skalakan efisiensi tim, delegasi tugas lintas proyek, dan koordinasi kerja kolaboratif.',
      popular: false,
      features: [
        'Semua Fitur Paket Pro',
        'Kolaborasi Multi-user & Akses Tim',
        'Ruang Kerja Khusus & Kustomisasi Alur Kerja',
        'Manajemen Role & Hak Akses Proyek',
        'Audit Log Aktivitas Workspace',
        'Sesi Onboarding VIP & Bantuan Setup Khusus',
        'SLA 99.9% Uptime Jaminan'
      ],
      ctaText: 'Hubungi Tim Sales',
      highlightBorder: 'border-indigo-500/50'
    }
  ];

  const faqs = [
    {
      q: 'Apa itu Orvian dan apa saja perlengkapan manajemen proyek yang disediakan?',
      a: 'Orvian adalah sistem perlengkapan manajemen proyek lengkap yang mencakup Kanban boards, pelacak milestone & sprint, kalender deadline, agenda rapat, catatan kerja, hingga analitik performa tim dalam satu ruang kerja terpadu.'
    },
    {
      q: 'Bagaimana Orvian membantu mengelola banyak proyek sekaligus?',
      a: 'Anda dapat mengelompokkan proyek berdasarkan prioritas, status progres, dan tim. Dilengkapi dengan filter pencarian cepat (Command Palette Ctrl+K) serta tampilan visual yang memudahkan pemantauan setiap milestone.'
    },
    {
      q: 'Apakah saya bisa berkolaborasi dan membagi tugas dengan tim?',
      a: 'Tentu. Paket kolaborasi mendukung pembagian role, delegasi tugas lintas proyek, pengaturan hak akses, serta pelacakan aktivitas kerja bersama secara terstruktur.'
    },
    {
      q: 'Apakah ada batasan proyek pada paket gratis?',
      a: 'Paket Starter gratis memungkinkan Anda mengelola hingga 2 proyek aktif, papan Kanban, dan pelacakan rutinitas harian tanpa batas waktu penggunaan.'
    }
  ];

  const handleSelectPlan = (plan) => {
    if (plan.id === 'Starter') {
      // Must sign in / sign up before entering free starter workspace
      setCurrentView('auth');
    } else {
      let price = billingCycle === 'monthly' ? (plan.promoMonthly || plan.priceMonthly) : (plan.promoYearly || plan.priceYearly);
      startCheckout(plan.id, billingCycle, price);
    }
  };

  return (
    <div className={`space-y-24 py-6 relative overflow-hidden ${isLight ? 'landing-bg-light' : 'landing-bg-dark'}`}>
      {/* ── Decorative Glow Orbs ── */}
      <div className="glow-amber w-[600px] h-[400px] -top-32 left-1/2 -translate-x-1/2 -z-10" />
      <div className="glow-indigo w-[400px] h-[400px] top-[40%] -right-24 -z-10" />
      <div className="glow-emerald w-[350px] h-[350px] top-[70%] -left-20 -z-10" />

      {/* Hero Section */}
      <section className="text-center max-w-5xl mx-auto space-y-7 pt-12 sm:pt-16 relative">
        {/* Dynamic Bold Typography */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.12]">
          Satu Ruang Kerja untuk <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600">
            Setiap Ambisi Besar Anda
          </span>
        </h1>

        <p className={`text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal ${isLight ? 'text-slate-600' : 'text-zinc-400'
          }`}>
          Tingkatkan produktivitas harian hingga 3x lipat dengan workspace terintegrasi. Portofolio proyek visual, ritme habit harian, kalender Google Sync, dan target OKR dalam satu ekosistem cepat.
        </p>

        {/* CTA Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={() => setCurrentView(user ? 'home' : 'auth')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 py-3.5 px-8 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-black text-sm shadow-xl shadow-amber-500/25 transition-all cursor-pointer active:scale-95 hover:shadow-amber-500/40"
          >
            <span>{user ? 'Buka Dashboard Anda' : 'Mulai Gratis Sekarang'}</span>
            <ArrowRight size={16} />
          </button>

          <a
            href="#pricing"
            className={`w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold border transition-all text-center ${isLight
              ? 'bg-white/80 hover:bg-white text-slate-700 border-slate-300 shadow-xs backdrop-blur-sm'
              : 'bg-white/5 hover:bg-white/10 text-zinc-200 border-white/10 backdrop-blur-sm'
              }`}
          >
            Eksplorasi Paket & Harga
          </a>
        </div>

        {/* Social Proof Avatars */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
          <div className="flex -space-x-2">
            {['T', 'K', 'A', 'M', 'R'].map((char, i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-full border-2 ${isLight ? 'border-white' : 'border-[#0B0B0D]'
                  } text-[10px] font-bold text-white flex items-center justify-center shadow-xs ${['bg-amber-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-sky-500'][i]
                  }`}
              >
                {char}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex text-amber-500 text-xs">
              {'★★★★★'.split('').map((s, idx) => (
                <span key={idx}>{s}</span>
              ))}
            </div>
            <span className={isLight ? 'text-slate-600 font-medium' : 'text-zinc-400'}>
              Dipercaya <strong className={isLight ? 'text-slate-900' : 'text-white'}>500+</strong> kreator & tim produktif
            </span>
          </div>
        </div>

        {/* ── Interactive SaaS App Preview Showcase Frame ── */}
        <div className="pt-6 relative max-w-4xl mx-auto">
          {/* Subtle Ambient Glow Behind Device Frame */}
          <div className="absolute inset-x-8 top-10 h-64 bg-gradient-to-r from-amber-500/20 via-orange-500/15 to-indigo-500/20 blur-3xl -z-10 rounded-full" />

          {/* Device Mockup Window */}
          <div className={`rounded-2xl border text-left overflow-hidden shadow-2xl backdrop-blur-xl transition-all ${isLight
            ? 'bg-white/95 border-slate-200/90 shadow-slate-200/60 ring-1 ring-black/5'
            : 'bg-[#121216]/95 border-white/10 shadow-black/80 ring-1 ring-white/5'
            }`}>
            {/* Window Topbar */}
            <div className={`px-4 py-3 border-b flex items-center justify-between text-xs ${isLight ? 'bg-slate-50/90 border-slate-200' : 'bg-[#16161B] border-white/5'
              }`}>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className={`ml-2 font-mono text-[11px] font-semibold ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                  app.orvian.id/workspace
                </span>
              </div>
            </div>

            {/* Inner Dashboard Preview Content */}
            <div className="p-4 sm:p-6 space-y-4">
              {/* Mini Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50/60 border-slate-200' : 'bg-white/[0.02] border-white/5'}`}>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Active Projects</p>
                  <p className="text-xl font-black mt-0.5">8 Proyek</p>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50/60 border-slate-200' : 'bg-white/[0.02] border-white/5'}`}>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Tasks Completed</p>
                  <p className="text-xl font-black mt-0.5 text-emerald-500">89% Selesai</p>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50/60 border-slate-200' : 'bg-white/[0.02] border-white/5'}`}>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Habit Streak</p>
                  <p className="text-xl font-black mt-0.5 text-amber-500">🔥 24 Hari</p>
                </div>
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-slate-50/60 border-slate-200' : 'bg-white/[0.02] border-white/5'}`}>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Google Sync</p>
                  <p className="text-xl font-black mt-0.5 text-indigo-500">Connected</p>
                </div>
              </div>

              {/* Mini Kanban Columns Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Col 1 */}
                <div className={`p-3 rounded-xl border space-y-2.5 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#18181E] border-white/5'}`}>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <span className="w-2 h-2 rounded-full bg-slate-400" /> Ready to Start
                    </span>
                    <span className="text-[10px] text-slate-400">2</span>
                  </div>
                  <div className={`p-2.5 rounded-lg border text-xs space-y-1 shadow-2xs ${isLight ? 'bg-white border-slate-200' : 'bg-[#202026] border-white/5'}`}>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-500 font-bold uppercase">UI Design</span>
                    <p className="font-semibold text-[11px] leading-tight">Revamp Landing Page Hero Section</p>
                  </div>
                </div>

                {/* Col 2 */}
                <div className={`p-3 rounded-xl border space-y-2.5 ${isLight ? 'bg-amber-50/40 border-amber-200' : 'bg-[#18181E] border-amber-500/20'}`}>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-amber-500">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> In Progress
                    </span>
                    <span className="text-[10px] text-amber-500 font-mono">1</span>
                  </div>
                  <div className={`p-2.5 rounded-lg border text-xs space-y-1 shadow-2xs ${isLight ? 'bg-white border-amber-200' : 'bg-[#202026] border-amber-500/30'}`}>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/15 text-indigo-400 font-bold uppercase">Database</span>
                    <p className="font-semibold text-[11px] leading-tight">Integrasi Google OAuth & Invoice QRIS</p>
                  </div>
                </div>

                {/* Col 3 */}
                <div className={`p-3 rounded-xl border space-y-2.5 ${isLight ? 'bg-emerald-50/40 border-emerald-200' : 'bg-[#18181E] border-emerald-500/20'}`}>
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-emerald-500">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed
                    </span>
                    <span className="text-[10px] text-emerald-500 font-mono">12</span>
                  </div>
                  <div className={`p-2.5 rounded-lg border text-xs space-y-1 shadow-2xs ${isLight ? 'bg-white border-emerald-200' : 'bg-[#202026] border-emerald-500/30'}`}>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-500 font-bold uppercase">Security</span>
                    <p className="font-semibold text-[11px] leading-tight">Supabase RLS & Clean Slate Storage</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Feature Showcase Grid: 6 Pillars of Product Value */}
      <section id="fitur" className="space-y-10 scroll-mt-20 relative">
        <div className="glow-amber w-[350px] h-[250px] top-0 left-1/2 -translate-x-1/2 opacity-40 pointer-events-none" style={{ position: 'absolute', zIndex: 0 }} />

        <div className="text-center max-w-3xl mx-auto space-y-3 relative">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Mengapa Memilih Orvian Dibanding Tool Produktivitas Lain?
          </h2>
          <p className={`text-sm sm:text-base leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
            Bukan sekadar to-do list biasa yang mudah ditinggalkan. Orvian dirancang sebagai <strong className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>Executive Life &amp; Project OS</strong> yang menghubungkan visi besar Anda dengan eksekusi harian secara nyata.
          </p>
        </div>

        {/* 6 Value Plus Cards with elevated solid background and clear breathing room */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {/* 1. All-in-One Unified Space */}
          <div className={`p-7 rounded-2xl border space-y-4 transition-all duration-200 hover:-translate-y-1.5 ${isLight
            ? 'bg-white border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)]'
            : 'bg-[#15151A] border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:border-amber-500/40'
            }`}>
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-500 flex items-center justify-center font-bold">
              <Layers size={22} />
            </div>
            <h3 className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              1. Satukan Seluruh Alur Kerja (All-In-One)
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
              Hentikan kebiasaan berganti 4–5 aplikasi terpisah (Trello, Notion, Habit Tracker, Kalender). Di Orvian, proyek, tugas, habit, dokumen, dan kalender tersinkron dalam satu dasbor terpadu.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-amber-500">
              <CheckCircle2 size={14} /> Efisiensi waktu hingga 3x lipat
            </div>
          </div>

          {/* 2. Visual Kanban & Sprint Prioritization */}
          <div className={`p-7 rounded-2xl border space-y-4 transition-all duration-200 hover:-translate-y-1.5 ${isLight
            ? 'bg-white border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)]'
            : 'bg-[#15151A] border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:border-emerald-500/40'
            }`}>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 flex items-center justify-center font-bold">
              <CheckSquare size={22} />
            </div>
            <h3 className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              2. Manajemen Proyek Kanban & Agile
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
              Pindahkan tugas secara fleksibel (<span className="italic">Ready to Start, In Progress, Review, Done</span>), lengkapi dengan deadline, tags warna, tingkat prioritas (<span className="italic">Urgent/Medium/Low</span>), dan sub-tugas detail.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-emerald-500">
              <CheckCircle2 size={14} /> Pantau kemajuan sprint seketika
            </div>
          </div>

          {/* 3. Gamified Habit Tracking */}
          <div className={`p-7 rounded-2xl border space-y-4 transition-all duration-200 hover:-translate-y-1.5 ${isLight
            ? 'bg-white border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)]'
            : 'bg-[#15151A] border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:border-orange-500/40'
            }`}>
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/25 text-orange-500 flex items-center justify-center font-bold">
              <Flame size={22} />
            </div>
            <h3 className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              3. Pelacak Kebiasaan & Streak Gamifikasi
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
              Bentuk rutinitas positif tanpa putus dengan sistem heatmap bulanan interaktif, penghitung rekor konsistensi (<span className="italic">streak</span>), dan checklist rutinitas harian yang memotivasi setiap pagi.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-orange-500">
              <CheckCircle2 size={14} /> Hindari prokrastinasi harian
            </div>
          </div>

          {/* 4. Ekspor Dokumen Resmi (PDF & DOCX) */}
          <div className={`p-7 rounded-2xl border space-y-4 transition-all duration-200 hover:-translate-y-1.5 ${isLight
            ? 'bg-white border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)]'
            : 'bg-[#15151A] border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:border-indigo-500/40'
            }`}>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-500 flex items-center justify-center font-bold">
              <Database size={22} />
            </div>
            <h3 className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              4. Ekstraksi Dokumen & Ekspor Instan (PDF & DOCX)
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
              Ubah catatan braindump, laporan sprint, dan brief proyek menjadi dokumen rapi siap cetak dan siap bagikan dalam format Microsoft Word (.docx) serta PDF berkualitas tinggi.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-indigo-400">
              <CheckCircle2 size={14} /> Ekspor 1-Klik ke PDF & DOCX
            </div>
          </div>

          {/* 5. Sinkronisasi Kalender & Agenda */}
          <div className={`p-7 rounded-2xl border space-y-4 transition-all duration-200 hover:-translate-y-1.5 ${isLight
            ? 'bg-white border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)]'
            : 'bg-[#15151A] border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:border-sky-500/40'
            }`}>
            <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/25 text-sky-400 flex items-center justify-center font-bold">
              <Calendar size={22} />
            </div>
            <h3 className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              5. Kalender Agenda & Google Calendar Sync
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
              Jadwalkan rapat, sesi deep work, dan deadline proyek dengan presisi. Dilengkapi fitur unduh file (.ics) otomatis yang langsung tersinkron masuk ke Google Calendar di HP & Laptop Anda.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-sky-400">
              <CheckCircle2 size={14} /> Sinkronisasi Otomatis Google Calendar
            </div>
          </div>

          {/* 6. Measurable Analytics & Invoice System */}
          <div className={`p-7 rounded-2xl border space-y-4 transition-all duration-200 hover:-translate-y-1.5 ${isLight
            ? 'bg-white border-slate-200/90 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgb(0,0,0,0.08)]'
            : 'bg-[#15151A] border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.3)] hover:border-purple-500/40'
            }`}>
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-400 flex items-center justify-center font-bold">
              <BarChart2 size={22} />
            </div>
            <h3 className={`text-base font-bold tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              6. Analitik Performa & Invoice Generator Otomatis
            </h3>
            <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
              Pantau rasio penyelesaian tugas dan produktivitas mingguan dalam grafik visual. Dilengkapi generator invoice resmi siap unduh PDF dan pembayaran QRIS instan.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-[11px] font-bold text-purple-400">
              <CheckCircle2 size={14} /> Evaluasi objektif setiap akhir pekan
            </div>
          </div>
        </div>

        {/* ── Visual Comparison: Tanpa Orvian vs Menggunakan Orvian ── */}
        <div className={`mt-14 max-w-5xl mx-auto rounded-3xl border p-7 sm:p-10 ${isLight
          ? 'bg-white border-slate-200 shadow-[0_10px_35px_rgb(0,0,0,0.05)]'
          : 'bg-[#141418] border-white/10 shadow-[0_10px_35px_rgb(0,0,0,0.4)]'
          }`}>
          <div className="text-center max-w-xl mx-auto mb-8">
            <h3 className={`text-2xl sm:text-3xl font-black mt-2.5 tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Mengapa Beralih ke Orvian?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* Box Tanpa Orvian */}
            <div className={`p-6 rounded-2xl border space-y-4 flex flex-col justify-between ${isLight ? 'bg-rose-50/40 border-rose-200 text-slate-800' : 'bg-rose-950/25 border-rose-900/40 text-zinc-100'
              }`}>
              <div>
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-3">
                  <span className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center text-xs text-rose-300">✕</span>
                  <span className="text-rose-400 font-extrabold">Cara Lama Tanpa Orvian</span>
                </div>
                <ul className={`space-y-3 text-xs leading-relaxed ${isLight ? 'text-slate-700' : 'text-zinc-200'}`}>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-400 font-bold shrink-0">•</span>
                    <span>Tugas tersebar di chat WhatsApp, sticky note meja, dan berbagai spreadsheet yang tercecer.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-400 font-bold shrink-0">•</span>
                    <span>Sering terdistraksi dan lupa deadline penting karena tidak ada prioritas visual yang jelas.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-400 font-bold shrink-0">•</span>
                    <span>Habit tracking sering bolong setelah 3 hari karena tidak ada motivasi gamifikasi & streak.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-400 font-bold shrink-0">•</span>
                    <span>Biaya langganan terpisah-pisah untuk to-do list, calendar app, dan note-taking berbiaya mahal.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Box Dengan Orvian */}
            <div className={`p-6 rounded-2xl border space-y-4 flex flex-col justify-between ${isLight ? 'bg-emerald-50/50 border-emerald-300 text-slate-900' : 'bg-emerald-950/30 border-emerald-800/50 text-white'
              }`}>
              <div>
                <div className="flex items-center gap-2 font-bold text-sm mb-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs text-emerald-400">✓</span>
                  <span className="text-emerald-400 font-extrabold">Dengan Sistem Terpadu Orvian</span>
                </div>
                <ul className={`space-y-3 text-xs leading-relaxed font-medium ${isLight ? 'text-slate-800' : 'text-zinc-100'}`}>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold shrink-0 text-sm">✓</span>
                    <span>Semua proyek, tugas harian, catatan dokumen, dan kalender tersinkron rapi dalam 1 layar.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold shrink-0 text-sm">✓</span>
                    <span>Fokus tajam dengan board Kanban drag-and-drop dan filter prioritas tinggi (Urgent/Medium).</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold shrink-0 text-sm">✓</span>
                    <span>Rutinitas konsisten dengan heatmap otomatis, streak harian, dan notifikasi pencapaian target.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold shrink-0 text-sm">✓</span>
                    <span>Hemat biaya, penyimpanan cloud terenkripsi aman, serta akses cepat tanpa jeda (*zero lag*).</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SaaS Pricing Section */}
      <section id="pricing" className="space-y-8 pt-6 relative">
        <div className="glow-indigo w-[500px] h-[300px] top-0 right-0 opacity-60" style={{ position: 'absolute', zIndex: 0 }} />
        <div className="text-center max-w-2xl mx-auto space-y-3 relative">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Pilih Paket Berlangganan Sesuai Kebutuhan Anda
          </h2>
          <p className={`text-sm ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
            Mulai dari paket gratis hingga skala tim bisnis. Fleksibel, tanpa ikatan kontrak jangka panjang.
          </p>

          {/* Billing Switch */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <span className={`text-xs font-semibold ${billingCycle === 'monthly' ? 'text-amber-500' : 'text-slate-400'}`}>
              Bulanan
            </span>
            <button
              onClick={() => setBillingCycle(b => b === 'monthly' ? 'yearly' : 'monthly')}
              className={`w-12 h-6 rounded-md p-1 border transition-colors flex items-center ${billingCycle === 'yearly' ? 'bg-amber-500 border-amber-600 justify-end' : 'bg-slate-200 dark:bg-zinc-800 border-slate-300 dark:border-zinc-700 justify-start'
                }`}
            >
              <div className="w-4 h-4 rounded-sm bg-white shadow-xs"></div>
            </button>
            <span className={`text-xs font-semibold ${billingCycle === 'yearly' ? 'text-amber-500' : 'text-slate-400'}`}>
              Tahunan (Hemat 20%)
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 max-w-6xl mx-auto items-stretch relative">
          {plans.map((p) => {
            // Only show 'Paket Aktif Saat Ini' if user is currently logged in!
            const isSelected = Boolean(user && currentPlan === p.id);
            const price = billingCycle === 'monthly' ? p.priceMonthly : p.priceYearly;

            return (
              <div
                key={p.id}
                className={`rounded-2xl p-6 sm:p-7 border flex flex-col justify-between transition-all duration-200 relative backdrop-blur-md shadow-xl ${p.highlightBorder
                  } ${isLight ? 'bg-white shadow-slate-200/50' : 'bg-[#15151A] shadow-black/50'
                  } ${p.popular ? 'ring-2 ring-amber-500 scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}
              >
                {p.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500 text-white shadow-lg shadow-amber-500/30">
                    Rekomendasi Utama
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={`text-lg font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                      {p.name}
                    </h3>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${isLight ? 'bg-slate-100 text-slate-700 border-slate-200' : 'bg-[#1E1E24] text-zinc-200 border-[#2A2A32]'
                      }`}>
                      {p.badge}
                    </span>
                  </div>

                  <p className={`text-xs mt-2 min-h-[32px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
                    {p.description}
                  </p>

                  <div className={`mt-4 pb-4 border-b ${isLight ? 'border-slate-100' : 'border-[#222228]'}`}>
                    <div className="flex flex-col gap-1">
                      {p.promoMonthly && (
                        <div className="inline-flex items-center gap-1.5 self-start px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                          🔥 Promo Pembelian Pertama
                        </div>
                      )}
                      <div className="flex items-baseline gap-1.5 flex-wrap">
                        {p.promoMonthly ? (
                          <>
                            <span className={`text-3xl font-extrabold text-amber-500`}>
                              Rp {(billingCycle === 'monthly' ? p.promoMonthly : p.promoYearly).toLocaleString('id-ID')}
                            </span>
                            <span className={`text-sm line-through ${isLight ? 'text-slate-400' : 'text-zinc-500'}`}>
                              Rp {price.toLocaleString('id-ID')}
                            </span>
                          </>
                        ) : (
                          <span className={`text-3xl font-extrabold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                            {price === 0 ? 'Gratis' : `Rp ${price.toLocaleString('id-ID')}`}
                          </span>
                        )}
                        {price > 0 && (
                          <span className={`text-xs font-medium ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                            /bulan
                          </span>
                        )}
                      </div>
                    </div>
                    {billingCycle === 'yearly' && price > 0 && (
                      <p className="text-[10px] text-emerald-400 font-medium mt-1">
                        Ditagih tahunan (hemat 20%)
                      </p>
                    )}
                  </div>

                  <ul className="space-y-2.5 mt-5">
                    {p.features.map((feat, idx) => (
                      <li key={idx} className={`text-xs flex items-start gap-2.5 font-medium ${isLight ? 'text-slate-700' : 'text-zinc-200'}`}>
                        <Check size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 dark:border-[#222228]">
                  <button
                    onClick={() => handleSelectPlan(p)}
                    className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer ${isSelected
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : p.popular
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-emerald-500 hover:to-emerald-600 hover:shadow-emerald-500/25 text-white shadow-md shadow-amber-500/20 active:scale-98'
                        : isLight
                          ? 'bg-slate-100 hover:bg-emerald-500 hover:text-white hover:border-emerald-500 text-slate-800 border border-slate-300 shadow-2xs hover:shadow-emerald-500/20'
                          : 'bg-[#202026] hover:bg-emerald-600 hover:text-white hover:border-emerald-600 text-zinc-100 border border-[#2F2F38] shadow-2xs hover:shadow-emerald-500/20'
                      }`}
                  >
                    {isSelected ? 'Paket Aktif Saat Ini' : p.ctaText}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="max-w-3xl mx-auto space-y-6 scroll-mt-20">
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
            Temukan jawaban seputar fitur, paket langganan, dan alur kerja di Orvian.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = faqOpen === i;
            return (
              <div
                key={i}
                className={`rounded-lg border overflow-hidden transition-all ${isLight ? 'bg-white border-slate-200 shadow-2xs' : 'bg-[#141417] border-[#24242A]'
                  }`}
              >
                <button
                  onClick={() => setFaqOpen(isOpen ? null : i)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180 text-amber-500' : 'text-slate-400'}`}
                  />
                </button>
                {isOpen && (
                  <div className={`px-4 pb-4 text-xs leading-relaxed border-t pt-3 ${isLight ? 'border-slate-100 text-slate-600' : 'border-[#202026] text-zinc-400'
                    }`}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className={`p-8 sm:p-10 rounded-2xl border text-center space-y-4 max-w-4xl mx-auto relative overflow-hidden backdrop-blur-sm ${isLight
        ? 'bg-gradient-to-br from-amber-50 via-white to-orange-50 border-amber-200 shadow-lg shadow-amber-100/50'
        : 'bg-gradient-to-br from-amber-500/10 via-white/[0.03] to-indigo-500/10 border-amber-500/20'
        }`}>
        {/* CTA glow */}
        <div className="glow-amber w-[400px] h-[200px] -top-10 left-1/2 -translate-x-1/2 opacity-60" style={{ position: 'absolute', zIndex: 0 }} />
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight relative">
          Siap Memaksimalkan Alur Kerja Anda Hari Ini?
        </h2>
        <p className={`text-xs sm:text-sm max-w-xl mx-auto relative ${isLight ? 'text-slate-600' : 'text-zinc-400'
          }`}>
          Bergabung bersama ratusan kreator dan tim profesional yang mengelola proyek dengan efisiensi tingkat tinggi.
        </p>
        <div className="pt-2 relative">
          <button
            onClick={() => setCurrentView(user ? 'home' : 'auth')}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold px-6 py-3 rounded-lg text-xs shadow-lg shadow-amber-500/30 transition-all active:scale-95 cursor-pointer hover:shadow-amber-500/40"
          >
            <span>{user ? 'Masuk ke Dashboard Sekarang' : 'Daftar & Masuk ke Dashboard'}</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </div>
  );
}
