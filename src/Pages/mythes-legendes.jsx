import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import "./mythes-legendes.css";

const API_URL = "http://localhost:5000";

function MythesLegendes() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const civilisationInitiale =
    searchParams.get("civilisation") || "";

  const [mythes, setMythes] =
    useState([]);

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

        const data =
          await response.json();

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
   * CHARGER LES MYTHES
   * ============================================================
   */

  useEffect(() => {
    const chargerMythes = async () => {
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
          `${API_URL}/api/mythes?${params.toString()}`
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Impossible de charger les mythes."
          );
        }

        setMythes(
          data.mythes || data
        );

      } catch (error) {
        console.error(
          "Erreur mythes :",
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

    chargerMythes();

  }, [
    search,
    civilisation,
  ]);


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
          RÉCITS MYTHOLOGIQUES
        </p>

        <h1>
          Mythes & légendes
        </h1>

        <p>
          Explorez les récits fascinants des
          différentes civilisations mythologiques.
        </p>

      </section>


      {/* ======================================================
          FILTRES
      ======================================================= */}

      <section className="catalogue-filters">

        {/* RECHERCHE */}

        <div className="search-box">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Rechercher un mythe..."
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
          />

        </div>


        {/* CIVILISATION */}

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
                  "Mythes"
                : "Tous les mythes"}
            </h2>

          </div>


          <span className="results-count">

            {mythes.length} résultat
            {mythes.length > 1
              ? "s"
              : ""}

          </span>

        </div>


        {/* ====================================================
            CHARGEMENT
        ===================================================== */}

        {loading ? (

          <div className="catalogue-message">
            Chargement des mythes...
          </div>


        ) : error ? (

          <div className="catalogue-message">
            {error}
          </div>


        ) : mythes.length === 0 ? (

          <div className="catalogue-message">
            Aucun mythe trouvé.
          </div>


        ) : (

          <div className="catalogue-grid">

            {mythes.map((mythe) => (

              <article
                key={mythe.id}
                className="catalogue-card"
              >

                {/* IMAGE */}

                {mythe.image ? (

                  <img
                    src={mythe.image}
                    alt={mythe.titre}
                  />

                ) : (

                  <div className="catalogue-placeholder">
                    📖
                  </div>

                )}


                {/* CONTENU */}

                <div className="catalogue-card-body">

                  <span className="catalogue-card-category">

                    {mythe.civilisation_nom ||
                      "Mythologie"}

                  </span>


                  <h3>
                    {mythe.titre}
                  </h3>


                  <p>
                    {mythe.description ||
                      "Découvrez ce récit mythologique."}
                  </p>


                  {/* BOUTON DÉCOUVRIR */}

                  <Link
                    to={`/mythes-legendes/${mythe.id}`}
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

export default MythesLegendes;