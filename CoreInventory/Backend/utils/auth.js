const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
};

const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const verifyPassword = (password, hash) => {
  return hashPassword(password) === hash;
};

module.exports = { generateToken, hashPassword, verifyPassword };
