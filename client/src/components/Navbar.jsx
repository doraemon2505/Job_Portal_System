
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Briefcase, Menu, X, Sun, Moon, ChevronDown,
  User, LogOut, LayoutDashboard, FileText, Bell
} from "lucide-react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Jobs", to: "/jobs" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "dark:bg-slate-900/95 bg-white/95 backdrop-blur-xl shadow-lg shadow-black/10 dark:shadow-black/40 border-b border-slate-200/50 dark:border-slate-700/50"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-all duration-300 group-hover:scale-105">
                <Briefcase size={18} className="text-white" />
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-lg tracking-tight dark:text-white text-slate-900" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Hire<span className="text-violet-600">Setu</span>
                </span>
                <span className="text-[10px] font-medium text-slate-400 tracking-widest uppercase">Career Portal</span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive(link.to)
                      ? "text-violet-600 dark:text-violet-400"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                  style={{ fontFamily: "'Figtree', sans-serif" }}
                >
                  {link.label}
                  {isActive(link.to) && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-violet-600 dark:bg-violet-400 rounded-full" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 md:gap-3">

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:scale-105 active:scale-95"
              >
                <div className={`absolute transition-all duration-300 ${isDark ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"}`}>
                  <Sun size={18} />
                </div>
                <div className={`absolute transition-all duration-300 ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}>
                  <Moon size={18} />
                </div>
              </button>

              {/* Auth */}
              {user ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate" style={{ fontFamily: "'Figtree', sans-serif" }}>
                      {user.name}
                    </span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-black/10 dark:shadow-black/40 border border-slate-200 dark:border-slate-700 overflow-hidden animate-[fadeSlideDown_0.15s_ease]">
                      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user.email}</p>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        <Link to="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-700 dark:hover:text-violet-400 transition-all">
                          <User size={15} /> Profile
                        </Link>
                        <Link to="/my-applications" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-700 dark:hover:text-violet-400 transition-all">
                          <FileText size={15} /> My Applications
                        </Link>
                        {user.role === "admin" && (
                          <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-900/20 hover:text-violet-700 dark:hover:text-violet-400 transition-all">
                            <LayoutDashboard size={15} /> Admin Panel
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        >
                          <LogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    style={{ fontFamily: "'Figtree', sans-serif" }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 active:scale-95 transition-all duration-200"
                    style={{ fontFamily: "'Figtree', sans-serif" }}
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="bg-white/98 dark:bg-slate-900/98 backdrop-blur-xl border-t border-slate-200 dark:border-slate-700 px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive(link.to)
                    ? "bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400"
                    : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-2 mt-2">
              {user ? (
                <>
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                    <User size={16} /> Profile
                  </Link>
                  <Link to="/my-applications" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                    <FileText size={16} /> My Applications
                  </Link>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                    <LogOut size={16} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block text-center px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                    Sign In
                  </Link>
                  <Link to="/register" className="block text-center px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-violet-500/30">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap');`}</style>
    </>
  );
};

export default Navbar;