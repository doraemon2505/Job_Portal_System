// const express = require("express");
// const router = express.Router();
// const { protect } = require("../middleware/authMiddleware");

// // Temporary in-memory storage
// let reviews = [];

// // ✅ GET my review
// router.get("/my", protect, (req, res) => {
//   const userReview = reviews.find(r => r.userId === req.user._id);

//   res.json({
//     review: userReview || null
//   });
// });

// // ✅ ADD review
// router.post("/", protect, (req, res) => {
//   const { rating, message } = req.body;

//   if (!message) {
//     return res.status(400).json({ message: "Message required" });
//   }

//   const newReview = {
//     id: Date.now(),
//     userId: req.user._id,
//     name: req.user.name,
//     rating,
//     message,
//     approved: false
//   };

//   reviews.push(newReview);

//   res.status(201).json(newReview);
// });

// module.exports = router;

// server/route/reviewRoutes.js
const express = require("express");
const {
  createReview,
  getAllReviews,
  getApprovedReviews,
  getMyReview,
  toggleApprove,
  deleteReview,
} = require("../controller/reviewController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public — approved reviews for Home page
router.get("/approved", getApprovedReviews);

// User routes
router.post("/",   protect, createReview);
router.get("/my",  protect, getMyReview);

// Admin routes
router.get("/",             protect, adminOnly, getAllReviews);
router.put("/:id",          protect, adminOnly, toggleApprove);
router.delete("/:id",       protect, adminOnly, deleteReview);

module.exports = router;