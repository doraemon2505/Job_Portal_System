import React, { useEffect, useState } from "react";
import api from "../../services/api";

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMyApplications = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.get("/application/my-applications"); 

            setApplications(res.data?.applications || []);

        } catch (err) {
            console.error(err);
            setError("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyApplications();
    }, []);

    if (loading) {
        return (
            <div className="p-10 text-center text-lg font-semibold">
                Loading applications...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center text-red-500 font-semibold">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-10">

            <h1 className="text-3xl font-bold mb-8">
                My Applications
            </h1>

            {applications.length === 0 ? (
                <p className="text-gray-500 text-lg">
                    You have not applied for any jobs yet.
                </p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {applications.map((app) => (
                        <div
                            key={app._id}
                            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
                        >
                            <h2 className="text-xl font-bold">
                                {app.job?.title}
                            </h2>

                            <p className="text-gray-600">
                                Company: {app.job?.company?.name}
                            </p>

                            <p className="text-gray-500 mt-1">
                                Location: {app.job?.location}
                            </p>

                            <p className="mt-3">
                                Status:{" "}
                                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 capitalize">
                                    {app.status}
                                </span>
                            </p>

                            <a
                                href={app.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-block text-green-600 underline font-medium"
                            >
                                View Resume
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplications;