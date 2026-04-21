// server/model/review.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "User",
      required: true,
    },
    name:    { type: String, required: true, trim: true },
    email:   { type: String, required: true, lowercase: true },
    role:    { type: String, default: "", trim: true },  // e.g. "Frontend Dev @ Google"
    message: { type: String, required: true, trim: true },
    rating:  { type: Number, min: 1, max: 5, default: 5 },
    approved:{ type: Boolean, default: false }, // admin approves before showing on homepage
  },
  { timestamps: true }
);

// One review per user
reviewSchema.index({ user: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);