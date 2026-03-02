// import { useAuth } from '../../context/AuthContext';

// const AdminDashboard = () => {
//   const { user } = useAuth();

//   return (
//     <div>
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//         {/* Card 1 */}
//         <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
//           <h2 className="text-gray-500 text-sm font-medium uppercase">Total Users</h2>
//           <p className="text-2xl font-bold text-gray-800 mt-2">1,250</p>
//         </div>

//         {/* Card 2 */}
//         <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
//           <h2 className="text-gray-500 text-sm font-medium uppercase">Active Sessions</h2>
//           <p className="text-2xl font-bold text-gray-800 mt-2">45</p>
//         </div>

//         {/* Card 3 */}
//         <div className="bg-white p-6 rounded-lg shadow border-l-4 border-yellow-500">
//           <h2 className="text-gray-500 text-sm font-medium uppercase">Pending Approvals</h2>
//           <p className="text-2xl font-bold text-gray-800 mt-2">12</p>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow p-6">
//         <h2 className="text-xl font-bold mb-4">Welcome, Admin {user?.name}</h2>
//         <p className="text-gray-600">
//           This is your control center. Use the sidebar to navigate to user management or settings.
//         </p>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

// pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";
import { Link } from "react-router-dom";
import {
  Users, Briefcase, FileText, MessageSquare,
  ArrowUpRight, ChevronRight, MapPin, Building2, RefreshCw
} from "lucide-react";

