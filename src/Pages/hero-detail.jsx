import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./detail.css";

const API_URL = "http://localhost:5000";

function HeroDetail() {
  const { id } = useParams();

  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const chargerHero = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/heros/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Héros ou créature introuvable."
          );
        }

        setHero(data.hero);

      } catch (error) {
        console.error(error);

        setError(
          error.message ||
            "Une erreur est survenue."
        );
      } finally {
        setLoading(false);
      }
    };

    chargerHero();
  }, [id]);

  if (loading) {
    return (
      <main className="detail-page">
        <div className="detail-message">
          Chargement...
        </div>
      </main>
    );
  }

  if (error || !hero) {
    return (
      <main className="detail-page">
        <div className="detail-message">

          <h1>
            Une erreur est survenue
          </h1>

          <p>
            {error ||
              "Héros ou créature introuvable."}
          </p>

          <Link
            to="/heros-creatures"
            className="detail-back-button"
          >
            ← Retour aux héros & créatures
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="detail-page">

      <Link
        to={`/heros-creatures?civilisation=${hero.civilisation_slug}`}
        className="detail-back-link"
      >
        ← Retour aux héros & créatures
      </Link>

      <section className="detail-card">

        <div className="detail-image-container">

          {hero.image ? (
            <img
              src={hero.image}
              alt={hero.nom}
              className="detail-image"
            />
          ) : (
            <div className="detail-image-placeholder">
              ⚔
            </div>
          )}

        </div>

        <div className="detail-content">

          <p className="detail-label">
            {hero.type === "créature"
              ? "CRÉATURE"
              : "HÉROS"}
          </p>

          <h1>
            {hero.nom}
          </h1>

          <span className="detail-civilisation">
            {hero.civilisation_nom}
          </span>

          <div className="detail-separator" />

          <p className="detail-description">
            {hero.description ||
              "Aucune description disponible."}
          </p>

        </div>

      </section>

    </main>
  );
}

export default HeroDetail;