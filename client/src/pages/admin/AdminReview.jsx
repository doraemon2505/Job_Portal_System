// pages/admin/AdminReview.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Admin: see all user-submitted reviews, approve/reject, and approved ones
// automatically appear on the Home page testimonials section.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
  Star, CheckCircle2, XCircle, Trash2, Eye, EyeOff,
  Loader2, RefreshCw, MessageSquare, Search, X, AlertCircle
} from "lucide-react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap');
  * { font-family: 'Figtree', sans-serif; }
  .font-display { font-family: 'Syne', sans-serif !important; }
  @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  .au { animation: slideUp 0.4s ease both; }
`;

const GRADS = ["from-violet-500 to-indigo-600","from-pink-500 to-rose-500","from-emerald-500 to-teal-500","from-amber-500 to-orange-500","from-blue-500 to-cyan-500"];

const AdminReview = () => {
  const [reviews,    setReviews]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState("all"); // all | approved | pending
  const [actionId,   setActionId]   = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get("/review");
      setReviews(res.data?.reviews || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleApprove = async (id, current) => {
    setActionId(id);
    try {
      await api.put(`/review/${id}`, { approved: !current });
      setReviews(prev => prev.map(r => r._id === id ? { ...r, approved: !current } : r));
    } catch (e) { console.error(e); }
    finally { setActionId(null); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this review permanently?")) return;
    setActionId(id);
    try {
      await api.delete(`/review/${id}`);
      setReviews(prev => prev.filter(r => r._id !== id));
    } catch (e) { console.error(e); }
    finally { setActionId(null); }
  };

  const filtered = reviews.filter(r => {
    const matchFilter = filter === "all" || (filter === "approved" ? r.approved : !r.approved);
    const q = search.toLowerCase();
    const matchSearch = !q || r.name?.toLowerCase().includes(q) || r.message?.toLowerCase().includes(q) || r.role?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-6 lg:p-8 transition-colors duration-300">
      <style>{CSS}</style>

      {/* Header */}
      <div className="mb-8 au" style={{ opacity: 0 }}>
        <h1 className="font-display text-3xl font-black text-slate-900 dark:text-white">Reviews</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          {reviews.filter(r => r.approved).length} approved · {reviews.filter(r => !r.approved).length} pending
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6 au" style={{ animationDelay: "0.06s", opacity: 0 }}>
        {[
          { label: "Total",    value: reviews.length,                    color: "text-slate-900 dark:text-white",        bg: "bg-slate-100 dark:bg-slate-800" },
          { label: "Approved", value: reviews.filter(r => r.approved).length, color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
          { label: "Pending",  value: reviews.filter(r => !r.approved).length, color: "text-amber-700 dark:text-amber-400",   bg: "bg-amber-100 dark:bg-amber-900/30" },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 text-center">
            <div className={`font-display text-3xl font-black ${color}`}>{value}</div>
            <p className="text-slate-400 text-xs mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5 au" style={{ animationDelay: "0.1s", opacity: 0 }}>
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="w-full pl-10 pr-9 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
          />
          {search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14} /></button>}
        </div>
        <div className="flex gap-2">
          {["all","approved","pending"].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2.5 rounded-xl text-xs font-semibold capitalize border transition-all ${filter === f ? "bg-violet-600 text-white border-violet-600" : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-violet-400"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews */}
      {loading ? (
        <div className="flex items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-slate-400">Loading reviews...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
            <MessageSquare size={26} className="text-slate-400" />
          </div>
          <p className="font-display font-bold text-lg text-slate-800 dark:text-white">No reviews found</p>
          <p className="text-slate-400 text-sm">Reviews submitted by users will appear here.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 au" style={{ animationDelay: "0.14s", opacity: 0 }}>
          {filtered.map((review, i) => (
            <div key={review._id} className={`bg-white dark:bg-slate-900 border rounded-2xl p-5 transition-all ${review.approved ? "border-emerald-200 dark:border-emerald-800" : "border-slate-100 dark:border-slate-800"}`}>
              {/* Status indicator */}
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${review.approved ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
                  {review.approved ? "✓ Showing on Home" : "⏳ Pending Approval"}
                </span>
                <div className="flex text-amber-400 gap-0.5">
                  {Array.from({ length: review.rating || 5 }).map((_, idx) => (
                    <Star key={idx} size={12} fill="currentColor" />
                  ))}
                </div>
              </div>

              {/* Review text */}
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4 italic line-clamp-3">
                "{review.message}"
              </p>

              {/* Reviewer */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${GRADS[i % GRADS.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                  {(review.name || "U").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{review.name}</p>
                  <p className="text-xs text-slate-400 truncate">{review.role || review.email || ""}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleApprove(review._id, review.approved)}
                  disabled={actionId === review._id}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    review.approved
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-700 dark:hover:text-amber-400"
                      : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800"
                  }`}
                >
                  {actionId === review._id
                    ? <Loader2 size={12} className="animate-spin" />
                    : review.approved
                      ? <><EyeOff size={12} /> Remove from Home</>
                      : <><CheckCircle2 size={12} /> Approve & Show</>}
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  disabled={actionId === review._id}
                  className="p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReview;


