// pages/public/Jobs.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../../services/api";
import ApplyModal from "../../components/public/ApplyModal";
import {
  Search, MapPin, Briefcase, Clock, IndianRupee, Building2,
  SlidersHorizontal, X, ChevronDown, ChevronUp, Loader2,
  ArrowRight, Filter, LayoutGrid, List, Sparkles, TrendingUp,
  RefreshCw, BookmarkPlus, Eye
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap');
  * { font-family: 'Figtree', sans-serif; }
  .font-display { font-family: 'Syne', sans-serif !important; }
  @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  .animate-slide-up { animation: slideUp 0.4s ease forwards; }
  .animate-fade-in  { animation: fadeIn  0.3s ease forwards; }
  .gradient-text {
    background: linear-gradient(135deg,#7c3aed,#4f46e5,#0ea5e9);
    background-size:200% auto; -webkit-background-clip:text;
    -webkit-text-fill-color:transparent; background-clip:text;
    animation: gradientShift 4s ease infinite;
  }
  .card-hover { transition: all 0.25s cubic-bezier(.4,0,.2,1); }
  .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 48px -12px rgba(0,0,0,0.14); }
  .dark .card-hover:hover { box-shadow: 0 20px 48px -12px rgba(0,0,0,0.55); }
  .filter-section { transition: max-height 0.3s ease, opacity 0.3s ease; overflow: hidden; }
`;

const GRADS = [
  "from-violet-500 to-indigo-600","from-pink-500 to-rose-500","from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500","from-blue-500 to-cyan-500","from-indigo-500 to-purple-600",
  "from-teal-500 to-green-500","from-red-500 to-orange-500",
];

const jobTypeBadge = (type = "") => {
  const t = type.toLowerCase();
  if (t.includes("full"))   return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  if (t.includes("part"))   return "bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400";
  if (t.includes("intern")) return "bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-400";
  if (t.includes("remote")) return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
  if (t.includes("contract"))return "bg-cyan-100  text-cyan-700   dark:bg-cyan-900/30   dark:text-cyan-400";
  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
};

const getCompanyName = (c) => (typeof c === "string" ? c : c?.name || "");
const getSalary      = (s) => {
  if (!s) return null;
  if (typeof s === "string") return s;
  if (s.min !== undefined && s.max !== undefined) return `${s.min} – ${s.max} LPA`;
  return null;
};

// ── Collapsible filter section ─────────────────────────────────────────────────
const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button type="button" onClick={() => setOpen(o => !o)} className="flex items-center justify-between w-full mb-3 group">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</span>
        {open ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
      </button>
      <div className="filter-section" style={{ maxHeight: open ? "400px" : "0", opacity: open ? 1 : 0 }}>
        {children}
      </div>
    </div>
  );
};

// ── Job Card ───────────────────────────────────────────────────────────────────
const JobCard = ({ job, index, onApply, gridView }) => {
  const company  = getCompanyName(job.company);
  const salary   = getSalary(job.salary);
  const skills   = job.skills || (Array.isArray(job.requirements) ? job.requirements : []);
  const initials = company.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  if (!gridView) {
    // List view
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 card-hover animate-slide-up flex items-center gap-5" style={{ animationDelay: `${(index % 8) * 0.04}s`, opacity: 0 }}>
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${GRADS[index % GRADS.length]} flex items-center justify-center text-white font-black text-lg flex-shrink-0 shadow-lg`}>
          {job.thumbnail ? <img src={job.thumbnail} alt="" className="w-full h-full object-cover rounded-xl" onError={e => e.target.style.display="none"} /> : initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white truncate">{job.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-1 mt-0.5"><Building2 size={11} /> {company}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 capitalize ${jobTypeBadge(job.jobType)}`}>{job.jobType}</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-400">
            {job.location && <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>}
            {salary && <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold"><IndianRupee size={11} />{salary}</span>}
            {job.experience && <span className="flex items-center gap-1"><Clock size={11} />{job.experience}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link to={`/jobs/${job._id}`} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all">
            Details
          </Link>
          <button onClick={() => onApply(job)} className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-105 active:scale-95 transition-all">
            Apply
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col card-hover animate-slide-up" style={{ animationDelay: `${(index % 9) * 0.05}s`, opacity: 0 }}>
      <div className={`h-1.5 w-full bg-gradient-to-r ${GRADS[index % GRADS.length]}`} />
      <div className="p-5 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${GRADS[index % GRADS.length]} flex items-center justify-center text-white font-black text-base flex-shrink-0 shadow-lg overflow-hidden`}>
            {job.thumbnail ? <img src={job.thumbnail} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display="none"} /> : initials}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white leading-snug line-clamp-2">{job.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 flex items-center gap-1 truncate"><Building2 size={10} />{company}</p>
          </div>
          <span className={`text-[11px] font-semibold px-2 py-1 rounded-lg flex-shrink-0 capitalize ${jobTypeBadge(job.jobType)}`}>{job.jobType}</span>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 mb-3">
          {job.location && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              <MapPin size={10} /> {job.location}
            </span>
          )}
          {(job.experience || job.experienceRequired) && (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
              <Clock size={10} /> {job.experience || job.experienceRequired}
            </span>
          )}
        </div>

        {/* Salary */}
        {salary && (
          <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-3">
            <IndianRupee size={12} /> {salary}
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {skills.slice(0, 3).map(s => (
              <span key={s} className="text-[11px] px-2 py-0.5 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border border-violet-100 dark:border-violet-800 font-medium">{s}</span>
            ))}
            {skills.length > 3 && (
              <span className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400">+{skills.length - 3}</span>
            )}
          </div>
        )}

        {/* Description */}
        {job.description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-grow">{job.description}</p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <Link
            to={`/jobs/${job._id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all"
          >
            <Eye size={13} /> View Details
          </Link>
          <button
            onClick={() => onApply(job)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles size={12} /> Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────
const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs,      setJobs]      = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [gridView,  setGridView]  = useState(true);
  const [applyJob,  setApplyJob]  = useState(null);
  const [mobileFilter, setMobileFilter] = useState(false);

  // Filter states
  const [query,       setQuery]       = useState(searchParams.get("q") || "");
  const [typeFilter,  setTypeFilter]  = useState("all");
  const [locFilter,   setLocFilter]   = useState("all");
  const [sortBy,      setSortBy]      = useState("newest");

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/job");
      setJobs((res.data.jobs || []).filter(j => j.isActive !== false));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, []);

  // Derived filter options
  const jobTypes  = useMemo(() => ["all", ...new Set(jobs.map(j => j.jobType).filter(Boolean))], [jobs]);
  const locations = useMemo(() => ["all", ...new Set(jobs.map(j => j.location).filter(Boolean))], [jobs]);

  // Filtered + sorted results
  const filtered = useMemo(() => {
    let res = [...jobs];
    if (query.trim()) {
      const q = query.toLowerCase();
      res = res.filter(j =>
        j.title?.toLowerCase().includes(q) ||
        getCompanyName(j.company).toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        (j.skills || j.requirements || []).some(s => s?.toLowerCase().includes(q))
      );
    }
    if (typeFilter !== "all") res = res.filter(j => j.jobType === typeFilter);
    if (locFilter  !== "all") res = res.filter(j => j.location === locFilter);
    if (sortBy === "newest") res.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "oldest") res.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return res;
  }, [jobs, query, typeFilter, locFilter, sortBy]);

  const clearFilters = () => { setQuery(""); setTypeFilter("all"); setLocFilter("all"); setSortBy("newest"); };
  const hasFilters   = query || typeFilter !== "all" || locFilter !== "all";

  // Filter Sidebar
  const FilterPanel = () => (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-display font-bold text-slate-900 dark:text-white text-base">Filters</h3>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline flex items-center gap-1">
            <X size={12} /> Clear all
          </button>
        )}
      </div>

      <FilterSection title="Job Type">
        <div className="space-y-1.5">
          {jobTypes.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                typeFilter === t
                  ? "bg-violet-600 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span>{t === "all" ? "All Types" : t}</span>
              <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-semibold ${typeFilter === t ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                {t === "all" ? jobs.length : jobs.filter(j => j.jobType === t).length}
              </span>
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Location">
        <div className="space-y-1.5">
          {locations.slice(0, 8).map(l => (
            <button
              key={l}
              onClick={() => setLocFilter(l)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                locFilter === l
                  ? "bg-violet-600 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span className="truncate text-left">{l === "all" ? "All Locations" : l}</span>
              {l !== "all" && (
                <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-semibold ml-2 flex-shrink-0 ${locFilter === l ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-400"}`}>
                  {jobs.filter(j => j.location === l).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Sort By" defaultOpen={false}>
        <div className="space-y-1.5">
          {[{ v: "newest", l: "Newest First" }, { v: "oldest", l: "Oldest First" }].map(({ v, l }) => (
            <button key={v} onClick={() => setSortBy(v)} className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-all ${sortBy === v ? "bg-violet-600 text-white" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
              {l}
            </button>
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-16 transition-colors duration-300">
      <style>{STYLES}</style>

      {/* Hero Search Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-950 py-12 px-6 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <TrendingUp size={16} className="text-violet-400" />
            <span className="text-violet-300 text-sm font-semibold">{jobs.length} Active Jobs</span>
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-black text-white mb-6">
            Find Your <span className="gradient-text">Dream Job</span>
          </h1>
          {/* Search Bar */}
          <div className="flex items-center bg-white dark:bg-slate-900 rounded-2xl p-2 shadow-2xl border border-white/10 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 flex-1 px-3">
              <Search size={18} className="text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Job title, company, skill..."
                className="flex-1 bg-transparent outline-none text-slate-800 dark:text-white placeholder-slate-400 text-sm"
              />
              {query && <button onClick={() => setQuery("")} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={14} /></button>}
            </div>
            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2 px-3 text-slate-400">
              <MapPin size={15} />
              <select value={locFilter} onChange={(e) => setLocFilter(e.target.value)} className="bg-transparent text-sm outline-none cursor-pointer">
                <option value="all">All Locations</option>
                {locations.filter(l => l !== "all").map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <button className="ml-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-violet-500/30">
              Search
            </button>
          </div>

          {/* Quick filters */}
          {jobTypes.filter(t => t !== "all").length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {jobTypes.filter(t => t !== "all").slice(0, 5).map(t => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(typeFilter === t ? "all" : t)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all border ${
                    typeFilter === t
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-white/10 text-slate-300 border-white/20 hover:bg-white/20"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-5 animate-slide-up">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-900 dark:text-white text-lg">
              {filtered.length} <span className="text-slate-400 font-normal text-base">jobs found</span>
            </span>
            {hasFilters && (
              <span className="text-xs px-2.5 py-1 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 rounded-lg font-semibold border border-violet-200 dark:border-violet-800">
                Filtered
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile filter toggle */}
            <button
              onClick={() => setMobileFilter(m => !m)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:border-violet-400 transition-all"
            >
              <Filter size={15} />
              Filters
              {hasFilters && <span className="w-2 h-2 rounded-full bg-violet-500" />}
            </button>
            {/* View toggle */}
            <div className="flex bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
              <button onClick={() => setGridView(true)}  className={`p-2 rounded-lg transition-all ${gridView  ? "bg-violet-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`}><LayoutGrid size={15} /></button>
              <button onClick={() => setGridView(false)} className={`p-2 rounded-lg transition-all ${!gridView ? "bg-violet-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`}><List size={15} /></button>
            </div>
          </div>
        </div>

        {/* Mobile Filter Panel */}
        {mobileFilter && (
          <div className="lg:hidden mb-5 animate-slide-up">
            <FilterPanel />
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar - desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterPanel />
            </div>
          </div>

          {/* Jobs Grid/List */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                <p className="text-slate-400 font-medium">Loading jobs...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                  <Briefcase size={28} className="text-slate-400" />
                </div>
                <div className="text-center">
                  <p className="font-display font-bold text-xl text-slate-800 dark:text-white">No jobs found</p>
                  <p className="text-slate-400 text-sm mt-1">{hasFilters ? "Try adjusting your filters" : "No active jobs available right now"}</p>
                </div>
                {hasFilters && (
                  <button onClick={clearFilters} className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white rounded-xl text-sm font-semibold shadow-lg shadow-violet-500/25 hover:scale-105 transition-all">
                    <RefreshCw size={14} /> Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className={gridView ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-4" : "space-y-3"}>
                {filtered.map((job, i) => (
                  <JobCard key={job._id} job={job} index={i} onApply={setApplyJob} gridView={gridView} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {applyJob && (
        <ApplyModal
          open={Boolean(applyJob)}
          setOpen={(v) => !v && setApplyJob(null)}
          jobId={applyJob._id}
          jobTitle={applyJob.title}
          companyName={getCompanyName(applyJob.company)}
        />
      )}
    </div>
  );
};

export default Jobs;