import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./detail.css";

const API_URL = "http://localhost:5000";

function MytheDetail() {
  const { id } = useParams();

  const [mythe, setMythe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [imageActuelle, setImageActuelle] = useState(0);

  useEffect(() => {
    const chargerMythe = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/mythes/${id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Mythe ou légende introuvable."
          );
        }

        setMythe(data.mythe);
      } catch (error) {
        console.error(error);

        setError(
          error.message || "Une erreur est survenue."
        );
      } finally {
        setLoading(false);
      }
    };

    chargerMythe();
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

  if (error || !mythe) {
    return (
      <main className="detail-page">
        <div className="detail-message">

          <h1>Une erreur est survenue</h1>

          <p>
            {error ||
              "Mythe ou légende introuvable."}
          </p>

          <Link
            to="/mythes-legendes"
            className="detail-back-button"
          >
            ← Retour aux mythes & légendes
          </Link>

        </div>
      </main>
    );
  }

  const images = [
    mythe.image,
    mythe.image2,
    mythe.image3,
  ].filter(Boolean);

  const imageSuivante = () => {
    if (images.length === 0) return;

    setImageActuelle((ancienneImage) =>
      ancienneImage === images.length - 1
        ? 0
        : ancienneImage + 1
    );
  };

  const imagePrecedente = () => {
    if (images.length === 0) return;

    setImageActuelle((ancienneImage) =>
      ancienneImage === 0
        ? images.length - 1
        : ancienneImage - 1
    );
  };

  return (
    <main className="detail-page">

      <Link
        to={`/mythes-legendes?civilisation=${mythe.civilisation_slug}`}
        className="detail-back-link"
      >
        ← Retour aux mythes & légendes
      </Link>

      <section className="detail-card">

        <div className="detail-image-container">

          {images.length > 0 ? (

            <div className="detail-carousel">

              <img
                src={images[imageActuelle]}
                alt={`${mythe.titre} - image ${
                  imageActuelle + 1
                }`}
                className="detail-image"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    className="carousel-button carousel-button-left"
                    onClick={imagePrecedente}
                    aria-label="Image précédente"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    className="carousel-button carousel-button-right"
                    onClick={imageSuivante}
                    aria-label="Image suivante"
                  >
                    →
                  </button>

                  <div className="carousel-indicators">

                    {images.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        className={`carousel-indicator ${
                          index === imageActuelle
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          setImageActuelle(index)
                        }
                        aria-label={`Afficher l'image ${
                          index + 1
                        }`}
                      />
                    ))}

                  </div>
                </>
              )}

            </div>

          ) : (

            <div className="detail-image-placeholder">
              📖
            </div>

          )}

        </div>

        <div className="detail-content">

          <p className="detail-label">
            MYTHE & LÉGENDE
          </p>

          <h1>
            {mythe.titre}
          </h1>

          <span className="detail-civilisation">
            {mythe.civilisation_nom}
          </span>

          <div className="detail-separator" />

          <p className="detail-description">
            {mythe.description ||
              "Aucune description disponible."}
          </p>

        </div>

      </section>

    </main>
  );
}

export default MytheDetail;