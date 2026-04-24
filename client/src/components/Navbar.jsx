// components/public/Navbar.jsx  (or wherever your Navbar lives)
// CHANGES: Admin sees only "Admin Dashboard" in dropdown
//          User sees "My Profile" + "My Applications"
//          Logout shows confirmation modal

import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth }  from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Sun, Moon, Menu, X, Briefcase, ChevronDown,
  LayoutDashboard, User, FileText, LogOut, Shield
} from "lucide-react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap');
  * { font-family: 'Figtree', sans-serif; }
  .font-display { font-family: 'Syne', sans-serif !important; }
  @keyframes fadeDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes modalUp  { from{opacity:0;transform:scale(0.92) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
  .dropdown-anim { animation: fadeDown 0.2s ease both; }
  .overlay-in    { animation: fadeIn   0.2s ease both; }
  .modal-in      { animation: modalUp  0.3s cubic-bezier(0.34,1.2,0.64,1) both; }
`;

// ── Logout Modal ──────────────────────────────────────────────────────────────
const LogoutModal = ({ onConfirm, onCancel }) => (
  <div
    className="fixed inset-0 z-[300] flex items-center justify-center p-4 overlay-in"
    style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
    onClick={onCancel}
  >
    <div
      className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-sm overflow-hidden modal-in"
      onClick={e => e.stopPropagation()}
    >
      <div className="h-1 bg-gradient-to-r from-red-400 to-orange-500" />
      <div className="p-7 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LogOut size={28} className="text-red-500" />
        </div>
        <h3 className="font-display font-black text-xl text-slate-900 dark:text-white mb-2">Sign out?</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
          Are you sure you want to sign out?
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/25">
            Yes, Sign Out
          </button>
        </div>
      </div>
    </div>
  </div>
);

// ── Navbar ────────────────────────────────────────────────────────────────────
const Navbar = () => {
  const { user, logout }  = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location  = useLocation();
  const navigate  = useNavigate();
  const dropRef   = useRef(null);

  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [dropOpen,     setDropOpen]     = useState(false);
  const [showLogout,   setShowLogout]   = useState(false);

  // Scroll-aware glass effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setDropOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    setShowLogout(false);
    navigate(user?.role === "admin" ? "/admin" : "/");
  };

  // Public nav links
  const PUBLIC_LINKS = [
    { label: "Home",    to: "/"        },
    { label: "Jobs",    to: "/jobs"    },
    { label: "About",   to: "/about"   },
    { label: "Contact", to: "/contact" },
  ];

  // ── Dropdown items by role ──────────────────────────────────────────────────
  const USER_MENU = user?.role === "admin"
    ? [
        { label: "Admin Dashboard", to: "/admin/dashboard", icon: LayoutDashboard, color: "text-violet-600 dark:text-violet-400" },
      ]
    : [
        { label: "My Profile",      to: "/profile",         icon: User,             color: "text-slate-500 dark:text-slate-400" },
        { label: "My Applications", to: "/applications",    icon: FileText,         color: "text-slate-500 dark:text-slate-400" },
      ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{CSS}</style>
      {showLogout && <LogoutModal onConfirm={handleLogout} onCancel={() => setShowLogout(false)} />}

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-slate-900/5 border-b border-slate-200/50 dark:border-slate-700/50"
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                <Briefcase size={16} className="text-white" />
              </div>
              <span className={`font-display text-xl font-black tracking-tight ${scrolled ? "text-slate-900 dark:text-white" : "text-white"}`}>
                Hire<span className="text-violet-400">Setu</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {PUBLIC_LINKS.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    isActive(to)
                      ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400"
                      : scrolled
                        ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-violet-600 dark:hover:text-violet-400"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  scrolled
                    ? "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {isDark ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              {user ? (
                /* ── Logged-in user dropdown ── */
                <div className="relative" ref={dropRef}>
                  <button
                    onClick={() => setDropOpen(d => !d)}
                    className="flex items-center gap-2 focus:outline-none group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className={`text-sm font-semibold leading-none ${scrolled ? "text-slate-800 dark:text-white" : "text-white"}`}>
                        {user.name}
                      </p>
                      <p className={`text-xs font-bold capitalize mt-0.5 ${user.role === "admin" ? "text-red-400" : "text-violet-400"}`}>
                        {user.role}
                      </p>
                    </div>
                    <ChevronDown size={13} className={`transition-transform flex-shrink-0 ${dropOpen ? "rotate-180" : ""} ${scrolled ? "text-slate-400" : "text-white/60"}`} />
                  </button>

                  {/* Dropdown */}
                  {dropOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 dropdown-anim">

                      {/* User info */}
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-400 truncate">{user.email}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-1 mt-2 text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${
                          user.role === "admin"
                            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                        }`}>
                          {user.role === "admin" && <Shield size={9} />}
                          {user.role}
                        </span>
                      </div>

                      {/* Menu items */}
                      <div className="py-1.5">
                        {USER_MENU.map(({ label, to, icon: Icon, color }) => (
                          <Link
                            key={to}
                            to={to}
                            onClick={() => setDropOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-700 dark:hover:text-violet-400 transition-colors"
                          >
                            <Icon size={15} className={color} />
                            {label}
                          </Link>
                        ))}
                      </div>

                      {/* Sign out */}
                      <div className="border-t border-slate-100 dark:border-slate-800 py-1.5">
                        <button
                          onClick={() => { setDropOpen(false); setShowLogout(true); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Not logged in ── */
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login" className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${scrolled ? "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" : "text-white/80 hover:text-white hover:bg-white/10"}`}>
                    Sign In
                  </Link>
                  <Link to="/register" className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:scale-105 active:scale-95 transition-all">
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(m => !m)}
                className={`md:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                  scrolled ? "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" : "text-white hover:bg-white/10"
                }`}
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-3 px-2 space-y-1 dropdown-anim">
              {PUBLIC_LINKS.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                    isActive(to)
                      ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {label}
                </Link>
              ))}

              {user ? (
                <>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 mx-3 my-2" />
                  {USER_MENU.map(({ label, to, icon: Icon }) => (
                    <Link key={to} to={to} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-700 transition-colors">
                      <Icon size={15} className="text-slate-400" /> {label}
                    </Link>
                  ))}
                  <button onClick={() => setShowLogout(true)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut size={15} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <div className="h-px bg-slate-100 dark:bg-slate-800 mx-3 my-2" />
                  <Link to="/login"    className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">Sign In</Link>
                  <Link to="/register" className="block px-4 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-center">Get Started</Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;