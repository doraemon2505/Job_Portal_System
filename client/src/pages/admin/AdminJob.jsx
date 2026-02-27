import React, { useEffect, useState } from "react";
import api from "../../services/api";
import JobModal from "../../components/admin/JobModal";

const AdminJob = () => {
    const [jobs, setJobs] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [editData, setEditData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        try {
            const res = await api.get("/job");
            setJobs(res.data.jobs);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleEdit = (job) => {
        setEditData(job);
        setOpenModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this job?")) return;
        await api.delete(`/job/${id}`);
        fetchJobs();
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">
                    Job Management
                </h1>

                <button
                    onClick={() => {
                        setEditData(null);
                        setOpenModal(true);
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-xl shadow hover:bg-blue-700 transition"
                >
                    + Create Job
                </button>
            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center text-lg font-semibold">
                    Loading jobs...
                </div>
            )}

            {/* Empty State */}
            {!loading && jobs.length === 0 && (
                <div className="text-center text-gray-500 text-lg">
                    No jobs found
                </div>
            )}

            {/* Grid Layout */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <div
                        key={job._id}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
                    >
                        {/* Thumbnail */}
                        {job.thumbnail && (
                            <img
                                src={job.thumbnail}
                                alt="thumbnail"
                                className="h-40 w-full object-cover"
                            />
                        )}

                        <div className="p-5 flex flex-col flex-grow">

                            {/* Title */}
                            <h2 className="text-lg font-bold text-gray-800 mb-1">
                                {job.title}
                            </h2>

                            {/* Company */}
                            <p className="text-sm text-gray-600 mb-2">
                                {job.company?.name}
                            </p>

                            {/* Location + Type */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs">
                                    📍 {job.location}
                                </span>

                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs capitalize">
                                    {job.jobType}
                                </span>
                            </div>

                            {/* Salary */}
                            <p className="text-sm text-green-600 font-semibold mb-2">
                                ₹ {job.salary?.min} - ₹ {job.salary?.max}
                            </p>

                            {/* Status */}
                            <span
                                className={`inline-block w-fit px-3 py-1 text-xs rounded-full mb-4 ${job.isActive
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-600"
                                    }`}
                            >
                                {job.isActive ? "Active" : "Inactive"}
                            </span>

                            {/* Buttons */}
                            <div className="mt-auto flex justify-between gap-3">
                                <button
                                    onClick={() => handleEdit(job)}
                                    className="flex-1 bg-yellow-400 text-white py-2 rounded-lg hover:bg-yellow-500 transition"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(job._id)}
                                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <JobModal
                open={openModal}
                setOpen={setOpenModal}
                editData={editData}
                refreshJobs={fetchJobs}
            />
        </div>
    );
};

export default AdminJob;