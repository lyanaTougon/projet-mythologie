import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import "./heros-creatures.css";

const API_URL = "http://localhost:5000";

function HerosCreatures() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const civilisationInitiale =
    searchParams.get("civilisation") || "";

  const typeInitial =
    searchParams.get("type") || "";

  const [heros, setHeros] =
    useState([]);

  const [civilisations, setCivilisations] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [civilisation, setCivilisation] =
    useState(civilisationInitiale);

  const [type, setType] =
    useState(typeInitial);

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
   * CHARGER HÉROS & CRÉATURES
   * ============================================================
   */

  useEffect(() => {
    const chargerHeros = async () => {
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

        if (type) {
          params.set(
            "type",
            type
          );
        }

        const response = await fetch(
          `${API_URL}/api/heros?${params.toString()}`
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Impossible de charger les personnages."
          );
        }

        setHeros(
          data.heros || data
        );

      } catch (error) {
        console.error(
          "Erreur héros/créatures :",
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

    chargerHeros();

  }, [
    search,
    civilisation,
    type,
  ]);


  /*
   * ============================================================
   * METTRE À JOUR LES FILTRES
   * ============================================================
   */

  const mettreAJourFiltres = (
    nouvelleCivilisation,
    nouveauType
  ) => {
    const params = {};

    if (nouvelleCivilisation) {
      params.civilisation =
        nouvelleCivilisation;
    }

    if (nouveauType) {
      params.type = nouveauType;
    }

    setSearchParams(params);
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
          PERSONNAGES
        </p>

        <h1>
          Héros & créatures
        </h1>

        <p>
          Découvrez les héros légendaires et les
          créatures fascinantes des différentes
          civilisations mythologiques.
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
            placeholder="Rechercher un héros ou une créature..."
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
            onChange={(event) => {

              const value =
                event.target.value;

              setCivilisation(value);

              mettreAJourFiltres(
                value,
                type
              );

            }}
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


        {/* TYPE */}

        <div className="filter-box">

          <label>
            Type
          </label>

          <select
            value={type}
            onChange={(event) => {

              const value =
                event.target.value;

              setType(value);

              mettreAJourFiltres(
                civilisation,
                value
              );

            }}
          >

            <option value="">
              Tous
            </option>

            <option value="héros">
              Héros
            </option>

            <option value="créature">
              Créatures
            </option>

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
                  "Personnages"
                : "Tous les personnages"}
            </h2>

          </div>


          <span className="results-count">

            {heros.length} résultat
            {heros.length > 1
              ? "s"
              : ""}

          </span>

        </div>


        {/* ====================================================
            CHARGEMENT
        ===================================================== */}

        {loading ? (

          <div className="catalogue-message">
            Chargement des personnages...
          </div>


        ) : error ? (

          <div className="catalogue-message">
            {error}
          </div>


        ) : heros.length === 0 ? (

          <div className="catalogue-message">
            Aucun personnage trouvé.
          </div>


        ) : (

          <div className="catalogue-grid">

            {heros.map((element) => (

              <article
                key={element.id}
                className="catalogue-card"
              >

                {/* IMAGE */}

                {element.image ? (

                  <img
                    src={element.image}
                    alt={element.nom}
                  />

                ) : (

                  <div className="catalogue-placeholder">
                    ⚔
                  </div>

                )}


                {/* CONTENU */}

                <div className="catalogue-card-body">

                  <span className="catalogue-card-category">

                    {element.type ||
                      "Personnage"}

                    {" • "}

                    {element.civilisation_nom ||
                      "Mythologie"}

                  </span>


                  <h3>
                    {element.nom}
                  </h3>


                  <p>
                    {element.description ||
                      "Découvrez ce personnage mythologique."}
                  </p>


                  {/* BOUTON DÉCOUVRIR */}

                  <Link
                    to={`/heros-creatures/${element.id}`}
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

export default HerosCreatures;