// pages/public/MyApplications.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import {
  Briefcase, Building2, MapPin, Clock, CheckCircle2,
  XCircle, Eye, FileText, RefreshCw, AlertCircle,
  ExternalLink, Search, X, IndianRupee, Calendar
} from "lucide-react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap');
  * { font-family: 'Figtree', sans-serif; }
  .font-display { font-family: 'Syne', sans-serif !important; }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .au { animation: slideUp 0.4s ease both; }
`;

const GRADS = [
  "from-violet-500 to-indigo-600","from-pink-500 to-rose-500",
  "from-emerald-500 to-teal-500","from-amber-500 to-orange-500",
  "from-blue-500 to-cyan-500","from-indigo-500 to-purple-600",
];

const STATUS_CONFIG = {
  pending:     { label: "Pending",     bg: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",        icon: Clock        },
  reviewed:    { label: "Reviewed",    bg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",             icon: Eye          },
  shortlisted: { label: "Shortlisted", bg: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle2 },
  rejected:    { label: "Rejected",    bg: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",                 icon: XCircle      },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${s.bg}`}>
      <Icon size={11} /> {s.label}
    </span>
  );
};

const getCompanyName = (c) => (typeof c === "string" ? c : c?.name || "—");
const getSalary = (s) => {
  if (!s) return null;
  if (typeof s === "string") return s;
  if (s.min && s.max) return `${s.min} – ${s.max} LPA`;
  return null;
};

