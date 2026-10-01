const jwt = require("jsonwebtoken");


// =========================================================
// VÉRIFIER LE TOKEN JWT
// =========================================================

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: "Token manquant.",
    });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      message: "Format du token invalide.",
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(403).json({
      message: "Token invalide ou expiré.",
    });
  }
}


// =========================================================
// VÉRIFIER LE RÔLE ADMIN
// =========================================================

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      message: "Utilisateur non authentifié.",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Accès réservé aux administrateurs.",
    });
  }

  next();
}


module.exports = {
  authenticateToken,
  requireAdmin,
};