
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  Search, Briefcase, Users, CheckCircle, ArrowRight, MapPin,
  Clock, TrendingUp, Star, ChevronRight, Zap, Shield, BarChart3,
  Building2, Code2, Stethoscope, Palette, Megaphone, Database,
  Sparkles, Globe, Award
} from "lucide-react";
import jobbackground from "../../assets/jobbackground.jpeg";
import {
 
  Facebook, Instagram, Twitter, Linkedin, Github,
  Heart, Phone, Mail,
} from "lucide-react";
import api from "../../services/api";


// ─── Animated Counter Hook ────────────────────────────────────────────────────
const useCounter = (target, duration = 2000, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
};

// ─── Floating Particles ───────────────────────────────────────────────────────
const Particles = () => {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 8,
    duration: Math.random() * 10 + 12,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-violet-400/20 dark:bg-violet-300/10"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            animation: `floatParticle ${p.duration}s ${p.delay}s ease-in-out infinite alternate`,
          }}
        />
      ))}
    </div>
  );
};

// ─── Category Data ─────────────────────────────────────────────────────────────
const categories = [
  { icon: Code2, label: "Engineering", count: "1,240+", color: "from-blue-500 to-cyan-500" },
  { icon: Palette, label: "Design", count: "860+", color: "from-pink-500 to-rose-500" },
  { icon: Megaphone, label: "Marketing", count: "540+", color: "from-orange-500 to-amber-500" },
  { icon: Stethoscope, label: "Healthcare", count: "720+", color: "from-green-500 to-emerald-500" },
  { icon: BarChart3, label: "Finance", count: "490+", color: "from-violet-500 to-purple-500" },
  { icon: Database, label: "Data & AI", count: "380+", color: "from-indigo-500 to-blue-500" },
];

// ─── Testimonials ─────────────────────────────────────────────────────────────
// const [testimonials, setTestimonials] = useState([]);

// useEffect(() => {
//   api.get("/review/approved")
//     .then(res => setTestimonials(res.data.reviews || []))
//     .catch(() => {});
// }, []);

// ─── Featured Jobs (Mock) ──────────────────────────────────────────────────────
const featuredJobs = [
  {
    id: 1, title: "Senior React Developer", company: "TechCorp India",
    location: "Bangalore", type: "Full-time", salary: "₹25–35 LPA",
    logo: "TC", gradient: "from-blue-500 to-cyan-400", tags: ["React", "Node.js", "AWS"],
  },
  {
    id: 2, title: "Product Designer", company: "StartupHub",
    location: "Remote", type: "Full-time", salary: "₹18–28 LPA",
    logo: "SH", gradient: "from-pink-500 to-violet-500", tags: ["Figma", "UX", "Research"],
  },
  {
    id: 3, title: "ML Engineer", company: "AI Labs",
    location: "Mumbai", type: "Hybrid", salary: "₹30–45 LPA",
    logo: "AL", gradient: "from-green-500 to-emerald-400", tags: ["Python", "TensorFlow", "MLOps"],
  },
];

