// import React, { useEffect, useState } from "react";
// import api from "../../services/api";

// const AdminApplication = () => {
//     const [applications, setApplications] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const fetchApplications = async () => {
//         try {
//             setLoading(true);
//             const res = await api.get("/application");
//             setApplications(res.data?.applications || []);
//         } catch (err) {
//             console.error(err);
//             alert("Failed to fetch applications");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchApplications();
//     }, []);

//     const handleStatusChange = async (id, status) => {
//         try {
//             await api.put(`/application/${id}`, { status });
//             fetchApplications();
//         } catch (err) {
//             alert("Failed to update status");
//         }
//     };

//     const handleDelete = async (id) => {
//         if (!window.confirm("Delete this application?")) return;

//         try {
//             await api.delete(`/application/${id}`);
//             fetchApplications();
//         } catch (err) {
//             alert("Failed to delete");
//         }
//     };

//     const getStatusBadge = (status) => {
//         switch (status) {
//             case "shortlisted":
//                 return "bg-green-100 text-green-700";
//             case "reviewed":
//                 return "bg-blue-100 text-blue-700";
//             case "rejected":
//                 return "bg-red-100 text-red-700";
//             default:
//                 return "bg-gray-100 text-gray-700";
//         }
//     };

//     return (
//         <div className="min-h-screen bg-gray-100 p-8">
//             <div className="max-w-7xl mx-auto">

//                 <h1 className="text-3xl font-bold mb-8">
//                     Applications Management
//                 </h1>

//                 {loading ? (
//                     <div className="text-center py-20 text-gray-500">
//                         Loading applications...
//                     </div>
//                 ) : applications.length === 0 ? (
//                     <div className="text-center py-20 text-gray-500">
//                         No applications found
//                     </div>
//                 ) : (
//                     <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">

//                         <table className="min-w-full text-sm text-left">

//                             {/* Table Head */}
//                             <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs">
//                                 <tr>
//                                     <th className="px-6 py-4">Applicant</th>
//                                     <th className="px-6 py-4">Contact</th>
//                                     <th className="px-6 py-4">Job</th>
//                                     <th className="px-6 py-4">Status</th>
//                                     <th className="px-6 py-4 text-center">Actions</th>
//                                 </tr>
//                             </thead>

//                             {/* Table Body */}
//                             <tbody>
//                                 {applications.map((app) => (
//                                     <tr
//                                         key={app._id}
//                                         className="border-b hover:bg-gray-50 transition"
//                                     >
//                                         {/* Applicant */}
//                                         <td className="px-6 py-4">
//                                             <p className="font-semibold">
//                                                 {app.name}
//                                             </p>
//                                         </td>

//                                         {/* Contact */}
//                                         <td className="px-6 py-4">
//                                             <p className="text-gray-600">
//                                                 {app.email}
//                                             </p>
//                                             <p className="text-gray-500 text-xs">
//                                                 {app.phone}
//                                             </p>
//                                         </td>

//                                         {/* Job */}
//                                         <td className="px-6 py-4">
//                                             <p className="font-medium">
//                                                 {app.job?.title}
//                                             </p>
//                                             <p className="text-gray-500 text-xs">
//                                                 {app.job?.company?.name}
//                                             </p>
//                                         </td>

//                                         {/* Status */}
//                                         <td className="px-6 py-4">
//                                             <select
//                                                 value={app.status}
//                                                 onChange={(e) =>
//                                                     handleStatusChange(
//                                                         app._id,
//                                                         e.target.value
//                                                     )
//                                                 }
//                                                 className={`px-3 py-1 rounded-full text-xs font-semibold border outline-none ${getStatusBadge(
//                                                     app.status
//                                                 )}`}
//                                             >
//                                                 <option value="pending">Pending</option>
//                                                 <option value="reviewed">Reviewed</option>
//                                                 <option value="shortlisted">Shortlisted</option>
//                                                 <option value="rejected">Rejected</option>
//                                             </select>
//                                         </td>

//                                         {/* Actions */}
//                                         <td className="px-6 py-4 text-center">
//                                             <button
//                                                 onClick={() => handleDelete(app._id)}
//                                                 className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-xs transition"
//                                             >
//                                                 Delete
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>

//                         </table>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AdminApplication;

// pages/admin/AdminApplication.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
  FileText, Search, X, Trash2, ChevronDown, Mail, Phone,
  Building2, Clock, CheckCircle2, AlertCircle, XCircle, Loader2
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap');
  * { font-family: 'Figtree', sans-serif; }
  .font-display { font-family: 'Syne', sans-serif !important; }
  @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  .animate-slide-up { animation: slideUp 0.4s ease forwards; }
`;

const GRADS = ["from-violet-500 to-indigo-600","from-pink-500 to-rose-500","from-emerald-500 to-teal-500","from-amber-500 to-orange-500","from-blue-500 to-cyan-500","from-indigo-500 to-purple-600"];

const STATUS_CONFIG = {
  pending:     { label: "Pending",     cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",    icon: Clock         },
  reviewed:    { label: "Reviewed",    cls: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",         icon: AlertCircle   },
  shortlisted: { label: "Shortlisted", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400", icon: CheckCircle2 },
  rejected:    { label: "Rejected",    cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",             icon: XCircle       },
};

const StatusBadge = ({ status }) => {
  const s = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${s.cls}`}>
      <Icon size={11} /> {s.label}
    </span>
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

      {/* Header */}
      <div className="mb-8 animate-slide-up">
        <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">Applications</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{applications.length} total · {filtered.length} shown</p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 animate-slide-up" style={{ animationDelay: "0.08s", opacity: 0 }}>
        {Object.entries(STATUS_CONFIG).map(([key, { label, cls, icon: Icon }]) => (
          <div key={key} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cls.split(" ").slice(0,2).join(" ")}`}>
              <Icon size={18} className={cls.split(" ").slice(2).join(" ")} />
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
                    {["Applicant", "Contact", "Applied For", "Status", "Action"].map(h => (
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
                                className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-semibold border-0 outline-none cursor-pointer ${STATUS_CONFIG[app.status]?.cls || STATUS_CONFIG.pending.cls}`}
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
                        <button
                          onClick={() => handleDelete(app._id)}
                          disabled={deletingId === app._id}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 transition-all disabled:opacity-50 opacity-0 group-hover:opacity-100"
                        >
                          {deletingId === app._id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                          Delete
                        </button>
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
                      className="flex-1 text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-violet-500/30"
                    >
                      {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
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