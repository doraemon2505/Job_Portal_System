const Application = require("../model/Application");
const Job = require("../model/Job");


// ✅ CREATE APPLICATION (STORE USER)
exports.createApplication = async (req, res) => {
    try {

        const { jobId, name, email, phone } = req.body;
        const userId = req.user.id;

        if (!jobId || !name || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Job not found",
            });
        }

        // ✅ Prevent duplicate application
        const existing = await Application.findOne({
            job: jobId,
            user: userId,
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                message: "You already applied for this job",
            });
        }

        const application = await Application.create({
            job: jobId,
            user: userId,
            name,
            email,
            phone,
            status: "pending",
        });

        res.status(201).json({
            success: true,
            message: "Application submitted successfully",
            application,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// ✅ GET ALL APPLICATIONS (ADMIN + USER FILTER)
exports.getAllApplications = async (req, res) => {
    try {

        let filter = {};

        // ✅ If not admin → show only his applications
        if (req.user.role !== "admin") {
            filter.user = req.user.id;
        }

        const applications = await Application.find(filter)
            .populate("job", "title company location")
            .populate("user", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            applications,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// ✅ GET SINGLE APPLICATION
exports.getSingleApplication = async (req, res) => {
    try {

        const application = await Application.findById(req.params.id)
            .populate("job")
            .populate("user");

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        res.status(200).json({
            success: true,
            application,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// ✅ UPDATE STATUS (ADMIN ONLY)
exports.updateApplicationStatus = async (req, res) => {
    try {

        const { status } = req.body;

        const allowedStatus = ["pending", "reviewed", "shortlisted", "rejected"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status",
            });
        }

        const application = await Application.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Status updated",
            application,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// ✅ DELETE
exports.deleteApplication = async (req, res) => {
    try {

        const application = await Application.findByIdAndDelete(req.params.id);

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Application deleted",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// ✅ GET LOGGED IN USER APPLICATIONS
exports.getMyApplications = async (req, res) => {
    try {

        const applications = await Application.find({
            user: req.user.id, // ✅ FIXED (was applicant wrong)
        })
            .populate("job")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            applications,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};