// const Job = require("../model/Job");

// /* ===============================
//    SALARY PARSER (IMPORTANT)
// ================================= */
// const parseSalary = (salaryInput) => {
//   let min = 0;
//   let max = 0;

//   // If object format {min, max}
//   if (typeof salaryInput === "object" && salaryInput !== null) {
//     min = Number(salaryInput.min) || 0;
//     max = Number(salaryInput.max) || 0;
//   }

//   // If string format "2-4 LPA"
//   else if (typeof salaryInput === "string") {
//     const match = salaryInput.match(/(\d+)\s*-\s*(\d+)/);
//     if (match) {
//       min = Number(match[1]);
//       max = Number(match[2]);
//     }
//   }

//   if (max < min) {
//     [min, max] = [max, min];
//   }

//   return { min, max };
// };

// /* =====================================
//    CREATE JOB
// ===================================== */
// exports.createJob = async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       requirements,
//       location,
//       jobType,
//       experienceRequired,
//       salary,
//       thumbnail,
//       company,
//       startDate,
//       lastDateToApply,
//       isActive,
//     } = req.body;

//     // 🔹 Basic Validation
//     if (!title || !description || !location) {
//       return res.status(400).json({
//         success: false,
//         message: "Title, description and location are required",
//       });
//     }

//     if (!company || !company.name) {
//       return res.status(400).json({
//         success: false,
//         message: "Company name is required",
//       });
//     }

//     const parsedRequirements =
//       typeof requirements === "string"
//         ? requirements.split(",").map((r) => r.trim())
//         : requirements || [];

//     const job = await Job.create({
//       title,
//       description,
//       requirements: parsedRequirements,
//       location,
//       jobType: jobType || "full-time",
//       experienceRequired: experienceRequired || "0",
//       salary: {
//         min: salary?.min || 0,
//         max: salary?.max || 0,
//       },
//       thumbnail: thumbnail || "",
//       company: {
//         name: company.name,
//         website: company.website || "",
//         location: company.location || "",
//         logo: company.logo || "",
//       },
//       startDate: startDate || null,
//       lastDateToApply: lastDateToApply || null,
//       isActive: isActive ?? true,
//     });

//     res.status(201).json({ success: true, job });

//   } catch (error) {
//     console.error("CREATE JOB ERROR:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* =====================================
//    UPDATE JOB
// ===================================== */
// exports.updateJob = async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);

//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: "Job not found",
//       });
//     }

//     const {
//       title,
//       description,
//       requirements,
//       location,
//       jobType,
//       experienceRequired,
//       salary,
//       thumbnail,
//       company,
//       startDate,
//       lastDateToApply,
//       isActive,
//     } = req.body;

//     const parsedRequirements =
//       typeof requirements === "string"
//         ? requirements.split(",").map((r) => r.trim())
//         : requirements ?? job.requirements;

//     const updatedJob = await Job.findByIdAndUpdate(
//       req.params.id,
//       {
//         title: title ?? job.title,
//         description: description ?? job.description,
//         requirements: parsedRequirements,
//         location: location ?? job.location,
//         jobType: jobType ?? job.jobType,
//         experienceRequired: experienceRequired ?? job.experienceRequired,
//         salary: {
//           min: salary?.min ?? job.salary.min,
//           max: salary?.max ?? job.salary.max,
//         },
//         thumbnail: thumbnail ?? job.thumbnail,
//         company: {
//           name: company?.name ?? job.company.name,
//           website: company?.website ?? job.company.website,
//           location: company?.location ?? job.company.location,
//           logo: company?.logo ?? job.company.logo,
//         },
//         startDate: startDate ?? job.startDate,
//         lastDateToApply: lastDateToApply ?? job.lastDateToApply,
//         isActive: isActive ?? job.isActive,
//       },
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     res.status(200).json({ success: true, job: updatedJob });

//   } catch (error) {
//     console.error("UPDATE JOB ERROR:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* =====================================
//    GET ALL JOBS
// ===================================== */
// exports.getAllJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, jobs });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* =====================================
//    GET SINGLE JOB
// ===================================== */
// exports.getSingleJob = async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);

//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: "Job not found",
//       });
//     }

//     res.status(200).json({ success: true, job });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* =====================================
//    DELETE JOB
// ===================================== */
// exports.deleteJob = async (req, res) => {
//   try {
//     const job = await Job.findById(req.params.id);

//     if (!job) {
//       return res.status(404).json({
//         success: false,
//         message: "Job not found",
//       });
//     }

//     await job.deleteOne();

//     res.status(200).json({
//       success: true,
//       message: "Job deleted successfully",
//     });

//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// server/controller/jobController.js
const Job = require("../model/Job");

