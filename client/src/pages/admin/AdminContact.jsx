// import { useEffect, useState } from "react";
// import api from "../../services/api";

// const AdminContact = () => {
//     const [contacts, setContacts] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const fetchContacts = async () => {
//         try {
//             const res = await api.get("contact/get");
//             setContacts(res.data.contact);
//         } catch (error) {
//             console.error(error.response?.data || error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchContacts();
//     }, []);

//     const handleDelete = async (id) => {
//         if (!window.confirm("Are you sure you want to delete this message?"))
//             return;

//         try {
//             await api.delete(`contact/delete/${id}`);
//             setContacts((prev) =>
//                 prev.filter((contact) => contact._id !== id)
//             );
//         } catch (error) {
//             console.error(error.response?.data || error.message);
//         }
//     };

//     if (loading)
//         return <p className="text-center mt-10 text-lg">Loading Contacts...</p>;

//     return (
//         <div className="min-h-screen bg-gray-100 p-8">
//             <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-6">
//                 <h1 className="text-3xl font-bold mb-6">
//                     Admin - Contact Messages
//                 </h1>

//                 {contacts.length === 0 ? (
//                     <p className="text-gray-500">No Messages Found</p>
//                 ) : (
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full border border-gray-200 rounded-lg">
//                             <thead className="bg-gray-800 text-white">
//                                 <tr>
//                                     <th className="px-4 py-3 text-left text-sm font-semibold">
//                                         #
//                                     </th>
//                                     <th className="px-4 py-3 text-left text-sm font-semibold">
//                                         Name
//                                     </th>
//                                     <th className="px-4 py-3 text-left text-sm font-semibold">
//                                         Email
//                                     </th>
//                                     <th className="px-4 py-3 text-left text-sm font-semibold">
//                                         Phone
//                                     </th>
//                                     <th className="px-4 py-3 text-left text-sm font-semibold">
//                                         Message
//                                     </th>
//                                     <th className="px-4 py-3 text-left text-sm font-semibold">
//                                         Date
//                                     </th>
//                                     <th className="px-4 py-3 text-center text-sm font-semibold">
//                                         Action
//                                     </th>
//                                 </tr>
//                             </thead>

//                             <tbody>
//                                 {contacts.map((contact, index) => (
//                                     <tr
//                                         key={contact._id}
//                                         className="border-t hover:bg-gray-50 transition"
//                                     >
//                                         <td className="px-4 py-3 text-sm">
//                                             {index + 1}
//                                         </td>
//                                         <td className="px-4 py-3 text-sm font-medium">
//                                             {contact.name}
//                                         </td>
//                                         <td className="px-4 py-3 text-sm">
//                                             {contact.email}
//                                         </td>
//                                         <td className="px-4 py-3 text-sm">
//                                             {contact.phone}
//                                         </td>
//                                         <td className="px-4 py-3 text-sm max-w-xs truncate">
//                                             {contact.message}
//                                         </td>
//                                         <td className="px-4 py-3 text-sm">
//                                             {new Date(
//                                                 contact.createdAt
//                                             ).toLocaleDateString()}
//                                         </td>
//                                         <td className="px-4 py-3 text-center">
//                                             <button
//                                                 onClick={() =>
//                                                     handleDelete(contact._id)
//                                                 }
//                                                 className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition"
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

// export default AdminContact;


// pages/admin/AdminContact.jsx
import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  MessageSquare, Search, X, Trash2, Mail, Phone,
  Calendar, User, ChevronDown, ChevronUp, Loader2, Eye
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap');
  * { font-family: 'Figtree', sans-serif; }
  .font-display { font-family: 'Syne', sans-serif !important; }
  @keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  .animate-slide-up { animation: slideUp 0.4s ease forwards; }
  .animate-fade-in  { animation: fadeIn 0.2s ease forwards; }
