import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import App from "./App.jsx";
import Navbar from "./components/Navbar.jsx";

import Civilisations from "./Pages/civilisations/civilisations.jsx";
import DieuxDeesses from "./Pages/dieux-deesses.jsx";
import HerosCreatures from "./Pages/heros-creatures.jsx";
import MythesLegendes from "./Pages/mythes-legendes.jsx";
import Connexion from "./Pages/connexion.jsx";
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

        {/* DIEUX & DÉESSES */}
        <Route
          path="/dieux-deesses"
          element={<DieuxDeesses />}
        />

        {/* HÉROS & CRÉATURES */}
        <Route
          path="/heros-creatures"
          element={<HerosCreatures />}
        />

        {/* MYTHES & LÉGENDES */}
        <Route
          path="/mythes-legendes"
          element={<MythesLegendes />}
        />

        {/* CONNEXION */}
        <Route
          path="/connexion"
          element={<Connexion />}
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