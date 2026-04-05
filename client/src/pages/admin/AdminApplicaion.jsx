import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
  FileText, Search, X, Trash2, ChevronDown, Mail, Phone,
  Building2, Clock, CheckCircle2, AlertCircle, XCircle, Loader2,
  Eye, ExternalLink, User, Briefcase
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap');
  * { font-family: 'Figtree', sans-serif; }
  .font-display { font-family: 'Syne', sans-serif !important; }
  @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  .animate-slide-up  { animation: slideUp 0.4s ease forwards; }
  .modal-enter  { animation: slideUp 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
  .overlay-enter{ animation: fadeIn  0.2s ease forwards; }
`;

const GRADS = ["from-violet-500 to-indigo-600","from-pink-500 to-rose-500","from-emerald-500 to-teal-500","from-amber-500 to-orange-500","from-blue-500 to-cyan-500","from-indigo-500 to-purple-600"];

const STATUS_CONFIG = {
  pending:     { label: "Pending",     bg: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",     icon: Clock         },
  reviewed:    { label: "Reviewed",    bg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",          icon: AlertCircle   },
  shortlisted: { label: "Shortlisted", bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle2 },
  rejected:    { label: "Rejected",    bg: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",              icon: XCircle       },
};

// status select colors
const STATUS_SELECT_CLS = {
  pending:     "bg-amber-50   text-amber-700   border-amber-200   dark:bg-amber-900/20   dark:text-amber-400   dark:border-amber-800",
  reviewed:    "bg-blue-50    text-blue-700    border-blue-200    dark:bg-blue-900/20    dark:text-blue-400    dark:border-blue-800",
  shortlisted: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  rejected:    "bg-red-50     text-red-700     border-red-200     dark:bg-red-900/20     dark:text-red-400     dark:border-red-800",
};

const StatusBadge = ({ status }) => {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${s.bg}`}>
      <Icon size={11} /> {s.label}
    </span>
  );
};

