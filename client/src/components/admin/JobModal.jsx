// import React, { useEffect, useState } from "react";
// import api from "../../services/api";

// const JobModal = ({ open, setOpen, editData, refreshJobs }) => {
//     const isEdit = Boolean(editData);
//     const [loading, setLoading] = useState(false);

//     const [formData, setFormData] = useState({
//         title: "",
//         description: "",
//         requirements: "",
//         salaryMin: "",
//         salaryMax: "",
//         location: "",
//         jobType: "full-time",
//         experienceRequired: "",
//         thumbnail: "", // now URL
//         companyName: "",
//         companyLogo: "",
//         companyWebsite: "",
//         companyLocation: "",
//         isActive: true,
//     });

//     // Prefill
//     useEffect(() => {
//         if (editData) {
//             setFormData({
//                 title: editData.title || "",
//                 description: editData.description || "",
//                 requirements: editData.requirements?.join(",") || "",
//                 salaryMin: editData.salary?.min || "",
//                 salaryMax: editData.salary?.max || "",
//                 location: editData.location || "",
//                 jobType: editData.jobType || "full-time",
//                 experienceRequired: editData.experienceRequired || "",
//                 thumbnail: editData.thumbnail || "",
//                 companyName: editData.company?.name || "",
//                 companyLogo: editData.company?.logo || "",
//                 companyWebsite: editData.company?.website || "",
//                 companyLocation: editData.company?.location || "",
//                 isActive: editData.isActive ?? true,
//             });
//         }
//     }, [editData]);

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData({
//             ...formData,
//             [name]: type === "checkbox" ? checked : value,
//         });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             setLoading(true);

//             if (isEdit) {
//                 await api.put(`/job/${editData._id}`, formData);
//                 alert("Job Updated ✅");
//             } else {
//                 await api.post("/job", formData);
//                 alert("Job Created ✅");
//             }

//             setOpen(false);
//             refreshJobs();
//         } catch (err) {
//             console.error(err);
//             alert("Something went wrong ❌");
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (!open) return null;

//     return (
//         <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
//             <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-8 overflow-y-auto max-h-[90vh]">

//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold">
//                         {isEdit ? "Edit Job" : "Create Job"}
//                     </h2>
//                     <button onClick={() => setOpen(false)}>✕</button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">

//                     <input name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" required className="w-full border p-3 rounded-lg" />

//                     <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="w-full border p-3 rounded-lg" />

//                     <input name="requirements" value={formData.requirements} onChange={handleChange} placeholder="Requirements (comma separated)" className="w-full border p-3 rounded-lg" />

//                     <div className="grid grid-cols-2 gap-4">
//                         <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} placeholder="Min Salary" className="border p-3 rounded-lg" />
//                         <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} placeholder="Max Salary" className="border p-3 rounded-lg" />
//                     </div>

//                     <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required className="w-full border p-3 rounded-lg" />

//                     <select name="jobType" value={formData.jobType} onChange={handleChange} className="w-full border p-3 rounded-lg">
//                         <option value="full-time">Full Time</option>
//                         <option value="part-time">Part Time</option>
//                         <option value="remote">Remote</option>
//                         <option value="internship">Internship</option>
//                         <option value="contract">Contract</option>
//                     </select>

//                     <input type="number" name="experienceRequired" value={formData.experienceRequired} onChange={handleChange} placeholder="Experience Required (Years)" className="w-full border p-3 rounded-lg" />

//                     {/* Thumbnail URL */}
//                     <div>
//                         <label className="block font-medium mb-2">Thumbnail URL</label>
//                         <input
//                             name="thumbnail"
//                             value={formData.thumbnail}
//                             onChange={handleChange}
//                             placeholder="Paste image URL here"
//                             className="w-full border p-3 rounded-lg"
//                         />

//                         {formData.thumbnail && (
//                             <div className="mt-4">
//                                 <img
//                                     src={formData.thumbnail}
//                                     alt="Preview"
//                                     className="w-40 h-40 object-cover rounded-xl border shadow"
//                                     onError={(e) => e.target.style.display = "none"}
//                                 />
//                             </div>
//                         )}
//                     </div>

//                     <h3 className="font-semibold mt-6 text-lg border-t pt-4">Company Info</h3>

//                     <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" required className="w-full border p-3 rounded-lg" />
//                     <input name="companyLogo" value={formData.companyLogo} onChange={handleChange} placeholder="Company Logo URL" className="w-full border p-3 rounded-lg" />
//                     <input name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} placeholder="Website" className="w-full border p-3 rounded-lg" />
//                     <input name="companyLocation" value={formData.companyLocation} onChange={handleChange} placeholder="Company Location" className="w-full border p-3 rounded-lg" />

//                     <div className="flex items-center gap-2">
//                         <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
//                         <label>Active</label>
//                     </div>

//                     <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold">
//                         {loading ? "Processing..." : isEdit ? "Update Job" : "Create Job"}
//                     </button>

//                 </form>
//             </div>
//         </div>
//     );
// };

// export default JobModal;


// components/admin/JobModal.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import api from "../../services/api";
import {
  X, Briefcase, MapPin, DollarSign, Clock, Building2,
  Globe, Image as ImageIcon, Eye, EyeOff, Upload,
  CheckCircle2, ChevronDown, Loader2, AlertCircle,
  FileText, Link as LinkIcon, Trash2, Info
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// Resize image via canvas
const resizeImage = (file, maxW, maxH) =>
  new Promise((resolve) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let { width: w, height: h } = img;
      if (w > maxW || h > maxH) {
        const ratio = Math.min(maxW / w, maxH / h);
        w = Math.round(w * ratio);
        h = Math.round(h * ratio);
      }
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      canvas.toBlob(blob => { URL.revokeObjectURL(url); resolve(blob); }, file.type, 0.85);
    };
    img.src = url;
  });

// Convert blob to base64
const toBase64 = (blob) =>
  new Promise((res) => {
    const r = new FileReader();
    r.onload = () => res(r.result);
    r.readAsDataURL(blob);
  });

// ── Field Component ────────────────────────────────────────────────────────────
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

// ── Image Uploader ─────────────────────────────────────────────────────────────
const ImageUploader = ({ label, value, onChange, maxW, maxH, hint }) => {
  const ref = useRef();
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const process = async (file) => {
    setError("");
    if (!ALLOWED_TYPES.includes(file.type)) { setError("Only JPG, PNG, WebP allowed"); return; }
    if (file.size > MAX_FILE_SIZE) { setError("Max file size is 5MB"); return; }
    setProcessing(true);
    try {
      const resized = await resizeImage(file, maxW, maxH);
      const b64 = await toBase64(resized);
      onChange(b64);
    } catch { setError("Failed to process image"); }
    finally { setProcessing(false); }
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) process(f);
  }, []);

  return (
    <div>
      <label className={LABEL_BASE}>{label}</label>
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border-2 border-violet-300 dark:border-violet-700">
          <img src={value} alt="preview" className="w-full object-cover" style={{ maxHeight: maxH === 300 ? "120px" : "160px" }} />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button type="button" onClick={() => ref.current.click()} className="px-3 py-1.5 bg-white text-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-100 transition-colors flex items-center gap-1.5">
              <Upload size={12} /> Replace
            </button>
            <button type="button" onClick={() => onChange("")} className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-colors flex items-center gap-1.5">
              <Trash2 size={12} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => ref.current.click()}
          className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all ${dragOver ? "border-violet-500 bg-violet-50 dark:bg-violet-900/10" : "border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}
        >
          {processing ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="text-violet-500 animate-spin" />
              <p className="text-sm text-slate-500 font-medium">Processing image...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                <ImageIcon size={20} className="text-slate-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Drop image here or <span className="text-violet-600 dark:text-violet-400">browse</span></p>
                <p className="text-xs text-slate-400 mt-0.5">{hint}</p>
              </div>
            </div>
          )}
        </div>
      )}
      <input ref={ref} type="file" accept={ALLOWED_TYPES.join(",")} className="hidden" onChange={(e) => e.target.files[0] && process(e.target.files[0])} />
      {error && <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1"><AlertCircle size={11} />{error}</p>}
    </div>
  );
};

