const bcrypt = require('bcrypt');
const UserRepository = require('../repositories/UserRepository');

/**
 * AuthService - Handles authentication business logic
 * Uses UserRepository for data access
 */

/**
 * Get user by email
 * @param {string} email - User email
 * @returns {Promise<Object|null>} User object or null
 */
async function getUserByEmail(email) {
  try {
    const user = await UserRepository.getUserByEmail(email);
    return user;
  } catch (error) {
    throw new Error(`AuthService - getUserByEmail failed: ${error.message}`);
  }
}

/**
 * Verify password against hash
 * @param {string} password - Plain text password
 * @param {string} passwordHash - Hashed password from database
 * @returns {Promise<boolean>} True if password matches
 */
async function verifyPassword(password, passwordHash) {
  try {
    return await bcrypt.compare(password, passwordHash);
  } catch (error) {
    throw new Error(`AuthService - verifyPassword failed: ${error.message}`);
  }
}

/**
 * Create new user (registration)
 * Business logic: hash password, then create user
 * @param {string} email - User email
 * @param {string} password - Plain text password
 * @returns {Promise<Object>} Created user object
 */
async function createUser(email, password) {
  try {
    // Business logic: hash the password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Data access: create user in repository
    const newUser = await UserRepository.create(email, passwordHash);

    return newUser;
  } catch (error) {
    throw new Error(`AuthService - createUser failed: ${error.message}`);
  }
}

module.exports = {
  getUserByEmail,
  verifyPassword,
  createUser,
};