const SHARED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap');
  * { font-family: 'Figtree', sans-serif; }
  .font-display { font-family: 'Syne', sans-serif !important; }
  @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  .animate-slide-up { animation: slideUp 0.5s ease forwards; }
  .gradient-text {
    background: linear-gradient(135deg,#7c3aed,#4f46e5,#0ea5e9);
    background-size: 200% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text; animation: gradientShift 4s ease infinite;
  }
  .card-hover { transition: all 0.25s cubic-bezier(.4,0,.2,1); }
  .card-hover:hover { transform: translateY(-3px); box-shadow: 0 16px 40px -8px rgba(0,0,0,0.12); }
  .dark .card-hover:hover { box-shadow: 0 16px 40px -8px rgba(0,0,0,0.5); }
`;

const useCounter = (target, duration = 1600, start = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start || !target) return;
    let s = null;
    const step = (ts) => {
      if (!s) s = ts;
      const p = Math.min((ts - s) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
};

const GRADS = ["from-violet-500 to-indigo-600","from-pink-500 to-rose-500","from-emerald-500 to-teal-500","from-amber-500 to-orange-500","from-blue-500 to-cyan-500"];

const jobTypeColor = (type = "") => {
  const t = type.toLowerCase();
  if (t.includes("full")) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
  if (t.includes("part")) return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
  if (t.includes("intern")) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
  return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
};

const statusColor = {
  pending:     "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  reviewed:    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  shortlisted: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  rejected:    "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats]     = useState({ users: 0, jobs: 0, applications: 0, contacts: 0 });
  const [recentJobs, setRecentJobs]   = useState([]);
  const [recentApps, setRecentApps]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const uC = useCounter(stats.users,        1400, started);
  const jC = useCounter(stats.jobs,         1200, started);
  const aC = useCounter(stats.applications, 1600, started);
  const cC = useCounter(stats.contacts,     1000, started);

  const fetchAll = async () => {
    try {
      setRefreshing(true);
      const [usersRes, jobsRes, appsRes, ctctsRes] = await Promise.allSettled([
        api.get("/auth/allusers"),
        api.get("/job"),
        api.get("/application"),
        api.get("/contact/get"),
      ]);
      const users = usersRes.status === "fulfilled" ? (usersRes.value.data.users || []) : [];
      const jobs  = jobsRes.status  === "fulfilled" ? (jobsRes.value.data.jobs   || []) : [];
      const apps  = appsRes.status  === "fulfilled" ? (appsRes.value.data?.applications || []) : [];
      const ctcts = ctctsRes.status === "fulfilled" ? (ctctsRes.value.data.contact || []) : [];
      setStats({ users: users.length, jobs: jobs.length, applications: apps.length, contacts: ctcts.length });
      setRecentJobs(jobs.slice(0, 4));
      setRecentApps(apps.slice(0, 5));
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); setTimeout(() => setStarted(true), 100); }
  };

  useEffect(() => { fetchAll(); }, []);

  const statCards = [
    { icon: Users,         label: "Total Users",   value: uC, sub: "Active accounts",   iconBg: "bg-violet-100 dark:bg-violet-900/30",  iconColor: "text-violet-600 dark:text-violet-400",   border: "border-t-violet-500",  to: "/admin/users"        },
    { icon: Briefcase,     label: "Total Jobs",    value: jC, sub: "Posted listings",   iconBg: "bg-indigo-100 dark:bg-indigo-900/30",  iconColor: "text-indigo-600 dark:text-indigo-400",   border: "border-t-indigo-500",  to: "/admin/jobs"         },
    { icon: FileText,      label: "Applications",  value: aC, sub: "All submissions",   iconBg: "bg-emerald-100 dark:bg-emerald-900/30",iconColor: "text-emerald-600 dark:text-emerald-400", border: "border-t-emerald-500", to: "/admin/applications" },
    { icon: MessageSquare, label: "Contact Msgs",  value: cC, sub: "Messages received", iconBg: "bg-amber-100 dark:bg-amber-900/30",   iconColor: "text-amber-600 dark:text-amber-400",     border: "border-t-amber-500",   to: "/admin/contact"      },
  ];

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <style>{SHARED_STYLES}</style>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6 lg:p-8 transition-colors duration-300">
      <style>{SHARED_STYLES}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-slide-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Live Dashboard</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-black text-slate-900 dark:text-white">
            Welcome back, <span className="gradient-text">{user?.name || "Admin"}</span> 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">Here's your platform overview.</p>
        </div>
        <button onClick={fetchAll} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all self-start sm:self-auto">
          <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {statCards.map(({ icon: Icon, label, value, sub, iconBg, iconColor, border, to }, i) => (
          <Link key={label} to={to} className={`group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 border-t-2 ${border} card-hover overflow-hidden animate-slide-up block`} style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center`}><Icon size={20} className={iconColor} /></div>
              <ArrowUpRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-violet-500 transition-colors" />
            </div>
            <div className="font-display text-3xl font-black text-slate-900 dark:text-white">{value.toLocaleString()}</div>
            <p className="text-slate-800 dark:text-slate-200 font-semibold text-sm mt-1">{label}</p>
            <p className="text-slate-400 text-xs mt-0.5">{sub}</p>
          </Link>
        ))}
      </div>

      {/* Recent Jobs + Apps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Recent Jobs */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-slide-up" style={{ animationDelay: "0.35s", opacity: 0 }}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Recent Jobs</h3>
              <p className="text-slate-400 text-xs mt-0.5">Latest posted listings</p>
            </div>
            <Link to="/admin/jobs" className="text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline flex items-center gap-1">View all <ChevronRight size={13} /></Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentJobs.length === 0 ? <p className="text-center text-slate-400 py-10 text-sm">No jobs yet</p>
            : recentJobs.map((job, i) => (
              <div key={job._id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRADS[i % 5]} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                  {(typeof job.company === "string" ? job.company : job.company?.name || "?")?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{job.title}</p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building2 size={10} /> {typeof job.company === "string" ? job.company : job.company?.name}
                    <span className="mx-1">·</span><MapPin size={10} /> {job.location}
                  </p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${jobTypeColor(job.jobType)} flex-shrink-0`}>{job.jobType}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-slide-up" style={{ animationDelay: "0.42s", opacity: 0 }}>
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Recent Applications</h3>
              <p className="text-slate-400 text-xs mt-0.5">Latest submissions</p>
            </div>
            <Link to="/admin/applications" className="text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline flex items-center gap-1">View all <ChevronRight size={13} /></Link>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentApps.length === 0 ? <p className="text-center text-slate-400 py-10 text-sm">No applications yet</p>
            : recentApps.map((app, i) => (
              <div key={app._id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRADS[(i + 2) % 5]} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                  {app.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{app.name}</p>
                  <p className="text-xs text-slate-400 truncate mt-0.5">{app.job?.title || "—"}</p>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg capitalize flex-shrink-0 ${statusColor[app.status] || statusColor.pending}`}>{app.status || "pending"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: "0.5s", opacity: 0 }}>
        {[
          { icon: Users,         label: "Manage Users",   sub: `${stats.users} total`,        to: "/admin/users",        grad: "from-violet-500 to-indigo-600" },
          { icon: Briefcase,     label: "Manage Jobs",    sub: `${stats.jobs} jobs`,           to: "/admin/jobs",         grad: "from-indigo-500 to-blue-600"   },
          { icon: FileText,      label: "Applications",   sub: `${stats.applications} total`,  to: "/admin/applications", grad: "from-emerald-500 to-teal-600"  },
          { icon: MessageSquare, label: "Contact Msgs",   sub: `${stats.contacts} messages`,   to: "/admin/contact",      grad: "from-amber-500 to-orange-600"  },
        ].map(({ icon: Icon, label, sub, to, grad }) => (
          <Link key={label} to={to} className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 card-hover relative overflow-hidden flex flex-col gap-3">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
              <Icon size={20} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-white text-sm">{label}</p>
              <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
            </div>
            <ChevronRight size={16} className="absolute bottom-5 right-5 text-slate-300 dark:text-slate-600 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;