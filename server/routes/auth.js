const express = require('express');
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'replace-with-a-secure-secret';

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

router.post('/login', authController.login);
router.post('/register', authController.register);

// Verify token endpoint
router.get('/verify', verifyToken, async (req, res) => {
  try {
    // Get user details from database
    const { getOne } = require('../db');
    const user = await getOne(
      'SELECT id, email, created_at FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
