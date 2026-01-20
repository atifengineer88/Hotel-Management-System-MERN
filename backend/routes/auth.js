const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. Generate Token (With strict error handling)
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '10h' }, // Use string for hours
      (err, token) => {
        if (err) {
            console.error("JWT Error:", err);
            return res.status(500).json({ msg: 'Error generating token' });
        }
        // Send successful response
        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
      }
    );

  } catch (err) {
    console.error("Server Error:", err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth/register
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });
    
        user = new User({ name, email, password, role: 'guest' }); // Default role
    
        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
    
        await user.save();
    
        const payload = { user: { id: user.id, role: user.role } };
    
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 36000 }, (err, token) => {
            if (err) throw err;
            res.json({ token, user: { id: user.id, name, email, role: user.role } });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;