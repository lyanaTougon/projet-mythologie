import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import "./dieux-deesses.css";

const API_URL = "http://localhost:5000";

function DieuxDeesses() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const civilisationInitiale =
    searchParams.get("civilisation") || "";

  const [dieux, setDieux] = useState([]);
  const [civilisations, setCivilisations] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [civilisation, setCivilisation] =
    useState(civilisationInitiale);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * ============================================================
   * CHARGER LES CIVILISATIONS
   * ============================================================
   */

  useEffect(() => {
    const chargerCivilisations = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/civilisations`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            "Impossible de charger les civilisations."
          );
        }

        setCivilisations(
          data.civilisations || data
        );

      } catch (error) {
        console.error(
          "Erreur civilisations :",
          error
        );
      }
    };

    chargerCivilisations();
  }, []);


  /*
   * ============================================================
   * CHARGER LES DIEUX
   * ============================================================
   */

  useEffect(() => {
    const chargerDieux = async () => {
      try {
        setLoading(true);
        setError("");

        const params =
          new URLSearchParams();

        if (search.trim()) {
          params.set(
            "search",
            search.trim()
          );
        }

        if (civilisation) {
          params.set(
            "civilisation",
            civilisation
          );
        }

        const response = await fetch(
          `${API_URL}/api/dieux?${params.toString()}`
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Impossible de charger les dieux."
          );
        }

        setDieux(
          data.dieux || data
        );

      } catch (error) {
        console.error(
          "Erreur dieux :",
          error
        );

        setError(
          error.message ||
            "Une erreur est survenue."
        );

      } finally {
        setLoading(false);
      }
    };

    chargerDieux();

  }, [search, civilisation]);


  /*
   * ============================================================
   * CHANGER DE CIVILISATION
   * ============================================================
   */

  const changerCivilisation = (
    value
  ) => {
    setCivilisation(value);

    if (value) {
      setSearchParams({
        civilisation: value,
      });
    } else {
      setSearchParams({});
    }
  };


  /*
   * ============================================================
   * AFFICHAGE
   * ============================================================
   */

  return (
    <main className="catalogue-page">

      {/* ======================================================
          EN-TÊTE
      ======================================================= */}

      <section className="catalogue-header">

        <p className="catalogue-label">
          DIVINITÉS
        </p>

        <h1>
          Dieux & déesses
        </h1>

        <p>
          Découvrez les divinités des différentes
          civilisations mythologiques.
        </p>

      </section>


      {/* ======================================================
          FILTRES
      ======================================================= */}

      <section className="catalogue-filters">

        <div className="search-box">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Rechercher un dieu ou une déesse..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>


        <div className="filter-box">

          <label>
            Civilisation
          </label>

          <select
            value={civilisation}
            onChange={(event) =>
              changerCivilisation(
                event.target.value
              )
            }
          >

            <option value="">
              Toutes les civilisations
            </option>

            {civilisations.map(
              (item) => (
                <option
                  key={item.id}
                  value={item.slug}
                >
                  {item.nom}
                </option>
              )
            )}

          </select>

        </div>

      </section>


      {/* ======================================================
          RÉSULTATS
      ======================================================= */}

      <section className="catalogue-results">

        <div className="catalogue-results-header">

          <div>

            <p className="catalogue-label">
              COLLECTION
            </p>

            <h2>
              {civilisation
                ? civilisations.find(
                    (item) =>
                      item.slug ===
                      civilisation
                  )?.nom ||
                  "Divinités"
                : "Toutes les divinités"}
            </h2>

          </div>


          <span className="results-count">

            {dieux.length} résultat
            {dieux.length > 1
              ? "s"
              : ""}

          </span>

        </div>


        {/* ====================================================
            CHARGEMENT
        ===================================================== */}

        {loading ? (

          <div className="catalogue-message">
            Chargement des divinités...
          </div>


        ) : error ? (

          <div className="catalogue-message">
            {error}
          </div>


        ) : dieux.length === 0 ? (

          <div className="catalogue-message">
            Aucune divinité trouvée.
          </div>


        ) : (

          <div className="catalogue-grid">

            {dieux.map((dieu) => (

              <article
                key={dieu.id}
                className="catalogue-card"
              >

                {/* IMAGE */}

                {dieu.image ? (

                  <img
                    src={dieu.image}
                    alt={dieu.nom}
                  />

                ) : (

                  <div className="catalogue-placeholder">
                    ⚜
                  </div>

                )}


                {/* CONTENU */}

                <div className="catalogue-card-body">

                  <span className="catalogue-card-category">

                    {dieu.civilisation_nom ||
                      "Mythologie"}

                  </span>


                  <h3>
                    {dieu.nom}
                  </h3>


                  <p>
                    {dieu.description ||
                      "Découvrez cette divinité mythologique."}
                  </p>


                  {/* BOUTON DÉCOUVRIR */}

                  <Link
                    to={`/dieux-deesses/${dieu.id}`}
                    className="catalogue-card-button"
                  >
                    Découvrir →
                  </Link>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default DieuxDeesses;