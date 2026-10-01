import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

function DieuxDeesses() {
  const [dieux, setDieux] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDieux = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/dieux`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
            "Impossible de récupérer les dieux."
          );
        }

        setDieux(data.dieux || []);

      } catch (error) {
        console.error(
          "Erreur récupération dieux :",
          error
        );

        setError(
          "Impossible de charger les dieux et déesses."
        );

      } finally {
        setLoading(false);
      }
    };

    fetchDieux();
  }, []);

  return (
    <main className="page">

      <h1>Dieux & déesses</h1>

      <p>
        Découvrez les divinités des différentes
        mythologies.
      </p>

      {loading && (
        <p>Chargement...</p>
      )}

      {error && (
        <p>{error}</p>
      )}

      {!loading && !error && dieux.length === 0 && (
        <p>
          Aucun dieu ou déesse n'a encore été ajouté.
        </p>
      )}

      <div className="cards">

        {dieux.map((dieu) => (
          <article
            key={dieu.id}
            className="card"
          >

            {dieu.image && (
              <img
                src={dieu.image}
                alt={dieu.nom}
              />
            )}

            <h3>
              {dieu.nom}
            </h3>

            <p>
              {dieu.description}
            </p>

            {dieu.civilisation_nom && (
              <p>
                <strong>
                  {dieu.civilisation_nom}
                </strong>
              </p>
            )}

          </article>
        ))}

      </div>

    </main>
  );
}

export default DieuxDeesses;