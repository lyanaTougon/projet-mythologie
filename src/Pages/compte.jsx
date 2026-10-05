import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./compte.css";

function Compte() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/connexion");
      return;
    }

    try {
      setUser(JSON.parse(savedUser));
    } catch (error) {
      console.error("Erreur utilisateur :", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/connexion");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.dispatchEvent(new Event("authChanged"));

    navigate("/connexion");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="compte-page">
      <div className="compte-card">

        <div className="compte-icon">
          👤
        </div>

        <h1>Mon compte</h1>

        <p className="compte-subtitle">
          Bienvenue {user.username} !
        </p>

        <div className="compte-informations">

          <div className="compte-info">
            <span>👤 Nom d'utilisateur</span>
            <strong>{user.username}</strong>
          </div>

          <div className="compte-info">
            <span>📧 Adresse email</span>
            <strong>{user.email}</strong>
          </div>

          <div className="compte-info">
            <span>🔑 Rôle</span>
            <strong>
              {user.role === "admin"
                ? "Administrateur"
                : "Utilisateur"}
            </strong>
          </div>

        </div>

        {user.role === "admin" && (
          <button
            className="compte-admin-button"
            onClick={() => navigate("/admin")}
          >
            👑 Administration
          </button>
        )}

        <button
          className="compte-logout-button"
          onClick={handleLogout}
        >
          🚪 Se déconnecter
        </button>

      </div>
    </div>
  );
}

export default Compte;