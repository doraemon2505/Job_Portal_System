// import React, { useState } from "react";
// import api from "../../services/api";

// const ApplyModal = ({ open, setOpen, jobId }) => {
//     const [loading, setLoading] = useState(false);

//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         phone: "",
//     });

//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             setLoading(true);

//             await api.post("/application", {
//                 jobId,
//                 ...formData,
//             });

//             alert("Application Submitted Successfully ✅");

//             // Reset form
//             setFormData({
//                 name: "",
//                 email: "",
//                 phone: "",
//             });

//             setOpen(false);

//         } catch (err) {
//             console.error(err.response?.data || err.message);

//             alert(
//                 err.response?.data?.message ||
//                 "Something went wrong ❌"
//             );
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (!open) return null;

//     return (
//         <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
//             <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-xl">

//                 <div className="flex justify-between mb-4">
//                     <h2 className="text-xl font-bold">Apply for Job</h2>
//                     <button onClick={() => setOpen(false)}>✕</button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">

//                     <input
//                         name="name"
//                         placeholder="Full Name"
//                         required
//                         value={formData.name}
//                         onChange={handleChange}
//                         className="w-full border p-3 rounded-lg"
//                     />

//                     <input
//                         type="email"
//                         name="email"
//                         placeholder="Email"
//                         required
//                         value={formData.email}
//                         onChange={handleChange}
//                         className="w-full border p-3 rounded-lg"
//                     />

//                     <input
//                         name="phone"
//                         placeholder="Phone"
//                         required
//                         value={formData.phone}
//                         onChange={handleChange}
//                         className="w-full border p-3 rounded-lg"
//                     />

//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
//                     >
//                         {loading ? "Submitting..." : "Submit Application"}
//                     </button>

//                 </form>
//             </div>
//         </div>
//     );
// };

// export default ApplyModal;

