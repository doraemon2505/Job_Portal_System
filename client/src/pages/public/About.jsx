// pages/public/About.jsx
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Code2, Briefcase, Users, Building2, TrendingUp, Sparkles,
  ArrowRight, Github, Linkedin, CheckCircle2, Zap, Shield,
  Star, ChevronRight, X, ExternalLink, Heart, Coffee,
  Rocket, Target
} from "lucide-react";

/* ─── TEAM DATA ─────────────────────────────────────────────────────────────
   - `image`: paste a direct image URL, or leave "" for gradient initials
   - `initials`, `gradient` used as fallback
────────────────────────────────────────────────────────────────────────────── */
const TEAM = [
  {
    name:         "Suprit Rout",
    role:         "Lead Developer",
    tag:          "Founder & Creator",
    contribution: 85,
    image:        "", // e.g. "https://yourcdn.com/suprit.jpg"
    initials:     "SR",
    gradient:     "from-violet-500 to-indigo-600",
    bio:          "Built HireSetu from the ground up — both frontend and backend. Started as a learning project, evolved into a mission to make hiring actually human. Handles architecture, UI design, API design, database modelling, and deployment. Basically everything except the coffee.",
    skills:       ["React", "Node.js", "MongoDB", "Tailwind CSS", "Express.js"],
    github:       "https://github.com",
    linkedin:     "https://linkedin.com",
    email:        "suprit@hiresetu.com",
    fun:          "Responsible for ~85% of the codebase and 100% of the late-night debugging sessions.",
  },
  {
    name:         "Abhisek Kanar",
    role:         "Backend Developer",
    tag:          "API Specialist",
    contribution: 8,
    image:        "", // paste image URL here
    initials:     "AK",
    gradient:     "from-emerald-500 to-teal-600",
    bio:          "The person behind clean APIs and reliable server logic. Makes sure data flows smoothly so users can find their dream jobs without hitting a spinner for 10 seconds.",
    skills:       ["Node.js", "REST APIs", "MongoDB", "JWT Auth", "Docker"],
    github:       "https://github.com",
    linkedin:     "https://linkedin.com",
    email:        "abhisek@hiresetu.com",
    fun:          "If the API is fast, thank this person.",
  },
  {
    name:         "Salonee Lenka",
    role:         "UI/UX Designer",
    tag:          "Design Lead",
    contribution: 7,
    image:        "", // paste image URL here
    initials:     "SL",
    gradient:     "from-pink-500 to-rose-600",
    bio:          "The creative mind ensuring every pixel earns its place. Responsible for the visual identity that makes HireSetu look unlike any other job platform.",
    skills:       ["Figma", "CSS Animation", "Tailwind", "Motion Design", "UX Research"],
    github:       "https://github.com",
    linkedin:     "https://linkedin.com",
    email:        "salonee@hiresetu.com",
    fun:          "Has very strong opinions about border-radius. Always right about it.",
  },
];

const STATS = [
  { icon: Briefcase,  value: "85K+", label: "Active Jobs"    },
  { icon: Building2,  value: "12K+", label: "Companies"      },
  { icon: Users,      value: "2M+",  label: "Professionals"  },
  { icon: TrendingUp, value: "94%",  label: "Placement Rate" },
];

