const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const civilisationsRoutes = require("./routes/civilisations");
const dieuxRoutes = require("./routes/dieux");
const herosRoutes = require("./routes/heros");
const mythesRoutes = require("./routes/mythes");

const app = express();


// ============================================================
// MIDDLEWARES
// ============================================================

app.use(cors());

app.use(express.json());


// ============================================================
// ROUTE PRINCIPALE
// ============================================================

app.get("/", (req, res) => {
  res.json({
    message: "API Mythologie fonctionne !",
  });
});


// ============================================================
// TEST POSTGRESQL
// ============================================================

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Connexion PostgreSQL réussie !",
      date: result.rows[0].now,
    });

  } catch (error) {
    console.error(
      "❌ Erreur PostgreSQL :",
      error
    );

    res.status(500).json({
      message: "Erreur de connexion à PostgreSQL",
    });
  }
});


// ============================================================
// ROUTES API
// ============================================================

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/civilisations", civilisationsRoutes);

app.use("/api/dieux", dieuxRoutes);

app.use("/api/heros", herosRoutes);

app.use("/api/mythes", mythesRoutes);


// ============================================================
// SERVEUR
// ============================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Serveur lancé sur http://localhost:${PORT}`
  );
});