const TABS = ["all", "pending", "reviewed", "shortlisted", "rejected"];

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [search,       setSearch]       = useState("");
  const [activeTab,    setActiveTab]    = useState("all");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/application/my-applications");
      setApplications(res.data?.applications || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load your applications. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchApplications(); }, []);

  // Filter
  const filtered = applications.filter(app => {
    const matchTab = activeTab === "all" || app.status === activeTab;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      app.job?.title?.toLowerCase().includes(q) ||
      getCompanyName(app.job?.company).toLowerCase().includes(q) ||
      app.job?.location?.toLowerCase().includes(q);
    return matchTab && matchSearch;
  });

  const countFor = (s) => applications.filter(a => a.status === s).length;

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <style>{CSS}</style>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading your applications...</p>
      </div>
    </div>
  );

  // ── Error ────────────────────────────────────────────────────────────────────
  if (error) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
      <style>{CSS}</style>
      <div className="text-center max-w-sm">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={28} className="text-red-500" />
        </div>
        <p className="font-display font-bold text-xl text-slate-900 dark:text-white mb-2">Something went wrong</p>
        <p className="text-slate-400 text-sm mb-5">{error}</p>
        <button onClick={fetchApplications} className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl font-semibold text-sm mx-auto hover:scale-105 transition-all">
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-16 px-4 sm:px-6 transition-colors duration-300">
      <style>{CSS}</style>

      <div className="max-w-5xl mx-auto">

        {/* ── Header ──────────────────────────────────────────── */}
        <div className="mb-8 au" style={{ opacity: 0 }}>
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">My Applications</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            {applications.length} total application{applications.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* ── Status Summary ───────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 au" style={{ animationDelay: "0.06s", opacity: 0 }}>
          {Object.entries(STATUS_CONFIG).map(([key, { label, bg, icon: Icon }]) => (
            <div key={key} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg.split(" ").slice(0, 2).join(" ")}`}>
                <Icon size={17} className={bg.split(" ").slice(2).join(" ")} />
              </div>
              <div>
                <div className="font-display text-xl font-black text-slate-900 dark:text-white">{countFor(key)}</div>
                <p className="text-slate-400 text-xs font-medium">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Search + Tabs ────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5 au" style={{ animationDelay: "0.1s", opacity: 0 }}>
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by job, company or location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={14} />
              </button>
            )}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                  activeTab === t
                    ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/20"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400"
                }`}
              >
                {t === "all" ? `All (${applications.length})` : `${t} (${countFor(t)})`}
              </button>
            ))}
          </div>
        </div>

        {/* ── Applications List ────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3 au" style={{ opacity: 0 }}>
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
              <Briefcase size={28} className="text-slate-400" />
            </div>
            <p className="font-display font-bold text-lg text-slate-800 dark:text-white">
              {search || activeTab !== "all" ? "No applications match your filters" : "No applications yet"}
            </p>
            <p className="text-slate-400 text-sm text-center max-w-xs">
              {search || activeTab !== "all"
                ? "Try adjusting your search or tab filter."
                : "Start browsing jobs and submit your first application!"}
            </p>
            {(search || activeTab !== "all") && (
              <button onClick={() => { setSearch(""); setActiveTab("all"); }} className="px-5 py-2.5 bg-violet-600 text-white rounded-xl font-semibold text-sm mt-1 hover:scale-105 transition-all">
                Clear Filters
              </button>
            )}
            {!search && activeTab === "all" && (
              <Link to="/jobs" className="flex items-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-xl font-semibold text-sm hover:scale-105 transition-all shadow-lg shadow-violet-500/20">
                <Briefcase size={14} /> Browse Jobs
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3 au" style={{ animationDelay: "0.14s", opacity: 0 }}>
            {filtered.map((app, i) => {
              const company  = getCompanyName(app.job?.company);
              const salary   = getSalary(app.job?.salary);
              const initials = (app.job?.title || "J").charAt(0).toUpperCase();
              const isExpired = app.job?.lastDateToApply && new Date(app.job.lastDateToApply) < new Date();
              const appliedOn = app.createdAt
                ? new Date(app.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                : null;

              return (
                <div
                  key={app._id}
                  className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start gap-4 transition-all hover:border-violet-200 dark:hover:border-violet-800 hover:shadow-md ${isExpired ? "opacity-60" : ""}`}
                >
                  {/* Logo */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${GRADS[i % GRADS.length]} flex items-center justify-center text-white font-black text-lg flex-shrink-0 ${isExpired ? "grayscale" : ""}`}>
                    {app.job?.thumbnail
                      ? <img src={app.job.thumbnail} alt="" className="w-full h-full object-cover rounded-xl" onError={e => e.target.style.display="none"} />
                      : initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <div>
                        <h2 className="font-display font-bold text-base text-slate-900 dark:text-white leading-snug">
                          {app.job?.title || "—"}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                          <Building2 size={10} /> {company}
                        </p>
                      </div>
                      <StatusBadge status={app.status} />
                    </div>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-2 text-xs text-slate-400 mb-3">
                      {app.job?.location && (
                        <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                          <MapPin size={10} /> {app.job.location}
                        </span>
                      )}
                      {app.job?.jobType && (
                        <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg capitalize">
                          <Briefcase size={10} /> {app.job.jobType}
                        </span>
                      )}
                      {salary && (
                        <span className="flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-lg font-semibold">
                          <IndianRupee size={10} /> {salary}
                        </span>
                      )}
                    </div>

                    {/* Dates */}
                    <div className="flex flex-wrap gap-3 text-xs text-slate-400">
                      {appliedOn && (
                        <span className="flex items-center gap-1">
                          <Calendar size={10} /> Applied: {appliedOn}
                        </span>
                      )}
                      {app.job?.lastDateToApply && (
                        <span className={`flex items-center gap-1 font-semibold ${isExpired ? "text-red-500 dark:text-red-400" : "text-amber-600 dark:text-amber-400"}`}>
                          <Clock size={10} />
                          {isExpired ? "Application closed" : `Deadline: ${new Date(app.job.lastDateToApply).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
                        </span>
                      )}
                    </div>

                    {/* Status message */}
                    {app.status === "rejected" && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-2 flex items-center gap-1 font-medium">
                        <XCircle size={11} /> Unfortunately, you were not selected for this role.
                      </p>
                    )}
                    {app.status === "shortlisted" && (
                      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1 font-medium">
                        <CheckCircle2 size={11} /> 🎉 Congratulations! You have been shortlisted.
                      </p>
                    )}
                    {app.status === "reviewed" && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1 font-medium">
                        <Eye size={11} /> Your application has been reviewed. Stay tuned!
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
                    {app.resumeUrl && (
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 text-xs font-semibold border border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors"
                      >
                        <FileText size={12} /> Resume
                      </a>
                    )}
                    {app.job?._id && (
                      <Link
                        to={`/jobs/${app.job._id}`}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <ExternalLink size={12} /> View Job
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;