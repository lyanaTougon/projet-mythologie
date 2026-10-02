import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./civilisations.css";

const API_URL = "http://localhost:5000";

const histoires = {
  azteque: {
    titre: "Présentation de la mythologie aztèque",
    texte:
      "La mythologie aztèque rassemble les croyances religieuses et les récits des peuples mésoaméricains associés aux Mexicas. Elle met en scène de nombreuses divinités liées au soleil, à la pluie, à la guerre, à la création et à la nature. Les récits aztèques expliquent notamment l’origine du monde, la création de l’humanité et les grands cycles cosmiques. Les dieux Quetzalcóatl, Huitzilopochtli, Tezcatlipoca et Tlaloc occupent une place importante dans cet univers.",
  },

  japonaise: {
    titre: "Présentation de la mythologie japonaise",
    texte:
      "La mythologie japonaise repose principalement sur des récits anciens transmis notamment par le Kojiki et le Nihon Shoki. Elle raconte la création des îles japonaises, l’apparition des kami et les relations entre les divinités. Amaterasu, Susanoo, Izanami et Izanagi figurent parmi les personnages majeurs de ces récits. La mythologie japonaise est également liée à de nombreuses légendes populaires mettant en scène des héros, des yōkai et des créatures surnaturelles.",
  },

  nordique: {
    titre: "Présentation de la mythologie nordique",
    texte:
      "La mythologie nordique est principalement connue à travers les récits scandinaves anciens. Elle présente un univers composé de plusieurs mondes reliés par Yggdrasil et peuplé de dieux, de géants, de héros et de créatures. Odin, Thor, Loki et Freyja sont parmi les figures les plus connues. Les récits nordiques racontent notamment la création du monde, les aventures des dieux et le Ragnarök, événement annonçant la destruction puis le renouvellement du monde.",
  },

  egyptienne: {
    titre: "Présentation de la mythologie égyptienne",
    texte:
      "La mythologie égyptienne s’est développée pendant plusieurs millénaires dans l’Égypte ancienne. Elle comprend de nombreuses divinités associées au soleil, à la mort, à la fertilité, à la protection et au pouvoir royal. Râ, Osiris, Isis, Horus et Anubis comptent parmi les divinités les plus célèbres. Les récits expliquent notamment la création du monde, le cycle solaire, la mort d’Osiris et le jugement des défunts dans l’au-delà.",
  },
};

