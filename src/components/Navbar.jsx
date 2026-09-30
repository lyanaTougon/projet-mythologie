import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      {/* LOGO */}
      <Link to="/" className="navbar-logo">
        🏛️ Mythologie
      </Link>

      {/* MENU */}
      <div className="navbar-menu">

        {/* CIVILISATIONS */}
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

        {/* DIEUX & DÉESSES */}
        <Link
          to="/dieux-deesses"
          className="navbar-link"
        >
          Dieux & déesses
        </Link>

        {/* HÉROS & CRÉATURES */}
        <Link
          to="/heros-creatures"
          className="navbar-link"
        >
          Héros & créatures
        </Link>

        {/* MYTHES & LÉGENDES */}
        <Link
          to="/mythes-legendes"
          className="navbar-link"
        >
          Mythes & légendes
        </Link>

      </div>

      {/* CONNEXION */}
      <Link
        to="/connexion"
        className="navbar-connexion"
      >
        Se connecter
      </Link>

    </nav>
  );
}

export default Navbar;