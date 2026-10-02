const express = require("express");
const router = express.Router();

const pool = require("../db");


// ============================================================
// GET — TOUTES LES CIVILISATIONS
// ============================================================

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        nom,
        slug
      FROM civilisations
      ORDER BY id ASC
    `);

    res.json({
      civilisations: result.rows,
    });

  } catch (error) {
    console.error(
      "❌ Erreur récupération civilisations :",
      error
    );

    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
});


// ============================================================
// GET — UNE CIVILISATION PAR SLUG
// ============================================================

router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `
      SELECT
        id,
        nom,
        slug
      FROM civilisations
      WHERE slug = $1
      `,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Civilisation introuvable.",
      });
    }

    res.json({
      civilisation: result.rows[0],
    });

  } catch (error) {
    console.error(
      "❌ Erreur récupération civilisation :",
      error
    );

    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
});


module.exports = router;