const FEATURES = [
  { icon: CheckCircle2, title: "Curated Listings",       text: "No spam. No 'entry-level requires 10 years experience' nonsense. Every listing is quality-checked.",    color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-50 dark:bg-violet-900/20" },
  { icon: Zap,          title: "One-Click Apply",         text: "Your profile pre-fills the form. Apply in seconds, not hours. Because you have better things to do.",   color: "text-amber-600 dark:text-amber-400",  bg: "bg-amber-50 dark:bg-amber-900/20"  },
  { icon: Shield,       title: "Verified Companies",      text: "Only trusted, real companies post jobs here. If it sounds too good to be true, we've filtered it out.", color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { icon: Star,         title: "Personalized Dashboard",  text: "Track every application, save jobs, see your status. Your career search, organised in one place.",     color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-50 dark:bg-blue-900/20"    },
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap');
  * { font-family: 'Figtree', sans-serif; }
  .font-display { font-family: 'Syne', sans-serif !important; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes scaleIn  { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
  @keyframes slideL   { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
  @keyframes gradS    { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

  .au { animation: fadeUp  0.6s ease both; }
  .ai { animation: fadeIn  0.4s ease both; }
  .as { animation: scaleIn 0.4s cubic-bezier(0.34,1.3,0.64,1) both; }
  .al { animation: slideL  0.5s ease both; }

  .gradient-text {
    background: linear-gradient(135deg,#7c3aed,#4f46e5,#0ea5e9,#7c3aed);
    background-size:300% auto; -webkit-background-clip:text;
    -webkit-text-fill-color:transparent; background-clip:text;
    animation: gradS 6s ease infinite;
  }
  .ch { transition: transform 0.25s ease, box-shadow 0.25s ease; }
  .ch:hover { transform: translateY(-5px); box-shadow: 0 20px 44px -12px rgba(0,0,0,0.15); }
  .dark .ch:hover { box-shadow: 0 20px 44px -12px rgba(0,0,0,0.5); }
  .float-el { animation: float 4s ease-in-out infinite; }
  .lb-bg { animation: fadeIn  0.2s ease both; }
  .lb-card{ animation: scaleIn 0.3s cubic-bezier(0.34,1.2,0.64,1) both; }
`;

/* ── Animated counter ──────────────────────────────────────────────────────── */
const useCounter = (target, active) => {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const num = parseInt(target.replace(/\D/g, ""));
    const step = Math.ceil(num / (1800 / 16));
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, num);
      setVal(cur);
      if (cur >= num) clearInterval(t);
    }, 16);
    return () => clearInterval(t);
  }, [active]);
  return val === 0 ? target : val + target.replace(/[0-9]/g, "");
};

const StatCard = ({ icon: Icon, value, label, delay, active }) => {
  const display = useCounter(value, active);
  return (
    <div className="text-center au" style={{ animationDelay: delay, opacity: 0 }}>
      <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center mx-auto mb-3">
        <Icon size={22} className="text-violet-600 dark:text-violet-400" />
      </div>
      <div className="font-display text-3xl md:text-4xl font-black text-slate-900 dark:text-white">{display}</div>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">{label}</p>
    </div>
  );
};

/* ── Team Lightbox ─────────────────────────────────────────────────────────── */
const Lightbox = ({ member, onClose }) => {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 lb-bg" style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-lg overflow-hidden lb-card" onClick={e => e.stopPropagation()}>
        <div className={`h-1.5 bg-gradient-to-r ${member.gradient}`} />
        <div className="p-7">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0">
              {member.image
                ? <img src={member.image} alt={member.name} className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-slate-800 shadow-xl" onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}} />
                : null}
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-2xl font-black shadow-xl ${member.image?"hidden":"flex"}`}>{member.initials}</div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white">{member.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{member.role}</p>
                  <span className={`inline-block mt-2 text-[11px] font-bold px-3 py-1 rounded-full bg-gradient-to-r ${member.gradient} text-white`}>{member.tag}</span>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors flex-shrink-0 mt-0.5"><X size={15} /></button>
              </div>
            </div>
          </div>

          {/* Contribution */}
          <div className="mb-5">
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1.5">
              <span>Contribution to HireSetu</span>
              <span className="text-violet-600 dark:text-violet-400">{member.contribution}%</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className={`h-full bg-gradient-to-r ${member.gradient} rounded-full`} style={{ width: `${member.contribution}%`, transition: "width 1.4s cubic-bezier(0.4,0,0.2,1)" }} />
            </div>
          </div>

          <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">{member.bio}</p>

          {/* Fun fact */}
          <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800 mb-4">
            <Coffee size={14} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300 italic">{member.fun}</p>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {member.skills.map(s => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border border-violet-100 dark:border-violet-800 font-medium">{s}</span>
            ))}
          </div>

          {/* Social links */}
          <div className="flex gap-3">
            {member.github && (
              <a href={member.github} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <Github size={13} /> GitHub
              </a>
            )}
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
                <Linkedin size={13} /> LinkedIn
              </a>
            )}
            {member.email && (
              <a href={`mailto:${member.email}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors">
                <ExternalLink size={13} /> Email
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main ──────────────────────────────────────────────────────────────────── */
const About = () => {
  const [lightbox,    setLightbox]    = useState(null);
  const [tab,         setTab]         = useState("seekers");
  const [statsOn,     setStatsOn]     = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsOn(true); }, { threshold: 0.25 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden">
      <style>{CSS}</style>
      {lightbox && <Lightbox member={lightbox} onClose={() => setLightbox(null)} />}

      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative pt-28 pb-24 px-6 overflow-hidden">
        <div className="absolute top-10 left-1/4 w-80 h-80 bg-violet-200/25 dark:bg-violet-900/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-indigo-200/25 dark:bg-indigo-900/15 rounded-full blur-3xl" />
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-widest mb-8 au" style={{ opacity: 0 }}>
            <Sparkles size={11} /> Our Story
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.0] tracking-tight mb-6 au" style={{ animationDelay: "0.1s", opacity: 0 }}>
            About <span className="gradient-text">HireSetu</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-light max-w-3xl mx-auto leading-relaxed mb-6 au" style={{ animationDelay: "0.18s", opacity: 0 }}>
            Connecting talent with opportunity — <em>without the chaos.</em>
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl px-5 py-3 text-amber-800 dark:text-amber-300 text-sm font-medium au" style={{ animationDelay: "0.28s", opacity: 0 }}>
            <Coffee size={14} /> Because life is too short to scroll through 500 irrelevant job posts.
          </div>
        </div>
      </section>

      {/* ── STORY ────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div className="au" style={{ opacity: 0 }}>
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-4 block">How it started</span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-6">
              Finding the right job<br />
              <span className="gradient-text">shouldn't feel like</span><br />
              searching for a needle<br />in a haystack.
            </h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              At <strong className="text-slate-800 dark:text-white">HireSetu</strong>, we simplify the job hunt by bringing companies and talented professionals together in one place. No fluff, no 47-step application forms, no ghosting.
            </p>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
              What started as a learning project by <strong className="text-violet-600 dark:text-violet-400">Suprit Rout</strong> quickly became a mission — to build a smarter job platform for both job seekers and the admins who hire them.
            </p>
          </div>
          <div className="relative al" style={{ animationDelay: "0.15s", opacity: 0 }}>
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl">
              <div className="text-5xl text-violet-400 font-serif mb-4">"</div>
              <p className="text-lg font-light leading-relaxed text-white/90 mb-6">
                Our goal is to become a platform where talent meets opportunity without barriers. No spam jobs. No fake listings. No <em>"entry-level requires 10 years experience"</em> nonsense.
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center font-black text-sm">SR</div>
                <div>
                  <p className="font-bold text-sm">Suprit Rout</p>
                  <p className="text-white/50 text-xs">Founder, HireSetu</p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-violet-200 dark:bg-violet-900/30 rounded-2xl -z-10 float-el" />
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────── */}
      <section ref={statsRef} className="py-20 px-6 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
          {STATS.map(({ icon, value, label }, i) => (
            <StatCard key={label} icon={icon} value={value} label={label} delay={`${i * 0.1}s`} active={statsOn} />
          ))}
        </div>
      </section>

      {/* ── MISSION & VISION ─────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3 block">What drives us</span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white">Mission & Vision</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-3xl p-8 text-white ch shadow-xl shadow-violet-500/20">
              <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center mb-5">
                <Rocket size={22} className="text-white" />
              </div>
              <h3 className="font-display font-black text-2xl mb-4">Our Mission</h3>
              <p className="text-white/80 leading-relaxed">To empower job seekers with transparent, fast, and easy access to verified opportunities from trusted companies worldwide. We match real skills with real roles — not keyword soup.</p>
              <div className="mt-6 flex items-center gap-2 text-white/55 text-xs font-semibold"><Heart size={12} /> Built with purpose, not just profit.</div>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 ch shadow-xl">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-5">
                <Target size={22} className="text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white mb-4">Our Vision</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">To become the most trusted job platform where companies and professionals connect seamlessly — with smarter job matching, better employer tools, and a personalised experience that actually works.</p>
              <div className="mt-6 flex items-center gap-2 text-slate-400 text-xs font-semibold"><TrendingUp size={12} /> Continuously improving every day.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY HIRESETU ─────────────────────────────────── */}
      <section className="py-24 px-6 bg-slate-900 dark:bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-3 block">No fluff, just facts</span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mb-4">Why Choose HireSetu?</h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">Unlike traditional job boards, we focus on quality over quantity — meaningful opportunities that match real skills and career goals.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, title, text, color, bg }, i) => (
              <div key={title} className="bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.07] rounded-2xl p-6 transition-all duration-200 au" style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon size={18} className={color} />
                </div>
                <h3 className="font-display font-bold text-white text-base mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3 block">Simple by design</span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white">How It Works</h2>
          </div>
          <div className="flex justify-center mb-10">
            <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-1.5 gap-1">
              {[{ id: "seekers", label: "For Job Seekers", icon: Users }, { id: "admins", label: "For Admins", icon: Building2 }].map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === id ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-5 as" style={{ opacity: 0 }} key={tab}>
            {(tab === "seekers" ? [
              { step: "01", icon: Users,        color: "bg-violet-100 dark:bg-violet-900/30", ic: "text-violet-600 dark:text-violet-400", num: "text-violet-200 dark:text-violet-900/50", title: "Create Your Profile",   text: "Set up with your skills, resume link, and portfolio. Takes 3 minutes, not 3 hours." },
              { step: "02", icon: Briefcase,    color: "bg-violet-100 dark:bg-violet-900/30", ic: "text-violet-600 dark:text-violet-400", num: "text-violet-200 dark:text-violet-900/50", title: "Explore Curated Jobs",  text: "Browse verified listings. Filter by type, location, or salary — find what actually fits." },
              { step: "03", icon: Zap,          color: "bg-violet-100 dark:bg-violet-900/30", ic: "text-violet-600 dark:text-violet-400", num: "text-violet-200 dark:text-violet-900/50", title: "Apply in One Click",    text: "Your profile pre-fills the application. Apply, then track status from your dashboard." },
            ] : [
              { step: "01", icon: Briefcase,    color: "bg-amber-100 dark:bg-amber-900/30",   ic: "text-amber-600 dark:text-amber-400",   num: "text-amber-200 dark:text-amber-900/40",  title: "Post Job Openings",    text: "Create listings with salary, skills, job type in minutes. Preview before publishing." },
              { step: "02", icon: Users,        color: "bg-amber-100 dark:bg-amber-900/30",   ic: "text-amber-600 dark:text-amber-400",   num: "text-amber-200 dark:text-amber-900/40",  title: "Review Applications",  text: "See all applicants in one place. View resumes, sort by status, shortlist with one click." },
              { step: "03", icon: CheckCircle2, color: "bg-amber-100 dark:bg-amber-900/30",   ic: "text-amber-600 dark:text-amber-400",   num: "text-amber-200 dark:text-amber-900/40",  title: "Hire the Best Talent", text: "Contact shortlisted candidates directly. Update status to keep everyone informed." },
            ]).map(({ step, icon: Icon, color, ic, num, title, text }) => (
              <div key={step} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 ch">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`font-display text-4xl font-black ${num}`}>{step}</span>
                  <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}><Icon size={18} className={ic} /></div>
                </div>
                <h3 className="font-display font-bold text-slate-900 dark:text-white text-base mb-2">{title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3 block">The humans behind the code</span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">Meet the Team</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base max-w-xl mx-auto">A small team with a big mission. <strong>Click any card</strong> to learn more about each member.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TEAM.map((m, i) => (
              <button key={m.name} onClick={() => setLightbox(m)} className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 text-left ch cursor-pointer w-full group au" style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}>
                <div className="mb-5 relative">
                  {m.image
                    ? <img src={m.image} alt={m.name} className="w-20 h-20 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform duration-300" onError={e=>{e.target.style.display="none";e.target.nextSibling.style.display="flex";}} />
                    : null}
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${m.gradient} flex items-center justify-center text-white text-2xl font-black shadow-lg group-hover:scale-105 transition-transform duration-300 ${m.image?"hidden":"flex"}`}>{m.initials}</div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity border border-slate-100 dark:border-slate-600">
                    <ExternalLink size={10} className="text-violet-600 dark:text-violet-400" />
                  </div>
                </div>
                <div className={`h-0.5 w-8 bg-gradient-to-r ${m.gradient} rounded-full mb-4 group-hover:w-14 transition-all duration-300`} />
                <h3 className="font-display font-black text-lg text-slate-900 dark:text-white mb-0.5">{m.name}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">{m.role}</p>
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1"><span>Contribution</span><span className="font-bold text-violet-600 dark:text-violet-400">{m.contribution}%</span></div>
                  <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${m.gradient} rounded-full`} style={{ width: `${m.contribution}%` }} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {m.skills.slice(0, 3).map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 font-semibold border border-violet-100 dark:border-violet-800">{s}</span>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  Click to learn more <ChevronRight size={11} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 rounded-3xl p-12 shadow-2xl shadow-violet-500/20 text-white">
            <Sparkles size={28} className="mx-auto mb-4 opacity-80" />
            <h2 className="font-display text-4xl font-black mb-4">Ready to Find Your Next Role?</h2>
            <p className="text-white/75 text-base mb-8 max-w-lg mx-auto leading-relaxed">Join 2M+ professionals who use HireSetu to find work that actually excites them. No spam, no nonsense, no 10-year requirements for entry-level jobs.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/jobs" className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-violet-700 rounded-xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"><Briefcase size={15} /> Browse Jobs</Link>
              <Link to="/register" className="flex items-center justify-center gap-2 px-7 py-3.5 bg-white/15 border border-white/30 text-white rounded-xl font-bold text-sm hover:bg-white/25 transition-all">Create Free Account <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;