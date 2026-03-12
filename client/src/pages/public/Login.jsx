import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase,
  Users, Building2, TrendingUp, CheckCircle2, X,
  Loader2, Send, AlertCircle,
} from 'lucide-react';
import jobBg from '../../assets/jobbackground.jpeg';

/* ─────────────────────────────────────────────────────────────────────────────
   Keyframes — identical to original, plus toast / modal additions
───────────────────────────────────────────────────────────────────────────── */
const keyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

  @keyframes slideInLeft {
    from { transform: translateX(-110%); opacity: 0; }
    to   { transform: translateX(0);     opacity: 1; }
  }
  @keyframes slideInRight {
    from { transform: translateX(110%);  opacity: 0; }
    to   { transform: translateX(0);     opacity: 1; }
  }
  @keyframes slideInTop {
    from { transform: translateY(-110%); opacity: 0; }
    to   { transform: translateY(0);     opacity: 1; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes statPop {
    from { opacity: 0; transform: scale(0.85) translateY(12px); }
    to   { opacity: 1; transform: scale(1)    translateY(0); }
  }
  @keyframes toastDrop {
    from { opacity: 0; transform: translateY(-28px) scale(0.94); }
    to   { opacity: 1; transform: translateY(0)     scale(1); }
  }
  @keyframes toastLeave {
    from { opacity: 1; transform: translateY(0)     scale(1); }
    to   { opacity: 0; transform: translateY(-28px) scale(0.94); }
  }
  @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes modalUp {
    from { opacity: 0; transform: translateY(24px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0)    scale(1); }
  }
  @keyframes shrink { from { width: 100%; } to { width: 0%; } }

  /* ── original classes (unchanged) ── */
  .slide-in-left  { animation: slideInLeft  0.85s cubic-bezier(0.22,1,0.36,1) both; }
  .slide-in-right { animation: slideInRight 0.85s cubic-bezier(0.22,1,0.36,1) both; }
  .fade-up        { animation: fadeUp       0.65s 0.45s cubic-bezier(0.22,1,0.36,1) both; }
  .stat-pop-1     { animation: statPop 0.5s 0.55s cubic-bezier(0.34,1.56,0.64,1) both; }
  .stat-pop-2     { animation: statPop 0.5s 0.70s cubic-bezier(0.34,1.56,0.64,1) both; }
  .stat-pop-3     { animation: statPop 0.5s 0.85s cubic-bezier(0.34,1.56,0.64,1) both; }
  .stat-pop-4     { animation: statPop 0.5s 1.00s cubic-bezier(0.34,1.56,0.64,1) both; }

  /* ── new additions ── */
  .toast-enter  { animation: toastDrop  0.38s cubic-bezier(0.34,1.4,0.64,1) both; }
  .toast-leave  { animation: toastLeave 0.28s ease forwards; }
  .overlay-in   { animation: overlayIn  0.2s ease both; }
  .modal-in     { animation: modalUp    0.36s cubic-bezier(0.34,1.2,0.64,1) both; }
  .bar-shrink   { animation: shrink 4.2s linear forwards; }

  @media (max-width: 767px) {
    .slide-in-left, .slide-in-right {
      animation: slideInTop 0.8s cubic-bezier(0.22,1,0.36,1) both !important;
    }
    .fade-up {
      animation: fadeUp 0.6s 0.4s cubic-bezier(0.22,1,0.36,1) both !important;
    }
  }
`;

const STATS = [
  { icon: Briefcase,  value: '85K+', label: 'Active Jobs',    delay: 'stat-pop-1' },
  { icon: Building2,  value: '12K+', label: 'Companies',      delay: 'stat-pop-2' },
  { icon: Users,      value: '2M+',  label: 'Job Seekers',    delay: 'stat-pop-3' },
  { icon: TrendingUp, value: '94%',  label: 'Placement Rate', delay: 'stat-pop-4' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Toast
───────────────────────────────────────────────────────────────────────────── */
const Toast = ({ type, title, message, onClose }) => {
  const [leaving, setLeaving] = useState(false);
  const ok = type === 'success';

  const dismiss = () => {
    setLeaving(true);
    setTimeout(onClose, 290);
  };

  useEffect(() => {
    const t = setTimeout(dismiss, 4300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[300] w-[calc(100%-2rem)] max-w-sm pointer-events-auto ${leaving ? 'toast-leave' : 'toast-enter'}`}>
      <div className={`rounded-2xl overflow-hidden shadow-2xl border bg-white ${ok ? 'border-emerald-200' : 'border-red-200'}`}>
        <div className="flex items-start gap-3 px-4 py-3.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${ok ? 'bg-emerald-100' : 'bg-red-50'}`}>
            {ok
              ? <CheckCircle2 size={18} className="text-emerald-600" />
              : <AlertCircle  size={18} className="text-red-500" />}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="font-bold text-slate-900 text-sm">{title}</p>
            <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{message}</p>
          </div>
          <button onClick={dismiss} className="text-slate-300 hover:text-slate-600 transition-colors">
            <X size={14} />
          </button>
        </div>
        {/* shrinking progress bar */}
        <div className="h-0.5 bg-slate-100">
          <div className={`h-full bar-shrink ${ok ? 'bg-emerald-500' : 'bg-red-400'}`} />
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Forgot Password Modal
───────────────────────────────────────────────────────────────────────────── */
const ForgotModal = ({ onClose }) => {
  const [email,   setEmail]   = useState('');
  const [sent,    setSent]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setErr('Please enter a valid email address.');
      return;
    }
    setErr('');
    setLoading(true);
    try {
      // ── swap this line for your real API call ──────────────────────────────
      // await api.post('/auth/forgot-password', { email });
      await new Promise(r => setTimeout(r, 1500)); // simulated delay
      // ──────────────────────────────────────────────────────────────────────
      setSent(true);
    } catch {
      setErr('Could not send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 overlay-in"
      style={{ background: 'rgba(0,0,0,0.58)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden modal-in"
        onClick={e => e.stopPropagation()}
      >
        {/* header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-7 py-5 flex items-center justify-between">
          <div>
            <h3 className="text-white font-bold text-lg">Reset Password</h3>
            <p className="text-white/50 text-xs mt-0.5">We'll send a secure link to your inbox</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            <X size={15} />
          </button>
        </div>

        {/* body */}
        <div className="px-7 py-6">
          {sent ? (
            <div className="text-center py-2">
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={30} className="text-emerald-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-1">Check your inbox!</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                A reset link was sent to <strong className="text-slate-700">{email}</strong>.
                Remember to check your spam folder too.
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-900 rounded-xl font-bold text-sm transition-all duration-300"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4" noValidate>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Your Email Address
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErr(''); }}
                    placeholder="you@example.com"
                    className={`w-full pl-9 pr-4 py-3 rounded-xl border bg-slate-50 text-sm text-slate-900 placeholder-slate-300
                      focus:outline-none focus:ring-2 focus:bg-white transition-all
                      ${err
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-400/10'
                        : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900/10'}`}
                  />
                </div>
                {err && <p className="text-xs text-red-500 mt-1.5">{err}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-900 rounded-xl font-bold text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? <><Loader2 size={14} className="animate-spin" /> Sending…</>
                  : <><Send size={14} /> Send Reset Link</>}
              </button>

              <p className="text-center text-xs text-slate-400">
                Remembered it?{' '}
                <button type="button" onClick={onClose} className="text-amber-500 font-semibold hover:underline">
                  Back to Sign In
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Login — same visual layout, updated logic
───────────────────────────────────────────────────────────────────────────── */
const Login = () => {
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [showPass,   setShowPass]   = useState(false);
  const [remember,   setRemember]   = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [toast,      setToast]      = useState(null);   // { type, title, message }
  const [showForgot, setShowForgot] = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setToast({ type: 'error', title: 'Missing fields', message: 'Please enter your email and password.' });
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      setToast({
        type: 'success',
        title: 'Welcome back! 🎉',
        message: 'Signed in successfully. Redirecting you now…',
      });
      setTimeout(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        navigate(user?.role === 'admin' ? '/admin' : '/profile');
      }, 1400);
    } else {
      setToast({
        type: 'error',
        title: 'Sign in failed',
        message: result.message || 'Invalid email or password. Please try again.',
      });
    }
  };

  /* ── social ──
     Replace the window.location line with your actual OAuth URL when ready.
     Example: window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  */
  const handleSocial = (provider) => {
    // window.location.href = `${import.meta.env.VITE_API_URL}/auth/${provider}`;
    setToast({
      type: 'error',
      title: `${provider === 'google' ? 'Google' : 'LinkedIn'} sign-in`,
      message: 'OAuth isn\'t configured yet. Use email login for now.',
    });
  };

  return (
    <>
      <style>{keyframes}</style>

      {/* ── Toast ── */}
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* ── Forgot Password Modal ── */}
      {showForgot && <ForgotModal onClose={() => setShowForgot(false)} />}

      {/* ══════════════════════ PAGE ══════════════════════ */}
      <div
        className="relative min-h-screen flex items-stretch overflow-hidden"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${jobBg})` }}
        />
        {/* Gradient overlay — identical to original */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-slate-900/50" />

        <div className="relative z-10 flex flex-col md:flex-row w-full min-h-screen">

          {/* ════ LEFT — Brand (unchanged) ════ */}
          <div className="slide-in-left flex flex-col justify-between px-8 pt-10 pb-10 md:px-16 md:py-16 md:w-[55%]">

            {/* hero */}
            <div className="my-auto py-12 md:py-0 md:pl-35">
              <span className="inline-block text-amber-400 text-[10px] font-bold tracking-[5px] uppercase mb-5 border border-amber-400/30 rounded-full px-3 py-1">
                Welcome Back
              </span>
              <h1 className="text-white text-4xl md:text-6xl font-black leading-[1.02] tracking-tight mb-5">
                Your Next Big<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400">
                  Opportunity
                </span>
                <br />Starts Here.
              </h1>
              <p className="text-white/50 text-base font-light leading-relaxed max-w-md mb-10">
                Thousands of top companies are actively hiring.
                Sign in to discover roles matched to your profile.
              </p>

              {/* stats grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-3 max-w-lg">
                {STATS.map(({ icon: Icon, value, label, delay }) => (
                  <div
                    key={label}
                    className={`${delay} bg-white/[0.07] backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 hover:bg-white/[0.12] transition-colors cursor-default`}
                  >
                    <Icon size={16} className="text-amber-400 mb-2.5" />
                    <p className="text-white text-xl font-bold leading-none mb-1">{value}</p>
                    <p className="text-white/40 text-[11px] font-medium">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-white/40 text-sm hidden md:block md:pl-35">
              New to HireWave?{' '}
              <Link to="/register" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
                Create a free account →
              </Link>
            </p>
          </div>

          {/* ════ RIGHT — Form ════ */}
          <div className="slide-in-right flex items-center justify-center md:justify-end px-4 pb-10 md:pb-0 md:pr-30 md:w-[40%]">
            <div className="w-full max-w-[360px] bg-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden">

              {/* card header — unchanged */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-7 py-5">
                <h2 className="text-white text-xl font-bold">Sign In</h2>
                <p className="text-white/50 text-xs mt-0.5">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-amber-400 font-semibold hover:underline">Register free</Link>
                </p>
              </div>

              {/* form body */}
              <form onSubmit={handleSubmit} noValidate className="px-7 py-7 fade-up space-y-4">

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={e => setRemember(e.target.checked)}
                      className="rounded accent-slate-900 w-3 h-3"
                    />
                    Remember me
                  </label>
                  {/* ← now opens modal instead of navigating */}
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors underline-offset-2 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-900 font-bold py-3.5 rounded-xl transition-all duration-300 text-sm shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading
                    ? <><Loader2 size={15} className="animate-spin" /> Signing in…</>
                    : <>Sign In <ArrowRight size={14} /></>}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[10px] text-slate-300 font-semibold tracking-widest uppercase">or</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>

                {/* Social buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Google
                      To enable: replace onClick body with
                      window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
                  */}
                  <button
                    type="button"
                    onClick={() => handleSocial('google')}
                    className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>

                  {/* LinkedIn
                      To enable: window.location.href = `${import.meta.env.VITE_API_URL}/auth/linkedin`;
                  */}
                  <button
                    type="button"
                    onClick={() => handleSocial('linkedin')}
                    className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all"
                  >
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#0A66C2">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </button>
                </div>

                {/* mobile new-user link */}
                <p className="text-center text-xs text-slate-400 md:hidden pt-1">
                  New here?{' '}
                  <Link to="/register" className="text-amber-500 font-semibold hover:underline">
                    Create a free account →
                  </Link>
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;