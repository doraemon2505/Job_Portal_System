// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true
//   },
//   password: {
//     type: String,
//     required: true
//   },
//   role: {
//     type: String,
//     enum: ['user', 'admin'],
//     default: 'user'
//   }
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);

// server/model/user.js
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type:     String,
      required: [true, "Name is required"],
      trim:     true,
    },
    email: {
      type:     String,
      required: [true, "Email is required"],
      unique:   true,
      lowercase: true,
      trim:     true,
    },
    password: {
      type:     String,
      required: [true, "Password is required"],
      minlength: 8,
      select:   false, // never returned in queries by default
    },
    role: {
      type:    String,
      enum:    ["user", "admin"],
      default: "user",
    },

    // ── Profile fields (persist after logout via JWT) ──────────────────────
    phone:        { type: String, default: "" },
    profileImage: { type: String, default: "" }, // direct image URL
    resumeUrl:    { type: String, default: "" }, // Google Drive link
    githubUrl:    { type: String, default: "" },
    linkedinUrl:  { type: String, default: "" },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.models.User || mongoose.model("User", userSchema);