/* ─── Salary parser ──────────────────────────────────────────────────────────
   Frontend can send salary as:
   - string  "5-7 LPA" | "Competitive" | "₹4,50,000"
   - object  { min: 5, max: 7 }
   - number  500000
   We store it as a single "salary" string field OR {min, max} — see model below.
   Best approach: store as string (flexible), parse only for display.
─────────────────────────────────────────────────────────────────────────────── */
const normalizeSalary = (input) => {
  if (!input) return "";
  if (typeof input === "object" && input !== null) {
    const { min, max } = input;
    if (min && max) return `${min} - ${max} LPA`;
    if (min)        return `${min} LPA`;
    return "";
  }
  return String(input).trim();
};

/* ─── CREATE JOB ─────────────────────────────────────────────────────────── */
exports.createJob = async (req, res) => {
  try {
    const {
      title, description, requirements, location, jobType,
      experienceRequired, experience, salary, thumbnail, company,
      startDate, lastDateToApply, isActive, skills,
    } = req.body;

    if (!title || !description || !location)
      return res.status(400).json({ success: false, message: "Title, description and location are required" });

    if (!company || !company.name)
      return res.status(400).json({ success: false, message: "Company name is required" });

    // Merge requirements + skills (frontend may send either)
    const mergedReqs = [
      ...(Array.isArray(requirements) ? requirements : (typeof requirements === "string" ? requirements.split(",").map(r => r.trim()).filter(Boolean) : [])),
      ...(Array.isArray(skills)       ? skills       : []),
    ].filter((v, i, a) => v && a.indexOf(v) === i); // unique, non-empty

    const job = await Job.create({
      title:              title.trim(),
      description:        description.trim(),
      requirements:       mergedReqs,
      skills:             mergedReqs,
      location:           location.trim(),
      jobType:            jobType || "full-time",
      experience:         experience || experienceRequired || "",
      experienceRequired: experienceRequired || experience || "",
      salary:             normalizeSalary(salary),
      thumbnail:          thumbnail || "",
      company: {
        name:     company.name.trim(),
        logo:     company.logo     || "",
        website:  company.website  || "",
        location: company.location || "",
      },
      startDate:          startDate       ? new Date(startDate)       : null,
      lastDateToApply:    lastDateToApply ? new Date(lastDateToApply) : null,
      isActive:           isActive ?? true,
    });

    res.status(201).json({ success: true, message: "Job created successfully", job });
  } catch (error) {
    console.error("CREATE JOB ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ─── UPDATE JOB ─────────────────────────────────────────────────────────── */
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    const {
      title, description, requirements, location, jobType,
      experienceRequired, experience, salary, thumbnail, company,
      startDate, lastDateToApply, isActive, skills,
    } = req.body;

    const mergedReqs = [
      ...(Array.isArray(requirements) ? requirements : (typeof requirements === "string" ? requirements.split(",").map(r => r.trim()).filter(Boolean) : [])),
      ...(Array.isArray(skills)       ? skills       : []),
    ].filter((v, i, a) => v && a.indexOf(v) === i);

    // Build update object — only update fields that were sent
    const update = {
      title:              title              ?? job.title,
      description:        description        ?? job.description,
      requirements:       mergedReqs.length  ? mergedReqs        : job.requirements,
      skills:             mergedReqs.length  ? mergedReqs        : job.skills,
      location:           location           ?? job.location,
      jobType:            jobType            ?? job.jobType,
      experience:         experience || experienceRequired || job.experience,
      experienceRequired: experienceRequired || experience || job.experienceRequired,
      salary:             salary !== undefined ? normalizeSalary(salary) : job.salary,
      thumbnail:          thumbnail          ?? job.thumbnail,
      isActive:           isActive           ?? job.isActive,
      company: {
        name:     company?.name     ?? job.company.name,
        logo:     company?.logo     ?? job.company.logo,
        website:  company?.website  ?? job.company.website,
        location: company?.location ?? job.company.location,
      },
      startDate:       startDate       !== undefined ? (startDate       ? new Date(startDate)       : null) : job.startDate,
      lastDateToApply: lastDateToApply !== undefined ? (lastDateToApply ? new Date(lastDateToApply) : null) : job.lastDateToApply,
    };

    const updated = await Job.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });

    res.status(200).json({ success: true, message: "Job updated successfully", job: updated });
  } catch (error) {
    console.error("UPDATE JOB ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ─── GET ALL JOBS (with search + filter from backend) ───────────────────── */
exports.getAllJobs = async (req, res) => {
  try {
    const { q, location, jobType, isActive } = req.query;

    const filter = {};

    // Search query — case-insensitive across title, company name, location, skills
    if (q && q.trim()) {
      const regex = new RegExp(q.trim(), "i");
      filter.$or = [
        { title:              regex },
        { location:           regex },
        { "company.name":     regex },
        { requirements:       regex },
        { skills:             regex },
      ];
    }

    if (location && location !== "all") filter.location = new RegExp(location, "i");
    if (jobType  && jobType  !== "all") filter.jobType  = jobType;

    // By default show only active jobs to users; admin can see all
    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ─── GET SINGLE JOB ─────────────────────────────────────────────────────── */
exports.getSingleJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ─── DELETE JOB ─────────────────────────────────────────────────────────── */
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job)
      return res.status(404).json({ success: false, message: "Job not found" });

    res.status(200).json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};