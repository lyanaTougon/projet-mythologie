import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./connexion.css";

function Connexion() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Email ou mot de passe incorrect.");
        setLoading(false);
        return;
      }

      // Enregistrement de la connexion
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Préviens la Navbar que l'utilisateur est connecté
      window.dispatchEvent(new Event("authChanged"));

      // Si admin → page admin
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        // Sinon → accueil
        navigate("/");
      }

    } catch (error) {
      console.error("Erreur connexion :", error);
      setMessage("Impossible de contacter le serveur.");
    }

    setLoading(false);
  };

  return (
    <div className="connexion-page">

      <div className="connexion-card">

        <h1>Connexion</h1>

        <p className="connexion-subtitle">
          Connectez-vous à votre compte
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="email">
              Adresse email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Mot de passe
            </label>

            <input
              id="password"
              type="password"
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <p className="connexion-message">
              {message}
            </p>
          )}

          <button
            type="submit"
            className="connexion-button"
            disabled={loading}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Connexion;