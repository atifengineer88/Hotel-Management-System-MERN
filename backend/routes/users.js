const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/authMiddleware');

// Get Current User Profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Get All Users (Admin only - for Staff Management)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;