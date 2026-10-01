const express = require("express");

const pool = require("../db");

const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/auth");

const router = express.Router();


/* ============================================================
   GET - TOUS LES HÉROS ET CRÉATURES
   ============================================================ */

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        heros_creatures.id,
        heros_creatures.nom,
        heros_creatures.type,
        heros_creatures.description,
        heros_creatures.image,
        heros_creatures.created_at,
        civilisations.id AS civilisation_id,
        civilisations.nom AS civilisation,
        civilisations.slug AS civilisation_slug
      FROM heros_creatures
      INNER JOIN civilisations
        ON heros_creatures.civilisation_id = civilisations.id
      ORDER BY heros_creatures.id ASC
    `);

    res.json({
      heros: result.rows,
    });

  } catch (error) {
    console.error(
      "Erreur récupération héros/créatures :",
      error
    );

    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
});


/* ============================================================
   GET - HÉROS / CRÉATURES D'UNE CIVILISATION
   ============================================================ */

router.get(
  "/civilisation/:slug",
  async (req, res) => {
    try {
      const { slug } = req.params;

      const result = await pool.query(
        `
        SELECT
          heros_creatures.id,
          heros_creatures.nom,
          heros_creatures.type,
          heros_creatures.description,
          heros_creatures.image,
          heros_creatures.created_at,
          civilisations.id AS civilisation_id,
          civilisations.nom AS civilisation,
          civilisations.slug AS civilisation_slug
        FROM heros_creatures
        INNER JOIN civilisations
          ON heros_creatures.civilisation_id = civilisations.id
        WHERE civilisations.slug = $1
        ORDER BY heros_creatures.id ASC
        `,
        [slug]
      );

      res.json({
        heros: result.rows,
      });

    } catch (error) {
      console.error(
        "Erreur récupération héros/créatures :",
        error
      );

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


/* ============================================================
   POST - AJOUTER UN HÉROS / UNE CRÉATURE
   ============================================================ */

router.post(
  "/",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const {
        nom,
        type,
        description,
        image,
        civilisation_id,
      } = req.body;

      if (!nom || !type || !civilisation_id) {
        return res.status(400).json({
          message:
            "Le nom, le type et la civilisation sont obligatoires.",
        });
      }

      const typesAutorises = [
        "héros",
        "créature",
      ];

      const typeNormalise = type.toLowerCase();

      if (!typesAutorises.includes(typeNormalise)) {
        return res.status(400).json({
          message:
            "Le type doit être 'héros' ou 'créature'.",
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
        INSERT INTO heros_creatures
        (
          nom,
          type,
          description,
          image,
          civilisation_id
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
          id,
          nom,
          type,
          description,
          image,
          civilisation_id,
          created_at
        `,
        [
          nom,
          typeNormalise,
          description || null,
          image || null,
          civilisation_id,
        ]
      );

      res.status(201).json({
        message:
          "Héros ou créature ajouté avec succès.",
        heros: result.rows[0],
      });

    } catch (error) {
      console.error(
        "Erreur ajout héros/créature :",
        error
      );

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


/* ============================================================
   PUT - MODIFIER UN HÉROS / UNE CRÉATURE
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
        type,
        description,
        image,
        civilisation_id,
      } = req.body;

      if (!Number.isInteger(id)) {
        return res.status(400).json({
          message: "ID invalide.",
        });
      }

      if (!nom || !type || !civilisation_id) {
        return res.status(400).json({
          message:
            "Le nom, le type et la civilisation sont obligatoires.",
        });
      }

      const typesAutorises = [
        "héros",
        "créature",
      ];

      const typeNormalise = type.toLowerCase();

      if (!typesAutorises.includes(typeNormalise)) {
        return res.status(400).json({
          message:
            "Le type doit être 'héros' ou 'créature'.",
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
        UPDATE heros_creatures
        SET
          nom = $1,
          type = $2,
          description = $3,
          image = $4,
          civilisation_id = $5
        WHERE id = $6
        RETURNING
          id,
          nom,
          type,
          description,
          image,
          civilisation_id,
          created_at
        `,
        [
          nom,
          typeNormalise,
          description || null,
          image || null,
          civilisation_id,
          id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Héros ou créature introuvable.",
        });
      }

      res.json({
        message:
          "Héros ou créature modifié avec succès.",
        heros: result.rows[0],
      });

    } catch (error) {
      console.error(
        "Erreur modification héros/créature :",
        error
      );

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


/* ============================================================
   DELETE - SUPPRIMER UN HÉROS / UNE CRÉATURE
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
        DELETE FROM heros_creatures
        WHERE id = $1
        RETURNING id, nom, type
        `,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Héros ou créature introuvable.",
        });
      }

      res.json({
        message:
          "Héros ou créature supprimé avec succès.",
        heros: result.rows[0],
      });

    } catch (error) {
      console.error(
        "Erreur suppression héros/créature :",
        error
      );

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


module.exports = router;