// components/public/ApplyModal.jsx
import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  X, User, Mail, Phone, FileText, Link as LinkIcon,
  Upload, CheckCircle2, Loader2, AlertCircle, Briefcase,
  Github, ExternalLink, Trash2, Info, Sparkles
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap');
  * { font-family: 'Figtree', sans-serif; }
  .font-display { font-family: 'Syne', sans-serif !important; }
  @keyframes slideUp { from { opacity:0; transform:translateY(24px) scale(0.98); } to { opacity:1; transform:translateY(0) scale(1); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  .modal-enter  { animation: slideUp 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
  .overlay-enter{ animation: fadeIn  0.2s ease forwards; }
  .auto-fill-badge {
    background: linear-gradient(90deg,#7c3aed20,#4f46e520,#7c3aed20);
    background-size: 200% 100%;
    animation: shimmer 2.5s linear infinite;
  }
`;

const INPUT_BASE = "w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400";

const MAX_PDF = 5 * 1024 * 1024; // 5MB

const Field = ({ label, required, error, hint, badge, children }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {label} {required && <span className="text-red-400 normal-case">*</span>}
      </label>
      {badge && (
        <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400 flex items-center gap-1 auto-fill-badge px-2 py-0.5 rounded-full border border-violet-200 dark:border-violet-800">
          <Sparkles size={9} /> Auto-filled
        </span>
      )}
    </div>
    {children}
    {hint && !error && <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1"><Info size={11} />{hint}</p>}
    {error && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
  </div>
);

const ApplyModal = ({ open, setOpen, jobId, jobTitle, companyName }) => {
  const { user } = useAuth();
  const resumeRef = useRef();
  const [loading,  setLoading]  = useState(false);
  const [success,  setSuccess]  = useState(false);
  const [autoFilled, setAutoFilled] = useState([]);

  const EMPTY = {
    name: "", email: "", phone: "",
    resumeFile: null, resumeName: "",
    coverLetter: "", portfolioUrl: "", githubUrl: "",
  };

  const [form, setForm]     = useState(EMPTY);
  const [errors, setErrors] = useState({});

  // Auto-fill from logged-in user
  useEffect(() => {
    if (!open) { setSuccess(false); return; }
    if (user) {
      const filled = [];
      const updates = {};
      if (user.name  && !form.name)  { updates.name  = user.name;  filled.push("name");  }
      if (user.email && !form.email) { updates.email = user.email; filled.push("email"); }
      if (user.phone && !form.phone) { updates.phone = user.phone; filled.push("phone"); }
      if (user.portfolioUrl && !form.portfolioUrl) { updates.portfolioUrl = user.portfolioUrl; filled.push("portfolioUrl"); }
      if (user.githubUrl    && !form.githubUrl)    { updates.githubUrl    = user.githubUrl;    filled.push("githubUrl");    }
      if (filled.length) { setForm(f => ({ ...f, ...updates })); setAutoFilled(filled); }
    }
  }, [open, user]);

  const set = (name, value) => {
    setForm(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: "" }));
  };

  const handleChange = (e) => set(e.target.name, e.target.value);

  const handleResume = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") { setErrors(e => ({ ...e, resume: "Only PDF files allowed" })); return; }
    if (file.size > MAX_PDF)             { setErrors(e => ({ ...e, resume: "Max file size is 5MB" }));    return; }
    setErrors(e => ({ ...e, resume: "" }));
    set("resumeFile", file);
    set("resumeName", file.name);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.resumeFile)   e.resume = "Resume (PDF) is required";
    return e;
  };

  const isReady = () => Object.keys(validate()).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      setLoading(true);
      // Build FormData for file upload
      const fd = new FormData();
      fd.append("jobId",        jobId);
      fd.append("name",         form.name);
      fd.append("email",        form.email);
      fd.append("phone",        form.phone);
      fd.append("coverLetter",  form.coverLetter);
      fd.append("portfolioUrl", form.portfolioUrl);
      fd.append("githubUrl",    form.githubUrl);
      fd.append("resume",       form.resumeFile);

      await api.post("/application", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
    } catch (err) {
      // Fallback: try JSON without file
      try {
        await api.post("/application", {
          jobId, name: form.name, email: form.email, phone: form.phone,
          coverLetter: form.coverLetter, portfolioUrl: form.portfolioUrl, githubUrl: form.githubUrl,
        });
        setSuccess(true);
      } catch (err2) {
        setErrors({ submit: err2.response?.data?.message || "Submission failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => { setForm(EMPTY); setErrors({}); setSuccess(false); setAutoFilled([]); }, 300);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-enter" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }} onClick={handleClose}>
      <style>{STYLES}</style>

      <div
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 modal-enter overflow-hidden flex flex-col"
        style={{ maxHeight: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="relative flex items-start justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/25 flex-shrink-0">
              <Briefcase size={18} className="text-white" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg text-slate-900 dark:text-white leading-tight">Apply Now</h2>
              {(jobTitle || companyName) && (
                <p className="text-xs text-slate-400 mt-0.5">
                  {jobTitle && <span className="font-semibold text-violet-600 dark:text-violet-400">{jobTitle}</span>}
                  {companyName && <span className="text-slate-400"> · {companyName}</span>}
                </p>
              )}
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex-shrink-0">
            <X size={15} />
          </button>
        </div>

        {/* Success State */}
        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center p-10 text-center gap-4">
            <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle2 size={40} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white">Application Sent!</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-xs">Your application has been submitted. The team will review it and get back to you soon.</p>
            </div>
            <button onClick={handleClose} className="mt-2 px-8 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg shadow-violet-500/25 hover:scale-105 transition-transform">
              Done
            </button>
          </div>
        ) : (
          <>
            {/* Auto-fill notice */}
            {user && autoFilled.length > 0 && (
              <div className="mx-6 mt-4 flex items-center gap-2.5 p-3 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-xl flex-shrink-0">
                <Sparkles size={15} className="text-violet-600 dark:text-violet-400 flex-shrink-0" />
                <p className="text-xs text-violet-700 dark:text-violet-300 font-medium">
                  We auto-filled {autoFilled.length} field{autoFilled.length > 1 ? "s" : ""} from your profile. Review and update if needed.
                </p>
              </div>
            )}

            {/* Scrollable form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">

              {/* Personal Info */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 space-y-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personal Information</p>

                <Field label="Full Name" required error={errors.name} badge={autoFilled.includes("name")}>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your full name" className={`${INPUT_BASE} pl-10 ${errors.name ? "border-red-400 focus:ring-red-400/20" : ""}`} />
                  </div>
                </Field>

                <Field label="Email Address" required error={errors.email} badge={autoFilled.includes("email")}>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@email.com" className={`${INPUT_BASE} pl-10 ${errors.email ? "border-red-400 focus:ring-red-400/20" : ""}`} />
                  </div>
                </Field>

                <Field label="Phone Number" required error={errors.phone} badge={autoFilled.includes("phone")}>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" className={`${INPUT_BASE} pl-10 ${errors.phone ? "border-red-400 focus:ring-red-400/20" : ""}`} />
                  </div>
                </Field>
              </div>

              {/* Resume */}
              <Field label="Resume" required error={errors.resume} hint="PDF only · Max 5MB">
                {form.resumeFile ? (
                  <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText size={20} className="text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{form.resumeName}</p>
                      <p className="text-xs text-slate-400">{(form.resumeFile.size / 1024 / 1024).toFixed(2)} MB · PDF</p>
                    </div>
                    <button type="button" onClick={() => { set("resumeFile", null); set("resumeName", ""); }} className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => resumeRef.current.click()}
                    className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all hover:border-violet-400 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 ${errors.resume ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10" : "border-slate-200 dark:border-slate-700"}`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                        <Upload size={20} className="text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Upload your resume</p>
                        <p className="text-xs text-slate-400 mt-0.5">PDF only · Maximum 5MB</p>
                      </div>
                    </div>
                  </div>
                )}
                <input ref={resumeRef} type="file" accept=".pdf,application/pdf" className="hidden" onChange={(e) => handleResume(e.target.files[0])} />
              </Field>

              {/* Links */}
              <div className="space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Portfolio & Links <span className="normal-case text-slate-300 font-normal">(optional)</span></p>

                <Field label="GitHub Profile" badge={autoFilled.includes("githubUrl")}>
                  <div className="relative">
                    <Github size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input name="githubUrl" value={form.githubUrl} onChange={handleChange} placeholder="https://github.com/yourusername" className={`${INPUT_BASE} pl-10`} />
                  </div>
                </Field>

                <Field label="Portfolio / LinkedIn / Any Link" badge={autoFilled.includes("portfolioUrl")}>
                  <div className="relative">
                    <ExternalLink size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input name="portfolioUrl" value={form.portfolioUrl} onChange={handleChange} placeholder="https://portfolio.com or linkedin.com/in/..." className={`${INPUT_BASE} pl-10`} />
                  </div>
                </Field>
              </div>

              {/* Cover Letter */}
              <Field label="Cover Letter" hint="Brief note to stand out — 2-3 sentences about why you're a great fit">
                <textarea
                  name="coverLetter"
                  value={form.coverLetter}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Tell us why you're the perfect fit for this role..."
                  className={`${INPUT_BASE} resize-none`}
                />
              </Field>

              {/* Error */}
              {errors.submit && (
                <div className="flex items-center gap-2.5 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                  <AlertCircle size={16} className="flex-shrink-0" /> {errors.submit}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !isReady()}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  isReady()
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.01] active:scale-[0.99]"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Submitting Application...</>
                ) : (
                  <>🚀 Submit Application</>
                )}
              </button>
              {!isReady() && (
                <p className="text-center text-xs text-slate-400">Fill in required fields and upload your resume to apply</p>
              )}
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ApplyModal;