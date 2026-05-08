const { runQuery, getOne } = require('../db');

/**
 * UserRepository - Handles all database operations for Users
 * Pure data access layer - no business logic here
 */
class UserRepository {
  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object or null
   */
  async findByEmail(email) {
    try {
      const user = await getOne(
        'SELECT id, email, password, created_at FROM users WHERE email = ?',
        [email.toLowerCase()]
      );
      return user;
    } catch (error) {
      throw new Error(`Repository error - findByEmail: ${error.message}`);
    }
  }

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} User object or null
   */
  async findById(id) {
    try {
      const user = await getOne(
        'SELECT id, email, created_at FROM users WHERE id = ?',
        [id]
      );
      return user;
    } catch (error) {
      throw new Error(`Repository error - findById: ${error.message}`);
    }
  }

  /**
   * Create new user
   * @param {string} email - User email
   * @param {string} hashedPassword - Already hashed password
   * @returns {Promise<Object>} Created user object with ID
   */
  async create(email, hashedPassword) {
    try {
      const result = await runQuery(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email.toLowerCase(), hashedPassword]
      );

      return {
        id: result.id,
        email: email.toLowerCase(),
        created_at: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Repository error - create: ${error.message}`);
    }
  }

  /**
   * Get user by email without password hash
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User object without password
   */
  async getUserByEmail(email) {
    try {
      const user = await getOne(
        'SELECT id, email, password, created_at FROM users WHERE email = ?',
        [email.toLowerCase()]
      );
      return user;
    } catch (error) {
      throw new Error(`Repository error - getUserByEmail: ${error.message}`);
    }
  }
}

module.exports = new UserRepository();
