const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("../db");

const router = express.Router();


// =========================================================
// INSCRIPTION
// POST /api/auth/register
// =========================================================

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Vérification des champs
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Tous les champs sont obligatoires.",
      });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await pool.query(
      "SELECT id FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Le nom d'utilisateur ou l'email existe déjà.",
      });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const result = await pool.query(
      `INSERT INTO users (username, email, password, role)
       VALUES ($1, $2, $3, 'user')
       RETURNING id, username, email, role, created_at`,
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: "Compte créé avec succès.",
      user: result.rows[0],
    });

  } catch (error) {
    console.error("Erreur inscription :", error);

    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
});


// =========================================================
// CONNEXION
// POST /api/auth/login
// =========================================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification des champs
    if (!email || !password) {
      return res.status(400).json({
        message: "L'email et le mot de passe sont obligatoires.",
      });
    }

    // Recherche de l'utilisateur
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect.",
      });
    }

    const user = result.rows[0];

    // Vérification du mot de passe
    const passwordIsValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect.",
      });
    }

    // Création du JWT
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    res.json({
      message: "Connexion réussie.",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.error("Erreur connexion :", error);

    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
});


module.exports = router;