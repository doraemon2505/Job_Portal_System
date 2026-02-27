import React, { useEffect, useState } from "react";
import api from "../../services/api";

const AdminApplication = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const res = await api.get("/application");
            setApplications(res.data?.applications || []);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/application/${id}`, { status });
            fetchApplications();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this application?")) return;

        try {
            await api.delete(`/application/${id}`);
            fetchApplications();
        } catch (err) {
            alert("Failed to delete");
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "shortlisted":
                return "bg-green-100 text-green-700";
            case "reviewed":
                return "bg-blue-100 text-blue-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">

                <h1 className="text-3xl font-bold mb-8">
                    Applications Management
                </h1>

                {loading ? (
                    <div className="text-center py-20 text-gray-500">
                        Loading applications...
                    </div>
                ) : applications.length === 0 ? (
                    <div className="text-center py-20 text-gray-500">
                        No applications found
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">

                        <table className="min-w-full text-sm text-left">

                            {/* Table Head */}
                            <thead className="bg-gray-50 border-b text-gray-600 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Applicant</th>
                                    <th className="px-6 py-4">Contact</th>
                                    <th className="px-6 py-4">Job</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                {applications.map((app) => (
                                    <tr
                                        key={app._id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        {/* Applicant */}
                                        <td className="px-6 py-4">
                                            <p className="font-semibold">
                                                {app.name}
                                            </p>
                                        </td>

                                        {/* Contact */}
                                        <td className="px-6 py-4">
                                            <p className="text-gray-600">
                                                {app.email}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                {app.phone}
                                            </p>
                                        </td>

                                        {/* Job */}
                                        <td className="px-6 py-4">
                                            <p className="font-medium">
                                                {app.job?.title}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                {app.job?.company?.name}
                                            </p>
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4">
                                            <select
                                                value={app.status}
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        app._id,
                                                        e.target.value
                                                    )
                                                }
                                                className={`px-3 py-1 rounded-full text-xs font-semibold border outline-none ${getStatusBadge(
                                                    app.status
                                                )}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="reviewed">Reviewed</option>
                                                <option value="shortlisted">Shortlisted</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleDelete(app._id)}
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-xs transition"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminApplication;