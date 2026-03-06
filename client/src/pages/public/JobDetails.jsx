// pages/public/JobDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import ApplyModal from "../../components/public/ApplyModal";
import {
  MapPin, Briefcase, Clock, IndianRupee, Building2, Globe,
  ArrowLeft, CheckCircle2, Share2, Bookmark, Sparkles,
  Calendar, Users, ChevronRight, ExternalLink, Loader2,
  Code2, AlertCircle
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap');
  * { font-family: 'Figtree', sans-serif; }
  .font-display { font-family: 'Syne', sans-serif !important; }
  @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  .animate-slide-up { animation: slideUp 0.5s ease forwards; }
  .gradient-text {
    background: linear-gradient(135deg,#7c3aed,#4f46e5,#0ea5e9);
    background-size:200% auto; -webkit-background-clip:text;
    -webkit-text-fill-color:transparent; background-clip:text;
    animation: gradientShift 4s ease infinite;
  }
  .prose-job p { margin-bottom: 0.75rem; line-height: 1.75; color: #475569; }
  .dark .prose-job p { color: #94a3b8; }
  .tag-chip {
    background: rgba(139,92,246,0.08); color: #7c3aed;
    border: 1px solid rgba(139,92,246,0.18);
  }
  .dark .tag-chip { background: rgba(139,92,246,0.15); color: #a78bfa; border-color: rgba(139,92,246,0.25); }
`;

const GRADS = [
  "from-violet-500 to-indigo-600","from-pink-500 to-rose-500","from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500","from-blue-500 to-cyan-500","from-indigo-500 to-purple-600",
];

const getCompanyName = (c) => (typeof c === "string" ? c : c?.name || "");
const getSalary = (s) => {
  if (!s) return null;
  if (typeof s === "string") return s;
  if (s.min !== undefined && s.max !== undefined) return `${s.min} – ${s.max} LPA`;
  return null;
};

const jobTypeBadge = (type = "") => {
  const t = type.toLowerCase();
  if (t.includes("full"))    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  if (t.includes("part"))    return "bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-400";
  if (t.includes("intern"))  return "bg-amber-100  text-amber-700  dark:bg-amber-900/30  dark:text-amber-400";
  if (t.includes("remote"))  return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
  if (t.includes("contract"))return "bg-cyan-100   text-cyan-700   dark:bg-cyan-900/30   dark:text-cyan-400";
  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
};

// ── Info Chip ──────────────────────────────────────────────────────────────────
const InfoChip = ({ icon: Icon, label, value, color = "" }) => (
  <div className="flex flex-col gap-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4">
    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color || "bg-slate-100 dark:bg-slate-800"}`}>
      <Icon size={18} className={color ? "text-white" : "text-slate-500 dark:text-slate-400"} />
    </div>
    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-1">{label}</p>
    <p className="text-sm font-bold text-slate-800 dark:text-white leading-snug">{value}</p>
  </div>
);

// ── Section Card ───────────────────────────────────────────────────────────────
const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
    <div className="flex items-center gap-2.5 mb-5">
      <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
        <Icon size={16} className="text-violet-600 dark:text-violet-400" />
      </div>
      <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">{title}</h3>
    </div>
    {children}
  </div>
);

// ── Main ───────────────────────────────────────────────────────────────────────
const JobDetails = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const [job,        setJob]        = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [openApply,  setOpenApply]  = useState(false);
  const [copied,     setCopied]     = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [relatedJobs, setRelatedJobs] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/job/${id}`);
        setJob(res.data.job);
        // Fetch related jobs
        try {
          const all = await api.get("/job");
          const others = (all.data.jobs || []).filter(j => j._id !== id && j.isActive !== false).slice(0, 3);
          setRelatedJobs(others);
        } catch {}
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <style>{STYLES}</style>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading job details...</p>
      </div>
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <style>{STYLES}</style>
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={28} className="text-red-500" />
        </div>
        <p className="font-display font-bold text-xl text-slate-900 dark:text-white">Job Not Found</p>
        <p className="text-slate-400 mt-1 mb-4">This job may have been removed or expired.</p>
        <Link to="/jobs" className="px-6 py-2.5 bg-violet-600 text-white rounded-xl font-semibold text-sm hover:scale-105 transition-all">
          Browse All Jobs
        </Link>
      </div>
    </div>
  );

  const company  = getCompanyName(job.company);
  const salary   = getSalary(job.salary);
  const skills   = job.skills || (Array.isArray(job.requirements) ? job.requirements : []);
  const reqs     = Array.isArray(job.requirements) ? job.requirements : [];
  const initials = company.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
  const gradIdx  = Math.abs(id.charCodeAt(0) + id.charCodeAt(1)) % GRADS.length;
  const posted   = job.createdAt ? new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-16 transition-colors duration-300">
      <style>{STYLES}</style>

      {/* Back */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 animate-slide-up">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 font-medium text-sm transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Jobs
        </button>
      </div>

      {/* Hero Banner */}
      {job.thumbnail && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 animate-slide-up" style={{ animationDelay: "0.05s" }}>
          <div className="rounded-2xl overflow-hidden h-48 md:h-64 border border-slate-100 dark:border-slate-800">
            <img src={job.thumbnail} alt={job.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">

          {/* ── LEFT: Main Content ─────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Header Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 animate-slide-up" style={{ animationDelay: "0.1s", opacity: 0 }}>
              <div className="flex items-start gap-4 mb-5">
                {/* Company Logo / Initials */}
                {(job.company?.logo || typeof job.company === "object") && job.company?.logo ? (
                  <img src={job.company.logo} alt={company} className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0" onError={e => e.target.style.display="none"} />
                ) : (
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${GRADS[gradIdx]} flex items-center justify-center text-white text-xl font-black flex-shrink-0 shadow-lg`}>
                    {initials}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <h1 className="font-display text-2xl md:text-3xl font-black text-slate-900 dark:text-white leading-tight">{job.title}</h1>
                      <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 mt-1">
                        <Building2 size={14} /> {company}
                        {job.company?.website && (
                          <a href={job.company.website} target="_blank" rel="noreferrer" className="text-violet-500 hover:text-violet-700 transition-colors ml-1">
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setBookmarked(b => !b)} className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${bookmarked ? "bg-violet-100 dark:bg-violet-900/30 border-violet-300 dark:border-violet-700 text-violet-600 dark:text-violet-400" : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-violet-600"}`}>
                        <Bookmark size={15} fill={bookmarked ? "currentColor" : "none"} />
                      </button>
                      <button onClick={handleShare} className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${copied ? "bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-600" : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-violet-600"}`}>
                        {copied ? <CheckCircle2 size={15} /> : <Share2 size={15} />}
                      </button>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.jobType && (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold capitalize ${jobTypeBadge(job.jobType)}`}>
                        <Briefcase size={11} /> {job.jobType}
                      </span>
                    )}
                    {posted && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        <Calendar size={11} /> Posted {posted}
                      </span>
                    )}
                    {job.isActive !== false && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 size={11} /> Actively Hiring
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick info chips row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-slate-100 dark:border-slate-800">
                {job.location && (
                  <InfoChip icon={MapPin} label="Location" value={job.location} color="bg-violet-500" />
                )}
                {salary && (
                  <InfoChip icon={IndianRupee} label="Salary" value={salary} color="bg-emerald-500" />
                )}
                {(job.experience || job.experienceRequired) && (
                  <InfoChip icon={Clock} label="Experience" value={job.experience || `${job.experienceRequired} yrs`} color="bg-amber-500" />
                )}
                {job.jobType && (
                  <InfoChip icon={Briefcase} label="Job Type" value={job.jobType} color="bg-indigo-500" />
                )}
              </div>
            </div>

            {/* Description */}
            <Section title="Job Description" icon={Briefcase}>
              <div className="prose-job text-slate-600 dark:text-slate-400 text-sm leading-relaxed whitespace-pre-line">
                {job.description}
              </div>
            </Section>

            {/* Requirements / Skills */}
            {reqs.length > 0 && (
              <Section title="Requirements" icon={CheckCircle2}>
                <ul className="space-y-2.5">
                  {reqs.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle2 size={12} className="text-violet-600 dark:text-violet-400" />
                      </div>
                      {req}
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <Section title="Skills Required" icon={Code2}>
                <div className="flex flex-wrap gap-2">
                  {skills.map(s => (
                    <span key={s} className="tag-chip px-3 py-1.5 rounded-xl text-sm font-semibold">{s}</span>
                  ))}
                </div>
              </Section>
            )}

            {/* Related Jobs */}
            {relatedJobs.length > 0 && (
              <Section title="More Jobs You Might Like" icon={Sparkles}>
                <div className="space-y-3">
                  {relatedJobs.map((rj, i) => {
                    const rc = getCompanyName(rj.company);
                    return (
                      <Link key={rj._id} to={`/jobs/${rj._id}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRADS[(i + 2) % GRADS.length]} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                          {rc.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors truncate">{rj.title}</p>
                          <p className="text-xs text-slate-400 truncate">{rc} · {rj.location}</p>
                        </div>
                        <ChevronRight size={15} className="text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </Link>
                    );
                  })}
                </div>
                <Link to="/jobs" className="flex items-center justify-center gap-2 mt-4 text-sm text-violet-600 dark:text-violet-400 font-semibold hover:underline">
                  View All Jobs <ChevronRight size={14} />
                </Link>
              </Section>
            )}
          </div>

          {/* ── RIGHT: Sticky Sidebar ──────────────────────── */}
          <div className="lg:w-80 flex-shrink-0 space-y-5">

            {/* Apply Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 animate-slide-up lg:sticky lg:top-24" style={{ animationDelay: "0.15s", opacity: 0 }}>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-2">Ready to Apply?</h3>
              <p className="text-slate-400 text-sm mb-5">Join hundreds of applicants and take the next step in your career.</p>

              <button
                onClick={() => setOpenApply(true)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles size={16} /> Apply for This Job
              </button>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                {salary && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <IndianRupee size={14} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Salary</p>
                      <p className="font-semibold text-slate-800 dark:text-white">{salary}</p>
                    </div>
                  </div>
                )}
                {(job.experience || job.experienceRequired) && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock size={14} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Experience</p>
                      <p className="font-semibold text-slate-800 dark:text-white">{job.experience || `${job.experienceRequired} years`}</p>
                    </div>
                  </div>
                )}
                {job.location && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin size={14} className="text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Location</p>
                      <p className="font-semibold text-slate-800 dark:text-white">{job.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Company Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 animate-slide-up" style={{ animationDelay: "0.2s", opacity: 0 }}>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-4">About the Company</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${GRADS[gradIdx]} flex items-center justify-center text-white font-black text-base shadow-lg flex-shrink-0`}>
                  {initials}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{company}</p>
                  {job.company?.location && (
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin size={10} />{job.company.location}</p>
                  )}
                </div>
              </div>
              {job.company?.website && (
                <a href={job.company.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-violet-600 dark:text-violet-400 font-semibold hover:underline">
                  <Globe size={14} /> Visit Website <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <ApplyModal
        open={openApply}
        setOpen={setOpenApply}
        jobId={job._id}
        jobTitle={job.title}
        companyName={company}
      />
    </div>
  );
};

export default JobDetails;