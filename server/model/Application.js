// const mongoose = require("mongoose");

// const applicationSchema = new mongoose.Schema(
//     {
//         job: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Job",
//             required: true,
//         },

//         user: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "User",
//             required: true,
//         },

//         name: {
//             type: String,
//             required: true,
//             trim: true,
//         },

//         email: {
//             type: String,
//             required: true,
//             trim: true,
//         },

//         phone: {
//             type: String,
//             required: true,
//         },

//         resumeUrl: {
//             type: String,
//             required: true
//       },

//         status: {
//             type: String,
//             enum: ["pending", "reviewed", "shortlisted", "rejected"],
//             default: "pending",
//         },
//     },
//     { timestamps: true }
// );

// module.exports = mongoose.model("Application", applicationSchema);

// server/middleware/authMiddleware.js
const jwt  = require("jsonwebtoken");
const User = require("./User");

/* ─── protect ─────────────────────────────────────────────────────────────── */
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
      return res.status(401).json({ success: false, message: "Not authorized — no token" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (excluding password)
    const user = await User.findById(decoded.id);
    if (!user)
      return res.status(401).json({ success: false, message: "User no longer exists" });

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError")
      return res.status(401).json({ success: false, message: "Session expired — please log in again" });
    if (error.name === "JsonWebTokenError")
      return res.status(401).json({ success: false, message: "Invalid token" });

    res.status(500).json({ success: false, message: error.message });
  }
};

/* ─── adminOnly ───────────────────────────────────────────────────────────── */
exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  res.status(403).json({ success: false, message: "Admin access required" });
};