// ─── Main Component ────────────────────────────────────────────────────────────
const Home = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statsVisible, setStatsVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const statsRef = useRef(null);

  const jobs = useCounter(5000, 2200, statsVisible);
  const companies = useCounter(1200, 2000, statsVisible);
  const hired = useCounter(8000, 2400, statsVisible);

  useEffect(() => {
    const timer = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
  api.get("/review/approved")
    .then(res => setTestimonials(res.data.reviews || []))
    .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.3 }
    );
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/jobs?q=${encodeURIComponent(query)}`);
    else navigate("/jobs");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">

      {/* ── GLOBAL STYLES ─────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap');

        * { font-family: 'Figtree', sans-serif; }
        .font-display { font-family: 'Syne', sans-serif !important; }

        @keyframes floatParticle {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.3; }
          100% { transform: translateY(-40px) translateX(20px) scale(1.5); opacity: 0.8; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139, 92, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(139, 92, 246, 0.6); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-slide-up { animation: slideUp 0.6s ease forwards; }
        .animate-fade-in { animation: fadeIn 0.8s ease forwards; }
        .animate-float { animation: float 5s ease-in-out infinite; }
        .animate-pulse-glow { animation: pulse-glow 2.5s ease-in-out infinite; }

        .gradient-text {
          background: linear-gradient(135deg, #7c3aed, #4f46e5, #0ea5e9);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 4s ease infinite;
        }

        .hero-bg {
          position: relative;
          background: linear-gradient(135deg, #0f0c29, #302b63, #24243e);
        }
        .hero-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url('');
          background-size: cover;
          background-position: center;
          opacity: 0.18;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.12);
        }
        .glass-card-light {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.8);
        }

        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-6px);
          box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.18);
        }
        .dark .card-hover:hover {
          box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.6);
        }

        .tag-chip {
          background: rgba(139, 92, 246, 0.12);
          color: #7c3aed;
          border: 1px solid rgba(139, 92, 246, 0.2);
        }
        .dark .tag-chip {
          background: rgba(139, 92, 246, 0.15);
          color: #a78bfa;
          border-color: rgba(139, 92, 246, 0.25);
        }

        .search-glow:focus-within {
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.25), 0 8px 32px rgba(139, 92, 246, 0.15);
        }
        .dark .search-glow:focus-within {
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.3), 0 8px 32px rgba(0,0,0,0.3);
        }

        .noise {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          background-size: 256px;
          pointer-events: none;
          border-radius: inherit;
        }
      `}</style>

      {/* ── HERO SECTION ──────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">

        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={jobbackground}
            alt="background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-violet-950/80 to-indigo-950/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        <Particles />

        {/* Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

        <div className={`relative z-10 w-full max-w-6xl mx-auto px-6 py-32 transition-all duration-700 ${heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>

          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-violet-300 text-sm font-semibold mb-8 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <Sparkles size={14} className="text-violet-400" />
            #1 Job Portal in India — 2026
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
          </div>

          {/* Headline */}
          <h1
            className="font-display text-5xl md:text-6xl xl:text-8xl font-black text-white leading-[1.05] tracking-tight animate-slide-up max-w-4xl"
            style={{ animationDelay: "0.2s" }}
          >
            Your Next Big
            <br />
            <span className="gradient-text">Career Move</span>
            <br />
            Starts Here.
          </h1>

          <p
            className="mt-6 text-slate-300 text-lg md:text-xl max-w-2xl leading-relaxed animate-slide-up font-light"
            style={{ animationDelay: "0.35s" }}
          >
            Join over <strong className="text-white font-semibold">50,000+ professionals</strong> who found their dream jobs through HireSetu. Apply in seconds, track in real-time.
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="mt-10 animate-slide-up"
            style={{ animationDelay: "0.45s" }}
          >
            <div className="flex items-center bg-white dark:bg-slate-900 rounded-2xl p-2 max-w-2xl shadow-2xl search-glow transition-all duration-300 border border-white/10">
              <div className="flex items-center gap-3 flex-1 px-3">
                <Search size={20} className="text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Job title, company, or skills..."
                  className="flex-1 bg-transparent outline-none text-slate-800 dark:text-white placeholder-slate-400 text-base"
                />
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1" />
              <div className="flex items-center gap-2 px-3 text-slate-400">
                <MapPin size={16} />
                <span className="text-sm hidden sm:block">India</span>
              </div>
              <button
                type="submit"
                className="ml-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:from-violet-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-violet-500/30 whitespace-nowrap"
              >
                Search Jobs
              </button>
            </div>

            {/* Trending Tags */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-slate-400 text-sm">Trending:</span>
              {["React Developer", "Data Scientist", "Product Manager", "DevOps"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => { setQuery(tag); navigate(`/jobs?q=${encodeURIComponent(tag)}`); }}
                  className="px-3 py-1 rounded-lg text-xs font-medium text-slate-300 glass-card hover:bg-violet-600/30 hover:text-white transition-all duration-200"
                >
                  {tag}
                </button>
              ))}
            </div>
          </form>

          {/* CTA Buttons */}
          <div
            className="mt-8 flex flex-wrap gap-3 animate-slide-up"
            style={{ animationDelay: "0.55s" }}
          >
            {user ? (
              <Link
                to="/jobs"
                className="group flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Explore Jobs <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="group flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105 active:scale-95 transition-all duration-200"
                >
                  Get Started Free <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/jobs"
                  className="flex items-center gap-2 glass-card text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/15 transition-all duration-200"
                >
                  Browse Jobs
                </Link>
              </>
            )}
          </div>

          {/* Floating Trust Badge */}
          <div
            className="mt-14 flex flex-wrap items-center gap-6 animate-fade-in"
            style={{ animationDelay: "0.7s" }}
          >
            {[
              { icon: "🏆", text: "Top Rated Platform" },
              { icon: "⚡", text: "1-Click Apply" },
              { icon: "🔒", text: "Verified Companies" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-slate-300 text-sm">
                <span>{item.icon}</span>
                <span className="font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce opacity-60">
          <div className="w-px h-8 bg-gradient-to-b from-white/0 to-white/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/60" />
        </div>
      </section>

      {/* ── STATS SECTION ─────────────────────────────── */}
      <section ref={statsRef} className="relative bg-white dark:bg-slate-900 py-16 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
          {[
            { icon: Briefcase, value: jobs, suffix: "+", label: "Active Jobs", sublabel: "Updated daily", color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20" },
            { icon: Building2, value: companies, suffix: "+", label: "Trusted Companies", sublabel: "Verified employers", color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
            { icon: Award, value: hired, suffix: "+", label: "People Hired", sublabel: "Success stories", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
          ].map(({ icon: Icon, value, suffix, label, sublabel, color, bg }) => (
            <div key={label} className="flex flex-col items-center py-10 px-8 text-center group">
              <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={26} className={color} />
              </div>
              <div className={`font-display text-4xl md:text-5xl font-black ${color}`}>
                {value.toLocaleString()}{suffix}
              </div>
              <div className="mt-1 text-slate-800 dark:text-slate-100 font-semibold text-lg">{label}</div>
              <div className="text-slate-400 text-sm mt-0.5">{sublabel}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── JOB CATEGORIES ────────────────────────────── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 text-sm font-semibold mb-3">
              <Zap size={14} /> EXPLORE BY CATEGORY
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
              Browse by Industry
            </h2>
            <p className="mt-4 text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
              From engineering to creative roles — find opportunities that match your passion and expertise.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map(({ icon: Icon, label, count, color }) => (
              <Link
                key={label}
                to={`/jobs?category=${label.toLowerCase()}`}
                className="group relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 card-hover overflow-hidden"
              >
                <div className="noise" />
                <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{label}</h3>
                <p className="text-slate-400 text-sm mt-1">{count} open roles</p>
                <ChevronRight
                  size={18}
                  className="absolute bottom-6 right-6 text-slate-300 dark:text-slate-600 group-hover:text-violet-500 group-hover:translate-x-1 transition-all duration-200"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED JOBS ─────────────────────────────── */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-4">
            <div>
              <span className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 text-sm font-semibold mb-3">
                <TrendingUp size={14} /> HOT OPPORTUNITIES
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
                Featured Jobs
              </h2>
            </div>
            <Link
              to="/jobs"
              className="group flex items-center gap-2 text-violet-600 dark:text-violet-400 font-semibold hover:gap-3 transition-all"
            >
              View all jobs <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredJobs.map((job) => (
              <Link
                key={job.id}
                to={`/jobs/${job.id}`}
                className="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 card-hover relative overflow-hidden"
              >
                <div className="noise" />
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${job.gradient} flex items-center justify-center text-white font-black text-lg shadow-lg`}>
                    {job.logo}
                  </div>
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                    {job.type}
                  </span>
                </div>

                <h3 className="font-semibold text-slate-900 dark:text-white text-lg leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {job.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">{job.company}</p>

                <div className="flex items-center gap-3 mt-3 text-slate-400 text-xs">
                  <span className="flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> Posted today</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {job.tags.map((tag) => (
                    <span key={tag} className="tag-chip px-2.5 py-1 rounded-lg text-xs font-medium">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white text-sm">{job.salary}</span>
                  <span className="text-violet-600 dark:text-violet-400 text-xs font-semibold group-hover:underline flex items-center gap-1">
                    Apply Now <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ─────────────────────────────── */}
      <section className="relative py-24 overflow-hidden bg-slate-950">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        </div>
        <div className="noise absolute inset-0 opacity-30" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-violet-400 text-sm font-semibold mb-4">
              <Shield size={14} /> WHY HIRESETU
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white">
              Built Different. Built Better.
            </h2>
            <p className="mt-4 text-slate-400 max-w-xl mx-auto">
              We're not just another job board. We're an end-to-end career acceleration platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                emoji: "⚡", title: "1-Click Applications",
                desc: "Your profile auto-fills everything. Apply to 10 jobs in the time it used to take 1. Track every status update live.",
                color: "border-amber-500/30 hover:border-amber-500/60"
              },
              {
                emoji: "🏆", title: "Elite Company Network",
                desc: "Every company is background-verified. We only partner with employers who respond within 72 hours.",
                color: "border-violet-500/30 hover:border-violet-500/60"
              },
              {
                emoji: "📊", title: "AI-Powered Matching",
                desc: "Our smart engine matches you with roles based on skills, culture fit, and salary expectations. No more spray and pray.",
                color: "border-emerald-500/30 hover:border-emerald-500/60"
              },
              {
                emoji: "💰", title: "Salary Intelligence",
                desc: "See real salary ranges before you apply. Negotiate from a position of power with live market data.",
                color: "border-blue-500/30 hover:border-blue-500/60"
              },
              {
                emoji: "🛡️", title: "Privacy First",
                desc: "Control who sees your resume. Go incognito from current employer. Your job search, your rules.",
                color: "border-rose-500/30 hover:border-rose-500/60"
              },
              {
                emoji: "🌐", title: "Remote & Global",
                desc: "From Bangalore to Berlin — access global remote opportunities. Your next job might not be in your city.",
                color: "border-cyan-500/30 hover:border-cyan-500/60"
              },
            ].map(({ emoji, title, desc, color }) => (
              <div
                key={title}
                className={`relative glass-card rounded-2xl p-6 border ${color} transition-all duration-300 card-hover`}
              >
                <div className="text-3xl mb-4">{emoji}</div>
                <h3 className="font-semibold text-white text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────── */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-violet-600 dark:text-violet-400 text-sm font-semibold mb-3">
              <Star size={14} /> SUCCESS STORIES
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
              Real People. Real Wins.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={t._id} className="relative bg-white dark:bg-slate-900 rounded-2xl p-7 border border-slate-100 dark:border-slate-800 card-hover overflow-hidden">
                <div className="flex text-amber-400 gap-0.5 mb-5">
                  {Array.from({ length: t.rating || 5 }).map((_, idx) => (
                    <Star key={idx} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm italic">"{t.message}"</p>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRADS[i % GRADS.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {t.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white text-sm">{t.name}</div>
                    <div className="text-slate-400 text-xs">{t.role || t.email}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-700 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.3),transparent_60%)]" />
        <Particles />

        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 text-sm font-medium mb-6 border border-white/20">
            <Globe size={14} /> Join 50,000+ professionals worldwide
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Your Dream Job is<br />One Click Away
          </h2>
          <p className="text-violet-200 text-lg max-w-xl mx-auto mb-10">
            Stop applying blindly. Start your smart job search with HireSetu today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {!user && (
              <Link
                to="/register"
                className="group flex items-center gap-2 bg-white text-violet-700 px-8 py-4 rounded-xl font-bold text-base shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Create Free Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            <Link
              to="/jobs"
              className="flex items-center gap-2 bg-white/10 backdrop-blur text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-base hover:bg-white/20 transition-all duration-200"
            >
              Browse 5000+ Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER MINI ───────────────────────────────── */}
{/* ── FOOTER ────────────────────────────────────── */}
<footer className="bg-slate-950 border-t border-white/[0.06]">

  {/* Main grid */}
  <div className="max-w-7xl mx-auto px-6 py-14">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">

      {/* Brand column */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Link to="/" className="flex items-center gap-2.5 w-fit">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Briefcase size={18} className="text-white" />
          </div>
          <span className="font-display text-xl font-black text-white tracking-tight">
            Hire<span className="text-violet-400">Setu</span>
          </span>
        </Link>

        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
          Connecting talent with opportunity — without the chaos.
          No spam jobs, no fake listings, no nonsense.
        </p>

        {/* Contact */}
        <div className="space-y-2.5">
          {[
            { icon: Mail,   label: "support@hiresetu.com", href: "mailto:support@hiresetu.com" },
            { icon: Phone,  label: "+91 98765 43210",      href: "tel:+919876543210"           },
            { icon: MapPin, label: "Mumbai, India",         href: null                          },
          ].map(({ icon: Icon, label, href }) => (
            href
              ? <a key={label} href={href} className="flex items-center gap-2 text-slate-400 hover:text-violet-400 text-sm transition-colors">
                  <Icon size={13} className="text-violet-500 flex-shrink-0" /> {label}
                </a>
              : <span key={label} className="flex items-center gap-2 text-slate-400 text-sm">
                  <Icon size={13} className="text-violet-500 flex-shrink-0" /> {label}
                </span>
          ))}
        </div>

        {/* Socials */}
        <div>
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-3">
            Follow us
          </p>
          <div className="flex gap-2">
            {[
              { icon: Facebook,  href: "https://facebook.com",  label: "Facebook"  },
              { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
              { icon: Twitter,   href: "https://twitter.com",   label: "Twitter"   },
              { icon: Linkedin,  href: "https://linkedin.com",  label: "LinkedIn"  },
              { icon: Github,    href: "https://github.com",    label: "GitHub"    },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-slate-400 hover:bg-violet-600/20 hover:border-violet-500/40 hover:text-violet-400 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Company links */}
      <div className="lg:col-span-1">
        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Company</h4>
        <ul className="space-y-3">
          {[
            { label: "About Us",      to: "/about"   },
            { label: "Contact Us",    to: "/contact" },
            { label: "Browse Jobs",   to: "/jobs"    },
            { label: "Careers",       to: "/jobs"    },
            { label: "Employer Home", to: "/admin"   },
          ].map(({ label, to }) => (
            <li key={label}>
              <Link
                to={to}
                className="text-slate-400 hover:text-violet-400 text-sm transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Support links */}
      <div className="lg:col-span-1">
        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Support</h4>
        <ul className="space-y-3">
          {[
            { label: "Help Center",       to: "/contact" },
            { label: "Report an Issue",   to: "/contact" },
            { label: "Grievances",        to: "/contact" },
            { label: "Summons / Notices", to: "/contact" },
          ].map(({ label, to }) => (
            <li key={label}>
              <Link
                to={to}
                className="text-slate-400 hover:text-violet-400 text-sm transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Legal links */}
      <div className="lg:col-span-1">
        <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">Legal</h4>
        <ul className="space-y-3">
          {[
            { label: "Privacy Policy",     to: "/privacy" },
            { label: "Terms & Conditions", to: "/terms"   },
            { label: "Fraud Alert",        to: "/terms"   },
            { label: "Trust & Safety",     to: "/terms"   },
          ].map(({ label, to }) => (
            <li key={label}>
              <Link
                to={to}
                className="text-slate-400 hover:text-violet-400 text-sm transition-colors"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* App download + CTA */}
      <div className="lg:col-span-1 flex flex-col gap-4">
        <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-5">
          <h4 className="text-white font-bold text-sm mb-1">Apply on the go</h4>
          <p className="text-slate-400 text-xs mb-4">Get real-time job updates</p>
          <div className="space-y-2.5">
            {/* Google Play */}
            <div className="bg-white/[0.06] border border-white/10 rounded-xl p-2.5 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="none">
                <path d="M3.18 23.76a2 2 0 0 1-.68-.56 2 2 0 0 1-.5-1.34V2.14c0-.5.18-.97.5-1.34.2-.22.43-.4.68-.55L14 12 3.18 23.76Z" fill="#4285F4"/>
                <path d="m14 12 3.22 3.22-10.8 6.22L14 12Z" fill="#34A853"/>
                <path d="M20.47 10.18 17.22 8.34 14 12l3.22 3.22 3.28-1.85a2 2 0 0 0 0-3.19Z" fill="#FBBC05"/>
                <path d="M6.42 2.56 14 12 10.78 15.22 3.18.24a2 2 0 0 1 3.24 2.32Z" fill="#EA4335"/>
              </svg>
              <div>
                <p className="text-slate-400 text-[9px] leading-none uppercase tracking-wider">Get it on</p>
                <p className="text-white text-xs font-bold mt-0.5">Google Play</p>
              </div>
            </div>
            {/* App Store */}
            <div className="bg-white/[0.06] border border-white/10 rounded-xl p-2.5 flex items-center gap-3 cursor-pointer hover:bg-white/10 transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0" fill="white">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div>
                <p className="text-slate-400 text-[9px] leading-none uppercase tracking-wider">Download on the</p>
                <p className="text-white text-xs font-bold mt-0.5">App Store</p>
              </div>
            </div>
          </div>
          <p className="text-slate-600 text-[10px] text-center mt-3">Coming soon</p>
        </div>

        <Link
          to="/jobs"
          className="flex items-center justify-between gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl text-white text-sm font-semibold shadow-lg shadow-violet-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Browse Jobs <ArrowRight size={15} />
        </Link>
      </div>
    </div>
  </div>

  {/* Bottom bar */}
  <div className="border-t border-white/[0.06]">
    <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-slate-500 text-xs text-center sm:text-left">
        © {new Date().getFullYear()} HireSetu. All rights reserved. Made with{" "}
        <Heart size={11} className="inline text-red-400 -mt-0.5" fill="currentColor" />{" "}
        in India.
      </p>
      <div className="flex items-center gap-5">
        {[
          { label: "Privacy", to: "/privacy" },
          { label: "Terms",   to: "/terms"   },
          { label: "Sitemap", to: "/"        },
        ].map(({ label, to }) => (
          <Link
            key={label}
            to={to}
            className="text-slate-500 hover:text-violet-400 text-xs transition-colors"
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  </div>
</footer>
</div>
  );
};

export default Home;