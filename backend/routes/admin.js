const express = require("express");

const pool = require("../db");

const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/auth");

const router = express.Router();


// =========================================================
// STATISTIQUES ADMIN
// GET /api/admin/stats
// =========================================================

router.get(
  "/stats",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const result = await pool.query(
        "SELECT COUNT(*) FROM users"
      );

      res.json({
        totalUsers: Number(result.rows[0].count),
      });

    } catch (error) {
      console.error("Erreur statistiques :", error);

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


// =========================================================
// LISTE DES UTILISATEURS
// GET /api/admin/users
// =========================================================

router.get(
  "/users",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, username, email, role, created_at
         FROM users
         ORDER BY id ASC`
      );

      res.json({
        users: result.rows,
      });

    } catch (error) {
      console.error("Erreur utilisateurs :", error);

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


// =========================================================
// SUPPRIMER UN UTILISATEUR
// DELETE /api/admin/users/:id
// =========================================================

router.delete(
  "/users/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const userId = Number(req.params.id);

      // Vérifier que l'ID est valide
      if (!Number.isInteger(userId)) {
        return res.status(400).json({
          message: "ID utilisateur invalide.",
        });
      }

      // Empêcher l'admin de supprimer son propre compte
      if (userId === req.user.id) {
        return res.status(400).json({
          message: "Vous ne pouvez pas supprimer votre propre compte.",
        });
      }

      const result = await pool.query(
        `DELETE FROM users
         WHERE id = $1
         RETURNING id, username, email`,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Utilisateur introuvable.",
        });
      }

      res.json({
        message: "Utilisateur supprimé avec succès.",
        user: result.rows[0],
      });

    } catch (error) {
      console.error("Erreur suppression utilisateur :", error);

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


module.exports = router;