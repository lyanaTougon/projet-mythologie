const express = require("express");
const router = express.Router();

const pool = require("../db");

const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/auth");


// ============================================================
// GET — TOUS LES MYTHES
// ============================================================

router.get("/", async (req, res) => {
  try {
    const {
      civilisation,
      search,
    } = req.query;

    let query = `
      SELECT
        mythes.id,
        mythes.titre,
        mythes.description,
        mythes.image,
        mythes.civilisation_id,
        mythes.created_at,
        civilisations.nom AS civilisation_nom,
        civilisations.slug AS civilisation_slug

      FROM mythes

      INNER JOIN civilisations
        ON mythes.civilisation_id =
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
          mythes.titre ILIKE $${values.length}
          OR mythes.description ILIKE $${values.length}
        )
      `);
    }

    if (conditions.length > 0) {
      query += `
        WHERE ${conditions.join(" AND ")}
      `;
    }

    query += `
      ORDER BY mythes.id ASC
    `;

    const result = await pool.query(
      query,
      values
    );

    res.json({
      mythes: result.rows,
    });

  } catch (error) {
    console.error(
      "❌ Erreur récupération mythes :",
      error
    );

    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
});


// ============================================================
// GET — UN MYTHE
// ============================================================

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        mythes.id,
        mythes.titre,
        mythes.description,
        mythes.image,
        mythes.civilisation_id,
        mythes.created_at,
        civilisations.nom AS civilisation_nom,
        civilisations.slug AS civilisation_slug

      FROM mythes

      INNER JOIN civilisations
        ON mythes.civilisation_id =
           civilisations.id

      WHERE mythes.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Mythe introuvable.",
      });
    }

    res.json({
      mythe: result.rows[0],
    });

  } catch (error) {
    console.error(
      "❌ Erreur récupération mythe :",
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

      const result = await pool.query(
        `
        INSERT INTO mythes
        (
          titre,
          description,
          image,
          civilisation_id
        )

        VALUES
        ($1, $2, $3, $4)

        RETURNING *
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
          "Mythe ajouté avec succès.",
        mythe: result.rows[0],
      });

    } catch (error) {
      console.error(
        "❌ Erreur ajout mythe :",
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
        titre,
        description,
        image,
        civilisation_id,
      } = req.body;

      const result = await pool.query(
        `
        UPDATE mythes

        SET
          titre = $1,
          description = $2,
          image = $3,
          civilisation_id = $4

        WHERE id = $5

        RETURNING *
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
          message: "Mythe introuvable.",
        });
      }

      res.json({
        message:
          "Mythe modifié avec succès.",
        mythe: result.rows[0],
      });

    } catch (error) {
      console.error(
        "❌ Erreur modification mythe :",
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
        DELETE FROM mythes
        WHERE id = $1
        RETURNING *
        `,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Mythe introuvable.",
        });
      }

      res.json({
        message:
          "Mythe supprimé avec succès.",
      });

    } catch (error) {
      console.error(
        "❌ Erreur suppression mythe :",
        error
      );

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


module.exports = router;