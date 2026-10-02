const express = require("express");
const router = express.Router();

const pool = require("../db");

const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/auth");


// ============================================================
// GET — HÉROS & CRÉATURES
// ============================================================

router.get("/", async (req, res) => {
  try {
    const {
      civilisation,
      search,
      type,
    } = req.query;

    let query = `
      SELECT
        heros_creatures.id,
        heros_creatures.nom,
        heros_creatures.type,
        heros_creatures.description,
        heros_creatures.image,
        heros_creatures.civilisation_id,
        heros_creatures.created_at,
        civilisations.nom AS civilisation_nom,
        civilisations.slug AS civilisation_slug

      FROM heros_creatures

      INNER JOIN civilisations
        ON heros_creatures.civilisation_id =
           civilisations.id
    `;

    const conditions = [];
    const values = [];

    // ----------------------------------------------------------
    // CIVILISATION
    // ----------------------------------------------------------

    if (civilisation) {
      values.push(civilisation);

      conditions.push(
        `civilisations.slug = $${values.length}`
      );
    }

    // ----------------------------------------------------------
    // RECHERCHE
    // ----------------------------------------------------------

    if (search) {
      values.push(`%${search}%`);

      conditions.push(`
        (
          heros_creatures.nom ILIKE $${values.length}
          OR heros_creatures.description ILIKE $${values.length}
        )
      `);
    }

    // ----------------------------------------------------------
    // TYPE
    // ----------------------------------------------------------

    if (type) {
      values.push(type);

      conditions.push(
        `heros_creatures.type = $${values.length}`
      );
    }

    // ----------------------------------------------------------
    // WHERE
    // ----------------------------------------------------------

    if (conditions.length > 0) {
      query += `
        WHERE ${conditions.join(" AND ")}
      `;
    }

    query += `
      ORDER BY heros_creatures.id ASC
    `;

    const result = await pool.query(
      query,
      values
    );

    res.json({
      heros: result.rows,
    });

  } catch (error) {
    console.error(
      "❌ Erreur récupération héros/créatures :",
      error
    );

    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
});


// ============================================================
// GET — UN HÉROS / UNE CRÉATURE
// ============================================================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        heros_creatures.id,
        heros_creatures.nom,
        heros_creatures.type,
        heros_creatures.description,
        heros_creatures.image,
        heros_creatures.civilisation_id,
        heros_creatures.created_at,
        civilisations.nom AS civilisation_nom,
        civilisations.slug AS civilisation_slug

      FROM heros_creatures

      INNER JOIN civilisations
        ON heros_creatures.civilisation_id =
           civilisations.id

      WHERE heros_creatures.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message:
          "Héros ou créature introuvable.",
      });
    }

    res.json({
      hero: result.rows[0],
    });

  } catch (error) {
    console.error(
      "❌ Erreur récupération héros/créature :",
      error
    );

    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
});


// ============================================================
// POST
// ============================================================

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

      if (
        !nom ||
        !type ||
        !civilisation_id
      ) {
        return res.status(400).json({
          message:
            "Le nom, le type et la civilisation sont obligatoires.",
        });
      }

      if (
        type !== "héros" &&
        type !== "créature"
      ) {
        return res.status(400).json({
          message:
            "Le type doit être héros ou créature.",
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

        VALUES
        ($1, $2, $3, $4, $5)

        RETURNING *
        `,
        [
          nom,
          type,
          description || null,
          image || null,
          civilisation_id,
        ]
      );

      res.status(201).json({
        message:
          "Héros/créature ajouté avec succès.",
        hero: result.rows[0],
      });

    } catch (error) {
      console.error(
        "❌ Erreur ajout héros/créature :",
        error
      );

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


// ============================================================
// PUT
// ============================================================

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {

    try {
      const { id } = req.params;

      const {
        nom,
        type,
        description,
        image,
        civilisation_id,
      } = req.body;

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

        RETURNING *
        `,
        [
          nom,
          type,
          description || null,
          image || null,
          civilisation_id,
          id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message:
            "Héros ou créature introuvable.",
        });
      }

      res.json({
        message:
          "Héros/créature modifié avec succès.",
        hero: result.rows[0],
      });

    } catch (error) {
      console.error(
        "❌ Erreur modification héros/créature :",
        error
      );

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


// ============================================================
// DELETE
// ============================================================

router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {

    try {
      const { id } = req.params;

      const result = await pool.query(
        `
        DELETE FROM heros_creatures
        WHERE id = $1
        RETURNING *
        `,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message:
            "Héros ou créature introuvable.",
        });
      }

      res.json({
        message:
          "Héros/créature supprimé avec succès.",
      });

    } catch (error) {
      console.error(
        "❌ Erreur suppression héros/créature :",
        error
      );

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


module.exports = router;