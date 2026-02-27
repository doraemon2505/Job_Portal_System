import { useState } from "react";
import api from "../../services/api";
import { Mail, Phone, User, MessageSquare } from "lucide-react";

const ContactUs = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await api.post("contact/add", form);

            if (res.data.status) {
                setSuccess("✅ Message sent successfully!");
                setForm({
                    name: "",
                    email: "",
                    phone: "",
                    message: "",
                });
            }
        } catch (error) {
            console.error(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-6 py-20">

            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

                {/* LEFT SIDE - INFO SECTION */}
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-10 flex flex-col justify-center">

                    <h2 className="text-4xl font-bold mb-6">
                        Get In Touch 🚀
                    </h2>

                    <p className="mb-6 opacity-90">
                        We’d love to hear from you.
                        Send us your message and our team will respond quickly.
                    </p>

                    <div className="space-y-4 text-sm">

                        <div className="flex items-center gap-3">
                            <Mail size={18} />
                            support@jobportal.com
                        </div>

                        <div className="flex items-center gap-3">
                            <Phone size={18} />
                            +91 98765 43210
                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE - FORM */}
                <div className="p-10">

                    <h2 className="text-2xl font-bold mb-6 text-gray-800">
                        Contact Form
                    </h2>

                    {success && (
                        <div className="bg-green-100 text-green-700 p-3 rounded-xl mb-4 text-sm">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* NAME */}
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>

                        {/* PHONE */}
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                            <input
                                type="text"
                                name="phone"
                                placeholder="Phone Number"
                                value={form.phone}
                                onChange={handleChange}
                                className="w-full border rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>

                        {/* MESSAGE */}
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-3 text-gray-400" size={18} />
                            <textarea
                                name="message"
                                placeholder="Your Message"
                                rows="4"
                                value={form.message}
                                onChange={handleChange}
                                required
                                className="w-full border rounded-xl pl-10 pr-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
                            />
                        </div>

                        {/* BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition transform hover:scale-105"
                        >
                            {loading ? "Sending..." : "Send Message 🚀"}
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
};

export default ContactUs;