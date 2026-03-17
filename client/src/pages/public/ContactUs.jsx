// pages/public/ContactUs.jsx
import { useState } from "react";
import api from "../../services/api";
import {
  Mail, Phone, MapPin, MessageSquare, User, ArrowRight,
  CheckCircle2, AlertCircle, Loader2, X, Sparkles, Clock, Send
} from "lucide-react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Figtree:wght@300;400;500;600;700&display=swap');
  * { font-family: 'Figtree', sans-serif; }
  .font-display { font-family: 'Syne', sans-serif !important; }

  @keyframes slideUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
  @keyframes modalPop { from{opacity:0;transform:scale(0.88) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes shake    { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-5px)} 40%,80%{transform:translateX(5px)} }
  @keyframes gradS    { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

  .au        { animation: slideUp  0.5s ease both; }
  .ai        { animation: fadeIn   0.2s ease both; }
  .modal-pop { animation: modalPop 0.35s cubic-bezier(0.34,1.2,0.64,1) both; }
  .shake     { animation: shake    0.4s ease; }

  .gradient-text {
    background: linear-gradient(135deg,#7c3aed,#4f46e5,#0ea5e9);
    background-size:200% auto; -webkit-background-clip:text;
    -webkit-text-fill-color:transparent; background-clip:text;
    animation: gradS 4s ease infinite;
  }

  .contact-input {
    width: 100%;
    background: transparent;
    border: 1.5px solid;
    border-radius: 14px;
    padding: 13px 16px 13px 44px;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;
    font-family: 'Figtree', sans-serif;
    box-sizing: border-box;
  }
  .contact-input::placeholder { color: #94a3b8; }
`;

const INPUT_LIGHT = "border-slate-200 bg-slate-50 text-slate-900 focus:border-violet-400 focus:bg-white focus:ring-2 focus:ring-violet-500/20";
const INPUT_ERROR = "border-red-300 bg-red-50 text-slate-900 focus:border-red-400 focus:ring-2 focus:ring-red-500/15";

const CONTACTS = [
  {
    icon: Mail,
    label: "Email us",
    value: "support@hiresetu.com",
    sub: "Typically replies within 1 business day",
    href: "mailto:support@hiresetu.com",
    color: "bg-violet-100 dark:bg-violet-900/30",
    ic: "text-violet-600 dark:text-violet-400",
  },
  {
    icon: Phone,
    label: "Call us",
    value: "+91 98765 43210",
    sub: "Mon–Fri, 9am – 6pm IST",
    href: "tel:+919876543210",
    color: "bg-emerald-100 dark:bg-emerald-900/30",
    ic: "text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: MapPin,
    label: "Visit us",
    value: "Mumbai, India",
    sub: "Headquarters",
    href: null,
    color: "bg-amber-100 dark:bg-amber-900/30",
    ic: "text-amber-600 dark:text-amber-400",
  },
];

/* ── Success Modal ─────────────────────────────────────────────────────────── */
const SuccessModal = ({ onClose }) => (
  <div
    className="fixed inset-0 z-[200] flex items-center justify-center p-4 ai"
    style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)" }}
    onClick={onClose}
  >
    <div
      className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-sm overflow-hidden modal-pop"
      onClick={e => e.stopPropagation()}
    >
      <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-500" />
      <div className="p-8 text-center">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={38} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="font-display font-black text-2xl text-slate-900 dark:text-white mb-2">Message Sent!</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
          Thanks for reaching out! Your message has been successfully submitted.
          We'll get back to you within 1 business day.
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold text-sm hover:-translate-y-0.5 active:translate-y-0 transition-all shadow-lg shadow-violet-500/25"
        >
          Got it, thanks!
        </button>
      </div>
    </div>
  </div>
);

/* ── Main ──────────────────────────────────────────────────────────────────── */
const ContactUs = () => {
  const [form,    setForm]    = useState({ name: "", email: "", phone: "", message: "" });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [shake,   setShake]   = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Please enter your name";
    if (!form.email.trim())   e.email   = "Please enter your email";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email address";
    if (!form.message.trim()) e.message = "Please write your message";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      setShake(true);
      setTimeout(() => setShake(false), 450);
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("contact/add", form);
      if (res.data.status) {
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", message: "" });
        setErrors({});
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setErrors({ submit: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-16 px-4 sm:px-6 transition-colors duration-300">
      <style>{CSS}</style>
      {success && <SuccessModal onClose={() => setSuccess(false)} />}

      <div className="max-w-6xl mx-auto">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="text-center mb-14 au" style={{ opacity: 0 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-300 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles size={11} /> Get in touch
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-tight mb-4">
            Let's Start a <span className="gradient-text">Conversation</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Have a question, opportunity, or just want to say hello?
            We'd love to hear from you.
          </p>
        </div>

        {/* ── Contact Info Cards ──────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {CONTACTS.map(({ icon: Icon, label, value, sub, href, color, ic }, i) => (
            <div
              key={label}
              className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex items-start gap-4 au ${href ? "hover:border-violet-300 dark:hover:border-violet-700 transition-all cursor-pointer" : ""}`}
              style={{ animationDelay: `${i * 0.08}s`, opacity: 0 }}
              onClick={() => href && window.open(href)}
            >
              <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={20} className={ic} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">{value}</p>
                <p className="text-slate-400 text-xs mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Form Card ──────────────────────────────────────── */}
        <div
          className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-slate-950/50 au"
          style={{ animationDelay: "0.2s", opacity: 0 }}
        >
          {/* Top accent */}
          <div className="h-1.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-blue-500" />

          <div className="grid md:grid-cols-5">

            {/* Left: info panel */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 via-violet-950 to-indigo-950 p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-violet-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                <p className="text-violet-400 text-xs font-bold uppercase tracking-widest mb-4">Contact Information</p>
                <h2 className="font-display text-2xl lg:text-3xl font-black text-white leading-tight mb-4">
                  We're here to help.
                </h2>
                <p className="text-white/55 text-sm leading-relaxed mb-10">
                  Fill out the form and our team will get back to you within one business day.
                </p>

                <div className="space-y-5">
                  {CONTACTS.map(({ icon: Icon, label, value, ic }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white/8 border border-white/10 flex items-center justify-center flex-shrink-0">
                        <Icon size={15} className="text-violet-300" />
                      </div>
                      <div>
                        <p className="text-white/40 text-[10px] uppercase tracking-wider">{label}</p>
                        <p className="text-white/85 text-sm font-medium">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response time badge */}
              <div className="relative z-10 mt-10 flex items-center gap-2.5 bg-white/8 border border-white/10 rounded-xl px-4 py-3">
                <Clock size={14} className="text-emerald-400 flex-shrink-0" />
                <p className="text-white/60 text-xs">Average response time: <span className="text-white font-semibold">Under 24 hours</span></p>
              </div>
            </div>

            {/* Right: form */}
            <div className="md:col-span-3 p-8 lg:p-10">
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white mb-1">Send a Message</h3>
              <p className="text-slate-400 text-sm mb-7">All fields marked <span className="text-red-400">*</span> are required.</p>

              {errors.submit && (
                <div className="flex items-center gap-2.5 p-3.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm mb-5">
                  <AlertCircle size={15} className="flex-shrink-0" /> {errors.submit}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className={shake ? "shake" : ""}>
                <div className="space-y-4">

                  {/* Name + Phone row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Full Name <span className="text-red-400 normal-case">*</span>
                      </label>
                      <div className="relative">
                        <User size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${errors.name ? "text-red-400" : "text-slate-400"}`} />
                        <input
                          type="text" name="name" value={form.name} onChange={handleChange}
                          placeholder="Your full name"
                          className={`contact-input ${errors.name ? INPUT_ERROR : INPUT_LIGHT}`}
                        />
                      </div>
                      {errors.name && <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5"><AlertCircle size={10} />{errors.name}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Phone</label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="text" name="phone" value={form.phone} onChange={handleChange}
                          placeholder="+91 98765 43210 (optional)"
                          className={`contact-input ${INPUT_LIGHT}`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-red-400 normal-case">*</span>
                    </label>
                    <div className="relative">
                      <Mail size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none ${errors.email ? "text-red-400" : "text-slate-400"}`} />
                      <input
                        type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="you@example.com"
                        className={`contact-input ${errors.email ? INPUT_ERROR : INPUT_LIGHT}`}
                      />
                    </div>
                    {errors.email && <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5"><AlertCircle size={10} />{errors.email}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                      Message <span className="text-red-400 normal-case">*</span>
                    </label>
                    <div className="relative">
                      <MessageSquare size={15} className={`absolute left-3.5 top-4 pointer-events-none ${errors.message ? "text-red-400" : "text-slate-400"}`} />
                      <textarea
                        name="message" value={form.message} onChange={handleChange}
                        rows={5} placeholder="Tell us how we can help..."
                        className={`contact-input resize-none ${errors.message ? INPUT_ERROR : INPUT_LIGHT}`}
                        style={{ paddingTop: "14px" }}
                      />
                    </div>
                    {errors.message && <p className="flex items-center gap-1 text-xs text-red-500 mt-1.5"><AlertCircle size={10} />{errors.message}</p>}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading
                      ? <><Loader2 size={16} className="animate-spin" /> Sending…</>
                      : <><Send size={15} /> Send Message</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;