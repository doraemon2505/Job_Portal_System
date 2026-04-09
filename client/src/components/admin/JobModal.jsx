// components/admin/JobModal.jsx
// CHANGES: Added startDate + lastDateToApply fields in the basic tab only.
// Nothing else changed.
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import {
  X, Briefcase, MapPin, DollarSign, Clock, Building2,
  Globe, Image as ImageIcon, Eye, EyeOff,
  CheckCircle2, ChevronDown, Loader2, AlertCircle,
  Link as LinkIcon, Info, Calendar
} from "lucide-react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap');
  * { font-family: 'Figtree', sans-serif; }
  .font-display { font-family: 'Syne', sans-serif !important; }
  @keyframes slideUp  { from { opacity:0; transform:translateY(24px) scale(0.98); } to { opacity:1; transform:translateY(0) scale(1); } }
  @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
  .modal-enter { animation: slideUp 0.3s cubic-bezier(0.4,0,0.2,1) forwards; }
  .overlay-enter { animation: fadeIn 0.2s ease forwards; }
  .field-group { transition: all 0.2s ease; }
  .field-group:focus-within label { color: #7c3aed; }
`;

const INPUT_BASE = "w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400";
const LABEL_BASE = "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5";

const Field = ({ label, required, error, children, hint }) => (
  <div className="field-group">
    <label className={LABEL_BASE}>
      {label} {required && <span className="text-red-400 normal-case">*</span>}
    </label>
    {children}
    {hint && !error && <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1"><Info size={11} />{hint}</p>}
    {error && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
  </div>
);

const ImageUrlInput = ({ label, value, onChange, placeholder, hint }) => (
  <div className="field-group">
    <label className={LABEL_BASE}>{label}</label>
    <div className="relative">
      <ImageIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
      <input type="url" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${INPUT_BASE} pl-10`} />
    </div>
    {hint && <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1"><Info size={11} />{hint}</p>}
    {value && (
      <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
        <img src={value} alt="preview" className="w-full object-cover max-h-40" onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
        <div className="hidden items-center justify-center gap-2 py-4 text-slate-400 text-xs"><ImageIcon size={16} /> Image not found or invalid URL</div>
      </div>
    )}
  </div>
);

