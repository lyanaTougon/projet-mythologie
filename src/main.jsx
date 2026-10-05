import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import App from "./App.jsx";
import Navbar from "./components/Navbar.jsx";

import Civilisations from "./Pages/civilisations/civilisations.jsx";
import DieuxDeesses from "./Pages/dieux-deesses.jsx";
import HerosCreatures from "./Pages/heros-creatures.jsx";
import MythesLegendes from "./Pages/mythes-legendes.jsx";

import DieuDetail from "./Pages/dieu-detail.jsx";
import HeroDetail from "./Pages/hero-detail.jsx";
import MytheDetail from "./Pages/mythe-detail.jsx";

import Connexion from "./Pages/connexion.jsx";
import Compte from "./Pages/compte.jsx";
import Admin from "./Pages/admin.jsx";

import "./index.css";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Navbar />

      <Routes>

        {/* ACCUEIL */}
        <Route
          path="/"
          element={<App />}
        />

        {/* CIVILISATIONS */}
        <Route
          path="/civilisations"
          element={<Civilisations />}
        />

        <Route
          path="/civilisations/:slug"
          element={<Civilisations />}
        />

        {/* DIEUX */}
        <Route
          path="/dieux-deesses"
          element={<DieuxDeesses />}
        />

        <Route
          path="/dieux-deesses/:id"
          element={<DieuDetail />}
        />

        {/* HÉROS & CRÉATURES */}
        <Route
          path="/heros-creatures"
          element={<HerosCreatures />}
        />

        <Route
          path="/heros-creatures/:id"
          element={<HeroDetail />}
        />

        {/* MYTHES */}
        <Route
          path="/mythes-legendes"
          element={<MythesLegendes />}
        />

        <Route
          path="/mythes-legendes/:id"
          element={<MytheDetail />}
        />

        {/* CONNEXION */}
        <Route
          path="/connexion"
          element={<Connexion />}
        />

        {/* MON COMPTE */}
        <Route
          path="/compte"
          element={<Compte />}
        />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={<Admin />}
        />

      </Routes>
    </BrowserRouter>
  </StrictMode>
);