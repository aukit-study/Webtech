const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcrypt');

const usersFilePath = path.resolve(__dirname, '..', 'data', 'users.json');

async function getUserByEmail(email) {
  const fileContent = await fs.readFile(usersFilePath, 'utf8');
  const users = JSON.parse(fileContent);
  return users.find((user) => user.email.toLowerCase() === String(email).toLowerCase());
}

async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

async function createUser(email, password, firstName) {
  const fileContent = await fs.readFile(usersFilePath, 'utf8');
  const users = JSON.parse(fileContent);

  const newId = (users.length + 1).toString();
  const passwordHash = await bcrypt.hash(password, 10);

  const newUser = {
    id: newId,
    email: email.toLowerCase(),
    passwordHash,
    firstName,
    registrationDate: new Date().toISOString().split('T')[0] // YYYY-MM-DD
  };

  users.push(newUser);
  await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2));

  return newUser;
}

module.exports = {
  getUserByEmail,
  verifyPassword,
  createUser,
};
