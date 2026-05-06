const bcrypt = require('bcrypt');
const { getOne, runQuery } = require('../db');

// Get user by email
async function getUserByEmail(email) {
  try {
    const user = await getOne(
      'SELECT id, email, password, created_at FROM users WHERE email = ?',
      [email.toLowerCase()]
    );
    return user;
  } catch (error) {
    throw new Error(`Failed to get user: ${error.message}`);
  }
}

// Verify password
async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

// Create new user
async function createUser(email, password) {
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await runQuery(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email.toLowerCase(), passwordHash]
    );

    const newUser = {
      id: result.id,
      email: email.toLowerCase(),
      created_at: new Date().toISOString()
    };

    return newUser;
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
}

module.exports = {
  getUserByEmail,
  verifyPassword,
  createUser,
};