// ── Preview Card ───────────────────────────────────────────────────────────────
const PreviewCard = ({ form }) => {
  const skills = form.requirements ? form.requirements.split(",").map(s => s.trim()).filter(Boolean) : [];
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xl max-w-lg mx-auto">
      {form.thumbnail && (
        <img src={form.thumbnail} alt="banner" className="w-full h-40 object-cover" />
      )}
      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          {form.companyLogo ? (
            <img src={form.companyLogo} alt="logo" className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xl font-black flex-shrink-0">
              {form.companyName?.charAt(0) || "?"}
            </div>
          )}
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
        {(form.salaryDisplay || form.salaryMin || form.salaryMax) && (
          <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-3">
            💰 {form.salaryDisplay || `${form.salaryMin}${form.salaryMax ? " – " + form.salaryMax : ""}`}
          </p>
        )}
        {form.description && <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">{form.description}</p>}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {skills.slice(0, 5).map(s => (
              <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 border border-violet-100 dark:border-violet-800 font-medium">{s}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Main Modal ─────────────────────────────────────────────────────────────────
const JobModal = ({ open, setOpen, editData, refreshJobs }) => {
  const isEdit = Boolean(editData);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const EMPTY = {
    title: "", description: "", requirements: "", salaryDisplay: "",
    salaryMin: "", salaryMax: "", location: "", jobType: "full-time",
    experienceRequired: "", thumbnail: "", companyName: "",
    companyLogo: "", companyWebsite: "", companyLocation: "", isActive: true,
  };

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (!open) { setPreview(false); setActiveTab("basic"); return; }
    if (editData) {
      setForm({
        title: editData.title || "",
        description: editData.description || "",
        requirements: Array.isArray(editData.requirements) ? editData.requirements.join(", ") : editData.requirements || "",
        salaryDisplay: typeof editData.salary === "string" ? editData.salary : "",
        salaryMin: editData.salary?.min || "",
        salaryMax: editData.salary?.max || "",
        location: editData.location || "",
        jobType: editData.jobType || "full-time",
        experienceRequired: editData.experience || editData.experienceRequired || "",
        thumbnail: editData.thumbnail || "",
        companyName: typeof editData.company === "string" ? editData.company : editData.company?.name || "",
        companyLogo: editData.company?.logo || "",
        companyWebsite: editData.company?.website || "",
        companyLocation: editData.company?.location || "",
        isActive: editData.isActive ?? true,
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

  // Validate required fields
  const validate = () => {
    const e = {};
    if (!form.title.trim())       e.title = "Job title is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.location.trim())    e.location = "Location is required";
    if (!form.companyName.trim()) e.companyName = "Company name is required";
    return e;
  };

  const isFormFilled = () => {
    const e = validate();
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); setTouched({ title: true, description: true, location: true, companyName: true }); return; }
    try {
      setLoading(true);
      const payload = {
        title: form.title, description: form.description, location: form.location,
        jobType: form.jobType, isActive: form.isActive,
        requirements: form.requirements ? form.requirements.split(",").map(s => s.trim()).filter(Boolean) : [],
        salary: form.salaryDisplay || (form.salaryMin && form.salaryMax ? `${form.salaryMin} - ${form.salaryMax} LPA` : form.salaryMin || ""),
        experience: form.experienceRequired,
        experienceRequired: form.experienceRequired,
        thumbnail: form.thumbnail,
        company: {
          name: form.companyName, logo: form.companyLogo,
          website: form.companyWebsite, location: form.companyLocation,
        },
        skills: form.requirements ? form.requirements.split(",").map(s => s.trim()).filter(Boolean) : [],
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
    { id: "basic",   label: "Job Details",   icon: Briefcase  },
    { id: "company", label: "Company",        icon: Building2  },
    { id: "media",   label: "Media",          icon: ImageIcon  },
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
            <button
              type="button"
              onClick={() => setPreview(p => !p)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${preview ? "bg-violet-600 text-white border-violet-600" : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400"}`}
            >
              {preview ? <EyeOff size={15} /> : <Eye size={15} />}
              {preview ? "Close Preview" : "Preview"}
            </button>
            <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">

          {/* Form Side */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-slate-100 dark:border-slate-800 px-6 flex-shrink-0">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2 px-4 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all -mb-px ${activeTab === id ? "border-violet-600 text-violet-600 dark:text-violet-400" : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"}`}
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </div>

            {/* Scrollable form body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">

              {/* ── TAB: BASIC ── */}
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
                        <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <select name="jobType" value={form.jobType} onChange={handleChange} className={`${INPUT_BASE} pl-10 appearance-none cursor-pointer`}>
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

                  {/* Salary — flexible */}
                  <Field label="Salary" hint="Write any format: 5-7 LPA, ₹4,00,000 - ₹8,00,000, Competitive, etc.">
                    <div className="space-y-2">
                      <div className="relative">
                        <DollarSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          name="salaryDisplay"
                          value={form.salaryDisplay}
                          onChange={handleChange}
                          placeholder="e.g. 5-7 LPA  or  ₹4,50,000 - ₹9,00,000  or  Competitive"
                          className={`${INPUT_BASE} pl-10`}
                        />
                      </div>
                      <p className="text-xs text-slate-400 text-center">— or split into min/max —</p>
                      <div className="grid grid-cols-2 gap-3">
                        <input name="salaryMin" value={form.salaryMin} onChange={handleChange} placeholder="Min (e.g. 5 LPA)" className={INPUT_BASE} />
                        <input name="salaryMax" value={form.salaryMax} onChange={handleChange} placeholder="Max (e.g. 10 LPA)" className={INPUT_BASE} />
                      </div>
                    </div>
                  </Field>

                  <Field label="Job Description" required error={touched.description && errors.description}>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Describe the role, responsibilities, and what makes this role exciting..."
                      className={`${INPUT_BASE} resize-none ${touched.description && errors.description ? "border-red-400 focus:ring-red-400/20" : ""}`}
                    />
                    <p className="text-xs text-slate-400 mt-1.5">Include key responsibilities, day-to-day tasks, and what makes this role exciting.</p>
                  </Field>

                  <Field label="Skills / Requirements" hint="Comma-separated: React, Node.js, AWS, Docker">
                    <input
                      name="requirements"
                      value={form.requirements}
                      onChange={handleChange}
                      placeholder="React, Node.js, MongoDB, TypeScript..."
                      className={INPUT_BASE}
                    />
                  </Field>

                  <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="relative inline-flex">
                      <input
                        type="checkbox"
                        name="isActive"
                        id="isActive"
                        checked={form.isActive}
                        onChange={handleChange}
                        className="sr-only peer"
                      />
                      <div
                        onClick={() => set("isActive", !form.isActive)}
                        className={`w-11 h-6 rounded-full cursor-pointer transition-colors duration-200 ${form.isActive ? "bg-violet-600" : "bg-slate-300 dark:bg-slate-600"}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 mt-0.5 ${form.isActive ? "translate-x-5" : "translate-x-0.5"}`} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="isActive" className="text-sm font-semibold text-slate-800 dark:text-white cursor-pointer">Active Listing</label>
                      <p className="text-xs text-slate-400">Job will be visible to applicants</p>
                    </div>
                    {form.isActive && <CheckCircle2 size={18} className="text-emerald-500 ml-auto" />}
                  </div>
                </>
              )}

              {/* ── TAB: COMPANY ── */}
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

                  <ImageUploader
                    label="Company Logo"
                    value={form.companyLogo}
                    onChange={(v) => set("companyLogo", v)}
                    maxW={300} maxH={300}
                    hint="JPG, PNG, WebP · Max 5MB · Auto-resized to 300×300px"
                  />
                </>
              )}

              {/* ── TAB: MEDIA ── */}
              {activeTab === "media" && (
                <ImageUploader
                  label="Job Banner / Thumbnail"
                  value={form.thumbnail}
                  onChange={(v) => set("thumbnail", v)}
                  maxW={1200} maxH={400}
                  hint="JPG, PNG, WebP · Max 5MB · Auto-resized to 1200×400px for best display"
                />
              )}

              {/* Error */}
              {errors.submit && (
                <div className="flex items-center gap-2.5 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                  <AlertCircle size={16} className="flex-shrink-0" /> {errors.submit}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !isFormFilled()}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${
                  isFormFilled()
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.01] active:scale-[0.99]"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> {isEdit ? "Updating..." : "Posting..."}</>
                ) : (
                  <>{isEdit ? "Update Job" : "🚀 Post Job"}</>
                )}
              </button>
              {!isFormFilled() && (
                <p className="text-center text-xs text-slate-400">Fill in all required fields (*) to enable posting</p>
              )}
            </form>
          </div>

          {/* Preview Side */}
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