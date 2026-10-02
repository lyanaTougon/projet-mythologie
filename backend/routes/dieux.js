const express = require("express");
const router = express.Router();

const pool = require("../db");

const {
  authenticateToken,
  requireAdmin,
} = require("../middleware/auth");

/* ============================================================
   GET - TOUS LES DIEUX / DÉESSES
   ============================================================ */

router.get("/", async (req, res) => {
  try {
    const {
      civilisation,
      search,
    } = req.query;

    let query = `
      SELECT
        d.id,
        d.nom,
        d.description,
        d.image,
        d.civilisation_id,
        c.nom AS civilisation_nom,
        c.slug AS civilisation_slug
      FROM dieux d
      INNER JOIN civilisations c
        ON d.civilisation_id = c.id
    `;

    const conditions = [];
    const values = [];

    if (civilisation) {
      values.push(civilisation);

      conditions.push(
        `c.slug = $${values.length}`
      );
    }

    if (search) {
      values.push(`%${search}%`);

      conditions.push(`
        (
          d.nom ILIKE $${values.length}
          OR d.description ILIKE $${values.length}
        )
      `);
    }

    if (conditions.length > 0) {
      query += `
        WHERE ${conditions.join(" AND ")}
      `;
    }

    query += `
      ORDER BY d.id ASC
    `;

    const result = await pool.query(
      query,
      values
    );

    res.json({
      dieux: result.rows,
    });

  } catch (error) {
    console.error(
      "Erreur récupération dieux :",
      error
    );

    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
});


/* ============================================================
   GET - UN DIEU / UNE DÉESSE PAR ID
   ============================================================ */

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT
        d.id,
        d.nom,
        d.description,
        d.image,
        d.civilisation_id,
        c.nom AS civilisation_nom,
        c.slug AS civilisation_slug
      FROM dieux d
      INNER JOIN civilisations c
        ON d.civilisation_id = c.id
      WHERE d.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Dieu ou déesse introuvable.",
      });
    }

    res.json({
      dieu: result.rows[0],
    });

  } catch (error) {
    console.error(
      "Erreur récupération dieu :",
      error
    );

    res.status(500).json({
      message: "Erreur serveur.",
    });
  }
});


/* ============================================================
   POST - AJOUTER UN DIEU / UNE DÉESSE
   ADMIN UNIQUEMENT
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
          message:
            "Le nom et la civilisation sont obligatoires.",
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
        RETURNING *
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
      console.error(
        "Erreur ajout dieu :",
        error
      );

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


/* ============================================================
   PUT - MODIFIER UN DIEU / UNE DÉESSE
   ADMIN UNIQUEMENT
   ============================================================ */

router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const {
        nom,
        description,
        image,
        civilisation_id,
      } = req.body;

      if (!nom || !civilisation_id) {
        return res.status(400).json({
          message:
            "Le nom et la civilisation sont obligatoires.",
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
        RETURNING *
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
        message:
          "Dieu ou déesse modifié avec succès.",
        dieu: result.rows[0],
      });

    } catch (error) {
      console.error(
        "Erreur modification dieu :",
        error
      );

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


/* ============================================================
   DELETE - SUPPRIMER UN DIEU / UNE DÉESSE
   ADMIN UNIQUEMENT
   ============================================================ */

router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await pool.query(
        `
        DELETE FROM dieux
        WHERE id = $1
        RETURNING *
        `,
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: "Dieu ou déesse introuvable.",
        });
      }

      res.json({
        message:
          "Dieu ou déesse supprimé avec succès.",
      });

    } catch (error) {
      console.error(
        "Erreur suppression dieu :",
        error
      );

      res.status(500).json({
        message: "Erreur serveur.",
      });
    }
  }
);


module.exports = router;