const express = require("express");
const {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
} = require("../controller/jobController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// CREATE JOB (ADMIN ONLY)
router.post("/", protect, adminOnly, createJob);

// GET ALL JOBS
router.get("/", getAllJobs);

// GET SINGLE JOB
router.get("/:id", getSingleJob);

// UPDATE JOB
router.put("/:id", protect, adminOnly, updateJob);

// DELETE JOB
router.delete("/:id", protect, adminOnly, deleteJob);

module.exports = router;