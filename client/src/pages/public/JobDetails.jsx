import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import ApplyModal from "../../components/public/ApplyModal";

const JobDetails = () => {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [openApply, setOpenApply] = useState(false);

    const fetchJob = async () => {
        const res = await api.get(`/job/${id}`);
        setJob(res.data.job);
    };

    useEffect(() => {
        fetchJob();
    }, [id]);

    if (!job) return <div className="p-10">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-10">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow">

                {job.thumbnail && (
                    <img
                        src={job.thumbnail}
                        alt={job.title}
                        className="w-full h-64 object-cover rounded-xl mb-6"
                    />
                )}

                <h1 className="text-3xl font-bold">{job.title}</h1>
                <p className="text-gray-600 mt-2">{job.company?.name}</p>
                <p className="text-gray-500">{job.location}</p>

                <div className="mt-6">
                    <h3 className="font-semibold text-lg">Description</h3>
                    <p className="text-gray-700 mt-2">{job.description}</p>
                </div>

                <div className="mt-6">
                    <h3 className="font-semibold text-lg">Requirements</h3>
                    <ul className="list-disc list-inside text-gray-700 mt-2">
                        {job.requirements?.map((req, index) => (
                            <li key={index}>{req}</li>
                        ))}
                    </ul>
                </div>

                <div className="mt-6">
                    <p><strong>Salary:</strong> ${job.salary?.min} - ${job.salary?.max}</p>
                    <p><strong>Experience:</strong> {job.experienceRequired} Years</p>
                    <p><strong>Type:</strong> {job.jobType}</p>
                </div>

                <button
                    onClick={() => setOpenApply(true)}
                    className="mt-8 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl"
                >
                    Apply Now
                </button>
            </div>

            <ApplyModal open={openApply} setOpen={setOpenApply} jobId={job._id} />
        </div>
    );
};

export default JobDetails;