// ── View Application Modal ────────────────────────────────────────────────────
const ViewModal = ({ app, onClose }) => {
  if (!app) return null;
  const company = app.job?.company ? (typeof app.job.company === "string" ? app.job.company : app.job.company?.name) : null;

  const isGDriveLink = (url) => url && (url.includes("drive.google.com") || url.includes("docs.google.com"));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-enter"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 modal-enter overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 flex items-center justify-between">
          <div>
            <h3 className="font-display font-black text-lg text-white">Applicant Details</h3>
            <p className="text-white/50 text-xs mt-0.5">{app.job?.title || "Job Application"}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/60 hover:text-white transition-all">
            <X size={15} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Applicant info */}
          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-lg font-black flex-shrink-0">
              {app.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{app.name}</p>
              <StatusBadge status={app.status} />
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail size={14} className="text-violet-600 dark:text-violet-400" />
              </div>
              <a href={`mailto:${app.email}`} className="text-slate-700 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">{app.email}</a>
            </div>
            {app.phone && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={14} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="text-slate-700 dark:text-slate-200">{app.phone}</span>
              </div>
            )}
            {app.job?.title && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase size={14} className="text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-slate-700 dark:text-slate-200">{app.job.title}{company ? ` · ${company}` : ""}</span>
              </div>
            )}
          </div>

          {/* Cover Letter */}
          {app.coverLetter && (
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Cover Letter</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 rounded-xl p-4">{app.coverLetter}</p>
            </div>
          )}

          {/* Links */}
          <div className="space-y-2">
            {/* Resume — Google Drive link */}
            {app.resumeUrl ? (
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Resume</p>
                {isGDriveLink(app.resumeUrl) ? (
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3.5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors group"
                  >
                    <div className="w-9 h-9 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                      <svg viewBox="0 0 24 24" className="w-5 h-5"><path d="M6.6 0L0 11l3.3 5.7L9.9 5.7z" fill="#0F9D58"/><path d="M17.4 0H6.6l6.6 11h10.8z" fill="#4285F4"/><path d="M16.5 16.7L13.2 11H2.4L0 16.7z" fill="#FBBC05"/><path d="M20.1 11h-6.9l3.3 5.7 3.6-5.7z" fill="#EA4335"/></svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 group-hover:underline">View Resume on Google Drive</p>
                      <p className="text-xs text-slate-400 truncate">{app.resumeUrl}</p>
                    </div>
                    <ExternalLink size={15} className="text-blue-500 flex-shrink-0" />
                  </a>
                ) : (
                  <a
                    href={app.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-violet-400 transition-colors group"
                  >
                    <FileText size={18} className="text-red-500 flex-shrink-0" />
                    <span className="flex-1 text-sm font-semibold text-slate-700 dark:text-slate-300 truncate group-hover:text-violet-600 dark:group-hover:text-violet-400">{app.resumeUrl}</span>
                    <ExternalLink size={14} className="text-slate-400 flex-shrink-0" />
                  </a>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-400 text-sm border border-slate-200 dark:border-slate-700">
                <FileText size={16} /> No resume link provided
              </div>
            )}

            {app.portfolioUrl && (
              <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors border border-slate-200 dark:border-slate-700 hover:border-violet-300">
                <ExternalLink size={15} /> View Portfolio / LinkedIn
              </a>
            )}
            {app.githubUrl && (
              <a href={app.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                View GitHub Profile
              </a>
            )}
          </div>

          <button onClick={onClose} className="w-full py-3 bg-slate-900 dark:bg-slate-700 hover:bg-amber-500 text-white font-bold text-sm rounded-xl transition-all duration-300 hover:-translate-y-0.5 mt-2">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminApplication = () => {
  const [applications, setApplications] = useState([]);
  const [filtered,     setFiltered]     = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingId,   setUpdatingId]   = useState(null);
  const [deletingId,   setDeletingId]   = useState(null);
  const [viewApp,      setViewApp]      = useState(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/application");
      setApplications(res.data?.applications || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  useEffect(() => {
    let res = [...applications];
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(a =>
        a.name?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.job?.title?.toLowerCase().includes(q)
      );
    }
    if (statusFilter !== "all") res = res.filter(a => a.status === statusFilter);
    setFiltered(res);
  }, [search, statusFilter, applications]);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.put(`/application/${id}`, { status });
      setApplications(prev => prev.map(a => a._id === id ? { ...a, status } : a));
    } catch (err) {
      console.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/application/${id}`);
      setApplications(prev => prev.filter(a => a._id !== id));
    } catch (err) {
      console.error("Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  const countByStatus = (s) => applications.filter(a => a.status === s).length;

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <style>{STYLES}</style>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading applications...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6 lg:p-8 transition-colors duration-300">
      <style>{STYLES}</style>

      {/* View Modal */}
      {viewApp && <ViewModal app={viewApp} onClose={() => setViewApp(null)} />}

      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">Applications</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{applications.length} total · {filtered.length} shown</p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-slide-up" style={{ animationDelay: "0.08s", opacity: 0 }}>
        {Object.entries(STATUS_CONFIG).map(([key, { label, cls, icon: Icon }]) => (
          <div key={key} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              (cls || "").split(" ").slice(0, 2).join(" ")
              }`}
            >
              <Icon
                size={18}
                className={(cls || "").split(" ").slice(2).join(" ")}
              />
            </div>
            <div>
              <div className="font-display text-2xl font-black text-slate-900 dark:text-white">{countByStatus(key)}</div>
              <p className="text-slate-400 text-xs font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5 animate-slide-up" style={{ animationDelay: "0.12s", opacity: 0 }}>
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14} /></button>}
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", ...Object.keys(STATUS_CONFIG)].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2.5 rounded-xl text-xs font-semibold capitalize border transition-all ${statusFilter === s ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/20" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400"}`}>
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-slide-up" style={{ animationDelay: "0.18s", opacity: 0 }}>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
              <FileText size={26} className="text-slate-400" />
            </div>
            <p className="font-semibold text-slate-600 dark:text-slate-300">No applications found</p>
            <p className="text-slate-400 text-sm">{search || statusFilter !== "all" ? "Try adjusting your filters" : "Applications will appear here"}</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    {["Applicant", "Contact", "Applied For", "Status", "Actions"].map(h => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((app, i) => (
                    <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${GRADS[i % GRADS.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                            {app.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-white text-sm">{app.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1.5"><Mail size={12} /> {app.email}</p>
                        {app.phone && <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5"><Phone size={11} /> {app.phone}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-800 dark:text-white">{app.job?.title || "—"}</p>
                        {app.job?.company && (
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Building2 size={10} />
                            {typeof app.job.company === "string" ? app.job.company : app.job.company?.name}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative inline-block">
                          {updatingId === app._id ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800">
                              <Loader2 size={12} className="animate-spin text-slate-400" />
                              <span className="text-xs text-slate-400">Updating...</span>
                            </div>
                          ) : (
                            <div className="relative">
                              <select
                                value={app.status || "pending"}
                                onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-semibold border outline-none cursor-pointer transition-all ${STATUS_SELECT_CLS[app.status] || STATUS_SELECT_CLS.pending}`}
                              >
                                {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                                  <option key={k} value={k}>{v.label}</option>
                                ))}
                              </select>
                              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewApp(app)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 text-xs font-semibold hover:bg-violet-100 dark:hover:bg-violet-900/40 border border-violet-200 dark:border-violet-800 transition-all"
                          >
                            <Eye size={12} /> View
                          </button>
                          <button
                            onClick={() => handleDelete(app._id)}
                            disabled={deletingId === app._id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 transition-all disabled:opacity-50 opacity-0 group-hover:opacity-100"
                          >
                            {deletingId === app._id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((app, i) => (
                <div key={app._id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRADS[i % GRADS.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {app.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-slate-800 dark:text-white text-sm">{app.name}</p>
                        <StatusBadge status={app.status} />
                      </div>
                      <p className="text-xs text-slate-400 truncate">{app.email}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">{app.job?.title || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <select
                      value={app.status || "pending"}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className={`flex-1 text-xs px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-violet-500/30 font-semibold transition-all ${STATUS_SELECT_CLS[app.status] || STATUS_SELECT_CLS.pending}`}
                    >
                      {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                    <button onClick={() => setViewApp(app)} className="p-2 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
                      <Eye size={14} />
                    </button>
                    <button onClick={() => handleDelete(app._id)} className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400">Showing {filtered.length} of {applications.length} applications</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminApplication;