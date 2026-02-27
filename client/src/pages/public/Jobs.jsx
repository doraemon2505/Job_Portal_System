import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

const Jobs = () => {
    const [jobs, setJobs] = useState([]);

    const fetchJobs = async () => {
        const res = await api.get("/job");
        setJobs(res.data.jobs.filter(job => job.isActive));
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-10">
            <h1 className="text-4xl font-bold mb-8 text-center">Available Jobs</h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                    <div key={job._id} className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">

                        {job.thumbnail && (
                            <img
                                src={job.thumbnail}
                                alt={job.title}
                                className="w-full h-48 object-cover rounded-xl mb-4"
                            />
                        )}

                        <h2 className="text-xl font-bold">{job.title}</h2>
                        <p className="text-gray-600">{job.company?.name}</p>
                        <p className="text-sm text-gray-500 mt-2">{job.location}</p>

                        <div className="flex justify-between items-center mt-4">
                            <span className="text-blue-600 font-semibold capitalize">
                                {job.jobType}
                            </span>

                            <Link
                                to={`/jobs/${job._id}`}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Jobs;