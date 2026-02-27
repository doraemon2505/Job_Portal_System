import React, { useEffect, useState } from "react";
import api from "../../services/api";

const JobModal = ({ open, setOpen, editData, refreshJobs }) => {
    const isEdit = Boolean(editData);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        requirements: "",
        salaryMin: "",
        salaryMax: "",
        location: "",
        jobType: "full-time",
        experienceRequired: "",
        thumbnail: "", // now URL
        companyName: "",
        companyLogo: "",
        companyWebsite: "",
        companyLocation: "",
        isActive: true,
    });

    // Prefill
    useEffect(() => {
        if (editData) {
            setFormData({
                title: editData.title || "",
                description: editData.description || "",
                requirements: editData.requirements?.join(",") || "",
                salaryMin: editData.salary?.min || "",
                salaryMax: editData.salary?.max || "",
                location: editData.location || "",
                jobType: editData.jobType || "full-time",
                experienceRequired: editData.experienceRequired || "",
                thumbnail: editData.thumbnail || "",
                companyName: editData.company?.name || "",
                companyLogo: editData.company?.logo || "",
                companyWebsite: editData.company?.website || "",
                companyLocation: editData.company?.location || "",
                isActive: editData.isActive ?? true,
            });
        }
    }, [editData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            if (isEdit) {
                await api.put(`/job/${editData._id}`, formData);
                alert("Job Updated ✅");
            } else {
                await api.post("/job", formData);
                alert("Job Created ✅");
            }

            setOpen(false);
            refreshJobs();
        } catch (err) {
            console.error(err);
            alert("Something went wrong ❌");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl p-8 overflow-y-auto max-h-[90vh]">

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                        {isEdit ? "Edit Job" : "Create Job"}
                    </h2>
                    <button onClick={() => setOpen(false)}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <input name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" required className="w-full border p-3 rounded-lg" />

                    <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="w-full border p-3 rounded-lg" />

                    <input name="requirements" value={formData.requirements} onChange={handleChange} placeholder="Requirements (comma separated)" className="w-full border p-3 rounded-lg" />

                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" name="salaryMin" value={formData.salaryMin} onChange={handleChange} placeholder="Min Salary" className="border p-3 rounded-lg" />
                        <input type="number" name="salaryMax" value={formData.salaryMax} onChange={handleChange} placeholder="Max Salary" className="border p-3 rounded-lg" />
                    </div>

                    <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" required className="w-full border p-3 rounded-lg" />

                    <select name="jobType" value={formData.jobType} onChange={handleChange} className="w-full border p-3 rounded-lg">
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="remote">Remote</option>
                        <option value="internship">Internship</option>
                        <option value="contract">Contract</option>
                    </select>

                    <input type="number" name="experienceRequired" value={formData.experienceRequired} onChange={handleChange} placeholder="Experience Required (Years)" className="w-full border p-3 rounded-lg" />

                    {/* Thumbnail URL */}
                    <div>
                        <label className="block font-medium mb-2">Thumbnail URL</label>
                        <input
                            name="thumbnail"
                            value={formData.thumbnail}
                            onChange={handleChange}
                            placeholder="Paste image URL here"
                            className="w-full border p-3 rounded-lg"
                        />

                        {formData.thumbnail && (
                            <div className="mt-4">
                                <img
                                    src={formData.thumbnail}
                                    alt="Preview"
                                    className="w-40 h-40 object-cover rounded-xl border shadow"
                                    onError={(e) => e.target.style.display = "none"}
                                />
                            </div>
                        )}
                    </div>

                    <h3 className="font-semibold mt-6 text-lg border-t pt-4">Company Info</h3>

                    <input name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" required className="w-full border p-3 rounded-lg" />
                    <input name="companyLogo" value={formData.companyLogo} onChange={handleChange} placeholder="Company Logo URL" className="w-full border p-3 rounded-lg" />
                    <input name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} placeholder="Website" className="w-full border p-3 rounded-lg" />
                    <input name="companyLocation" value={formData.companyLocation} onChange={handleChange} placeholder="Company Location" className="w-full border p-3 rounded-lg" />

                    <div className="flex items-center gap-2">
                        <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                        <label>Active</label>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold">
                        {loading ? "Processing..." : isEdit ? "Update Job" : "Create Job"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default JobModal;