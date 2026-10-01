import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./connexion.css";

const API_URL = "http://localhost:5000";

function Connexion() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
          "Erreur lors de la connexion."
        );
      }

      /*
       * Enregistrement du JWT
       */
      localStorage.setItem(
        "token",
        data.token
      );

      /*
       * Enregistrement des informations
       * de l'utilisateur
       */
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      setMessage(
        "Connexion réussie !"
      );

      /*
       * Si l'utilisateur est administrateur,
       * on l'envoie vers l'administration.
       *
       * Sinon, retour à l'accueil.
       */
      setTimeout(() => {

        if (data.user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

      }, 500);

    } catch (error) {

      console.error(
        "Erreur connexion :",
        error
      );

      setError(
        error.message ||
        "Impossible de se connecter."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="connexion-page">

      <div className="connexion-card">

        <div className="connexion-header">

          <div className="connexion-icon">
            🔐
          </div>

          <h1>
            Se connecter
          </h1>

          <p>
            Connectez-vous à votre compte
            Mythologie.
          </p>

        </div>


        {error && (
          <div className="connexion-message error">
            {error}
          </div>
        )}


        {message && (
          <div className="connexion-message success">
            {message}
          </div>
        )}


        <form
          className="connexion-form"
          onSubmit={handleSubmit}
        >

          <label htmlFor="email">
            Adresse email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="exemple@email.com"
            autoComplete="email"
            required
          />


          <label htmlFor="password">
            Mot de passe
          </label>

          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Votre mot de passe"
            autoComplete="current-password"
            required
          />


          <button
            type="submit"
            className="connexion-button"
            disabled={loading}
          >
            {loading
              ? "Connexion..."
              : "Se connecter"}
          </button>

        </form>

      </div>

    </main>
  );
}

export default Connexion;