function Civilisations() {
  const { slug } = useParams();

  const [civilisations, setCivilisations] = useState([]);
  const [civilisation, setCivilisation] = useState(null);

  const [dieux, setDieux] = useState([]);
  const [heros, setHeros] = useState([]);
  const [mythes, setMythes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const chargerDonnees = async () => {
      try {
        setLoading(true);
        setError("");

        if (!slug) {
          const response = await fetch(
            `${API_URL}/api/civilisations`
          );

          const data = await response.json();

          if (!response.ok) {
            throw new Error(
              "Impossible de récupérer les civilisations."
            );
          }

          setCivilisations(
            Array.isArray(data)
              ? data
              : data.civilisations || []
          );

          return;
        }

        const [
          civilisationResponse,
          dieuxResponse,
          herosResponse,
          mythesResponse,
        ] = await Promise.all([
          fetch(
            `${API_URL}/api/civilisations/${slug}`
          ),

          fetch(
            `${API_URL}/api/dieux?civilisation=${slug}`
          ),

          fetch(
            `${API_URL}/api/heros?civilisation=${slug}`
          ),

          fetch(
            `${API_URL}/api/mythes?civilisation=${slug}`
          ),
        ]);

        const civilisationData =
          await civilisationResponse.json();

        const dieuxData =
          await dieuxResponse.json();

        const herosData =
          await herosResponse.json();

        const mythesData =
          await mythesResponse.json();

        if (!civilisationResponse.ok) {
          throw new Error(
            civilisationData.message ||
              "Civilisation introuvable."
          );
        }

        if (!dieuxResponse.ok) {
          throw new Error(
            dieuxData.message ||
              "Impossible de charger les divinités."
          );
        }

        if (!herosResponse.ok) {
          throw new Error(
            herosData.message ||
              "Impossible de charger les héros."
          );
        }

        if (!mythesResponse.ok) {
          throw new Error(
            mythesData.message ||
              "Impossible de charger les mythes."
          );
        }

        setCivilisation(
          civilisationData.civilisation
        );

        setDieux(
          dieuxData.dieux || []
        );

        setHeros(
          herosData.heros || []
        );

        setMythes(
          mythesData.mythes || []
        );

      } catch (error) {
        console.error(
          "Erreur civilisations :",
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

    chargerDonnees();
  }, [slug]);

  if (loading) {
    return (
      <main className="page">
        <div className="page-header">
          <p className="page-label">
            MYTHOLOGIE
          </p>

          <h1>
            Chargement...
          </h1>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <div className="page-header">
          <p className="page-label">
            MYTHOLOGIE
          </p>

          <h1>
            Une erreur est survenue
          </h1>

          <p>
            {error}
          </p>

          <Link
            to="/civilisations"
            className="home-main-button"
          >
            Retour aux civilisations
          </Link>
        </div>
      </main>
    );
  }

  /*
   * ============================================================
   * PAGE DÉTAIL D'UNE CIVILISATION
   * ============================================================
   */

  if (slug && civilisation) {
    const histoire =
      histoires[civilisation.slug] || {
        titre: `Présentation de ${civilisation.nom}`,
        texte:
          "Découvrez l’histoire, les croyances, les divinités et les récits de cette civilisation mythologique.",
      };

    return (
      <main className="page civilisation-detail-page">

        <div className="page-header">

          <Link
            to="/civilisations"
            className="back-link"
          >
            ← Toutes les civilisations
          </Link>

          <p className="page-label">
            CIVILISATION
          </p>

          <h1>
            {civilisation.nom}
          </h1>

        </div>


        {/* =====================================================
            HISTOIRE
        ====================================================== */}

        <section className="civilisation-history">

          <div className="civilisation-section-heading">

            <p className="page-label">
              HISTOIRE & CULTURE
            </p>

            <h2>
              {histoire.titre}
            </h2>

          </div>

          <div className="civilisation-history-text">

            <p>
              {histoire.texte}
            </p>

          </div>

        </section>


        {/* =====================================================
            DIEUX
        ====================================================== */}

        <section className="civilisation-content-section">

          <div className="civilisation-section-header">

            <div>

              <p className="page-label">
                DIVINITÉS
              </p>

              <h2>
                ⚜ Dieux & déesses
              </h2>

            </div>

            <Link
              to={`/dieux-deesses?civilisation=${civilisation.slug}`}
              className="civilisation-see-more"
            >
              Voir toutes →
            </Link>

          </div>


          {dieux.length > 0 ? (

            <div className="civilisation-content-grid">

              {dieux.slice(0, 4).map((dieu) => (

                <article
                  key={dieu.id}
                  className="civilisation-content-card"
                >

                  {dieu.image ? (

                    <img
                      src={dieu.image}
                      alt={dieu.nom}
                    />

                  ) : (

                    <div className="civilisation-card-placeholder">
                      ⚜
                    </div>

                  )}

                  <div className="civilisation-card-body">

                    <span>
                      {civilisation.nom}
                    </span>

                    <h3>
                      {dieu.nom}
                    </h3>

                    <p>
                      {dieu.description}
                    </p>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="civilisation-empty">
              Aucune divinité disponible.
            </div>

          )}

        </section>


        {/* =====================================================
            HÉROS & CRÉATURES
        ====================================================== */}

        <section className="civilisation-content-section">

          <div className="civilisation-section-header">

            <div>

              <p className="page-label">
                PERSONNAGES
              </p>

              <h2>
                ⚔ Héros & créatures
              </h2>

            </div>

            <Link
              to={`/heros-creatures?civilisation=${civilisation.slug}`}
              className="civilisation-see-more"
            >
              Voir tous →
            </Link>

          </div>


          {heros.length > 0 ? (

            <div className="civilisation-content-grid">

              {heros.slice(0, 4).map((element) => (

                <article
                  key={element.id}
                  className="civilisation-content-card"
                >

                  {element.image ? (

                    <img
                      src={element.image}
                      alt={element.nom}
                    />

                  ) : (

                    <div className="civilisation-card-placeholder">
                      ⚔
                    </div>

                  )}

                  <div className="civilisation-card-body">

                    <span>
                      {element.type}
                    </span>

                    <h3>
                      {element.nom}
                    </h3>

                    <p>
                      {element.description}
                    </p>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="civilisation-empty">
              Aucun héros ou créature disponible.
            </div>

          )}

        </section>


        {/* =====================================================
            MYTHES
        ====================================================== */}

        <section className="civilisation-content-section">

          <div className="civilisation-section-header">

            <div>

              <p className="page-label">
                RÉCITS
              </p>

              <h2>
                📖 Mythes & légendes
              </h2>

            </div>

            <Link
              to={`/mythes-legendes?civilisation=${civilisation.slug}`}
              className="civilisation-see-more"
            >
              Voir tous →
            </Link>

          </div>


          {mythes.length > 0 ? (

            <div className="civilisation-content-grid">

              {mythes.slice(0, 4).map((mythe) => (

                <article
                  key={mythe.id}
                  className="civilisation-content-card"
                >

                  {mythe.image ? (

                    <img
                      src={mythe.image}
                      alt={mythe.titre}
                    />

                  ) : (

                    <div className="civilisation-card-placeholder">
                      📖
                    </div>

                  )}

                  <div className="civilisation-card-body">

                    <span>
                      {civilisation.nom}
                    </span>

                    <h3>
                      {mythe.titre}
                    </h3>

                    <p>
                      {mythe.description}
                    </p>

                  </div>

                </article>

              ))}

            </div>

          ) : (

            <div className="civilisation-empty">
              Aucun mythe disponible.
            </div>

          )}

        </section>


        {/* =====================================================
            RETOUR
        ====================================================== */}

        <div className="civilisation-bottom">

          <Link
            to="/civilisations"
            className="home-main-button"
          >
            ← Découvrir les autres civilisations
          </Link>

        </div>

      </main>
    );
  }


  /*
   * ============================================================
   * LISTE DES CIVILISATIONS
   * ============================================================
   */

  return (
    <main className="page">

      <div className="page-header">

        <p className="page-label">
          MYTHOLOGIE
        </p>

        <h1>
          Civilisations
        </h1>

        <p>
          Explorez les grandes civilisations
          mythologiques et découvrez leurs dieux,
          leurs héros, leurs créatures et leurs
          légendes.
        </p>

      </div>


      <section className="cards">

        {civilisations.length > 0 ? (

          civilisations.map((civilisation) => (

            <Link
              key={civilisation.id}
              to={`/civilisations/${civilisation.slug}`}
              className="card civilisation-card"
            >

              <div className="card-icon">
                ✦
              </div>

              <h2>
                {civilisation.nom}
              </h2>

              <p>
                Découvrez les dieux, héros,
                créatures, mythes et légendes
                de cette civilisation.
              </p>

              <span className="card-link">
                Découvrir →
              </span>

            </Link>

          ))

        ) : (

          <p className="home-empty">
            Aucune civilisation disponible.
          </p>

        )}

      </section>

    </main>
  );
}

export default Civilisations;