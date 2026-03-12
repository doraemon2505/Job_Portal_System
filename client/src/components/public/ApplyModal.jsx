import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  X, User, Mail, Phone, FileText, Link as LinkIcon,
  CheckCircle2, Loader2, AlertCircle, Briefcase,
  Github, ExternalLink, Info, Sparkles, AlertTriangle
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

const MAX_PDF = 5 * 1024 * 1024; // kept for reference, no longer used

// Validate Google Drive link
const isValidDriveUrl = (url) => {
  if (!url || !url.trim()) return false;
  return url.includes("drive.google.com") || url.includes("docs.google.com");
};

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
  const [loading,    setLoading]    = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [autoFilled, setAutoFilled] = useState([]);
  const [driveToast, setDriveToast] = useState(false); // invalid link warning

  const EMPTY = {
    name: "", email: "", phone: "",
    resumeUrl: "",
    coverLetter: "", portfolioUrl: "", githubUrl: "",
  };

  const [form,   setForm]   = useState(EMPTY);
  const [errors, setErrors] = useState({});

  // Auto-fill from logged-in user
  useEffect(() => {
    if (!open) { setSuccess(false); setDriveToast(false); return; }
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

  // Validate Google Drive link on blur
  const handleResumeBlur = () => {
    if (form.resumeUrl.trim() && !isValidDriveUrl(form.resumeUrl)) {
      setDriveToast(true);
      setTimeout(() => setDriveToast(false), 4000);
      setErrors(e => ({ ...e, resumeUrl: "Please upload a Google Drive share link (drive.google.com)" }));
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.resumeUrl.trim()) {
      e.resumeUrl = "Resume Google Drive link is required";
    } else if (!isValidDriveUrl(form.resumeUrl)) {
      e.resumeUrl = "Please upload a Google Drive share link";
    }
    return e;
  };

  const isReady = () => Object.keys(validate()).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    try {
      setLoading(true);
      await api.post("/application", {
        jobId,
        name:         form.name,
        email:        form.email,
        phone:        form.phone,
        resumeUrl:    form.resumeUrl,
        coverLetter:  form.coverLetter,
        portfolioUrl: form.portfolioUrl,
        githubUrl:    form.githubUrl,
      });
      setSuccess(true);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Submission failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => { setForm(EMPTY); setErrors({}); setSuccess(false); setAutoFilled([]); setDriveToast(false); }, 300);
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
        {/* Drive link toast warning */}
        {driveToast && (
          <div className="mx-4 mt-3 flex items-start gap-2.5 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 rounded-xl flex-shrink-0 animate-slide-up">
            <AlertTriangle size={16} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-800 dark:text-amber-300">Invalid Resume Link</p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                Please paste a <strong>Google Drive share link</strong> (drive.google.com). 
                Upload your PDF to Google Drive → Share → Copy Link.
              </p>
            </div>
            <button onClick={() => setDriveToast(false)} className="text-amber-400 hover:text-amber-600 flex-shrink-0 ml-auto"><X size={13} /></button>
          </div>
        )}
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

              {/* Resume — Google Drive Link */}
              <Field
                label="Resume"
                required
                error={errors.resumeUrl}
                hint='Upload your CV to Google Drive → Share → "Anyone with link" → paste link here'
              >
                <div className="relative">
                  {/* Google Drive icon */}
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg viewBox="0 0 24 24" className="w-4 h-4"><path d="M6.6 0L0 11l3.3 5.7L9.9 5.7z" fill="#0F9D58"/><path d="M17.4 0H6.6l6.6 11h10.8z" fill="#4285F4"/><path d="M16.5 16.7L13.2 11H2.4L0 16.7z" fill="#FBBC05"/><path d="M20.1 11h-6.9l3.3 5.7 3.6-5.7z" fill="#EA4335"/></svg>
                  </div>
                  <input
                    name="resumeUrl"
                    value={form.resumeUrl}
                    onChange={handleChange}
                    onBlur={handleResumeBlur}
                    placeholder="https://drive.google.com/file/d/..."
                    className={`${INPUT_BASE} pl-10 ${errors.resumeUrl ? "border-red-400 focus:ring-red-400/20" : isValidDriveUrl(form.resumeUrl) ? "border-emerald-400 focus:ring-emerald-400/20 bg-emerald-50 dark:bg-emerald-900/10" : ""}`}
                  />
                  {isValidDriveUrl(form.resumeUrl) && (
                    <CheckCircle2 size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-500" />
                  )}
                </div>
                {isValidDriveUrl(form.resumeUrl) && (
                  <a
                    href={form.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 flex items-center gap-2 text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline"
                  >
                    <ExternalLink size={11} /> Preview your Google Drive link
                  </a>
                )}
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