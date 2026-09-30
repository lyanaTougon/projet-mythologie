import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import App from "./App.jsx";
import Navbar from "./components/Navbar.jsx";

import Civilisations from "./Pages/civilisations.jsx";
import DieuxDeesses from "./Pages/dieux-deesses.jsx";
import HerosCreatures from "./Pages/heros-creatures.jsx";
import MythesLegendes from "./Pages/mythes-legendes.jsx";
import Connexion from "./Pages/connexion.jsx";

import "./index.css";
import "./App.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route path="/" element={<App />} />

        <Route
          path="/civilisations"
          element={<Civilisations />}
        />

        <Route
          path="/dieux-deesses"
          element={<DieuxDeesses />}
        />

        <Route
          path="/heros-creatures"
          element={<HerosCreatures />}
        />

        <Route
          path="/mythes-legendes"
          element={<MythesLegendes />}
        />

        <Route
          path="/connexion"
          element={<Connexion />}
        />

      </Routes>

    </BrowserRouter>
  </StrictMode>
);