// const express = require('express');
// const router = express.Router();
// const { registerUser, loginUser, logoutUser, getMe, getAllUsers } = require('../controller/authController');
// const { protect, adminOnly } = require('../middleware/authMiddleware'); // See step 5

// router.post('/register', registerUser);
// router.post('/login', loginUser);
// router.post('/logout', logoutUser);
// router.get('/me', protect, getMe); // Protected route example
// router.get("/allusers",getAllUsers);

// module.exports = router;

// server/route/authRoutes.js
const express = require("express");
const {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  deleteUser,
} = require("../controller/authController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.post("/register", register);
router.post("/login",    login);

// User (logged in)
router.get ("/profile",        protect, getProfile);
router.put ("/profile/update", protect, updateProfile);  // ← saves URLs

// Admin
router.get    ("/allusers",    protect, adminOnly, getAllUsers);
router.delete ("/user/:id",   protect, adminOnly, deleteUser);

module.exports = router;