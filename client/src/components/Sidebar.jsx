// import { Link } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const Sidebar = () => {
//   const { logout } = useAuth();

//   return (
//     <div className="w-64 bg-gray-800 h-screen text-white flex flex-col">
//       <div className="p-4 text-2xl font-bold border-b border-gray-700">
//         Admin Panel
//       </div>
//       <nav className="flex-1 p-4 space-y-2">
//         <Link to="/admin" className="block py-2 px-4 hover:bg-gray-700 rounded">Dashboard</Link>
//         <Link to="/admin/users" className="block py-2 px-4 hover:bg-gray-700 rounded">Users</Link>
//         <Link to="/admin/contact" className="block py-2 px-4 hover:bg-gray-700 rounded">Contacts</Link>
//         <Link to="/admin/job" className="block py-2 px-4 hover:bg-gray-700 rounded">Jobs</Link>
//         <Link to="/admin/application" className="block py-2 px-4 hover:bg-gray-700 rounded">Applications</Link>
//         <Link to="/" className="block py-2 px-4 hover:bg-gray-700 rounded text-gray-400">Back to Site</Link>
//       </nav>
//       <div className="p-4 border-t border-gray-700">
//         <button 
//           onClick={logout} 
//           className="w-full bg-red-600 py-2 rounded hover:bg-red-700"
//         >
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Sidebar;


// components/admin/Sidebar.jsx  (or public/Sidebar.jsx — move to admin folder)
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Users, Briefcase, FileText,
  MessageSquare, Globe, LogOut, ChevronLeft,
  ChevronRight, Zap, Shield
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap');
  * { font-family: 'Figtree', sans-serif; }
  .font-display { font-family: 'Syne', sans-serif !important; }
  @keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
  .gradient-logo {
    background: linear-gradient(135deg,#7c3aed,#4f46e5,#0ea5e9);
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; animation: gradientShift 4s ease infinite;
  }
`;

const NAV = [
  { label: "Dashboard",    to: "/admin",              icon: LayoutDashboard },
  { label: "Users",        to: "/admin/users",         icon: Users           },
  { label: "Jobs",         to: "/admin/jobs",          icon: Briefcase       },
  { label: "Applications", to: "/admin/applications",  icon: FileText        },
  { label: "Contacts",     to: "/admin/contact",       icon: MessageSquare   },
];

const Sidebar = () => {
  const { logout, user } = useAuth();
  const location  = useLocation();
  const navigate  = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <>
      <style>{STYLES}</style>

      <aside
        className={`
          relative flex flex-col h-screen
          bg-slate-900 border-r border-slate-800
          transition-all duration-300 ease-in-out flex-shrink-0
          ${collapsed ? "w-[72px]" : "w-[240px]"}
        `}
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute -right-3.5 top-6 z-10 w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-violet-600 hover:border-violet-600 transition-all duration-200 shadow-lg"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-5 border-b border-slate-800 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-9 h-9 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30 flex-shrink-0">
            <Shield size={18} className="text-white" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <span className="font-display font-black text-lg gradient-logo block leading-tight">HireSetu</span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Admin Panel</span>
            </div>
          )}
        </div>

        {/* Admin User Badge */}
        {!collapsed && user && (
          <div className="mx-3 mt-4 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white text-xs font-semibold truncate">{user.name}</p>
                <p className="text-slate-400 text-[10px] flex items-center gap-1"><Shield size={9} /> Administrator</p>
              </div>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
          {!collapsed && (
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2">Navigation</p>
          )}

          {NAV.map(({ label, to, icon: Icon }) => {
            const active = isActive(to);
            return (
              <Link
                key={to}
                to={to}
                title={collapsed ? label : undefined}
                className={`
                  flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 group relative
                  ${active
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/25"
                    : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <Icon size={18} className={`flex-shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-white"}`} />
                {!collapsed && (
                  <span className="text-sm font-semibold">{label}</span>
                )}
                {active && !collapsed && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white/60" />
                )}
                {/* Tooltip when collapsed */}
                {collapsed && (
                  <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-slate-700 shadow-xl z-50">
                    {label}
                  </div>
                )}
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-slate-800">
            {!collapsed && (
              <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2">Site</p>
            )}
            <Link
              to="/"
              title={collapsed ? "Back to Site" : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-slate-400 hover:text-white hover:bg-slate-800 transition-all group relative ${collapsed ? "justify-center" : ""}`}
            >
              <Globe size={18} className="flex-shrink-0 text-slate-400 group-hover:text-white" />
              {!collapsed && <span className="text-sm font-semibold">Back to Site</span>}
              {collapsed && (
                <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-slate-700 shadow-xl z-50">
                  Back to Site
                </div>
              )}
            </Link>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            title={collapsed ? "Logout" : undefined}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all group relative ${collapsed ? "justify-center" : ""}`}
          >
            <LogOut size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm font-semibold">Sign Out</span>}
            {collapsed && (
              <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-slate-700 shadow-xl z-50">
                Sign Out
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;