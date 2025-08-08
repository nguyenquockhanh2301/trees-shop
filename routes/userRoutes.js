const express = require('express');
const router = express.Router(); // ✅ THIS is what was missing

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust the path if needed


router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ✅ Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;