import { useEffect, useState } from "react";
import "./admin.css";

const API_URL = "http://localhost:5000";

const civilisations = [
  {
    id: 1,
    nom: "Mythologie aztèque",
  },
  {
    id: 2,
    nom: "Mythologie japonaise",
  },
  {
    id: 3,
    nom: "Mythologie nordique",
  },
  {
    id: 4,
    nom: "Mythologie égyptienne",
  },
];

function Admin() {
  const [users, setUsers] = useState([]);
  const [dieux, setDieux] = useState([]);
  const [heros, setHeros] = useState([]);
  const [mythes, setMythes] = useState([]);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [activeSection, setActiveSection] = useState("dashboard");

  const [editingType, setEditingType] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [dieuForm, setDieuForm] = useState({
    nom: "",
    description: "",
    image: "",
    civilisation_id: "",
  });

  const [heroForm, setHeroForm] = useState({
    nom: "",
    type: "héros",
    description: "",
    image: "",
    civilisation_id: "",
  });

  const [mytheForm, setMytheForm] = useState({
    titre: "",
    description: "",
    image: "",
    civilisation_id: "",
  });


  /* ============================================================
     TOKEN
     ============================================================ */

  const getToken = () => {
    return localStorage.getItem("token");
  };


  /* ============================================================
     MESSAGE
     ============================================================ */

  const showMessage = (text) => {
    setMessage(text);
    setError("");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const showError = (text) => {
    setError(text);
    setMessage("");

    setTimeout(() => {
      setError("");
    }, 4000);
  };


  /* ============================================================
     CHARGER LES DONNÉES
     ============================================================ */

  useEffect(() => {
    loadUsers();
    loadDieux();
    loadHeros();
    loadMythes();
  }, []);


  /* ============================================================
     UTILISATEURS
     ============================================================ */

  const loadUsers = async () => {
    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setUsers(data.users);

    } catch (error) {
      console.error(error);
      showError(
        error.message ||
        "Impossible de récupérer les utilisateurs."
      );
    }
  };


  const deleteUser = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cet utilisateur ?"
    );

    if (!confirmation) {
      return;
    }

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/admin/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      showMessage(data.message);

      loadUsers();

    } catch (error) {
      showError(
        error.message ||
        "Erreur lors de la suppression."
      );
    }
  };


  /* ============================================================
     DIEUX
     ============================================================ */

  const loadDieux = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/dieux`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setDieux(data.dieux);

    } catch (error) {
      console.error(error);
    }
  };


  const resetDieuForm = () => {
    setDieuForm({
      nom: "",
      description: "",
      image: "",
      civilisation_id: "",
    });

    setEditingType(null);
    setEditingId(null);
  };


  const submitDieu = async (event) => {
    event.preventDefault();

    try {
      const token = getToken();

      const url = editingId
        ? `${API_URL}/api/dieux/${editingId}`
        : `${API_URL}/api/dieux`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nom: dieuForm.nom,
          description: dieuForm.description,
          image: dieuForm.image || null,
          civilisation_id: Number(
            dieuForm.civilisation_id
          ),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      showMessage(data.message);

      resetDieuForm();
      loadDieux();

    } catch (error) {
      showError(
        error.message ||
        "Erreur lors de l'enregistrement."
      );
    }
  };


  const editDieu = (dieu) => {
    setActiveSection("dieux");
    setEditingType("dieu");
    setEditingId(dieu.id);

    setDieuForm({
      nom: dieu.nom || "",
      description: dieu.description || "",
      image: dieu.image || "",
      civilisation_id:
        dieu.civilisation_id?.toString() || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const deleteDieu = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer ce dieu ou cette déesse ?"
    );

    if (!confirmation) {
      return;
    }

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/dieux/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      showMessage(data.message);

      loadDieux();

    } catch (error) {
      showError(
        error.message ||
        "Erreur lors de la suppression."
      );
    }
  };


  /* ============================================================
     HÉROS / CRÉATURES
     ============================================================ */

  const loadHeros = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/heros`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setHeros(data.heros);

    } catch (error) {
      console.error(error);
    }
  };


  const resetHeroForm = () => {
    setHeroForm({
      nom: "",
      type: "héros",
      description: "",
      image: "",
      civilisation_id: "",
    });

    setEditingType(null);
    setEditingId(null);
  };


  const submitHero = async (event) => {
    event.preventDefault();

    try {
      const token = getToken();

      const url = editingId
        ? `${API_URL}/api/heros/${editingId}`
        : `${API_URL}/api/heros`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nom: heroForm.nom,
          type: heroForm.type,
          description: heroForm.description,
          image: heroForm.image || null,
          civilisation_id: Number(
            heroForm.civilisation_id
          ),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      showMessage(data.message);

      resetHeroForm();
      loadHeros();

    } catch (error) {
      showError(
        error.message ||
        "Erreur lors de l'enregistrement."
      );
    }
  };


  const editHero = (hero) => {
    setActiveSection("heros");
    setEditingType("hero");
    setEditingId(hero.id);

    setHeroForm({
      nom: hero.nom || "",
      type: hero.type || "héros",
      description: hero.description || "",
      image: hero.image || "",
      civilisation_id:
        hero.civilisation_id?.toString() || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const deleteHero = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cet élément ?"
    );

    if (!confirmation) {
      return;
    }

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/heros/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      showMessage(data.message);

      loadHeros();

    } catch (error) {
      showError(
        error.message ||
        "Erreur lors de la suppression."
      );
    }
  };


  /* ============================================================
     MYTHES
     ============================================================ */

  const loadMythes = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/mythes`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setMythes(data.mythes);

    } catch (error) {
      console.error(error);
    }
  };


  const resetMytheForm = () => {
    setMytheForm({
      titre: "",
      description: "",
      image: "",
      civilisation_id: "",
    });

    setEditingType(null);
    setEditingId(null);
  };


  const submitMythe = async (event) => {
    event.preventDefault();

    try {
      const token = getToken();

      const url = editingId
        ? `${API_URL}/api/mythes/${editingId}`
        : `${API_URL}/api/mythes`;

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titre: mytheForm.titre,
          description: mytheForm.description,
          image: mytheForm.image || null,
          civilisation_id: Number(
            mytheForm.civilisation_id
          ),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      showMessage(data.message);

      resetMytheForm();
      loadMythes();

    } catch (error) {
      showError(
        error.message ||
        "Erreur lors de l'enregistrement."
      );
    }
  };


  const editMythe = (mythe) => {
    setActiveSection("mythes");
    setEditingType("mythe");
    setEditingId(mythe.id);

    setMytheForm({
      titre: mythe.titre || "",
      description: mythe.description || "",
      image: mythe.image || "",
      civilisation_id:
        mythe.civilisation_id?.toString() || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const deleteMythe = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer ce mythe ou cette légende ?"
    );

    if (!confirmation) {
      return;
    }

    try {
      const token = getToken();

      const response = await fetch(
        `${API_URL}/api/mythes/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      showMessage(data.message);

      loadMythes();

    } catch (error) {
      showError(
        error.message ||
        "Erreur lors de la suppression."
      );
    }
  };


  /* ============================================================
     AFFICHAGE
     ============================================================ */

  return (
    <main className="admin-page">

      <div className="admin-header">
        <div>
          <p className="admin-small-title">
            ESPACE ADMINISTRATEUR
          </p>

          <h1>
            Administration
          </h1>

          <p>
            Gérez les utilisateurs et le contenu
            du site Mythologie.
          </p>
        </div>
      </div>


      {/* ========================================================
          MESSAGES
          ======================================================== */}

      {message && (
        <div className="admin-message success">
          {message}
        </div>
      )}

      {error && (
        <div className="admin-message error">
          {error}
        </div>
      )}


      {/* ========================================================
          MENU ADMIN
          ======================================================== */}

      <div className="admin-tabs">

        <button
          className={
            activeSection === "dashboard"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveSection("dashboard")
          }
        >
          📊 Tableau de bord
        </button>

        <button
          className={
            activeSection === "users"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveSection("users")
          }
        >
          👥 Utilisateurs
        </button>

        <button
          className={
            activeSection === "dieux"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveSection("dieux")
          }
        >
          🏛️ Dieux & déesses
        </button>

        <button
          className={
            activeSection === "heros"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveSection("heros")
          }
        >
          ⚔️ Héros & créatures
        </button>

        <button
          className={
            activeSection === "mythes"
              ? "active"
              : ""
          }
          onClick={() =>
            setActiveSection("mythes")
          }
        >
          📜 Mythes & légendes
        </button>

      </div>


      {/* ========================================================
          DASHBOARD
          ======================================================== */}

      {activeSection === "dashboard" && (
        <section className="admin-section">

          <h2>
            Tableau de bord
          </h2>

          <div className="admin-stat-grid">

            <div className="admin-stat-card">
              <span>👥</span>
              <strong>{users.length}</strong>
              <p>Utilisateurs</p>
            </div>

            <div className="admin-stat-card">
              <span>🏛️</span>
              <strong>{dieux.length}</strong>
              <p>Dieux & déesses</p>
            </div>

            <div className="admin-stat-card">
              <span>⚔️</span>
              <strong>{heros.length}</strong>
              <p>Héros & créatures</p>
            </div>

            <div className="admin-stat-card">
              <span>📜</span>
              <strong>{mythes.length}</strong>
              <p>Mythes & légendes</p>
            </div>

          </div>

        </section>
      )}


      {/* ========================================================
          UTILISATEURS
          ======================================================== */}

      {activeSection === "users" && (
        <section className="admin-section">

          <h2>
            👥 Gestion des utilisateurs
          </h2>

          <div className="admin-table-wrapper">

            <table className="admin-table">

              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>

                {users.map((user) => (
                  <tr key={user.id}>

                    <td>{user.id}</td>

                    <td>{user.username}</td>

                    <td>{user.email}</td>

                    <td>
                      <span
                        className={
                          user.role === "admin"
                            ? "role-admin"
                            : "role-user"
                        }
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteUser(user.id)
                        }
                      >
                        🗑️ Supprimer
                      </button>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </section>
      )}


      {/* ========================================================
          DIEUX
          ======================================================== */}

      {activeSection === "dieux" && (
        <section className="admin-section">

          <h2>
            🏛️ Dieux & déesses
          </h2>


          <form
            className="admin-form"
            onSubmit={submitDieu}
          >

            <h3>
              {editingType === "dieu"
                ? "✏️ Modifier un dieu / une déesse"
                : "➕ Ajouter un dieu / une déesse"}
            </h3>


            <label>
              Nom
            </label>

            <input
              type="text"
              value={dieuForm.nom}
              onChange={(event) =>
                setDieuForm({
                  ...dieuForm,
                  nom: event.target.value,
                })
              }
              placeholder="Ex : Quetzalcóatl"
              required
            />


            <label>
              Description
            </label>

            <textarea
              value={dieuForm.description}
              onChange={(event) =>
                setDieuForm({
                  ...dieuForm,
                  description:
                    event.target.value,
                })
              }
              placeholder="Description..."
              rows="5"
            />


            <label>
              Image
            </label>

            <input
              type="text"
              value={dieuForm.image}
              onChange={(event) =>
                setDieuForm({
                  ...dieuForm,
                  image: event.target.value,
                })
              }
              placeholder="URL de l'image"
            />


            <label>
              Civilisation
            </label>

            <select
              value={dieuForm.civilisation_id}
              onChange={(event) =>
                setDieuForm({
                  ...dieuForm,
                  civilisation_id:
                    event.target.value,
                })
              }
              required
            >

              <option value="">
                Sélectionner une civilisation
              </option>

              {civilisations.map(
                (civilisation) => (
                  <option
                    key={civilisation.id}
                    value={civilisation.id}
                  >
                    {civilisation.nom}
                  </option>
                )
              )}

            </select>


            <div className="form-actions">

              <button
                type="submit"
                className="save-button"
              >
                {editingType === "dieu"
                  ? "💾 Modifier"
                  : "➕ Ajouter"}
              </button>

              {editingType === "dieu" && (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={resetDieuForm}
                >
                  Annuler
                </button>
              )}

            </div>

          </form>


          <div className="admin-content-list">

            {dieux.map((dieu) => (
              <article
                className="content-card"
                key={dieu.id}
              >

                <div>

                  <span className="content-id">
                    #{dieu.id}
                  </span>

                  <h3>
                    {dieu.nom}
                  </h3>

                  <p className="content-civilisation">
                    {dieu.civilisation}
                  </p>

                  <p>
                    {dieu.description ||
                      "Aucune description."}
                  </p>

                </div>

                <div className="content-actions">

                  <button
                    className="edit-button"
                    onClick={() =>
                      editDieu(dieu)
                    }
                  >
                    ✏️ Modifier
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteDieu(dieu.id)
                    }
                  >
                    🗑️ Supprimer
                  </button>

                </div>

              </article>
            ))}

          </div>

        </section>
      )}


      {/* ========================================================
          HÉROS / CRÉATURES
          ======================================================== */}

      {activeSection === "heros" && (
        <section className="admin-section">

          <h2>
            ⚔️ Héros & créatures
          </h2>


          <form
            className="admin-form"
            onSubmit={submitHero}
          >

            <h3>
              {editingType === "hero"
                ? "✏️ Modifier un héros / une créature"
                : "➕ Ajouter un héros / une créature"}
            </h3>


            <label>
              Nom
            </label>

            <input
              type="text"
              value={heroForm.nom}
              onChange={(event) =>
                setHeroForm({
                  ...heroForm,
                  nom: event.target.value,
                })
              }
              placeholder="Ex : Huitzilopochtli"
              required
            />


            <label>
              Type
            </label>

            <select
              value={heroForm.type}
              onChange={(event) =>
                setHeroForm({
                  ...heroForm,
                  type: event.target.value,
                })
              }
              required
            >

              <option value="héros">
                Héros
              </option>

              <option value="créature">
                Créature
              </option>

            </select>


            <label>
              Description
            </label>

            <textarea
              value={heroForm.description}
              onChange={(event) =>
                setHeroForm({
                  ...heroForm,
                  description:
                    event.target.value,
                })
              }
              placeholder="Description..."
              rows="5"
            />


            <label>
              Image
            </label>

            <input
              type="text"
              value={heroForm.image}
              onChange={(event) =>
                setHeroForm({
                  ...heroForm,
                  image: event.target.value,
                })
              }
              placeholder="URL de l'image"
            />


            <label>
              Civilisation
            </label>

            <select
              value={heroForm.civilisation_id}
              onChange={(event) =>
                setHeroForm({
                  ...heroForm,
                  civilisation_id:
                    event.target.value,
                })
              }
              required
            >

              <option value="">
                Sélectionner une civilisation
              </option>

              {civilisations.map(
                (civilisation) => (
                  <option
                    key={civilisation.id}
                    value={civilisation.id}
                  >
                    {civilisation.nom}
                  </option>
                )
              )}

            </select>


            <div className="form-actions">

              <button
                type="submit"
                className="save-button"
              >
                {editingType === "hero"
                  ? "💾 Modifier"
                  : "➕ Ajouter"}
              </button>

              {editingType === "hero" && (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={resetHeroForm}
                >
                  Annuler
                </button>
              )}

            </div>

          </form>


          <div className="admin-content-list">

            {heros.map((hero) => (
              <article
                className="content-card"
                key={hero.id}
              >

                <div>

                  <span className="content-id">
                    #{hero.id}
                  </span>

                  <h3>
                    {hero.nom}
                  </h3>

                  <p className="content-type">
                    {hero.type}
                  </p>

                  <p className="content-civilisation">
                    {hero.civilisation}
                  </p>

                  <p>
                    {hero.description ||
                      "Aucune description."}
                  </p>

                </div>

                <div className="content-actions">

                  <button
                    className="edit-button"
                    onClick={() =>
                      editHero(hero)
                    }
                  >
                    ✏️ Modifier
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteHero(hero.id)
                    }
                  >
                    🗑️ Supprimer
                  </button>

                </div>

              </article>
            ))}

          </div>

        </section>
      )}


      {/* ========================================================
          MYTHES
          ======================================================== */}

      {activeSection === "mythes" && (
        <section className="admin-section">

          <h2>
            📜 Mythes & légendes
          </h2>


          <form
            className="admin-form"
            onSubmit={submitMythe}
          >

            <h3>
              {editingType === "mythe"
                ? "✏️ Modifier un mythe / une légende"
                : "➕ Ajouter un mythe / une légende"}
            </h3>


            <label>
              Titre
            </label>

            <input
              type="text"
              value={mytheForm.titre}
              onChange={(event) =>
                setMytheForm({
                  ...mytheForm,
                  titre: event.target.value,
                })
              }
              placeholder="Ex : La naissance du Soleil"
              required
            />


            <label>
              Description
            </label>

            <textarea
              value={mytheForm.description}
              onChange={(event) =>
                setMytheForm({
                  ...mytheForm,
                  description:
                    event.target.value,
                })
              }
              placeholder="Description..."
              rows="6"
            />


            <label>
              Image
            </label>

            <input
              type="text"
              value={mytheForm.image}
              onChange={(event) =>
                setMytheForm({
                  ...mytheForm,
                  image: event.target.value,
                })
              }
              placeholder="URL de l'image"
            />


            <label>
              Civilisation
            </label>

            <select
              value={mytheForm.civilisation_id}
              onChange={(event) =>
                setMytheForm({
                  ...mytheForm,
                  civilisation_id:
                    event.target.value,
                })
              }
              required
            >

              <option value="">
                Sélectionner une civilisation
              </option>

              {civilisations.map(
                (civilisation) => (
                  <option
                    key={civilisation.id}
                    value={civilisation.id}
                  >
                    {civilisation.nom}
                  </option>
                )
              )}

            </select>


            <div className="form-actions">

              <button
                type="submit"
                className="save-button"
              >
                {editingType === "mythe"
                  ? "💾 Modifier"
                  : "➕ Ajouter"}
              </button>

              {editingType === "mythe" && (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={resetMytheForm}
                >
                  Annuler
                </button>
              )}

            </div>

          </form>


          <div className="admin-content-list">

            {mythes.map((mythe) => (
              <article
                className="content-card"
                key={mythe.id}
              >

                <div>

                  <span className="content-id">
                    #{mythe.id}
                  </span>

                  <h3>
                    {mythe.titre}
                  </h3>

                  <p className="content-civilisation">
                    {mythe.civilisation}
                  </p>

                  <p>
                    {mythe.description ||
                      "Aucune description."}
                  </p>

                </div>

                <div className="content-actions">

                  <button
                    className="edit-button"
                    onClick={() =>
                      editMythe(mythe)
                    }
                  >
                    ✏️ Modifier
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      deleteMythe(mythe.id)
                    }
                  >
                    🗑️ Supprimer
                  </button>

                </div>

              </article>
            ))}

          </div>

        </section>
      )}

    </main>
  );
}

export default Admin;