const PreviewCard = ({ form }) => {
  const skills = form.requirements ? form.requirements.split(",").map(s => s.trim()).filter(Boolean) : [];
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xl max-w-lg mx-auto">
      {form.thumbnail && <img src={form.thumbnail} alt="banner" className="w-full h-40 object-cover" />}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {form.companyLogo
            ? <img src={form.companyLogo} alt="logo" className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0" />
            : <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xl font-black flex-shrink-0">{form.companyName?.charAt(0) || "?"}</div>
          }
          <div>
            <h2 className="font-display font-black text-xl text-slate-900 dark:text-white">{form.title || "Job Title"}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">{form.companyName || "Company Name"}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {form.location && <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"><MapPin size={11} />{form.location}</span>}
          {form.jobType && <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"><Briefcase size={11} />{form.jobType}</span>}
          {form.experienceRequired && <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"><Clock size={11} />{form.experienceRequired} yrs exp</span>}
        </div>
        {/* Preview: date badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {form.startDate && <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400"><Calendar size={11} /> From {new Date(form.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
          {form.lastDateToApply && <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"><Clock size={11} /> Apply by {new Date(form.lastDateToApply).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>}
        </div>
        {(form.salaryDisplay || form.salaryMin || form.salaryMax) && (
          <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-3">💰 {form.salaryDisplay || `${form.salaryMin}${form.salaryMax ? " – " + form.salaryMax : ""}`}</p>
        )}
        {form.description && <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">{form.description}</p>}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 5).map(s => <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border border-violet-100 dark:border-violet-800 font-medium">{s}</span>)}
          </div>
        )}
      </div>
    </div>
  );
};

const JobModal = ({ open, setOpen, editData, refreshJobs }) => {
  const isEdit = Boolean(editData);
  const [loading,   setLoading]   = useState(false);
  const [preview,   setPreview]   = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  // ── UPDATED EMPTY: added startDate + lastDateToApply ──────────────────────
  const EMPTY = {
    title: "", description: "", requirements: "", salaryDisplay: "",
    salaryMin: "", salaryMax: "", location: "", jobType: "full-time",
    experienceRequired: "", thumbnail: "", companyName: "",
    companyLogo: "", companyWebsite: "", companyLocation: "", isActive: true,
    startDate: "",           // ← NEW
    lastDateToApply: "",     // ← NEW
  };

  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (!open) { setPreview(false); setActiveTab("basic"); return; }
    if (editData) {
      setForm({
        title:              editData.title || "",
        description:        editData.description || "",
        requirements:       Array.isArray(editData.requirements) ? editData.requirements.join(", ") : editData.requirements || "",
        salaryDisplay:      typeof editData.salary === "string" ? editData.salary : "",
        salaryMin:          editData.salary?.min || "",
        salaryMax:          editData.salary?.max || "",
        location:           editData.location || "",
        jobType:            editData.jobType || "full-time",
        experienceRequired: editData.experience || editData.experienceRequired || "",
        thumbnail:          editData.thumbnail || "",
        companyName:        typeof editData.company === "string" ? editData.company : editData.company?.name || "",
        companyLogo:        editData.company?.logo || "",
        companyWebsite:     editData.company?.website || "",
        companyLocation:    editData.company?.location || "",
        isActive:           editData.isActive ?? true,
        // ── NEW: pre-fill dates when editing ──────────────────────────────
        startDate:          editData.startDate        ? editData.startDate.slice(0, 10)       : "",
        lastDateToApply:    editData.lastDateToApply  ? editData.lastDateToApply.slice(0, 10) : "",
      });
    } else {
      setForm(EMPTY);
    }
    setErrors({}); setTouched({});
  }, [open, editData]);

  const set = (name, value) => {
    setForm(f => ({ ...f, [name]: value }));
    setTouched(t => ({ ...t, [name]: true }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    set(name, type === "checkbox" ? checked : value);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title       = "Job title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.location.trim())    e.location    = "Location is required";
    if (!form.companyName.trim()) e.companyName = "Company name is required";
    // ── NEW: date validation ─────────────────────────────────────────────────
    if (form.startDate && form.lastDateToApply && new Date(form.lastDateToApply) <= new Date(form.startDate)) {
      e.lastDateToApply = "Last date must be after the start date";
    }
    return e;
  };

  const isFormFilled = () => Object.keys(validate()).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      setTouched({ title: true, description: true, location: true, companyName: true, lastDateToApply: true });
      return;
    }
    try {
      setLoading(true);
      const payload = {
        title:              form.title,
        description:        form.description,
        location:           form.location,
        jobType:            form.jobType,
        isActive:           form.isActive,
        requirements:       form.requirements ? form.requirements.split(",").map(s => s.trim()).filter(Boolean) : [],
        salary:             form.salaryDisplay || (form.salaryMin && form.salaryMax ? `${form.salaryMin} - ${form.salaryMax} LPA` : form.salaryMin || ""),
        experience:         form.experienceRequired,
        experienceRequired: form.experienceRequired,
        thumbnail:          form.thumbnail,
        company: {
          name:     form.companyName,
          logo:     form.companyLogo,
          website:  form.companyWebsite,
          location: form.companyLocation,
        },
        skills:             form.requirements ? form.requirements.split(",").map(s => s.trim()).filter(Boolean) : [],
        // ── NEW: include dates in payload ────────────────────────────────────
        startDate:          form.startDate       || null,
        lastDateToApply:    form.lastDateToApply || null,
      };
      if (isEdit) await api.put(`/job/${editData._id}`, payload);
      else        await api.post("/job", payload);
      setOpen(false);
      refreshJobs();
    } catch (err) {
      console.error(err);
      setErrors({ submit: err.response?.data?.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const TABS = [
    { id: "basic",   label: "Job Details", icon: Briefcase  },
    { id: "company", label: "Company",     icon: Building2  },
    { id: "media",   label: "Media",       icon: ImageIcon  },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overlay-enter" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}>
      <style>{STYLES}</style>

      <div className={`bg-white dark:bg-slate-900 w-full rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col modal-enter overflow-hidden ${preview ? "max-w-5xl" : "max-w-2xl"}`} style={{ maxHeight: "92vh" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div>
            <h2 className="font-display font-black text-xl text-slate-900 dark:text-white">{isEdit ? "Edit Job Posting" : "Post a New Job"}</h2>
            <p className="text-slate-400 text-xs mt-0.5">{isEdit ? "Update the job details below" : "Fill out the form to create your job posting"}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPreview(p => !p)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${preview ? "bg-violet-600 text-white border-violet-600" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:text-violet-600"}`}>
              {preview ? <EyeOff size={15} /> : <Eye size={15} />}
              {preview ? "Close Preview" : "Preview"}
            </button>
            <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 flex-shrink-0">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} type="button" onClick={() => setActiveTab(id)} className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all -mb-px ${activeTab === id ? "border-violet-600 text-violet-600 dark:text-violet-400" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`}>
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">

              {/* ── BASIC TAB ── */}
              {activeTab === "basic" && (
                <>
                  <Field label="Job Title" required error={touched.title && errors.title}>
                    <div className="relative">
                      <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Senior Frontend Developer" className={`${INPUT_BASE} pl-10 ${touched.title && errors.title ? "border-red-400 focus:ring-red-400/20" : ""}`} />
                    </div>
                  </Field>

                  <Field label="Location" required error={touched.location && errors.location}>
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Bangalore, India / Remote" className={`${INPUT_BASE} pl-10 ${touched.location && errors.location ? "border-red-400 focus:ring-red-400/20" : ""}`} />
                    </div>
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Job Type" required>
                      <div className="relative">
                        <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                        <select name="jobType" value={form.jobType} onChange={handleChange} className={`${INPUT_BASE} pl-10 appearance-none cursor-pointer font-semibold ${
                          form.jobType === "full-time"  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800" :
                          form.jobType === "part-time"  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800" :
                          form.jobType === "remote"     ? "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800" :
                          form.jobType === "internship" ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800" :
                          form.jobType === "contract"   ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800" : ""}`}>
                          <option value="full-time">Full Time</option>
                          <option value="part-time">Part Time</option>
                          <option value="remote">Remote</option>
                          <option value="internship">Internship</option>
                          <option value="contract">Contract</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                      </div>
                    </Field>

                    <Field label="Experience" hint="e.g. 2-5 years">
                      <div className="relative">
                        <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input name="experienceRequired" value={form.experienceRequired} onChange={handleChange} placeholder="e.g. 2-5 years" className={`${INPUT_BASE} pl-10`} />
                      </div>
                    </Field>
                  </div>

                  {/* Salary */}
                  <Field label="Salary" hint="Write any format: 5-7 LPA, ₹4,00,000 - ₹8,00,000, Competitive, etc.">
                    <div className="space-y-2">
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input name="salaryDisplay" value={form.salaryDisplay} onChange={handleChange} placeholder="e.g. 5-7 LPA  or  Competitive" className={`${INPUT_BASE} pl-10`} />
                      </div>
                      <p className="text-xs text-slate-400 text-center">— or split into min/max —</p>
                      <div className="grid grid-cols-2 gap-3">
                        <input name="salaryMin" value={form.salaryMin} onChange={handleChange} placeholder="Min (e.g. 5 LPA)" className={INPUT_BASE} />
                        <input name="salaryMax" value={form.salaryMax} onChange={handleChange} placeholder="Max (e.g. 10 LPA)" className={INPUT_BASE} />
                      </div>
                    </div>
                  </Field>

                  {/* ── NEW: Apply Date + Last Date to Apply ───────────────── */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30 space-y-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar size={15} className="text-blue-600 dark:text-blue-400" />
                      <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">Application Window</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Start Date to Apply" hint="When applications open">
                        <div className="relative">
                          <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <input
                            type="date"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            className={`${INPUT_BASE} pl-10`}
                          />
                        </div>
                      </Field>
                      <Field label="Last Date to Apply" hint="Application deadline" error={touched.lastDateToApply && errors.lastDateToApply}>
                        <div className="relative">
                          <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <input
                            type="date"
                            name="lastDateToApply"
                            value={form.lastDateToApply}
                            onChange={handleChange}
                            min={form.startDate || undefined}
                            className={`${INPUT_BASE} pl-10 ${touched.lastDateToApply && errors.lastDateToApply ? "border-red-400 focus:ring-red-400/20" : ""}`}
                          />
                        </div>
                      </Field>
                    </div>
                    <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1"><Info size={11} /> Leave empty to keep applications open indefinitely.</p>
                  </div>
                  {/* ─────────────────────────────────────────────────────────── */}

                  <Field label="Job Description" required error={touched.description && errors.description}>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={5} placeholder="Describe the role, responsibilities..." className={`${INPUT_BASE} resize-none ${touched.description && errors.description ? "border-red-400 focus:ring-red-400/20" : ""}`} />
                  </Field>

                  <Field label="Skills / Requirements" hint="Comma-separated: React, Node.js, AWS, Docker">
                    <input name="requirements" value={form.requirements} onChange={handleChange} placeholder="React, Node.js, MongoDB, TypeScript..." className={INPUT_BASE} />
                  </Field>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="relative inline-flex">
                      <div onClick={() => set("isActive", !form.isActive)} className={`w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 ${form.isActive ? "bg-violet-600" : "bg-slate-300 dark:bg-slate-600"}`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 mt-0.5 ${form.isActive ? "translate-x-5" : "translate-x-0.5"}`} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-white">Active Listing</p>
                      <p className="text-xs text-slate-400">Job will be visible to applicants</p>
                    </div>
                    {form.isActive && <CheckCircle2 size={18} className="text-emerald-500 ml-auto" />}
                  </div>
                </>
              )}

              {/* ── COMPANY TAB ── */}
              {activeTab === "company" && (
                <>
                  <Field label="Company Name" required error={touched.companyName && errors.companyName}>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="e.g. Infosys, TCS, Startup Inc." className={`${INPUT_BASE} pl-10 ${touched.companyName && errors.companyName ? "border-red-400 focus:ring-red-400/20" : ""}`} />
                    </div>
                  </Field>
                  <Field label="Company Website">
                    <div className="relative">
                      <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input name="companyWebsite" value={form.companyWebsite} onChange={handleChange} placeholder="https://company.com" className={`${INPUT_BASE} pl-10`} />
                    </div>
                  </Field>
                  <Field label="Company Location">
                    <div className="relative">
                      <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input name="companyLocation" value={form.companyLocation} onChange={handleChange} placeholder="e.g. Bangalore, India" className={`${INPUT_BASE} pl-10`} />
                    </div>
                  </Field>
                  <ImageUrlInput label="Company Logo URL" value={form.companyLogo} onChange={(v) => set("companyLogo", v)} placeholder="https://cdn.example.com/company-logo.png" hint="Paste a direct image URL (Cloudinary, ImgBB, etc.)" />
                </>
              )}

              {/* ── MEDIA TAB ── */}
              {activeTab === "media" && (
                <ImageUrlInput label="Job Banner / Thumbnail URL" value={form.thumbnail} onChange={(v) => set("thumbnail", v)} placeholder="https://cdn.example.com/job-banner.jpg" hint="Best size: 1200×400px. Hosted on Cloudinary, ImgBB, etc." />
              )}

              {/* Submit error */}
              {errors.submit && (
                <div className="flex items-center gap-2.5 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                  <AlertCircle size={16} className="flex-shrink-0" /> {errors.submit}
                </div>
              )}

              {/* Submit button */}
              <button type="submit" disabled={loading || !isFormFilled()} className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${isFormFilled() ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.01] active:scale-[0.99]" : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"}`}>
                {loading ? <><Loader2 size={16} className="animate-spin" /> {isEdit ? "Updating..." : "Posting..."}</> : <>{isEdit ? "Update Job" : "🚀 Post Job"}</>}
              </button>
              {!isFormFilled() && <p className="text-center text-xs text-slate-400">Fill in all required fields (*) to enable posting</p>}
            </form>
          </div>

          {/* Preview */}
          {preview && (
            <div className="w-80 flex-shrink-0 border-l border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-y-auto p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Eye size={12} /> Live Preview</p>
              <PreviewCard form={form} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobModal;