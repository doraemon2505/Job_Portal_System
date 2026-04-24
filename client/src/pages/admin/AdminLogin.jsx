// pages/admin/AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import jobBg from "../../assets/jobbackground.jpeg";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap');
  * { font-family: 'Figtree', sans-serif; }
  .font-display { font-family: 'Syne', sans-serif !important; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes gradS    { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes toastIn  { from{opacity:0;transform:translateY(-20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes shrink   { from{width:100%} to{width:0%} }

  .au         { animation: fadeUp  0.6s cubic-bezier(0.22,1,0.36,1) both; }
  .ai         { animation: fadeIn  0.4s ease both; }
  .float-el   { animation: float   5s ease-in-out infinite; }
  .toast-in   { animation: toastIn 0.35s cubic-bezier(0.34,1.4,0.64,1) both; }
  .bar-shrink { animation: shrink  4s linear forwards; }

  .gradient-text {
    background: linear-gradient(135deg,#7c3aed,#4f46e5,#0ea5e9);
    background-size:200% auto; -webkit-background-clip:text;
    -webkit-text-fill-color:transparent; background-clip:text;
    animation: gradS 4s ease infinite;
  }
  .glass {
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255,255,255,0.15);
  }
  .glass-input {
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    border: 1.5px solid rgba(255,255,255,0.2);
    color: white;
    transition: all 0.2s;
  }
  .glass-input::placeholder { color: rgba(255,255,255,0.45); }
  .glass-input:focus {
    background: rgba(255,255,255,0.15);
    border-color: rgba(139,92,246,0.7);
    box-shadow: 0 0 0 3px rgba(139,92,246,0.25);
    outline: none;
  }
`;

// ── Toast ─────────────────────────────────────────────────────────────────────
const Toast = ({ message, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, []);
  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-sm toast-in">
      <div className="rounded-2xl overflow-hidden shadow-2xl border border-red-300/30 bg-red-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-3.5">
          <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle size={16} className="text-red-400" />
          </div>
          <p className="text-white text-sm font-medium flex-1">{message}</p>
          <button onClick={onClose} className="text-white/40 hover:text-white text-lg leading-none">×</button>
        </div>
        <div className="h-0.5 bg-white/10">
          <div className="h-full bar-shrink bg-red-500" />
        </div>
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const AdminLogin = () => {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [toast,    setToast]    = useState(null);

  const { login, user } = useAuth();
  const navigate        = useNavigate();

  // If already logged in as admin → go straight to dashboard
  useEffect(() => {
    if (user?.role === "admin") navigate("/admin/dashboard");
    else if (user?.role === "user") navigate("/");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setToast("Please enter both email and password.");
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      if (stored.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        // Logged in but not admin
        setToast("Access denied. This login is for admins only.");
        // log them back out
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else {
      setToast(result.message || "Invalid credentials. Please try again.");
    }
  };

  return (
    <>
      <style>{CSS}</style>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">

        {/* Background */}
        <div className="absolute inset-0">
          <img src={jobBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/92 via-violet-950/80 to-indigo-950/85" />
          {/* Glow orbs */}
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute top-20 right-20 w-16 h-16 glass rounded-2xl float-el hidden lg:flex items-center justify-center">
          <Shield size={24} className="text-violet-400" />
        </div>
        <div className="absolute bottom-20 left-20 w-12 h-12 glass rounded-xl float-el hidden lg:block" style={{ animationDelay: "2s" }} />

        {/* Card */}
        <div className="relative z-10 w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8 au" style={{ opacity: 0 }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-violet-500/40">
              <Shield size={28} className="text-white" />
            </div>
            <h1 className="font-display text-3xl font-black text-white mb-2">
              Admin <span className="gradient-text">Portal</span>
            </h1>
            <p className="text-white/50 text-sm">Restricted access — authorized personnel only</p>
          </div>

          {/* Glass form card */}
          <div className="glass rounded-3xl overflow-hidden shadow-2xl au" style={{ animationDelay: "0.1s", opacity: 0 }}>

            {/* Top strip */}
            <div className="h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500" />

            <div className="p-8">
              <h2 className="font-display font-black text-xl text-white mb-1">Sign In</h2>
              <p className="text-white/40 text-xs mb-7">Enter your admin credentials to continue</p>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                {/* Email */}
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="admin@hiresetu.com"
                      className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[10px] font-bold text-white/50 uppercase tracking-widest mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                    <input
                      type={showPass ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="glass-input w-full pl-10 pr-10 py-3 rounded-xl text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                    >
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-violet-500/35 hover:shadow-violet-500/55 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none mt-2"
                >
                  {loading
                    ? <><Loader2 size={16} className="animate-spin" /> Verifying…</>
                    : <><Shield size={15} /> Access Admin Panel</>}
                </button>
              </form>

              {/* Footer note */}
              <div className="mt-6 pt-5 border-t border-white/10 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <p className="text-white/30 text-xs">Secure connection · Session expires in 30 days</p>
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="text-center mt-6 au" style={{ animationDelay: "0.2s", opacity: 0 }}>
            <a href="/" className="text-white/40 hover:text-white/70 text-xs transition-colors">
              ← Back to main site
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;