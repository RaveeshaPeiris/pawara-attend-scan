const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Teacher = require('../models/Teacher');

// Hardcoded admin
const ADMIN = {
  email: 'admin@gmail.com',
  password: 'admin123' 
};

// Login only
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Admin login
  if (email === ADMIN.email && password === ADMIN.password) {
    const token = jwt.sign({ role: 'admin' }, 'secretKey', { expiresIn: '1d' });
    return res.json({ token, role: 'admin' });
  }

  try {
    const teacher = await Teacher.findOne({ email });
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign({ id: teacher._id, role: 'teacher' }, 'secretKey', { expiresIn: '1d' });
    res.json({ token, role: 'teacher' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
