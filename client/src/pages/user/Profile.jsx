// pages/public/Profile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import {
  User, Mail, Phone, Github, Linkedin, FileText, Edit3, Save,
  X, LogOut, Briefcase, Bookmark, Bell, CheckCircle2, Clock,
  XCircle, AlertCircle, Eye, ExternalLink, ChevronRight,
  Image as ImageIcon, Link as LinkIcon, Sparkles, Loader2,
  AlertTriangle, Building2, MapPin, Calendar
} from "lucide-react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap');
  * { font-family: 'Figtree', sans-serif; }
  .font-display { font-family: 'Syne', sans-serif !important; }
  @keyframes slideIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes pulse   { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
  @keyframes gradS   { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  .au { animation: slideIn 0.4s ease both; }
  .ai { animation: fadeIn  0.25s ease both; }
  .badge-pulse { animation: pulse 2s ease-in-out infinite; }
  .gradient-text {
    background: linear-gradient(135deg,#7c3aed,#4f46e5,#0ea5e9);
    background-size:200% auto; -webkit-background-clip:text;
    -webkit-text-fill-color:transparent; background-clip:text;
    animation: gradS 4s ease infinite;
  }
`;

const INPUT = "w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all";

const STATUS = {
  pending:     { label: "Pending",     cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",    icon: Clock       },
  reviewed:    { label: "Reviewed",    cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",         icon: Eye         },
  shortlisted: { label: "Shortlisted", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle2 },
  rejected:    { label: "Rejected",    cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",             icon: XCircle     },
};

const GRADS = ["from-violet-500 to-indigo-600","from-pink-500 to-rose-500","from-emerald-500 to-teal-500","from-amber-500 to-orange-500","from-blue-500 to-cyan-500"];

/* ── Logout Confirm Modal ──────────────────────────────────────────────────── */
const LogoutModal = ({ onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 ai" style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }} onClick={onCancel}>
    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-sm overflow-hidden au" onClick={e => e.stopPropagation()}>
      <div className="h-1 bg-gradient-to-r from-red-400 to-orange-500" />
      <div className="p-7 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <LogOut size={28} className="text-red-500" />
        </div>
        <h3 className="font-display font-black text-xl text-slate-900 dark:text-white mb-2">Sign out?</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
          You'll need to sign in again to access your profile, saved jobs, and applications.
        </p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            Stay logged in
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-500/25">
            Yes, sign out
          </button>
        </div>
      </div>
    </div>
  </div>
);

/* ── Status Badge ──────────────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.pending;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${s.cls}`}>
      <Icon size={11} /> {s.label}
    </span>
  );
};

