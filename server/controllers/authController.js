const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

const JWT_SECRET = process.env.JWT_SECRET || 'replace-with-a-secure-secret';

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await authService.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: 'Email or password is incorrect' });
  }

  const passwordMatches = await authService.verifyPassword(password, user.password);
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Email or password is incorrect' });
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: '1h',
  });

  return res.status(200).json({ token, message: 'Login successful...' });
}

async function register(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const existingUser = await authService.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const newUser = await authService.createUser(email, password);
    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(201).json({ token, message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  login,
  register,
};