// ─────────────────────────────────────────────────────────────────────────────
// USER: ReviewSection component — drop inside Profile.jsx
// Import this and place it inside the Profile tab content area
// ─────────────────────────────────────────────────────────────────────────────
// export const ReviewSection = ({ user }) => {
//   const [form,    setForm]    = useState({ message: "", rating: 5, role: user?.role === "admin" ? "Admin" : "" });
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error,   setError]   = useState("");
//   const [myReview, setMyReview] = useState(null);

//   useEffect(() => {
//     api.get("/review/my").then(res => setMyReview(res.data?.review || null)).catch(() => {});
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!form.message.trim()) { setError("Please write your review."); return; }
//     setError(""); setLoading(true);
//     try {
//       await api.post("/review", { ...form, name: user?.name, email: user?.email });
//       setSuccess(true);
//       setMyReview({ ...form, name: user?.name, approved: false });
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to submit. Try again.");
//     } finally { setLoading(false); }
//   };

//   return (
//     <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 mt-5">
//       <div className="flex items-center gap-2 mb-5">
//         <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
//           <Star size={16} className="text-amber-600 dark:text-amber-400" />
//         </div>
//         <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white">Share Your Experience</h2>
//       </div>

//       {myReview ? (
//         <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5">
//           <div className="flex items-center gap-2 mb-2">
//             <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${myReview.approved ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"}`}>
//               {myReview.approved ? "✓ Published on homepage" : "⏳ Awaiting admin approval"}
//             </span>
//           </div>
//           <p className="text-slate-600 dark:text-slate-300 text-sm italic mt-2">"{myReview.message}"</p>
//           <p className="text-slate-400 text-xs mt-3">You've already submitted a review. Thank you! 🙏</p>
//         </div>
//       ) : success ? (
//         <div className="flex flex-col items-center py-8 gap-3 text-center">
//           <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
//             <CheckCircle2 size={26} className="text-emerald-600 dark:text-emerald-400" />
//           </div>
//           <p className="font-display font-bold text-lg text-slate-900 dark:text-white">Review Submitted! 🎉</p>
//           <p className="text-slate-400 text-sm">Thank you for your feedback. Our admin will review it shortly.</p>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Star rating */}
//           <div>
//             <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Rating</label>
//             <div className="flex gap-1">
//               {[1,2,3,4,5].map(n => (
//                 <button key={n} type="button" onClick={() => setForm(f => ({ ...f, rating: n }))} className={`text-2xl transition-transform hover:scale-110 ${n <= form.rating ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}`}>
//                   ★
//                 </button>
//               ))}
//               <span className="ml-2 text-sm text-slate-400 self-center">{form.rating}/5</span>
//             </div>
//           </div>

//           {/* Role/Designation */}
//           <div>
//             <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Your Role / Designation</label>
//             <input
//               type="text" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
//               placeholder="e.g. Frontend Developer @ Google"
//               className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all"
//             />
//           </div>

//           {/* Review */}
//           <div>
//             <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Your Review <span className="text-red-400">*</span></label>
//             <textarea
//               value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
//               rows={4} placeholder="Share your experience with HireSetu..."
//               className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400 transition-all resize-none"
//             />
//           </div>

//           {error && <p className="flex items-center gap-1.5 text-xs text-red-500"><AlertCircle size={12} />{error}</p>}

//           <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-violet-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-60">
//             {loading ? <><Loader2 size={15} className="animate-spin" /> Submitting…</> : <><Star size={14} /> Submit Review</>}
//           </button>
//           <p className="text-center text-xs text-slate-400">Your review will appear on our homepage after admin approval.</p>
//         </form>
//       )}
//     </div>
//   );
// };