/* ── Main ──────────────────────────────────────────────────────────────────── */
const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [tab,          setTab]          = useState("profile");
  const [editing,      setEditing]      = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [showLogout,   setShowLogout]   = useState(false);
  const [applications, setApplications] = useState([]);
  const [savedJobs,    setSavedJobs]    = useState([]);
  const [loadingApps,  setLoadingApps]  = useState(false);
  const [saveMsg,      setSaveMsg]      = useState("");

  const [form, setForm] = useState({
    name:         user?.name         || "",
    phone:        user?.phone        || "",
    resumeUrl:    user?.resumeUrl    || "",
    githubUrl:    user?.githubUrl    || "",
    linkedinUrl:  user?.linkedinUrl  || "",
    profileImage: user?.profileImage || "",
  });

  const hasUnread = applications.some(a => a.status === "shortlisted" || a.status === "reviewed");

  // Fetch applications
  useEffect(() => {
    if (!user) return;
    setLoadingApps(true);
    api.get("/application/my")
      .then(res => setApplications(res.data?.applications || []))
      .catch(() => {})
      .finally(() => setLoadingApps(false));
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // TODO: replace with your actual update endpoint
      // await api.put("/auth/update", form);
      await new Promise(r => setTimeout(r, 1000)); // simulate
      if (updateUser) updateUser({ ...user, ...form });
      setSaveMsg("Profile updated successfully!");
      setEditing(false);
      setTimeout(() => setSaveMsg(""), 3000);
    } catch {
      setSaveMsg("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = (user?.name || "U").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <style>{CSS}</style>
      <div className="text-center">
        <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User size={28} className="text-violet-500" />
        </div>
        <p className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">Not logged in</p>
        <p className="text-slate-400 text-sm mb-4">Please sign in to view your profile.</p>
        <button onClick={() => navigate("/login")} className="px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold text-sm hover:scale-105 transition-transform">Go to Sign In</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-16 transition-colors duration-300">
      <style>{CSS}</style>
      {showLogout && <LogoutModal onConfirm={handleLogout} onCancel={() => setShowLogout(false)} />}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Profile Header Card ─────────────────────────── */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden mb-6 au" style={{ opacity: 0 }}>
          {/* Gradient banner */}
          <div className="h-28 bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 relative">
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%)" }} />
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row items-start gap-4 -mt-12 mb-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                {form.profileImage ? (
                  <img
                    src={form.profileImage}
                    alt={user.name}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-white dark:border-slate-900 shadow-xl"
                    onError={e => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                  />
                ) : null}
                <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-black border-4 border-white dark:border-slate-900 shadow-xl ${form.profileImage ? "hidden" : "flex"}`}>
                  {initials}
                </div>
                {hasUnread && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full badge-pulse" />
                )}
              </div>

              <div className="flex-1 min-w-0 pt-14 sm:pt-14">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <h1 className="font-display font-black text-2xl text-slate-900 dark:text-white">{user.name}</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1.5 mt-0.5">
                      <Mail size={13} /> {user.email}
                    </p>
                    <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full capitalize ${user.role === "admin" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"}`}>
                      {user.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {!editing ? (
                      <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 active:scale-95 transition-all shadow-lg shadow-violet-500/20">
                        <Edit3 size={14} /> Edit Profile
                      </button>
                    ) : (
                      <>
                        <button onClick={() => setEditing(false)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                          <X size={14} /> Cancel
                        </button>
                        <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-60 shadow-lg shadow-emerald-500/20">
                          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                          {saving ? "Saving..." : "Save Changes"}
                        </button>
                      </>
                    )}
                    <button onClick={() => setShowLogout(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Save success */}
            {saveMsg && (
              <div className={`flex items-center gap-2.5 p-3.5 rounded-xl text-sm font-medium mb-2 ${saveMsg.includes("success") ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"}`}>
                {saveMsg.includes("success") ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
                {saveMsg}
              </div>
            )}
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────── */}
        <div className="flex bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-1.5 gap-1 mb-6 au" style={{ animationDelay: "0.08s", opacity: 0 }}>
          {[
            { id: "profile",  label: "Profile",       icon: User     },
            { id: "applied",  label: "Applications",  icon: Briefcase, badge: applications.filter(a => a.status === "shortlisted").length },
            { id: "saved",    label: "Saved Jobs",     icon: Bookmark  },
          ].map(({ id, label, icon: Icon, badge }) => (
            <button key={id} onClick={() => setTab(id)} className={`relative flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === id ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/20" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"}`}>
              <Icon size={15} /> {label}
              {badge > 0 && (
                <span className="absolute -top-1.5 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 badge-pulse">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── PROFILE TAB ──────────────────────────────────── */}
        {tab === "profile" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 au" style={{ animationDelay: "0.12s", opacity: 0 }}>
            <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <User size={18} className="text-violet-600 dark:text-violet-400" /> Profile Information
              {editing && <span className="ml-2 text-xs font-semibold px-2.5 py-1 rounded-lg bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400">Editing</span>}
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Profile Image URL */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                  Profile Image URL
                </label>
                <div className="flex gap-3 items-start">
                  <div className="relative flex-1">
                    <ImageIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="url" value={form.profileImage}
                      onChange={e => setForm(f => ({ ...f, profileImage: e.target.value }))}
                      placeholder="https://cdn.example.com/your-photo.jpg"
                      disabled={!editing}
                      className={`${INPUT} pl-10 ${!editing ? "opacity-60 cursor-default" : ""}`}
                    />
                  </div>
                  {form.profileImage && (
                    <img src={form.profileImage} alt="preview" className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0" onError={e => e.target.style.display="none"} />
                  )}
                </div>
                {editing && <p className="text-xs text-slate-400 mt-1.5">Paste a direct image URL — any size will auto-fit in the circular avatar above.</p>}
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} disabled={!editing} placeholder="Your full name" className={`${INPUT} pl-10 ${!editing ? "opacity-60 cursor-default" : ""}`} />
                </div>
              </div>

              {/* Email (read only) */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" value={user.email} disabled placeholder="Email" className={`${INPUT} pl-10 opacity-60 cursor-default`} />
                </div>
                <p className="text-xs text-slate-400 mt-1">Email cannot be changed.</p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} disabled={!editing} placeholder="+91 98765 43210" className={`${INPUT} pl-10 ${!editing ? "opacity-60 cursor-default" : ""}`} />
                </div>
              </div>

              {/* Resume URL */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Resume (Google Drive Link)</label>
                <div className="relative">
                  <FileText size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="url" value={form.resumeUrl} onChange={e => setForm(f => ({ ...f, resumeUrl: e.target.value }))} disabled={!editing} placeholder="https://drive.google.com/file/d/..." className={`${INPUT} pl-10 ${!editing ? "opacity-60 cursor-default" : ""}`} />
                </div>
                {form.resumeUrl && (
                  <a href={form.resumeUrl} target="_blank" rel="noreferrer" className="text-xs text-violet-600 dark:text-violet-400 hover:underline flex items-center gap-1 mt-1.5 font-medium">
                    <ExternalLink size={10} /> Preview resume
                  </a>
                )}
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">GitHub Profile</label>
                <div className="relative">
                  <svg viewBox="0 0 24 24" className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 fill-current text-slate-400" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                  <input type="url" value={form.githubUrl} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} disabled={!editing} placeholder="https://github.com/yourusername" className={`${INPUT} pl-10 ${!editing ? "opacity-60 cursor-default" : ""}`} />
                </div>
              </div>

              {/* LinkedIn */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">LinkedIn Profile</label>
                <div className="relative">
                  <Linkedin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="url" value={form.linkedinUrl} onChange={e => setForm(f => ({ ...f, linkedinUrl: e.target.value }))} disabled={!editing} placeholder="https://linkedin.com/in/yourprofile" className={`${INPUT} pl-10 ${!editing ? "opacity-60 cursor-default" : ""}`} />
                </div>
              </div>
            </div>

            {/* Quick links row */}
            {(form.githubUrl || form.linkedinUrl || form.resumeUrl) && !editing && (
              <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
                {form.githubUrl && (
                  <a href={form.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                    GitHub
                  </a>
                )}
                {form.linkedinUrl && (
                  <a href={form.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors">
                    <Linkedin size={13} /> LinkedIn
                  </a>
                )}
                {form.resumeUrl && (
                  <a href={form.resumeUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors">
                    <FileText size={13} /> View Resume
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── APPLICATIONS TAB ─────────────────────────────── */}
        {tab === "applied" && (
          <div className="au" style={{ animationDelay: "0.12s", opacity: 0 }}>
            {/* Notification banner */}
            {applications.some(a => a.status === "shortlisted") && (
              <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl mb-4">
                <div className="w-9 h-9 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm">Great news! 🎉</p>
                  <p className="text-emerald-700 dark:text-emerald-400 text-xs mt-0.5">
                    You've been shortlisted for {applications.filter(a => a.status === "shortlisted").length} job{applications.filter(a => a.status === "shortlisted").length > 1 ? "s" : ""}. Check below!
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase size={18} className="text-violet-600 dark:text-violet-400" /> My Applications
                </h2>
                <span className="text-xs text-slate-400 font-medium">{applications.length} total</span>
              </div>

              {loadingApps ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                  <p className="text-slate-400 text-sm">Loading applications...</p>
                </div>
              ) : applications.length === 0 ? (
                <div className="flex flex-col items-center py-16 gap-3">
                  <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                    <Briefcase size={26} className="text-slate-400" />
                  </div>
                  <p className="font-display font-bold text-lg text-slate-800 dark:text-white">No applications yet</p>
                  <p className="text-slate-400 text-sm">Browse jobs and start applying!</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {applications.map((app, i) => {
                    const isExpired = app.job?.deadline && new Date(app.job.deadline) < new Date();
                    const notSelected = ["rejected"].includes(app.status);
                    return (
                      <div key={app._id} className={`p-5 flex items-start gap-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/40 ${isExpired ? "opacity-50" : ""}`}>
                        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${GRADS[i % GRADS.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0 ${isExpired ? "grayscale" : ""}`}>
                          {(app.job?.title || "J").charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 flex-wrap">
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white text-sm">{app.job?.title || "—"}</p>
                              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                                <Building2 size={10} />
                                {typeof app.job?.company === "string" ? app.job.company : app.job?.company?.name || "—"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {notSelected && (
                                <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                                  <Bell size={12} className="badge-pulse" /> Not selected
                                </div>
                              )}
                              <StatusBadge status={app.status} />
                            </div>
                          </div>
                          {isExpired && (
                            <span className="inline-flex items-center gap-1 text-xs text-slate-400 mt-1.5">
                              <Clock size={10} /> Application period ended
                            </span>
                          )}
                          {app.createdAt && (
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                              <Calendar size={10} /> Applied {new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SAVED JOBS TAB ───────────────────────────────── */}
        {tab === "saved" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 overflow-hidden au" style={{ animationDelay: "0.12s", opacity: 0 }}>
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <Bookmark size={18} className="text-violet-600 dark:text-violet-400" /> Saved Jobs
              </h2>
            </div>
            {/* Saved jobs come from local state / API - showing empty state for now */}
            <div className="flex flex-col items-center py-16 gap-3">
              <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                <Bookmark size={26} className="text-slate-400" />
              </div>
              <p className="font-display font-bold text-lg text-slate-800 dark:text-white">No saved jobs yet</p>
              <p className="text-slate-400 text-sm">Click the bookmark icon on any job card to save it here.</p>
              <a href="/jobs" className="flex items-center gap-2 mt-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-violet-500/20">
                <Briefcase size={14} /> Browse Jobs
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;