`;

const GRADS = ["from-violet-500 to-indigo-600","from-pink-500 to-rose-500","from-emerald-500 to-teal-500","from-amber-500 to-orange-500","from-blue-500 to-cyan-500","from-indigo-500 to-purple-600"];

const AdminContact = () => {
  const [contacts,   setContacts]   = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [viewMsg,    setViewMsg]    = useState(null);

  const fetchContacts = async () => {
    try {
      const res = await api.get("contact/get");
      setContacts(res.data.contact || []);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  useEffect(() => {
    if (!search.trim()) { setFiltered(contacts); return; }
    const q = search.toLowerCase();
    setFiltered(contacts.filter(c =>
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.message?.toLowerCase().includes(q)
    ));
  }, [search, contacts]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    setDeletingId(id);
    try {
      await api.delete(`contact/delete/${id}`);
      setContacts(prev => prev.filter(c => c._id !== id));
      if (viewMsg?._id === id) setViewMsg(null);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <style>{STYLES}</style>
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">Loading messages...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6 lg:p-8 transition-colors duration-300">
      <style>{STYLES}</style>

      {/* Message Modal */}
      {viewMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setViewMsg(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl max-w-lg w-full p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRADS[0]} flex items-center justify-center text-white text-sm font-bold`}>
                  {viewMsg.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{viewMsg.name}</p>
                  <p className="text-xs text-slate-400">{viewMsg.email}</p>
                </div>
              </div>
              <button onClick={() => setViewMsg(null)} className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <X size={14} />
              </button>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-5">
              <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{viewMsg.message}</p>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1"><Calendar size={11} /> {new Date(viewMsg.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
              {viewMsg.phone && <span className="flex items-center gap-1"><Phone size={11} /> {viewMsg.phone}</span>}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-slide-up">
        <div>
          <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">Contact Messages</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">{contacts.length} total · {filtered.length} shown</p>
        </div>
        <div className="flex items-center gap-2 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl px-4 py-2.5 self-start sm:self-auto">
          <MessageSquare size={16} className="text-violet-600 dark:text-violet-400" />
          <span className="text-sm font-semibold text-violet-700 dark:text-violet-400">{contacts.length} message{contacts.length !== 1 ? "s" : ""}</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5 animate-slide-up" style={{ animationDelay: "0.08s", opacity: 0 }}>
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name, email or message content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
        />
        {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14} /></button>}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden animate-slide-up" style={{ animationDelay: "0.14s", opacity: 0 }}>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
              <MessageSquare size={26} className="text-slate-400" />
            </div>
            <p className="font-semibold text-slate-600 dark:text-slate-300">No messages found</p>
            <p className="text-slate-400 text-sm">{search ? "Try adjusting your search" : "Contact messages will appear here"}</p>
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Sender</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((contact, i) => (
                    <tr key={contact._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                      <td className="px-6 py-4 text-sm text-slate-400 font-medium">{i + 1}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${GRADS[i % GRADS.length]} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                            {contact.name?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-800 dark:text-white text-sm">{contact.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-1.5"><Mail size={12} /> {contact.email}</p>
                        {contact.phone && <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5"><Phone size={11} /> {contact.phone}</p>}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <p className="text-sm text-slate-600 dark:text-slate-300 truncate">{contact.message}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Calendar size={11} />
                          {new Date(contact.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setViewMsg(contact)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 text-xs font-semibold hover:bg-violet-100 dark:hover:bg-violet-900/40 border border-violet-200 dark:border-violet-800 transition-all"
                          >
                            <Eye size={12} /> View
                          </button>
                          <button
                            onClick={() => handleDelete(contact._id)}
                            disabled={deletingId === contact._id}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 transition-all disabled:opacity-50"
                          >
                            {deletingId === contact._id ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile - Accordion */}
            <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((contact, i) => (
                <div key={contact._id} className="p-4">
                  <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === contact._id ? null : contact._id)}
                  >
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${GRADS[i % GRADS.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {contact.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 dark:text-white text-sm">{contact.name}</p>
                      <p className="text-xs text-slate-400 truncate">{contact.message}</p>
                    </div>
                    {expandedId === contact._id ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
                  </div>
                  {expandedId === contact._id && (
                    <div className="mt-3 ml-13 space-y-2 animate-fade-in pl-13" style={{ paddingLeft: "52px" }}>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Mail size={11} /> {contact.email}</p>
                      {contact.phone && <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Phone size={11} /> {contact.phone}</p>}
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5"><Calendar size={11} /> {new Date(contact.createdAt).toLocaleDateString("en-IN")}</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800 rounded-xl p-3 mt-2">{contact.message}</p>
                      <button onClick={() => handleDelete(contact._id)} className="flex items-center gap-1.5 px-3 py-1.5 mt-1 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold border border-red-200 dark:border-red-800">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="px-6 py-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs text-slate-400">Showing {filtered.length} of {contacts.length} messages</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminContact;