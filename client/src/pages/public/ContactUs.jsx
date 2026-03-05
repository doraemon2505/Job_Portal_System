import { useState } from "react";
import api from "../../services/api";
import { Mail, Phone, User, MessageSquare, MapPin, ArrowRight } from "lucide-react";

// ─────────────────────────────────────────────
//  🖼️  BACKGROUND IMAGE — change this path to
//      swap the hero background at any time
// ─────────────────────────────────────────────
import contactBg from "../../assets/jobbackground.jpeg";
// If you use a URL instead:
// const contactBg = "https://your-cdn.com/your-image.jpg";

const ContactUs = () => {
    const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("contact/add", form);
            if (res.data.status) {
                setSuccess("Message sent! We'll get back to you shortly.");
                setForm({ name: "", email: "", phone: "", message: "" });
            }
        } catch (error) {
            console.error(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

                .contact-root * { font-family: 'DM Sans', sans-serif; }

                .contact-root {
                    min-height: 100vh;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 80px 24px;
                    overflow: hidden;
                }

                /* ── Background image layer ── */
                .contact-bg {
                    position: absolute;
                    inset: 0;
                    background-image: url(${contactBg});
                    background-size: cover;
                    background-position: center;
                    background-repeat: no-repeat;
                    z-index: 0;
                }
                /* Dark overlay for readability */
                .contact-bg::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(135deg, rgba(5,10,30,0.78) 0%, rgba(8,20,50,0.65) 60%, rgba(5,10,30,0.82) 100%);
                }

                /* ── Card ── */
                .contact-card {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 960px;
                    display: grid;
                    grid-template-columns: 1fr 1.3fr;
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07);
                    animation: cardReveal 0.7s cubic-bezier(0.16,1,0.3,1) both;
                }

                @keyframes cardReveal {
                    from { opacity: 0; transform: translateY(32px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }

                /* ── Left info panel ── */
                .info-panel {
                    background: linear-gradient(160deg, #0f2a5e 0%, #1a1060 60%, #0d1b4b 100%);
                    padding: 56px 40px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    position: relative;
                    overflow: hidden;
                }
                .info-panel::before {
                    content: '';
                    position: absolute;
                    top: -60px; right: -60px;
                    width: 220px; height: 220px;
                    border-radius: 50%;
                    background: rgba(99,102,241,0.15);
                    filter: blur(40px);
                }
                .info-panel::after {
                    content: '';
                    position: absolute;
                    bottom: -40px; left: -40px;
                    width: 180px; height: 180px;
                    border-radius: 50%;
                    background: rgba(59,130,246,0.12);
                    filter: blur(50px);
                }

                .info-eyebrow {
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 3px;
                    text-transform: uppercase;
                    color: #818cf8;
                    margin-bottom: 16px;
                }
                .info-heading {
                    font-family: 'Playfair Display', serif;
                    font-size: 38px;
                    font-weight: 700;
                    color: #fff;
                    line-height: 1.15;
                    margin-bottom: 20px;
                }
                .info-sub {
                    font-size: 14.5px;
                    color: rgba(255,255,255,0.6);
                    line-height: 1.7;
                    margin-bottom: 48px;
                }

                .info-contacts { display: flex; flex-direction: column; gap: 20px; }
                .info-contact-item {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }
                .info-icon-wrap {
                    width: 40px; height: 40px;
                    border-radius: 12px;
                    background: rgba(255,255,255,0.08);
                    border: 1px solid rgba(255,255,255,0.1);
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0;
                    color: #a5b4fc;
                }
                .info-contact-text { display: flex; flex-direction: column; }
                .info-contact-label { font-size: 10px; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase; }
                .info-contact-value { font-size: 14px; color: rgba(255,255,255,0.85); margin-top: 2px; }

                /* ── Right form panel ── */
                .form-panel {
                    background: #fff;
                    padding: 56px 44px;
                }
                .form-heading {
                    font-size: 22px;
                    font-weight: 600;
                    color: #0f172a;
                    margin-bottom: 6px;
                }
                .form-subheading {
                    font-size: 13.5px;
                    color: #94a3b8;
                    margin-bottom: 32px;
                }

                .success-banner {
                    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
                    border: 1px solid #a7f3d0;
                    color: #065f46;
                    border-radius: 12px;
                    padding: 12px 16px;
                    font-size: 13.5px;
                    font-weight: 500;
                    margin-bottom: 24px;
                    display: flex; align-items: center; gap: 8px;
                }

                .form-grid { display: flex; flex-direction: column; gap: 18px; }

                .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }

                .field-wrap { position: relative; }
                .field-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8;
                    pointer-events: none;
                }
                .field-icon-top { top: 16px; transform: none; }

                .field-input, .field-textarea {
                    width: 100%;
                    border: 1.5px solid #e2e8f0;
                    border-radius: 12px;
                    padding: 13px 16px 13px 42px;
                    font-size: 14px;
                    color: #0f172a;
                    background: #f8fafc;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                    box-sizing: border-box;
                    font-family: 'DM Sans', sans-serif;
                }
                .field-input::placeholder, .field-textarea::placeholder { color: #cbd5e1; }
                .field-input:focus, .field-textarea:focus {
                    border-color: #6366f1;
                    background: #fff;
                    box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
                }
                .field-textarea { resize: none; padding-top: 14px; }

                .submit-btn {
                    width: 100%;
                    background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    padding: 15px 24px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
                    font-family: 'DM Sans', sans-serif;
                    box-shadow: 0 4px 15px rgba(99,102,241,0.35);
                    margin-top: 4px;
                }
                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(99,102,241,0.45);
                }
                .submit-btn:active:not(:disabled) { transform: translateY(0); }
                .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

                /* ── Responsive ── */
                @media (max-width: 768px) {
                    .contact-card { grid-template-columns: 1fr; }
                    .info-panel { padding: 40px 28px; }
                    .info-heading { font-size: 28px; }
                    .info-sub { margin-bottom: 28px; }
                    .form-panel { padding: 36px 28px; }
                    .field-row { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="contact-root">
                {/* Swappable background image */}
                <div className="contact-bg" />

                <div className="contact-card">
                    {/* ── LEFT PANEL ── */}
                    <div className="info-panel">
                        <div>
                            <p className="info-eyebrow">Contact Us</p>
                            <h2 className="info-heading">Let's Start a Conversation</h2>
                            <p className="info-sub">
                                Have a question, opportunity, or just want to say hello?
                                Our team typically responds within a business day.
                            </p>
                        </div>

                        <div className="info-contacts">
                            <div className="info-contact-item">
                                <div className="info-icon-wrap">
                                    <Mail size={16} />
                                </div>
                                <div className="info-contact-text">
                                    <span className="info-contact-label">Email</span>
                                    <span className="info-contact-value">support@jobportal.com</span>
                                </div>
                            </div>
                            <div className="info-contact-item">
                                <div className="info-icon-wrap">
                                    <Phone size={16} />
                                </div>
                                <div className="info-contact-text">
                                    <span className="info-contact-label">Phone</span>
                                    <span className="info-contact-value">+91 98765 43210</span>
                                </div>
                            </div>
                            <div className="info-contact-item">
                                <div className="info-icon-wrap">
                                    <MapPin size={16} />
                                </div>
                                <div className="info-contact-text">
                                    <span className="info-contact-label">Location</span>
                                    <span className="info-contact-value">Mumbai, India</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT PANEL ── */}
                    <div className="form-panel">
                        <h3 className="form-heading">Send a Message</h3>
                        <p className="form-subheading">Fill out the form and we'll be in touch.</p>

                        {success && (
                            <div className="success-banner">
                                ✓ {success}
                            </div>
                        )}

                        <div className="form-grid">
                            <div className="field-row">
                                <div className="field-wrap">
                                    <User className="field-icon" size={16} />
                                    <input type="text" name="name" placeholder="Your Name"
                                        value={form.name} onChange={handleChange} required
                                        className="field-input" />
                                </div>
                                <div className="field-wrap">
                                    <Phone className="field-icon" size={16} />
                                    <input type="text" name="phone" placeholder="Phone Number"
                                        value={form.phone} onChange={handleChange}
                                        className="field-input" />
                                </div>
                            </div>

                            <div className="field-wrap">
                                <Mail className="field-icon" size={16} />
                                <input type="email" name="email" placeholder="Email Address"
                                    value={form.email} onChange={handleChange} required
                                    className="field-input" />
                            </div>

                            <div className="field-wrap">
                                <MessageSquare className="field-icon field-icon-top" size={16} />
                                <textarea name="message" placeholder="Your message..." rows="5"
                                    value={form.message} onChange={handleChange} required
                                    className="field-textarea" />
                            </div>

                            <button onClick={handleSubmit} disabled={loading} className="submit-btn">
                                {loading ? "Sending…" : <>Send Message <ArrowRight size={16} /></>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ContactUs;