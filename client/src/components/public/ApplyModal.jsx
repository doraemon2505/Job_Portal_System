import React, { useState } from "react";
import api from "../../services/api";

const ApplyModal = ({ open, setOpen, jobId }) => {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            await api.post("/application", {
                jobId,
                ...formData,
            });

            alert("Application Submitted Successfully ✅");

            // Reset form
            setFormData({
                name: "",
                email: "",
                phone: "",
            });

            setOpen(false);

        } catch (err) {
            console.error(err.response?.data || err.message);

            alert(
                err.response?.data?.message ||
                "Something went wrong ❌"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-lg p-8 rounded-2xl shadow-xl">

                <div className="flex justify-between mb-4">
                    <h2 className="text-xl font-bold">Apply for Job</h2>
                    <button onClick={() => setOpen(false)}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input
                        name="name"
                        placeholder="Full Name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                    />

                    <input
                        name="phone"
                        placeholder="Phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-lg"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
                    >
                        {loading ? "Submitting..." : "Submit Application"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default ApplyModal;