import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./detail.css";

const API_URL = "http://localhost:5000";

function DieuDetail() {
  const { id } = useParams();

  const [dieu, setDieu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const chargerDieu = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/dieux/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Dieu ou déesse introuvable."
          );
        }

        setDieu(data.dieu);

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

    chargerDieu();
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

  if (error || !dieu) {
    return (
      <main className="detail-page">
        <div className="detail-message">
          <h1>Une erreur est survenue</h1>

          <p>
            {error ||
              "Dieu ou déesse introuvable."}
          </p>

          <Link
            to="/dieux-deesses"
            className="detail-back-button"
          >
            ← Retour aux dieux & déesses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="detail-page">

      <Link
        to={`/dieux-deesses?civilisation=${dieu.civilisation_slug}`}
        className="detail-back-link"
      >
        ← Retour aux dieux & déesses
      </Link>

      <section className="detail-card">

        <div className="detail-image-container">

          {dieu.image ? (
            <img
              src={dieu.image}
              alt={dieu.nom}
              className="detail-image"
            />
          ) : (
            <div className="detail-image-placeholder">
              ⚜
            </div>
          )}

        </div>

        <div className="detail-content">

          <p className="detail-label">
            DIVINITÉ
          </p>

          <h1>
            {dieu.nom}
          </h1>

          <span className="detail-civilisation">
            {dieu.civilisation_nom}
          </span>

          <div className="detail-separator" />

          <p className="detail-description">
            {dieu.description ||
              "Aucune description disponible."}
          </p>

        </div>

      </section>

    </main>
  );
}

export default DieuDetail;
