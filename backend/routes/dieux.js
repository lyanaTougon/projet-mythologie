const express = require("express");

const pool = require("../db");

const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/auth");

const router = express.Router();

/* ============================================================
   GET - TOUS LES DIEUX ET DÉESSES
   ============================================================ */

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        dieux.id,
        dieux.nom,
        dieux.description,
        dieux.image,
        dieux.created_at,
        civilisations.id AS civilisation_id,
        civilisations.nom AS civilisation,
        civilisations.slug AS civilisation_slug
      FROM dieux
      INNER JOIN civilisations
        ON dieux.civilisation_id = civilisations.id
      ORDER BY dieux.id ASC
    `);

    res.json({
      dieux: result.rows,
    });

  } catch (error) {
    console.error("Erreur récupération dieux :", error);

    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
});


/* ============================================================
   GET - DIEUX D'UNE CIVILISATION
   ============================================================ */

router.get("/civilisation/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `
      SELECT
        dieux.id,
        dieux.nom,
        dieux.description,
        dieux.image,
        dieux.created_at,
        civilisations.id AS civilisation_id,
        civilisations.nom AS civilisation,
        civilisations.slug AS civilisation_slug
      FROM dieux
      INNER JOIN civilisations
        ON dieux.civilisation_id = civilisations.id
      WHERE civilisations.slug = $1
      ORDER BY dieux.id ASC
      `,
      [slug]
    );

    res.json({
      dieux: result.rows,
    });

  } catch (error) {
    console.error("Erreur récupération dieux :", error);

    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
});


/* ============================================================
   POST - AJOUTER UN DIEU / UNE DÉESSE
   ============================================================ */

router.post(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const {
        nom,
        description,
        image,
        civilisation_id,
      } = req.body;

      if (!nom || !civilisation_id) {
        return res.status(400).json({
          message: "Le nom et la civilisation sont obligatoires.",
        });
      }

      const civilisation = await pool.query(
        "SELECT id FROM civilisations WHERE id = $1",
        [civilisation_id]
      );

      if (civilisation.rows.length === 0) {
        return res.status(404).json({
          message: "Civilisation introuvable.",
        });
      }

      const result = await pool.query(
        `
        INSERT INTO dieux
        (
          nom,
          description,
          image,
          civilisation_id
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          id,
          nom,
          description,
          image,
          civilisation_id,
          created_at
        `,
        [
          nom,
          description || null,
          image || null,
          civilisation_id,
        ]
      );

      res.status(201).json({
        message: "Dieu ou déesse ajouté avec succès.",
        dieu: result.rows[0],
      });

    } catch (error) {
      console.error("Erreur ajout dieu :", error);

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


/* ============================================================
   PUT - MODIFIER UN DIEU / UNE DÉESSE
   ============================================================ */

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      const {
        nom,
        description,
        image,
        civilisation_id,
      } = req.body;

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          message: "ID invalide.",
        });
      }

      if (!nom || !civilisation_id) {
        return res.status(400).json({
          message: "Le nom et la civilisation sont obligatoires.",
        });
      }

      const civilisation = await pool.query(
        "SELECT id FROM civilisations WHERE id = $1",
        [civilisation_id]
      );

      if (civilisation.rows.length === 0) {
        return res.status(404).json({
          message: "Civilisation introuvable.",
        });
      }

      const result = await pool.query(
        `
        UPDATE dieux
        SET
          nom = $1,
          description = $2,
          image = $3,
          civilisation_id = $4
        WHERE id = $5
        RETURNING
          id,
          nom,
          description,
          image,
          civilisation_id,
          created_at
        `,
        [
          nom,
          description || null,
          image || null,
          civilisation_id,
          id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Dieu ou déesse introuvable.",
        });
      }

      res.json({
        message: "Dieu ou déesse modifié avec succès.",
        dieu: result.rows[0],
      });

    } catch (error) {
      console.error("Erreur modification dieu :", error);

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


/* ============================================================
   DELETE - SUPPRIMER UN DIEU / UNE DÉESSE
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
        DELETE FROM dieux
        WHERE id = $1
        RETURNING id, nom
        `,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Dieu ou déesse introuvable.",
        });
      }

      res.json({
        message: "Dieu ou déesse supprimé avec succès.",
        dieu: result.rows[0],
      });

    } catch (error) {
      console.error("Erreur suppression dieu :", error);

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


module.exports = router;