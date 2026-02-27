const express = require("express");
const {
    createJob,
    getAllJobs,
    getSingleJob,
    updateJob,
    deleteJob,
} = require("../controller/jobController");

const router = express.Router();

// CREATE JOB
router.post("/", createJob);

// GET ALL JOBS
router.get("/", getAllJobs);

// GET SINGLE JOB
router.get("/:id", getSingleJob);

// UPDATE JOB
router.put("/:id", updateJob);

// DELETE JOB
router.delete("/:id", deleteJob);

module.exports = router;