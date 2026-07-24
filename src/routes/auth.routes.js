const express = require('express');
const router = express.Router();

// Import controllers
const { registerUser, loginUser } = require('../controllers/auth.controllers');

// Import middleware
const { protect } = require('../middleware/auth.middleware');

// @route   POST /api/auth/register
// @access  Public
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @access  Public
router.post('/login', loginUser);

// @route   GET /api/auth/me
// @desc    Get current logged-in user profile (Tests the middleware)
// @access  Private
router.get('/me', protect, (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = router;