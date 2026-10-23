import React, { useState, useEffect } from 'react';
import {
  Mail,
  Lock,
  User,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useStorage } from '../context/StorageContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

export default function AuthView() {
  const { loginUser, setCurrentView, changePlan, theme } = useStorage();
  const isLight = theme === 'light';

  const [mode, setMode] = useState('signup');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Listen for Supabase OAuth redirect callback
  useEffect(() => {
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        if (window.location.hash && (window.location.hash.includes('access_token') || window.location.hash.includes('error'))) {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        }
        const u = session.user;
        const userData = {
          name: u.user_metadata?.full_name || u.user_metadata?.name || u.email.split('@')[0],
          email: u.email,
          avatar: u.user_metadata?.avatar_url || '',
          authProvider: u.app_metadata?.provider || 'google',
          registeredAt: u.created_at
        };
        loginUser(userData);
        setSuccessMsg('Login berhasil! Mengalihkan ke dashboard...');
        setTimeout(() => setCurrentView('home'), 400);
      }
    });
    return () => subscription.unsubscribe();
  }, []);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg('');
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMsg('Harap isi semua kolom email dan kata sandi.');
      return;
    }
    if (mode === 'signup' && !formData.name.trim()) {
      setErrorMsg('Nama lengkap wajib diisi untuk pendaftaran.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      if (supabase) {
        if (mode === 'signup') {
          const { error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: { data: { full_name: formData.name } }
          });
          if (error && !error.message.includes('not configured')) console.warn(error.message);
        } else {
          const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password
          });
          if (error && !error.message.includes('not configured')) console.warn(error.message);
        }
      }

      const userData = {
        name: formData.name || formData.email.split('@')[0],
        email: formData.email,
        avatar: '',
        authProvider: 'email',
        registeredAt: new Date().toISOString()
      };

      loginUser(userData);
      changePlan('Starter');
      setSuccessMsg(mode === 'signup' ? 'Akun berhasil dibuat! Mengalihkan...' : 'Berhasil masuk! Mengalihkan...');
      setTimeout(() => setCurrentView('home'), 1200);
    } catch (err) {
      setErrorMsg(err.message || 'Terjadi kesalahan saat otentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!isSupabaseConfigured || !supabase) {
      setErrorMsg('Konfigurasi Supabase belum tersedia. Tambahkan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY di file .env.');
      return;
    }
    setIsGoogleLoading(true);
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: { access_type: 'offline', prompt: 'consent select_account' }
        }
      });
      if (error) throw error;
      // Browser will redirect to Google — no further action needed here
    } catch (err) {
      setErrorMsg(err.message || 'Gagal memulai login Google.');
      setIsGoogleLoading(false);
    }
  };

  const inputClass = `w-full pl-10 pr-4 py-3 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 ${
    isLight
      ? 'bg-white border-slate-200 text-slate-800 placeholder:text-slate-400'
      : 'bg-white/5 border-white/10 text-white placeholder:text-zinc-500'
  }`;

  return (
    <div className="min-h-screen flex antialiased font-sans">

      {/* ── LEFT PANEL: Form ── */}
      <div className={`relative w-full md:w-[52%] flex flex-col ${
        isLight ? 'bg-white' : 'bg-[#0D0D10]'
      }`}>

        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full bg-amber-500/8 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-6 relative">
          <button
            onClick={() => setCurrentView('landing')}
            className={`flex items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
              isLight ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-500 hover:text-white'
            }`}
          >
            <ArrowLeft size={14} />
            Kembali
          </button>
        </div>

        {/* Form Content */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-14 lg:px-20 py-10 max-w-md w-full mx-auto relative">

          {/* Heading */}
          <div className="mb-8">
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight leading-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              {mode === 'signup' ? 'Buat Akun Orvian' : 'Selamat Datang Kembali'}
            </h1>
            <p className={`mt-2 text-sm ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              {mode === 'signup'
                ? 'Mulai gratis, tanpa kartu kredit. Akses penuh workspace manajemen proyek.'
                : 'Masuk untuk melanjutkan ruang kerja dan proyek Anda.'}
            </p>
          </div>

          {/* Mode Toggle */}
          <div className={`flex p-1 rounded-xl mb-6 ${isLight ? 'bg-slate-100' : 'bg-white/5'}`}>
            {['signup', 'signin'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setErrorMsg(''); }}
                className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === m
                    ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/25'
                    : isLight ? 'text-slate-500 hover:text-slate-800' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {m === 'signup' ? 'Daftar Baru' : 'Masuk'}
              </button>
            ))}
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs font-medium flex items-start gap-2">
              <span className="mt-0.5">⚠</span> {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 size={14} className="shrink-0" /> {successMsg}
            </div>
          )}

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading || isGoogleLoading}
            className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer active:scale-98 mb-4 ${
              isLight
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs hover:shadow-sm'
                : 'bg-white/5 hover:bg-white/10 text-zinc-200 border-white/10'
            }`}
          >
            {isGoogleLoading ? (
              <span className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {isGoogleLoading
              ? 'Menghubungkan ke Google...'
              : mode === 'signup'
                ? 'Daftar dengan Google'
                : 'Masuk dengan Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`flex-1 h-px ${isLight ? 'bg-slate-200' : 'bg-white/8'}`} />
            <span className={`text-[11px] font-medium ${isLight ? 'text-slate-400' : 'text-zinc-600'}`}>atau dengan email</span>
            <div className={`flex-1 h-px ${isLight ? 'bg-slate-200' : 'bg-white/8'}`} />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {mode === 'signup' && (
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nama lengkap"
                  className={inputClass}
                />
              </div>
            )}

            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="nama@email.com"
                className={inputClass}
              />
            </div>

            <div className="relative">
              <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Kata sandi"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Memproses...</span></>
              ) : (
                <span>{mode === 'signup' ? 'Buat Akun Gratis' : 'Masuk Sekarang'}</span>
              )}
            </button>
          </form>

          <p className={`text-[11px] text-center mt-5 ${isLight ? 'text-slate-400' : 'text-zinc-600'}`}>
            Dengan mendaftar, Anda menyetujui{' '}
            <span className="underline cursor-pointer hover:text-amber-500 transition-colors">Ketentuan Layanan</span>{' '}
            &amp;{' '}
            <span className="underline cursor-pointer hover:text-amber-500 transition-colors">Kebijakan Privasi</span>{' '}
            Orvian.
          </p>
        </div>
      </div>

      {/* ── RIGHT PANEL: Branding ── */}
      <div className={`hidden md:flex md:w-[48%] relative overflow-hidden border-l ${
        isLight
          ? 'bg-gradient-to-br from-amber-50/50 via-slate-50 to-orange-50/30 border-slate-200'
          : 'bg-gradient-to-br from-[#121217] via-[#0D0D10] to-[#141419] border-white/5'
      }`}>
        {/* Subtle grid and decorative glows */}
        <div className={`absolute inset-0 ${
          isLight
            ? 'bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:32px_32px]'
            : 'bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]'
        }`} />
        <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-amber-500/10 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 rounded-full bg-indigo-500/8 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-center w-full p-12 lg:p-16 max-w-lg mx-auto">
          {/* Center: Headline & Value Proposition */}
          <div className="space-y-6">
            <h2 className={`text-3xl lg:text-4xl xl:text-5xl font-black leading-tight tracking-tight ${
              isLight ? 'text-slate-900' : 'text-white'
            }`}>
              Wujudkan Setiap{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-600">Ambisi</span>{' '}
              dalam Satu Ruang Kerja.
            </h2>

            <p className={`text-sm sm:text-base leading-relaxed ${
              isLight ? 'text-slate-600' : 'text-zinc-400'
            }`}>
              Platform manajemen proyek terpadu untuk solopreneur, tim kreatif, dan profesional ambisius. Kelola task, deadline, dan habit harian dengan alur kerja yang rapi.
            </p>

            {/* Social proof */}
            <div className={`pt-6 border-t flex items-center gap-4 ${
              isLight ? 'border-slate-200/80' : 'border-white/10'
            }`}>
              <div className="flex -space-x-2">
                {['A','B','C','D'].map((l, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full border-2 ${
                    isLight ? 'border-white' : 'border-[#0D0D10]'
                  } flex items-center justify-center text-[11px] font-bold text-white shadow-xs ${
                    ['bg-amber-500','bg-indigo-500','bg-emerald-500','bg-rose-500'][i]
                  }`}>{l}</div>
                ))}
              </div>
              <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>500+</span> tim & kreator sudah bergabung
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
