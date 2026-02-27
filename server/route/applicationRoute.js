const express = require("express");
const {
    createApplication,
    getAllApplications,
    getSingleApplication,
    updateApplicationStatus,
    deleteApplication,
} = require("../controller/applicationController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ CREATE APPLICATION (NO FILE UPLOAD)
router.post("/", protect, createApplication);

// ✅ USER → HIS APPLICATIONS
router.get("/my-applications", protect, getAllApplications);

// ✅ ADMIN → ALL APPLICATIONS
router.get("/", protect, adminOnly, getAllApplications);

// ✅ GET SINGLE
router.get("/:id", protect, getSingleApplication);

// ✅ UPDATE STATUS (ADMIN)
router.put("/:id", protect, adminOnly, updateApplicationStatus);

// ✅ DELETE (ADMIN)
router.delete("/:id", protect, adminOnly, deleteApplication);

module.exports = router;