import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const API_URL = "http://localhost:5000";

function App() {
  const [civilisations, setCivilisations] = useState([]);
  const [dieux, setDieux] = useState([]);
  const [heros, setHeros] = useState([]);
  const [mythes, setMythes] = useState([]);

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        const [
          civilisationsResponse,
          dieuxResponse,
          herosResponse,
          mythesResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/api/civilisations`),
          fetch(`${API_URL}/api/dieux`),
          fetch(`${API_URL}/api/heros`),
          fetch(`${API_URL}/api/mythes`),
        ]);

        /* =====================================================
           CIVILISATIONS
        ===================================================== */

        if (civilisationsResponse.ok) {
          const data = await civilisationsResponse.json();

          setCivilisations(
            Array.isArray(data)
              ? data
              : data.civilisations || []
          );
        } else {
          console.error(
            "Erreur API civilisations :",
            civilisationsResponse.status
          );
        }

        /* =====================================================
           DIEUX
        ===================================================== */

        if (dieuxResponse.ok) {
          const data = await dieuxResponse.json();

          setDieux(
            Array.isArray(data)
              ? data
              : data.dieux || []
          );
        } else {
          console.error(
            "Erreur API dieux :",
            dieuxResponse.status
          );
        }

        /* =====================================================
           HÉROS & CRÉATURES
        ===================================================== */

        if (herosResponse.ok) {
          const data = await herosResponse.json();

          setHeros(
            Array.isArray(data)
              ? data
              : data.heros || []
          );
        } else {
          console.error(
            "Erreur API héros :",
            herosResponse.status
          );
        }

        /* =====================================================
           MYTHES
        ===================================================== */

        if (mythesResponse.ok) {
          const data = await mythesResponse.json();

          setMythes(
            Array.isArray(data)
              ? data
              : data.mythes || []
          );
        } else {
          console.error(
            "Erreur API mythes :",
            mythesResponse.status
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données :",
          error
        );
      }
    };

    chargerDonnees();
  }, []);

  return (
    <main className="home-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="home-hero">
        <div className="home-hero-overlay">

          <p className="home-small-title">
            BIENVENUE DANS
          </p>

          <h1>
            Mythologie
          </h1>

          <p className="home-description">
            Découvrez les dieux, les héros, les créatures,
            les mythes et les légendes des grandes civilisations
            mythologiques.
          </p>

          <Link
            to="/civilisations"
            className="home-main-button"
          >
            Explorer les civilisations
          </Link>

        </div>
      </section>


      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="home-section home-introduction">

        <p className="home-section-label">
          À LA DÉCOUVERTE DES LÉGENDES
        </p>

        <h2>
          Un voyage au cœur de la mythologie
        </h2>

        <p>
          Plongez dans les récits fascinants qui ont marqué
          les civilisations à travers les siècles. Découvrez
          leurs divinités, leurs héros, leurs créatures et
          leurs légendes.
        </p>

      </section>


      {/* =====================================================
          CIVILISATIONS
      ===================================================== */}

      <section className="home-section">

        <div className="home-section-header">

          <div>
            <p className="home-section-label">
              CIVILISATIONS
            </p>

            <h2>
              Explorez les mythologies
            </h2>
          </div>

          <Link
            to="/civilisations"
            className="home-see-more"
          >
            Voir toutes →
          </Link>

        </div>


        <div className="civilisation-home-grid">

          {civilisations.length > 0 ? (

            civilisations.map((civilisation) => (

              <Link
                key={civilisation.id}
                to={`/civilisations/${civilisation.slug}`}
                className="civilisation-home-card"
              >

                <div className="civilisation-card-content">

                  <span>
                    ✦
                  </span>

                  <h3>
                    {civilisation.nom}
                  </h3>

                  <p>
                    Découvrez les dieux, héros, créatures
                    et mythes de cette civilisation.
                  </p>

                  <strong>
                    Découvrir →
                  </strong>

                </div>

              </Link>

            ))

          ) : (

            <p className="home-empty">
              Aucune civilisation disponible.
            </p>

          )}

        </div>

      </section>


      {/* =====================================================
          DIEUX & DÉESSES
      ===================================================== */}

      <section className="home-section">

        <div className="home-section-header">

          <div>
            <p className="home-section-label">
              DIVINITÉS
            </p>

            <h2>
              Dieux & déesses
            </h2>
          </div>

          <Link
            to="/dieux-deesses"
            className="home-see-more"
          >
            Voir tous →
          </Link>

        </div>


        <div className="home-content-grid">

          {dieux.length > 0 ? (

            dieux.slice(0, 4).map((dieu) => (

              <Link
                key={dieu.id}
                to={`/dieux-deesses/${dieu.id}`}
                className="home-content-card"
              >

                {dieu.image ? (

                  <img
                    src={dieu.image}
                    alt={dieu.nom}
                  />

                ) : (

                  <div className="home-card-placeholder">
                    ⚜
                  </div>

                )}

                <div className="home-content-card-body">

                  <span className="home-card-category">
                    {dieu.civilisation_nom ||
                      "Mythologie"}
                  </span>

                  <h3>
                    {dieu.nom}
                  </h3>

                  <p>
                    {dieu.description ||
                      "Découvrez cette divinité."}
                  </p>

                  <span className="home-card-link">
                    Découvrir →
                  </span>

                </div>

              </Link>

            ))

          ) : (

            <p className="home-empty">
              Aucune divinité disponible.
            </p>

          )}

        </div>

      </section>


      {/* =====================================================
          HÉROS & CRÉATURES
      ===================================================== */}

      <section className="home-section">

        <div className="home-section-header">

          <div>
            <p className="home-section-label">
              LÉGENDES
            </p>

            <h2>
              Héros & créatures
            </h2>
          </div>

          <Link
            to="/heros-creatures"
            className="home-see-more"
          >
            Voir tous →
          </Link>

        </div>


        <div className="home-content-grid">

          {heros.length > 0 ? (

            heros.slice(0, 4).map((element) => (

              <Link
                key={element.id}
                to={`/heros-creatures/${element.id}`}
                className="home-content-card"
              >

                {element.image ? (

                  <img
                    src={element.image}
                    alt={element.nom}
                  />

                ) : (

                  <div className="home-card-placeholder">
                    ⚔
                  </div>

                )}

                <div className="home-content-card-body">

                  <span className="home-card-category">
                    {element.type}
                  </span>

                  <h3>
                    {element.nom}
                  </h3>

                  <p>
                    {element.description ||
                      "Découvrez ce personnage mythologique."}
                  </p>

                  <span className="home-card-link">
                    Découvrir →
                  </span>

                </div>

              </Link>

            ))

          ) : (

            <p className="home-empty">
              Aucun héros ou créature disponible.
            </p>

          )}

        </div>

      </section>


      {/* =====================================================
          MYTHES & LÉGENDES
      ===================================================== */}

      <section className="home-section">

        <div className="home-section-header">

          <div>
            <p className="home-section-label">
              RÉCITS
            </p>

            <h2>
              Mythes & légendes
            </h2>
          </div>

          <Link
            to="/mythes-legendes"
            className="home-see-more"
          >
            Voir tous →
          </Link>

        </div>


        <div className="home-mythes-grid">

          {mythes.length > 0 ? (

            mythes.slice(0, 3).map((mythe) => (

              <Link
                key={mythe.id}
                to={`/mythes-legendes/${mythe.id}`}
                className="home-mythe-card"
              >

                {mythe.image ? (

                  <img
                    src={mythe.image}
                    alt={mythe.titre}
                  />

                ) : (

                  <div className="home-card-placeholder">
                    📖
                  </div>

                )}

                <div className="home-mythe-body">

                  <span>
                    {mythe.civilisation_nom ||
                      "Mythologie"}
                  </span>

                  <h3>
                    {mythe.titre}
                  </h3>

                  <p>
                    {mythe.description ||
                      "Découvrez cette légende mythologique."}
                  </p>

                  <span className="home-card-link">
                    Découvrir →
                  </span>

                </div>

              </Link>

            ))

          ) : (

            <p className="home-empty">
              Aucun mythe disponible.
            </p>

          )}

        </div>

      </section>


      {/* =====================================================
          CTA FINAL
      ===================================================== */}

      <section className="home-final">

        <div>

          <p className="home-section-label">
            MYTHOLOGIE
          </p>

          <h2>
            Quelle légende allez-vous découvrir ?
          </h2>

          <p>
            Explorez notre collection et partez à la
            découverte des récits mythologiques du monde.
          </p>

          <Link
            to="/civilisations"
            className="home-main-button"
          >
            Commencer l'exploration
          </Link>

        </div>

      </section>

    </main>
  );
}

export default App;