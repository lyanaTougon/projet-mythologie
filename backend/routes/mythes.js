const express = require("express");

const pool = require("../db");

const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/auth");

const router = express.Router();


/* ============================================================
   GET - TOUS LES MYTHES
   ============================================================ */

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        mythes.id,
        mythes.titre,
        mythes.description,
        mythes.image,
        mythes.created_at,
        civilisations.id AS civilisation_id,
        civilisations.nom AS civilisation,
        civilisations.slug AS civilisation_slug
      FROM mythes
      INNER JOIN civilisations
        ON mythes.civilisation_id = civilisations.id
      ORDER BY mythes.id ASC
    `);

    res.json({
      mythes: result.rows,
    });

  } catch (error) {
    console.error(
      "Erreur récupération mythes :",
      error
    );

    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
});


/* ============================================================
   GET - MYTHES D'UNE CIVILISATION
   ============================================================ */

router.get(
  "/civilisation/:slug",
  async (req, res) => {
    try {
      const { slug } = req.params;

      const result = await pool.query(
        `
        SELECT
          mythes.id,
          mythes.titre,
          mythes.description,
          mythes.image,
          mythes.created_at,
          civilisations.id AS civilisation_id,
          civilisations.nom AS civilisation,
          civilisations.slug AS civilisation_slug
        FROM mythes
        INNER JOIN civilisations
          ON mythes.civilisation_id = civilisations.id
        WHERE civilisations.slug = $1
        ORDER BY mythes.id ASC
        `,
        [slug]
      );

      res.json({
        mythes: result.rows,
      });

    } catch (error) {
      console.error(
        "Erreur récupération mythes :",
        error
      );

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


/* ============================================================
   POST - AJOUTER UN MYTHE
   ============================================================ */

router.post(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const {
        titre,
        description,
        image,
        civilisation_id,
      } = req.body;

      if (!titre || !civilisation_id) {
        return res.status(400).json({
          message:
            "Le titre et la civilisation sont obligatoires.",
        });
      }

      const civilisation = await pool.query(
        `
        SELECT id
        FROM civilisations
        WHERE id = $1
        `,
        [civilisation_id]
      );

      if (civilisation.rows.length === 0) {
        return res.status(404).json({
          message: "Civilisation introuvable.",
        });
      }

      const result = await pool.query(
        `
        INSERT INTO mythes
        (
          titre,
          description,
          image,
          civilisation_id
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          id,
          titre,
          description,
          image,
          civilisation_id,
          created_at
        `,
        [
          titre,
          description || null,
          image || null,
          civilisation_id,
        ]
      );

      res.status(201).json({
        message:
          "Mythe ou légende ajouté avec succès.",
        mythe: result.rows[0],
      });

    } catch (error) {
      console.error(
        "Erreur ajout mythe :",
        error
      );

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


/* ============================================================
   PUT - MODIFIER UN MYTHE
   ============================================================ */

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      const {
        titre,
        description,
        image,
        civilisation_id,
      } = req.body;

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          message: "ID invalide.",
        });
      }

      if (!titre || !civilisation_id) {
        return res.status(400).json({
          message:
            "Le titre et la civilisation sont obligatoires.",
        });
      }

      const civilisation = await pool.query(
        `
        SELECT id
        FROM civilisations
        WHERE id = $1
        `,
        [civilisation_id]
      );

      if (civilisation.rows.length === 0) {
        return res.status(404).json({
          message: "Civilisation introuvable.",
        });
      }

      const result = await pool.query(
        `
        UPDATE mythes
        SET
          titre = $1,
          description = $2,
          image = $3,
          civilisation_id = $4
        WHERE id = $5
        RETURNING
          id,
          titre,
          description,
          image,
          civilisation_id,
          created_at
        `,
        [
          titre,
          description || null,
          image || null,
          civilisation_id,
          id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Mythe ou légende introuvable.",
        });
      }

      res.json({
        message:
          "Mythe ou légende modifié avec succès.",
        mythe: result.rows[0],
      });

    } catch (error) {
      console.error(
        "Erreur modification mythe :",
        error
      );

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


/* ============================================================
   DELETE - SUPPRIMER UN MYTHE
   ============================================================ */

router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          message: "ID invalide.",
        });
      }

      const result = await pool.query(
        `
        DELETE FROM mythes
        WHERE id = $1
        RETURNING id, titre
        `,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Mythe ou légende introuvable.",
        });
      }

      res.json({
        message:
          "Mythe ou légende supprimé avec succès.",
        mythe: result.rows[0],
      });

    } catch (error) {
      console.error(
        "Erreur suppression mythe :",
        error
      );

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


module.exports = router;