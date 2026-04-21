import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Users, Search, X, ShieldCheck, User, Calendar, Mail, ChevronUp, ChevronDown } from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap');
  * { font-family: 'Figtree', sans-serif; }
  .font-display { font-family: 'Syne', sans-serif !important; }
  @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  .animate-slide-up { animation: slideUp 0.4s ease forwards; }
`;

const GRADS = ["from-violet-500 to-indigo-600","from-pink-500 to-rose-500","from-emerald-500 to-teal-500","from-amber-500 to-orange-500","from-blue-500 to-cyan-500","from-indigo-500 to-purple-600"];

const AdminUsers = () => {
  const [users,   setUsers]   = useState([]);
  const [filtered,setFiltered]= useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [search,  setSearch]  = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [sortField,  setSortField]  = useState("createdAt");
  const [sortDir,    setSortDir]    = useState("desc");

  const fetchUsers = async () => {
    try {
      const { data } = await api.get("/auth/allusers");
      setUsers(data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    let res = [...users];
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(u => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
    }
    if (roleFilter !== "all") res = res.filter(u => u.role === roleFilter);
    res.sort((a, b) => {
      if (sortField === "name")  return sortDir === "asc" ? a.name?.localeCompare(b.name) : b.name?.localeCompare(a.name);
      if (sortField === "createdAt") return sortDir === "asc" ? new Date(a.createdAt) - new Date(b.createdAt) : new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });
    setFiltered(res);
  }, [search, roleFilter, sortField, sortDir, users]);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp size={13} className="text-slate-300 dark:text-slate-600" />;
    return sortDir === "asc" ? <ChevronUp size={13} className="text-violet-500" /> : <ChevronDown size={13} className="text-violet-500" />;
  };

  const adminCount = users.filter(u => u.role === "admin").length;
  const userCount  = users.filter(u => u.role !== "admin").length;

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <style>{STYLES}</style>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading users...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <style>{STYLES}</style>
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 text-center max-w-sm">
        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
          <X size={24} className="text-red-600 dark:text-red-400" />
        </div>
        <p className="font-semibold text-red-700 dark:text-red-400">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6 lg:p-8 transition-colors duration-300">
      <style>{STYLES}</style>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-slide-up">
        <div>
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{users.length} total users · {filtered.length} shown</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6 animate-slide-up" style={{ animationDelay: "0.08s", opacity: 0 }}>
        {[
          { label: "Total Users", value: users.length, icon: Users,       bg: "bg-violet-100 dark:bg-violet-900/30", color: "text-violet-600 dark:text-violet-400" },
          { label: "Admins",      value: adminCount,   icon: ShieldCheck,  bg: "bg-indigo-100 dark:bg-indigo-900/30", color: "text-indigo-600 dark:text-indigo-400" },
          { label: "Members",     value: userCount,    icon: User,         bg: "bg-emerald-100 dark:bg-emerald-900/30", color: "text-emerald-600 dark:text-emerald-400" },
        ].map(({ label, value, icon: Icon, bg, color }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={20} className={color} />
            </div>
            <div>
              <div className="font-display text-2xl font-black text-slate-900 dark:text-white">{value}</div>
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
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14} /></button>}
        </div>
        {/* <div className="flex gap-2">
          {["all", "admin", "user"].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)} className={`px-4 py-2.5 rounded-xl text-xs font-semibold capitalize border transition-all ${roleFilter === r ? "bg-violet-600 text-white border-violet-600 shadow-lg shadow-violet-500/20" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400"}`}>
              {r === "all" ? "All Roles" : r}
            </button>
          ))}
        </div> */}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-slide-up" style={{ animationDelay: "0.18s", opacity: 0 }}>

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left">
                  <button onClick={() => toggleSort("name")} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    User <SortIcon field="name" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left">
                  <button onClick={() => toggleSort("createdAt")} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                    Joined <SortIcon field="createdAt" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16 text-slate-400 text-sm">No users found</td></tr>
              ) : filtered.map((user, i) => (
                <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="px-6 py-4 text-sm text-slate-400 font-medium">{i + 1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${GRADS[i % GRADS.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800 dark:text-white text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                      <Mail size={13} /> {user.email}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
                      user.role === "admin"
                        ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400"
                        : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    }`}>
                      {user.role === "admin" ? <ShieldCheck size={11} /> : <User size={11} />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5 text-xs text-slate-400">
                      <Calendar size={11} />
                      {new Date(user.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {filtered.length === 0 ? (
            <p className="text-center py-12 text-slate-400 text-sm">No users found</p>
          ) : filtered.map((user, i) => (
            <div key={user._id} className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRADS[i % GRADS.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 dark:text-white text-sm">{user.name}</p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
                <p className="text-xs text-slate-400 mt-0.5">Joined {new Date(user.createdAt).toLocaleDateString("en-IN")}</p>
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0 ${user.role === "admin" ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"}`}>
                {user.role}
              </span>
            </div>
          ))}
        </div>

        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-400">Showing {filtered.length} of {users.length} users</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;