// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// 1. Protect Middleware (Login Check)
const protect = async (req, res, next) => {
  let token;

  // Header mein check karo: 'Bearer <token>' format
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // "Bearer " hata kar sirf token nikalo
      token = req.headers.authorization.split(' ')[1];

      // Token verify karo (Secret key use karke)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // User dhoond ke req object mein daal do (Password chhod kar)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Sab sahi hai, aage badho
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 2. Admin Middleware (Role Check)
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); // Admin hai, aage badho
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };