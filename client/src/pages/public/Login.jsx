import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase, Users, Building2, TrendingUp } from 'lucide-react';
import jobBg from '../../assets/jobbackground.jpeg';

/* ── Keyframes ONLY — all visual styling is Tailwind ── */
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

  .slide-in-left  { animation: slideInLeft  0.85s cubic-bezier(0.22,1,0.36,1) both; }
  .slide-in-right { animation: slideInRight 0.85s cubic-bezier(0.22,1,0.36,1) both; }
  .fade-up        { animation: fadeUp       0.65s 0.45s cubic-bezier(0.22,1,0.36,1) both; }
  .stat-pop-1     { animation: statPop 0.5s 0.55s cubic-bezier(0.34,1.56,0.64,1) both; }
  .stat-pop-2     { animation: statPop 0.5s 0.70s cubic-bezier(0.34,1.56,0.64,1) both; }
  .stat-pop-3     { animation: statPop 0.5s 0.85s cubic-bezier(0.34,1.56,0.64,1) both; }
  .stat-pop-4     { animation: statPop 0.5s 1.00s cubic-bezier(0.34,1.56,0.64,1) both; }

  /* Mobile: everything slides from top */
  @media (max-width: 767px) {
    .slide-in-left, .slide-in-right {
      animation: slideInTop 0.8s cubic-bezier(0.22,1,0.36,1) both !important;
    }
    .fade-up {
      animation: fadeUp 0.6s 0.4s cubic-bezier(0.22,1,0.36,1) both !important;
    }
  }
`;

const stats = [
  { icon: Briefcase,  value: '85K+', label: 'Active Jobs',      delay: 'stat-pop-1' },
  { icon: Building2,  value: '12K+', label: 'Companies',        delay: 'stat-pop-2' },
  { icon: Users,      value: '2M+',  label: 'Job Seekers',      delay: 'stat-pop-3' },
  { icon: TrendingUp, value: '94%',  label: 'Placement Rate',   delay: 'stat-pop-4' },
];

const Login = () => {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login }               = useAuth();
  const navigate                = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user'));
      navigate(user?.role === 'admin' ? '/admin' : '/profile');
    } else {
      setError(result.message);
    }
  };

  return (
    <>
      <style>{keyframes}</style>

      <div
        className="relative min-h-screen flex items-stretch overflow-hidden"
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        {/* ── Full-screen background image ── */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${jobBg})` }}
        />
        {/* Gradient overlay — heavier on left for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 to-slate-900/50" />

        {/* ── Main layout ── */}
        <div className="relative z-10 flex flex-col md:flex-row w-full min-h-screen">

          {/* ════ LEFT SIDE — Brand panel (slides in from left / top on mobile) ════ */}
          <div className="slide-in-left flex flex-col justify-between px-8 pt-10 pb-10 md:px-16 md:py-16 md:w-[55%]">

            {/* Top: Logo
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm flex items-center justify-center">
                <Briefcase size={17} className="text-white" />
              </div>
              <span className="text-white text-base font-semibold tracking-tight">JobPortal</span>
            </div> */}

            {/* Middle: Hero text */}
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

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-3 max-w-lg">
                {stats.map(({ icon: Icon, value, label, delay }) => (
                  <div
                    key={label}
                    className={`${delay} bg-white/[0.07] backdrop-blur-md border border-white/[0.08] rounded-2xl p-4 hover:bg-white/[0.12] transition-colors`}
                  >
                    <Icon size={16} className="text-amber-400 mb-2.5" />
                    <p className="text-white text-xl font-bold leading-none mb-1">{value}</p>
                    <p className="text-white/40 text-[11px] font-medium">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom: new user prompt */}
            <p className="text-white/40 text-sm hidden md:block md:pl-35">
              New to JobPortal?{' '}
              <Link to="/register" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
                Create a free account →
              </Link>
            </p>
          </div>

          {/* ════ RIGHT SIDE — Form panel (slides in from right / fades up on mobile) ════ */}
          <div className="slide-in-right flex items-center justify-center md:justify-end px-4 pb-10 md:pb-0 md:pr-30 md:w-[40%]">
            <div className="w-full max-w-[360px] bg-white rounded-3xl shadow-2xl shadow-black/30 overflow-hidden">

              {/* Card header strip */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-7 py-5">
                <h2 className="text-white text-xl font-bold">Sign In</h2>
                <p className="text-white/50 text-xs mt-0.5">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-amber-400 font-semibold hover:underline">
                    Register free
                  </Link>
                </p>
              </div>

              {/* Form body */}
              <div className="px-7 py-7 fade-up">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3 mb-5 font-medium">
                    ⚠ {error}
                  </div>
                )}

                <div className="space-y-4 mb-4">
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
                        onChange={(e) => setEmail(e.target.value)}
                        required
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
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-9 pr-10 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-300 focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Extras row */}
                <div className="flex items-center justify-between mb-5">
                  <label className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                    <input type="checkbox" className="rounded accent-slate-900 w-3 h-3" />
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="text-xs text-slate-500 hover:text-slate-900 font-medium transition-colors">
                    Forgot password?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-amber-500 text-white hover:text-slate-900 font-bold py-3.5 rounded-xl transition-all duration-300 text-sm shadow-lg hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? 'Signing in…' : <> Sign In <ArrowRight size={14} /> </>}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[10px] text-slate-300 font-semibold tracking-widest uppercase">or</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>

                {/* Google + LinkedIn */}
                <div className="grid grid-cols-2 gap-2.5">
                  <button className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                  <button className="flex items-center justify-center gap-2 border border-slate-200 rounded-xl py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="#0A66C2">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default Login;