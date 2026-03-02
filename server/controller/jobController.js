const Job = require("../model/Job");

/* ===============================
   SALARY PARSER (IMPORTANT)
================================= */
const parseSalary = (salaryInput) => {
  let min = 0;
  let max = 0;

  // If object format {min, max}
  if (typeof salaryInput === "object" && salaryInput !== null) {
    min = Number(salaryInput.min) || 0;
    max = Number(salaryInput.max) || 0;
  }

  // If string format "2-4 LPA"
  else if (typeof salaryInput === "string") {
    const match = salaryInput.match(/(\d+)\s*-\s*(\d+)/);
    if (match) {
      min = Number(match[1]);
      max = Number(match[2]);
    }
  }

  if (max < min) {
    [min, max] = [max, min];
  }

  return { min, max };
};

/* =====================================
   CREATE JOB
===================================== */
exports.createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      location,
      jobType,
      experienceRequired,
      salary,
      thumbnail,
      company,
      isActive,
    } = req.body;

    // 🔹 Basic Validation
    if (!title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: "Title, description and location are required",
      });
    }

    if (!company || !company.name) {
      return res.status(400).json({
        success: false,
        message: "Company name is required",
      });
    }

    const parsedRequirements =
      typeof requirements === "string"
        ? requirements.split(",").map((r) => r.trim())
        : requirements || [];

    const job = await Job.create({
      title,
      description,
      requirements: parsedRequirements,
      location,
      jobType: jobType || "full-time",
      experienceRequired: experienceRequired || "0",
      salary: {
        min: salary?.min || 0,
        max: salary?.max || 0,
      },
      thumbnail: thumbnail || "",
      company: {
        name: company.name,
        website: company.website || "",
        location: company.location || "",
        logo: company.logo || "",
      },
      isActive: isActive ?? true,
    });

    res.status(201).json({ success: true, job });

  } catch (error) {
    console.error("CREATE JOB ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================
   UPDATE JOB
===================================== */
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const {
      title,
      description,
      requirements,
      location,
      jobType,
      experienceRequired,
      salary,
      thumbnail,
      company,
      isActive,
    } = req.body;

    const parsedRequirements =
      typeof requirements === "string"
        ? requirements.split(",").map((r) => r.trim())
        : requirements ?? job.requirements;

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      {
        title: title ?? job.title,
        description: description ?? job.description,
        requirements: parsedRequirements,
        location: location ?? job.location,
        jobType: jobType ?? job.jobType,
        experienceRequired: experienceRequired ?? job.experienceRequired,
        salary: {
          min: salary?.min ?? job.salary.min,
          max: salary?.max ?? job.salary.max,
        },
        thumbnail: thumbnail ?? job.thumbnail,
        company: {
          name: company?.name ?? job.company.name,
          website: company?.website ?? job.company.website,
          location: company?.location ?? job.company.location,
          logo: company?.logo ?? job.company.logo,
        },
        isActive: isActive ?? job.isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ success: true, job: updatedJob });

  } catch (error) {
    console.error("UPDATE JOB ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================
   GET ALL JOBS
===================================== */
exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================
   GET SINGLE JOB
===================================== */
exports.getSingleJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({ success: true, job });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =====================================
   DELETE JOB
===================================== */
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};