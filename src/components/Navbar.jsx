import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">

      <Link to="/" className="navbar-logo">
        🏛️ Mythologie
      </Link>

      <div className="navbar-menu">

        <Link to="/civilisations" className="navbar-link">
          Civilisations
        </Link>

        <Link to="/dieux-deesses" className="navbar-link">
          Dieux & déesses
        </Link>

        <Link to="/heros-creatures" className="navbar-link">
          Héros & créatures
        </Link>

        <Link to="/mythes-legendes" className="navbar-link">
          Mythes & légendes
        </Link>

      </div>

      <Link to="/connexion" className="navbar-connexion">
        Se connecter
      </Link>

    </nav>
  );
}

export default Navbar;