// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  updateUser,
  updateUserProfile
} = require('../controllers/userController');

// Middleware import kiya
const { protect, admin } = require('../middleware/authMiddleware');

// Public Routes
router.post('/register', registerUser);
router.post('/login', authUser);
router.put('/profile', protect, updateUserProfile);

// Protected Routes (User ko login hona padega)
router.route('/profile')
    .get(protect, getUserProfile)      // Profile dekhne ke liye
    .put(protect, updateUserProfile);  // Profile update karne ke liye

// Admin Routes (Login + Admin Role zaroori)
router.route('/')
    .get(protect, admin, getUsers);    // Saare users dekhne ke liye

router.route('/:id')
    .delete(protect, admin, deleteUser) // User delete karne ke liye
    .put(protect, admin, updateUser);   // User status/role update karne ke liye

module.exports = router;