const Job = require("../model/Job");
/* ===============================
   CREATE JOB
================================= */
/* ===============================
   CREATE JOB
================================= */
exports.createJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            location,
            jobType,
            experienceRequired,
            salaryMin,
            salaryMax,
            thumbnail, // now image URL
            companyName,
            companyWebsite,
            companyLocation,
            companyLogo,
            isActive,
        } = req.body;

        const job = await Job.create({
            title,
            description,
            requirements: requirements ? requirements.split(",") : [],
            location,
            jobType,
            experienceRequired,
            salary: {
                min: salaryMin || 0,
                max: salaryMax || 0,
            },
            thumbnail: thumbnail || "",
            company: {
                name: companyName,
                website: companyWebsite,
                location: companyLocation,
                logo: companyLogo || "",
            },
            isActive: isActive ?? true,
        });

        res.status(201).json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ===============================
   UPDATE JOB
================================= */
exports.updateJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                requirements: req.body.requirements
                    ? req.body.requirements.split(",")
                    : job.requirements,
                salary: {
                    min: req.body.salaryMin || job.salary.min,
                    max: req.body.salaryMax || job.salary.max,
                },
                company: {
                    name: req.body.companyName,
                    website: req.body.companyWebsite,
                    location: req.body.companyLocation,
                    logo: req.body.companyLogo,
                },
            },
            { new: true }
        );

        res.status(200).json({ success: true, job: updatedJob });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ===============================
   GET ALL JOBS
================================= */
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });

        res.status(200).json({ success: true, jobs });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ===============================
   GET SINGLE JOB
================================= */
exports.getSingleJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        res.status(200).json({ success: true, job });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/* ===============================
   DELETE JOB
================================= */
exports.deleteJob = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        await job.deleteOne();

        res.status(200).json({ success: true, message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};