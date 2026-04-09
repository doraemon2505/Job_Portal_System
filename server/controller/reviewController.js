// server/controller/reviewController.js
const Review = require("../model/review");

/* ─── CREATE REVIEW (logged-in user) ────────────────────────────────────── */
exports.createReview = async (req, res) => {
  try {
    const { message, rating, role } = req.body;
    const userId = req.user.id;

    if (!message || !message.trim())
      return res.status(400).json({ success: false, message: "Review message is required" });

    if (rating < 1 || rating > 5)
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5" });

    // One review per user
    const existing = await Review.findOne({ user: userId });
    if (existing)
      return res.status(400).json({ success: false, message: "You have already submitted a review" });

    const review = await Review.create({
      user:     userId,
      name:     req.user.name,
      email:    req.user.email,
      message:  message.trim(),
      rating:   rating || 5,
      role:     role || "",
      approved: false, // admin must approve first
    });

    res.status(201).json({ success: true, message: "Review submitted! It will appear after admin approval.", review });
  } catch (error) {
    console.error("CREATE REVIEW ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ─── GET ALL REVIEWS (admin) ────────────────────────────────────────────── */
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ─── GET APPROVED REVIEWS (public — for Home page) ─────────────────────── */
exports.getApprovedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 }).limit(10);
    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ─── GET MY REVIEW (logged-in user) ────────────────────────────────────── */
exports.getMyReview = async (req, res) => {
  try {
    const review = await Review.findOne({ user: req.user.id });
    res.status(200).json({ success: true, review: review || null });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ─── TOGGLE APPROVE (admin) ─────────────────────────────────────────────── */
exports.toggleApprove = async (req, res) => {
  try {
    const { approved } = req.body;

    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved },
      { new: true }
    );

    if (!review)
      return res.status(404).json({ success: false, message: "Review not found" });

    res.status(200).json({
      success: true,
      message: approved ? "Review approved — now showing on homepage" : "Review removed from homepage",
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ─── DELETE REVIEW (admin) ──────────────────────────────────────────────── */
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review)
      return res.status(404).json({ success: false, message: "Review not found" });

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};