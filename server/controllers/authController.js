const jwt = require('jsonwebtoken');
const authService = require('../services/authService');

const JWT_SECRET = process.env.JWT_SECRET || 'replace-with-a-secure-secret';

/**
 * AuthController - Handles HTTP requests/responses for authentication
 * Delegates business logic to AuthService
 */

/**
 * Login handler
 * HTTP: POST /api/login
 * Controllers responsibility: 
 *   - Extract request data
 *   - Call service for business logic
 *   - Format HTTP response
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Input validation (HTTP layer validation)
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Call service for business logic
    const user = await authService.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }

    // Call service to verify password
    const passwordMatches = await authService.verifyPassword(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Email or password is incorrect' });
    }

    // Generate token (could move to service if reused elsewhere)
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(200).json({ token, message: 'Login successful' });
  } catch (error) {
    console.error('AuthController.login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * Register handler
 * HTTP: POST /api/register
 * Controllers responsibility:
 *   - Extract request data
 *   - Call service for business logic
 *   - Format HTTP response
 */
async function register(req, res) {
  try {
    const { email, password } = req.body;

    // Input validation (HTTP layer validation)
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Call service to check if user exists
    const existingUser = await authService.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Call service to create user (includes password hashing)
    const newUser = await authService.createUser(email, password);

    // Generate token
    const token = jwt.sign({ userId: newUser.id, email: newUser.email }, JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(201).json({ token, message: 'Registration successful' });
  } catch (error) {
    console.error('AuthController.register error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  login,
  register,
};
