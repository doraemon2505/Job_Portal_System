import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Mail, Lock, User, Eye, EyeOff, ArrowRight, Briefcase,
  CheckCircle2, Star, Shield, Zap, X, Loader2, AlertCircle,
} from 'lucide-react';
import jobBg from '../../assets/jobbackground.jpeg';

/* ─────────────────────────────────────────────────────────────────────────────
   Keyframes — identical to original, plus toast additions
───────────────────────────────────────────────────────────────────────────── */
const keyframes = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

  @keyframes slideInRight {
    from { transform: translateX(110%);  opacity: 0; }
    to   { transform: translateX(0);     opacity: 1; }
  }
  @keyframes slideInLeft {
    from { transform: translateX(-110%); opacity: 0; }
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
  @keyframes perkSlide {
    from { opacity: 0; transform: translateX(20px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes toastDrop {
    from { opacity: 0; transform: translateY(-28px) scale(0.94); }
    to   { opacity: 1; transform: translateY(0)     scale(1); }
  }
  @keyframes toastLeave {
    from { opacity: 1; transform: translateY(0)     scale(1); }
    to   { opacity: 0; transform: translateY(-28px) scale(0.94); }
  }
  @keyframes shrink { from { width: 100%; } to { width: 0%; } }

  /* ── original classes ── */
  .slide-in-right { animation: slideInRight 0.85s cubic-bezier(0.22,1,0.36,1) both; }
  .slide-in-left  { animation: slideInLeft  0.85s cubic-bezier(0.22,1,0.36,1) both; }
  .fade-up        { animation: fadeUp       0.65s 0.4s  cubic-bezier(0.22,1,0.36,1) both; }
  .perk-1         { animation: perkSlide    0.5s  0.55s cubic-bezier(0.22,1,0.36,1) both; }
  .perk-2         { animation: perkSlide    0.5s  0.70s cubic-bezier(0.22,1,0.36,1) both; }
  .perk-3         { animation: perkSlide    0.5s  0.85s cubic-bezier(0.22,1,0.36,1) both; }
  .perk-4         { animation: perkSlide    0.5s  1.00s cubic-bezier(0.22,1,0.36,1) both; }

  /* ── new ── */
  .toast-enter  { animation: toastDrop  0.38s cubic-bezier(0.34,1.4,0.64,1) both; }
  .toast-leave  { animation: toastLeave 0.28s ease forwards; }
  .bar-shrink   { animation: shrink 4.2s linear forwards; }

  @media (max-width: 767px) {
    .slide-in-right, .slide-in-left {
      animation: slideInTop 0.8s cubic-bezier(0.22,1,0.36,1) both !important;
    }
    .fade-up {
      animation: fadeUp 0.6s 0.4s cubic-bezier(0.22,1,0.36,1) both !important;
    }
  }
`;

const PERKS = [
  { icon: CheckCircle2, text: 'Access 85,000+ verified job listings daily',     delay: 'perk-1' },
  { icon: Zap,          text: 'One-click apply to your dream companies',         delay: 'perk-2' },
  { icon: Star,         text: 'AI-powered job matching tailored to your skills', delay: 'perk-3' },
  { icon: Shield,       text: 'Your profile stays private until you apply',      delay: 'perk-4' },
];

/* ─────────────────────────────────────────────────────────────────────────────
   Password rules  (8–20 chars, uppercase, number, special char)
───────────────────────────────────────────────────────────────────────────── */
const RULES = [
  { id: 'len',     label: '8 – 20 characters',             test: p => p.length >= 8 && p.length <= 20 },
  { id: 'upper',   label: 'One uppercase letter (A–Z)',     test: p => /[A-Z]/.test(p) },
  { id: 'number',  label: 'One number (0–9)',               test: p => /[0-9]/.test(p) },
  { id: 'special', label: 'One special character (!@#$…)',  test: p => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(p) },
];

const getStrength = (p) => {
  const n = RULES.filter(r => r.test(p)).length;
  if (n === 0) return { score: 0, label: '',       color: '' };
  if (n === 1) return { score: 1, label: 'Weak',   color: 'bg-red-500' };
  if (n === 2) return { score: 2, label: 'Fair',   color: 'bg-amber-500' };
  if (n === 3) return { score: 3, label: 'Good',   color: 'bg-blue-500' };
  return            { score: 4, label: 'Strong', color: 'bg-emerald-500' };
};

/* ─────────────────────────────────────────────────────────────────────────────
   Toast  (same component as Login for consistency)
───────────────────────────────────────────────────────────────────────────── */
const Toast = ({ type, title, message, onClose }) => {
  const [leaving, setLeaving] = useState(false);
  const ok = type === 'success';

  const dismiss = () => { setLeaving(true); setTimeout(onClose, 290); };
  useEffect(() => { const t = setTimeout(dismiss, 4300); return () => clearTimeout(t); }, []);

  return (
    <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[300] w-[calc(100%-2rem)] max-w-sm pointer-events-auto ${leaving ? 'toast-leave' : 'toast-enter'}`}>
      <div className={`rounded-2xl overflow-hidden shadow-2xl border bg-white ${ok ? 'border-emerald-200' : 'border-red-200'}`}>
        <div className="flex items-start gap-3 px-4 py-3.5">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${ok ? 'bg-emerald-100' : 'bg-red-50'}`}>
            {ok ? <CheckCircle2 size={18} className="text-emerald-600" /> : <AlertCircle size={18} className="text-red-500" />}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="font-bold text-slate-900 text-sm">{title}</p>
            <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{message}</p>
          </div>
          <button onClick={dismiss} className="text-slate-300 hover:text-slate-600 transition-colors">
            <X size={14} />
          </button>
        </div>
        <div className="h-0.5 bg-slate-100">
          <div className={`h-full bar-shrink ${ok ? 'bg-emerald-500' : 'bg-red-400'}`} />
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────────
   Register — same visual layout, updated logic
───────────────────────────────────────────────────────────────────────────── */
const Register = () => {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [pwFocus,  setPwFocus]  = useState(false);
  const [agreed,   setAgreed]   = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [toast,    setToast]    = useState(null);
  const [errors,   setErrors]   = useState({});

  const { register } = useAuth();
  const navigate     = useNavigate();

  const strength   = getStrength(password);
  const allRulesOk = RULES.every(r => r.test(password));

  /* ── field-level validation ── */
  const validate = () => {
    const e = {};
    if (!name.trim() || name.trim().length < 2)
      e.name = 'Enter your full name (at least 2 characters).';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email))
      e.email = 'Enter a valid email address.';
    if (!allRulesOk)
      e.password = 'Password doesn\'t meet all the requirements below.';
    if (!agreed)
      e.agreed = 'You must accept the Terms & Privacy Policy to continue.';
    return e;
  };

  /* ── submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    const result = await register(name.trim(), email.trim(), password);
    setLoading(false);

    if (result.success) {
      setToast({
        type: 'success',
        title: 'Account created! 🎉',
        message: 'Welcome to HireWave. Taking you to your profile…',
      });
      setTimeout(() => navigate('/profile'), 1400);
    } else {
      setToast({
        type: 'error',
        title: 'Registration failed',
        message: result.message || 'Something went wrong. Please try again.',
      });
    }
  };

  /* ── social ──
     Replace onClick body with:
     window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;   (Google)
     window.location.href = `${import.meta.env.VITE_API_URL}/auth/linkedin`; (LinkedIn)
  */
  const handleSocial = (provider) => {
    setToast({
      type: 'error',
      title: `${provider === 'google' ? 'Google' : 'LinkedIn'} sign-up`,
      message: 'OAuth isn\'t configured yet. Please register with email for now.',
    });
  };

  /* ── clear individual field error on change ── */
  const clearErr = (key) => (e) => {
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
    return e;
  };

  return (
    <>
      <style>{keyframes}</style>

      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* ══════════════════════ PAGE ══════════════════════ */}
      <div
        className="relative min-h-screen flex items-stretch overflow-hidden"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${jobBg})` }}
        />
        {/* Gradient — mirrored from Login (heavier on right) */}
        <div className="absolute inset-0 bg-gradient-to-l from-slate-950/90 via-slate-900/70 to-slate-900/50" />

        <div className="relative z-10 flex flex-col md:flex-row w-full min-h-screen">

          {/* ════ LEFT — Form ════ */}
          <div className="slide-in-left flex items-center justify-center md:justify-start px-6 pt-24 pb-8 md:pt-24 md:pb-10 md:pl-30 lg:pl-50 md:w-[45%]">
            <div className="w-full max-w-[370px] bg-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden">

              {/* card header — unchanged style */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-7 py-5">
                <h2 className="text-white text-xl font-bold">Create Account</h2>
                <p className="text-white/50 text-xs mt-0.5">
                  Already have an account?{' '}
                  <Link to="/login" className="text-amber-400 font-semibold hover:underline">Sign in</Link>
                </p>
              </div>

              {/* form */}
              <form onSubmit={handleSubmit} noValidate className="px-7 py-6 fade-up space-y-4">

                {/* Full Name */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={e => { setName(e.target.value); clearErr('name')(e); }}
                      className={`w-full pl-9 pr-4 py-3 rounded-xl border bg-slate-50 text-sm text-slate-900 placeholder-slate-300
                        focus:outline-none focus:ring-2 focus:bg-white transition-all
                        ${errors.name
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-400/10'
                          : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900/10'}`}
                    />
                  </div>
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>

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
                      onChange={e => { setEmail(e.target.value); clearErr('email')(e); }}
                      className={`w-full pl-9 pr-4 py-3 rounded-xl border bg-slate-50 text-sm text-slate-900 placeholder-slate-300
                        focus:outline-none focus:ring-2 focus:bg-white transition-all
                        ${errors.email
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-400/10'
                          : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900/10'}`}
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
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
                      placeholder="Create a strong password"
                      value={password}
                      onFocus={() => setPwFocus(true)}
                      onBlur={() => setPwFocus(false)}
                      onChange={e => { setPassword(e.target.value); clearErr('password')(e); }}
                      className={`w-full pl-9 pr-10 py-3 rounded-xl border bg-slate-50 text-sm text-slate-900 placeholder-slate-300
                        focus:outline-none focus:ring-2 focus:bg-white transition-all
                        ${errors.password
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-400/10'
                          : 'border-slate-200 focus:border-slate-900 focus:ring-slate-900/10'}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>

                  {/* Strength bar — appears as soon as user starts typing */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= strength.score ? strength.color : 'bg-slate-100'}`}
                          />
                        ))}
                      </div>
                      {strength.label && (
                        <p className={`text-[11px] font-semibold ${
                          strength.score <= 1 ? 'text-red-500'
                          : strength.score === 2 ? 'text-amber-500'
                          : strength.score === 3 ? 'text-blue-500'
                          : 'text-emerald-600'}`}
                        >
                          {strength.label} password
                        </p>
                      )}
                    </div>
                  )}

                  {/* Rules checklist — visible while focused or has input */}
                  {(pwFocus || password) && (
                    <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                      {RULES.map(r => {
                        const ok = r.test(password);
                        return (
                          <div key={r.id} className="flex items-center gap-2">
                            <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${ok ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                              {ok && <CheckCircle2 size={9} className="text-white" />}
                            </div>
                            <span className={`text-[11px] transition-colors ${ok ? 'text-emerald-700 font-medium' : 'text-slate-400'}`}>
                              {r.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Show error only when not focused */}
                  {errors.password && !pwFocus && (
                    <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Terms checkbox */}
                <div>
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreed}
                      onChange={e => { setAgreed(e.target.checked); if (errors.agreed) setErrors(p => ({ ...p, agreed: '' })); }}
                      className="mt-0.5 rounded accent-slate-900 w-3 h-3 flex-shrink-0"
                    />
                    <span className="text-[11px] text-slate-400 leading-relaxed">
                      I agree to the{' '}
                      <a href="/terms" target="_blank" rel="noreferrer" className="text-slate-700 font-semibold hover:underline">Terms of Service</a>
                      {' '}and{' '}
                      <a href="/privacy" target="_blank" rel="noreferrer" className="text-slate-700 font-semibold hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                  {errors.agreed && <p className="text-xs text-red-500 mt-1">{errors.agreed}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-900 font-bold py-3.5 rounded-xl transition-all duration-300 text-sm shadow-lg hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading
                    ? <><Loader2 size={15} className="animate-spin" /> Creating Account…</>
                    : <>Create Account <ArrowRight size={14} /></>}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[10px] text-slate-300 font-semibold tracking-widest uppercase">or</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>

                {/* Social buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Google — replace onClick with: window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`; */}
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

                  {/* LinkedIn — replace onClick with: window.location.href = `${import.meta.env.VITE_API_URL}/auth/linkedin`; */}
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

                {/* Mobile sign-in link */}
                <p className="text-center text-xs text-slate-400 md:hidden pt-1">
                  Already a member?{' '}
                  <Link to="/login" className="text-amber-500 font-semibold hover:underline">← Sign in</Link>
                </p>
              </form>
            </div>
          </div>

          {/* ════ RIGHT — Brand (unchanged) ════ */}
          <div className="slide-in-right flex flex-col justify-between px-8 pt-6 pb-10 md:px-16 md:py-16 md:w-[55%]">

            <div className="my-auto py-12 md:py-0 md:text-right md:pr-35">
              <span className="inline-block text-amber-400 text-[10px] font-bold tracking-[5px] uppercase mb-5 border border-amber-400/30 rounded-full px-3 py-1">
                Join Today — It's Free
              </span>
              <h1 className="text-white text-4xl md:text-5xl font-black leading-[1.05] tracking-tight mb-5">
                Land Your{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-rose-400">
                  Dream Role
                </span>
                <br />Faster Than Ever.
              </h1>
              <p className="text-white/50 text-base font-light leading-relaxed max-w-md ml-auto mb-10">
                Over 2 million professionals trust HireWave to find meaningful work.
                Join them today.
              </p>

              <div className="space-y-3 max-w-md ml-auto">
                {PERKS.map(({ icon: Icon, text, delay }) => (
                  <div key={text} className={`${delay} flex items-center gap-3 md:justify-end`}>
                    <span className="text-white/70 text-sm font-light leading-snug md:order-first order-last">{text}</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-400/15 border border-amber-400/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-amber-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-white/40 text-sm hidden md:block text-right md:pr-35">
              Already a member?{' '}
              <Link to="/login" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
                ← Sign in to your account
              </Link>
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default Register;