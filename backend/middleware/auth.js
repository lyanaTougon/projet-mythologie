const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) {
  next();
}

function requireAdmin(req, res, next) {
  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
};