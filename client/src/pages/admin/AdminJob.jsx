import React, { useEffect, useState } from "react";
import api from "../../services/api";
import JobModal from "../../components/admin/JobModal";
import {
  Plus, Search, MapPin, Briefcase, Building2, IndianRupee,
  Clock, Pencil, Trash2, Filter, ChevronDown, X, Layers
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap');
  * { font-family: 'Figtree', sans-serif; }
  .font-display { font-family: 'Syne', sans-serif !important; }
  @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  .animate-slide-up { animation: slideUp 0.4s ease forwards; }
  .card-hover { transition: all 0.25s cubic-bezier(.4,0,.2,1); }
  .card-hover:hover { transform: translateY(-3px); box-shadow: 0 16px 40px -8px rgba(0,0,0,0.12); }
  .dark .card-hover:hover { box-shadow: 0 16px 40px -8px rgba(0,0,0,0.5); }
`;

const GRADS = [
  "from-violet-500 to-indigo-600","from-pink-500 to-rose-500","from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500","from-blue-500 to-cyan-500","from-indigo-500 to-purple-600",
  "from-teal-500 to-green-500","from-red-500 to-orange-500",
];

const jobTypeColor = (type = "") => {
  const t = type.toLowerCase();
  if (t.includes("full"))   return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  if (t.includes("part"))   return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
  if (t.includes("intern")) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  if (t.includes("remote")) return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400";
  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
};

const getCompanyName = (company) =>
  typeof company === "string" ? company : company?.name || "—";

const getSalary = (salary) => {
  if (!salary) return null;
  if (typeof salary === "string") return salary;
  if (typeof salary === "object") {
    if (salary.min !== undefined && salary.max !== undefined)
      return `${salary.min} - ${salary.max} LPA`;
  }
  return String(salary);
};

const AdminJob = () => {
  const [jobs, setJobs]           = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editData, setEditData]   = useState(null);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [deleteId, setDeleteId]   = useState(null);

  const fetchJobs = async () => {
    try {
      const res = await api.get("/job");
      setJobs(res.data.jobs || []);
      setFiltered(res.data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  useEffect(() => {
    let result = [...jobs];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(j =>
        j.title?.toLowerCase().includes(q) ||
        getCompanyName(j.company).toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        (j.skills || []).some(s => s.toLowerCase().includes(q))
      );
    }
    if (typeFilter !== "all") {
      result = result.filter(j => j.jobType?.toLowerCase().includes(typeFilter));
    }
    setFiltered(result);
  }, [search, typeFilter, jobs]);

  const handleEdit = (job) => { setEditData(job); setOpenModal(true); };

  const handleDelete = async (id) => {
    setDeleteId(id);
    try {
      await api.delete(`/job/${id}`);
      fetchJobs();
    } catch (err) {
      console.error(err);
    } finally {
      setDeleteId(null);
    }
  };

  const jobTypes = ["all", ...new Set(jobs.map(j => j.jobType?.toLowerCase().split(" ")[0]).filter(Boolean))];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6 lg:p-8 transition-colors duration-300">
      <style>{STYLES}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-slide-up">
        <div>
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">Job Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            {jobs.length} job{jobs.length !== 1 ? "s" : ""} posted · {filtered.length} shown
          </p>
        </div>
        <button
          onClick={() => { setEditData(null); setOpenModal(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-105 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus size={16} /> Create Job
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-slide-up" style={{ animationDelay: "0.08s", opacity: 0 }}>
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, company, location or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          {jobTypes.map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold capitalize border transition-all ${
                typeFilter === t
                  ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/20"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400"
              }`}
            >
              {t === "all" ? "All Types" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-slate-400 font-medium">Loading jobs...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
            <Briefcase size={28} className="text-slate-400" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-slate-700 dark:text-slate-200">No jobs found</p>
            <p className="text-slate-400 text-sm mt-1">
              {search || typeFilter !== "all" ? "Try adjusting your filters" : "Create your first job listing"}
            </p>
          </div>
          {(search || typeFilter !== "all") && (
            <button onClick={() => { setSearch(""); setTypeFilter("all"); }} className="text-sm text-violet-600 dark:text-violet-400 font-semibold hover:underline">
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((job, i) => {
            const company  = getCompanyName(job.company);
            const salary   = getSalary(job.salary);
            const skills   = job.skills || [];
            const initials = company.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

            return (
              <div
                key={job._id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col card-hover animate-slide-up"
                style={{ animationDelay: `${(i % 9) * 0.05}s`, opacity: 0 }}
              >
                {/* Top accent + Logo */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${GRADS[i % GRADS.length]}`} />

                <div className="p-5 flex flex-col flex-grow">
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${GRADS[i % GRADS.length]} flex items-center justify-center text-white text-sm font-black flex-shrink-0 shadow-lg`}>
                      {job.thumbnail
                        ? <img src={job.thumbnail} alt="" className="w-full h-full object-cover rounded-xl" onError={e => e.target.style.display = "none"} />
                        : initials
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-display font-bold text-slate-900 dark:text-white text-base leading-snug truncate">{job.title}</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <Building2 size={11} /> {company}
                      </p>
                    </div>
                    {job.isActive !== undefined && (
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 ${job.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>
                        {job.isActive ? "Active" : "Inactive"}
                      </span>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                      <MapPin size={11} /> {job.location}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-medium ${jobTypeColor(job.jobType)}`}>
                      <Briefcase size={11} /> {job.jobType}
                    </span>
                    {job.experience && (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg">
                        <Clock size={11} /> {job.experience}
                      </span>
                    )}
                  </div>

                  {/* Salary */}
                  {salary && (
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-3">
                      <IndianRupee size={13} /> {salary}
                    </div>
                  )}

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {skills.slice(0, 4).map((s) => (
                        <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-violet-50 text-violet-700 dark:bg-violet-900/20 dark:text-violet-400 border border-violet-100 dark:border-violet-800 font-medium">
                          {s}
                        </span>
                      ))}
                      {skills.length > 4 && (
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          +{skills.length - 4}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {job.description && (
                    <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-grow">
                      {job.description}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(job.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(job)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-800 transition-all"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job._id)}
                        disabled={deleteId === job._id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 transition-all disabled:opacity-50"
                      >
                        {deleteId === job._id
                          ? <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          : <Trash2 size={12} />
                        }
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <JobModal open={openModal} setOpen={setOpenModal} editData={editData} refreshJobs={fetchJobs} />
    </div>
  );
};

export default AdminJob;