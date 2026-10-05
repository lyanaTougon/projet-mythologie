import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (error) {
          console.error("Erreur utilisateur :", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();

    window.addEventListener("authChanged", checkUser);
    window.addEventListener("storage", checkUser);

    return () => {
      window.removeEventListener("authChanged", checkUser);
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  const accountLink =
    user?.role === "admin"
      ? "/admin"
      : "/compte";

  return (
    <nav className="navbar">

      <Link to="/" className="navbar-logo">
        🏛️ Mythologie
      </Link>

      <div className="navbar-menu">

        <div className="navbar-dropdown">

          <button className="navbar-dropdown-button">
            Civilisations
            <span className="arrow">▼</span>
          </button>

          <div className="dropdown-menu">

            <Link
              to="/civilisations/azteque"
              className="dropdown-link"
            >
              🌞 Mythologie aztèque
            </Link>

            <Link
              to="/civilisations/japonaise"
              className="dropdown-link"
            >
              ⛩️ Mythologie japonaise
            </Link>

            <Link
              to="/civilisations/nordique"
              className="dropdown-link"
            >
              ⚔️ Mythologie nordique
            </Link>

            <Link
              to="/civilisations/egyptienne"
              className="dropdown-link"
            >
              🏺 Mythologie égyptienne
            </Link>

          </div>
        </div>

        <Link
          to="/dieux-deesses"
          className="navbar-link"
        >
          Dieux & déesses
        </Link>

        <Link
          to="/heros-creatures"
          className="navbar-link"
        >
          Héros & créatures
        </Link>

        <Link
          to="/mythes-legendes"
          className="navbar-link"
        >
          Mythes & légendes
        </Link>

      </div>

      {user ? (
        <Link
          to={accountLink}
          className="navbar-connexion"
        >
          Mon compte
        </Link>
      ) : (
        <Link
          to="/connexion"
          className="navbar-connexion"
        >
          Se connecter
        </Link>
      )}

    </nav>
  );
}

export default Navbar;