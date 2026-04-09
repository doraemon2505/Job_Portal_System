// const User = require('../model/User');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// // Generate JWT Token
// const generateToken = (id, role) => {
//   return jwt.sign({ id, role }, process.env.JWT_SECRET, {
//     expiresIn: '30d',
//   });
// };

// // @desc    Register new user
// // @route   POST /api/auth/register
// // @access  Public
// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check if user exists
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: 'User already exists' });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create user (Default role is 'user'. To create an admin, manually change in DB or add logic here)
//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     if (user) {
//       res.status(201).json({
//         _id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         token: generateToken(user.id, user.role),
//       });
//     } else {
//       res.status(400).json({ message: 'Invalid user data' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Authenticate a user
// // @route   POST /api/auth/login
// // @access  Public
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check for user email
//     const user = await User.findOne({ email });

//     if (user && (await bcrypt.compare(password, user.password))) {
//       res.json({
//         _id: user.id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         token: generateToken(user.id, user.role),
//       });
//     } else {
//       res.status(401).json({ message: 'Invalid credentials' });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // @desc    Logout user
// // @route   POST /api/auth/logout
// // @access  Public
// const logoutUser = (req, res) => {
//   // Since we are using JWT (stateless), logout is handled on client by removing token.
//   // We just send a success message here.
//   res.status(200).json({ message: 'Logged out successfully' });
// };

// // @desc    Get user data
// // @route   GET /api/auth/me
// // @access  Private
// const getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find({role:"user"})
//       .select("-password") // remove password field
//       .sort({ createdAt: -1 }); // newest first

//     res.status(200).json({
//       success: true,
//       count: users.length,
//       users,
//     });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch users",
//     });
//   }
// };


// module.exports = {
//   registerUser,
//   loginUser,
//   logoutUser,
//   getMe,
//   getAllUsers
// };


// server/controller/authController.js
const User = require("../model/user");
const jwt  = require("jsonwebtoken");

// ── Generate JWT ──────────────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });

// ── Safe user object (no password) ───────────────────────────────────────────
const safeUser = (user) => ({
  _id:          user._id,
  name:         user.name,
  email:        user.email,
  role:         user.role,
  phone:        user.phone        || "",
  profileImage: user.profileImage || "",
  resumeUrl:    user.resumeUrl    || "",
  githubUrl:    user.githubUrl    || "",
  linkedinUrl:  user.linkedinUrl  || "",
  createdAt:    user.createdAt,
});

/* ─── REGISTER ─────────────────────────────────────────────────────────────── */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(400).json({ success: false, message: "Email already registered" });

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token:   generateToken(user._id),
      user:    safeUser(user),
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ─── LOGIN ────────────────────────────────────────────────────────────────── */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ success: false, message: "Email and password are required" });

    // select: false on password, so manually select it here
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    const match = await user.comparePassword(password);
    if (!match)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token:   generateToken(user._id),
      user:    safeUser(user),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ─── GET PROFILE ──────────────────────────────────────────────────────────── */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, user: safeUser(user) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ─── UPDATE PROFILE (saves URLs) ─────────────────────────────────────────── */
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, profileImage, resumeUrl, githubUrl, linkedinUrl } = req.body;

    // Only update provided fields
    const updates = {};
    if (name         !== undefined) updates.name         = name.trim();
    if (phone        !== undefined) updates.phone        = phone.trim();
    if (profileImage !== undefined) updates.profileImage = profileImage.trim();
    if (resumeUrl    !== undefined) updates.resumeUrl    = resumeUrl.trim();
    if (githubUrl    !== undefined) updates.githubUrl    = githubUrl.trim();
    if (linkedinUrl  !== undefined) updates.linkedinUrl  = linkedinUrl.trim();

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user:    safeUser(user),
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ─── GET ALL USERS (admin) ────────────────────────────────────────────────── */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, users: users.map(safeUser) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ─── DELETE USER (admin) ──────────────────────────────────────────────────── */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};