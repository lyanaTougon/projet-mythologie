import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";

const API_URL = "http://localhost:5000";

const emptyDieu = {
  nom: "",
  description: "",
  image: "",
  image2: "",
  image3: "",
  civilisation_id: "",
};

const emptyHero = {
  nom: "",
  type: "héros",
  description: "",
  image: "",
  image2: "",
  image3: "",
  civilisation_id: "",
};

const emptyMythe = {
  titre: "",
  description: "",
  image: "",
  image2: "",
  image3: "",
  civilisation_id: "",
};


/* ============================================================
   COMPOSANT POUR CHOISIR UNE IMAGE
   ============================================================ */

function ImagePicker({ label, value, onChange }) {
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    // Vérification du type
    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image.");
      return;
    }

    // Limite de 2,5 Mo
    if (file.size > 2.5 * 1024 * 1024) {
      setError("L'image doit faire moins de 2,5 Mo.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      onChange(reader.result);
    };

    reader.onerror = () => {
      setError("Impossible de lire cette image.");
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    onChange("");
    setError("");
  };

  return (
    <div className="image-picker">

      <label className="image-picker-label">
        {label}
      </label>

      <label className="file-input-button">
        📁 Choisir une image
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </label>

      {value ? (
        <div className="image-preview-container">

          <img
            src={value}
            alt={`Aperçu ${label}`}
            className="image-preview"
          />

          <button
            type="button"
            className="remove-image-button"
            onClick={removeImage}
          >
            🗑️ Retirer cette image
          </button>

        </div>
      ) : (
        <div className="image-preview-empty">
          <span>🖼️</span>
          <p>Aucune image sélectionnée</p>
        </div>
      )}

      {error && (
        <p className="image-error">
          ❌ {error}
        </p>
      )}

    </div>
  );
}


/* ============================================================
   APERÇU DES IMAGES D'UNE CARTE
   ============================================================ */

function CardImages({ item, fallback }) {
  const images = [
    item.image,
    item.image2,
    item.image3,
  ].filter(Boolean);

  if (images.length === 0) {
    return (
      <div className="admin-card-no-image">
        {fallback}
      </div>
    );
  }

  return (
    <div className="admin-card-images">

      <img
        src={images[0]}
        alt=""
        className="admin-card-main-image"
      />

      {images.length > 1 && (
        <div className="admin-card-thumbnails">

          {images.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt={`Image ${index + 1}`}
            />
          ))}

        </div>
      )}

    </div>
  );
}


/* ============================================================
   ADMIN
   ============================================================ */

function Admin() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDieux: 0,
    totalHeros: 0,
    totalMythes: 0,
  });

  const [users, setUsers] = useState([]);
  const [dieux, setDieux] = useState([]);
  const [heros, setHeros] = useState([]);
  const [mythes, setMythes] = useState([]);
  const [civilisations, setCivilisations] = useState([]);

  const [dieuData, setDieuData] = useState(emptyDieu);
  const [heroData, setHeroData] = useState(emptyHero);
  const [mytheData, setMytheData] = useState(emptyMythe);

  const [editingDieu, setEditingDieu] = useState(null);
  const [editingHero, setEditingHero] = useState(null);
  const [editingMythe, setEditingMythe] = useState(null);

  const getToken = () => {
    return localStorage.getItem("token");
  };


  /* ============================================================
     MESSAGES
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
     VÉRIFICATION ADMIN
     ============================================================ */

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/connexion");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      if (parsedUser.role !== "admin") {
        navigate("/");
        return;
      }

      setUser(parsedUser);

    } catch (err) {
      console.error(err);

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/connexion");
    }
  }, [navigate]);


  /* ============================================================
     CHARGEMENT DES DONNÉES
     ============================================================ */

  useEffect(() => {
    if (!user) {
      return;
    }

    loadData();
  }, [user]);


  const loadData = async () => {
    await Promise.all([
      loadStats(),
      loadUsers(),
      loadDieux(),
      loadHeros(),
      loadMythes(),
      loadCivilisations(),
    ]);
  };


  /* ============================================================
     STATISTIQUES
     ============================================================ */

  const loadStats = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return;
      }

      setStats((current) => ({
        ...current,
        totalUsers: data.totalUsers || 0,
      }));

    } catch (err) {
      console.error("Erreur statistiques :", err);
    }
  };


  /* ============================================================
     UTILISATEURS
     ============================================================ */

  const loadUsers = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return;
      }

      setUsers(data.users || []);

    } catch (err) {
      console.error("Erreur utilisateurs :", err);
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
        return;
      }

      const list = data.dieux || [];

      setDieux(list);

      setStats((current) => ({
        ...current,
        totalDieux: list.length,
      }));

    } catch (err) {
      console.error("Erreur dieux :", err);
    }
  };


  /* ============================================================
     HEROS
     ============================================================ */

  const loadHeros = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/heros`
      );

      const data = await response.json();

      if (!response.ok) {
        return;
      }

      const list = data.heros || [];

      setHeros(list);

      setStats((current) => ({
        ...current,
        totalHeros: list.length,
      }));

    } catch (err) {
      console.error("Erreur héros :", err);
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
        return;
      }

      const list = data.mythes || [];

      setMythes(list);

      setStats((current) => ({
        ...current,
        totalMythes: list.length,
      }));

    } catch (err) {
      console.error("Erreur mythes :", err);
    }
  };


  /* ============================================================
     CIVILISATIONS
     ============================================================ */

  const loadCivilisations = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/civilisations`
      );

      if (response.ok) {
        const data = await response.json();

        setCivilisations(
          data.civilisations || []
        );

        return;
      }

    } catch (err) {
      console.log(
        "Route civilisations non disponible."
      );
    }

    setCivilisations([
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
    ]);
  };


  /* ============================================================
     DÉCONNEXION
     ============================================================ */

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/connexion");
  };


  /* ============================================================
     UTILISATEUR - SUPPRESSION
     ============================================================ */

  const deleteUser = async (id) => {
    if (Number(id) === Number(user?.id)) {
      showError(
        "Vous ne pouvez pas supprimer votre propre compte."
      );
      return;
    }

    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cet utilisateur ?"
    );

    if (!confirmation) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/admin/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de supprimer l'utilisateur."
        );
      }

      showMessage(
        "Utilisateur supprimé avec succès."
      );

      await loadUsers();
      await loadStats();

    } catch (err) {
      showError(err.message);
    }
  };


  /* ============================================================
     DIEU - CHANGEMENT
     ============================================================ */

  const handleDieuChange = (event) => {
    const { name, value } = event.target;

    setDieuData((current) => ({
      ...current,
      [name]: value,
    }));
  };


  /* ============================================================
     DIEU - AJOUT
     ============================================================ */

  const addDieu = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/dieux`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            nom: dieuData.nom,
            description: dieuData.description,
            image: dieuData.image,
            image2: dieuData.image2,
            image3: dieuData.image3,
            civilisation_id: Number(
              dieuData.civilisation_id
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible d'ajouter le dieu."
        );
      }

      showMessage(
        "Dieu ajouté avec succès."
      );

      resetDieu();
      await loadDieux();

    } catch (err) {
      showError(err.message);
    }
  };


  /* ============================================================
     DIEU - MODIFICATION
     ============================================================ */

  const editDieu = (dieu) => {
    setEditingDieu(dieu);

    setDieuData({
      nom: dieu.nom || "",
      description: dieu.description || "",
      image: dieu.image || "",
      image2: dieu.image2 || "",
      image3: dieu.image3 || "",
      civilisation_id:
        dieu.civilisation_id || "",
    });

    setActiveSection("dieux");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const updateDieu = async (event) => {
    event.preventDefault();

    if (!editingDieu) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/dieux/${editingDieu.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            nom: dieuData.nom,
            description: dieuData.description,
            image: dieuData.image,
            image2: dieuData.image2,
            image3: dieuData.image3,
            civilisation_id: Number(
              dieuData.civilisation_id
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de modifier le dieu."
        );
      }

      showMessage(
        "Dieu modifié avec succès."
      );

      setEditingDieu(null);
      resetDieu();

      await loadDieux();

    } catch (err) {
      showError(err.message);
    }
  };


  /* ============================================================
     DIEU - SUPPRESSION
     ============================================================ */

  const deleteDieu = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer ce dieu ?"
    );

    if (!confirmation) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/dieux/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de supprimer le dieu."
        );
      }

      showMessage(
        "Dieu supprimé avec succès."
      );

      await loadDieux();

    } catch (err) {
      showError(err.message);
    }
  };


  /* ============================================================
     HEROS - CHANGEMENT
     ============================================================ */

  const handleHeroChange = (event) => {
    const { name, value } = event.target;

    setHeroData((current) => ({
      ...current,
      [name]: value,
    }));
  };


  /* ============================================================
     HEROS - AJOUT
     ============================================================ */

  const addHero = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/heros`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            nom: heroData.nom,
            type: heroData.type,
            description: heroData.description,
            image: heroData.image,
            image2: heroData.image2,
            image3: heroData.image3,
            civilisation_id: Number(
              heroData.civilisation_id
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible d'ajouter la fiche."
        );
      }

      showMessage(
        "Fiche ajoutée avec succès."
      );

      resetHero();
      await loadHeros();

    } catch (err) {
      showError(err.message);
    }
  };


  /* ============================================================
     HEROS - MODIFICATION
     ============================================================ */

  const editHero = (hero) => {
    setEditingHero(hero);

    setHeroData({
      nom: hero.nom || "",
      type: hero.type || "héros",
      description: hero.description || "",
      image: hero.image || "",
      image2: hero.image2 || "",
      image3: hero.image3 || "",
      civilisation_id:
        hero.civilisation_id || "",
    });

    setActiveSection("heros");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const updateHero = async (event) => {
    event.preventDefault();

    if (!editingHero) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/heros/${editingHero.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            nom: heroData.nom,
            type: heroData.type,
            description: heroData.description,
            image: heroData.image,
            image2: heroData.image2,
            image3: heroData.image3,
            civilisation_id: Number(
              heroData.civilisation_id
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de modifier la fiche."
        );
      }

      showMessage(
        "Fiche modifiée avec succès."
      );

      setEditingHero(null);
      resetHero();

      await loadHeros();

    } catch (err) {
      showError(err.message);
    }
  };


  /* ============================================================
     HEROS - SUPPRESSION
     ============================================================ */

  const deleteHero = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer cette fiche ?"
    );

    if (!confirmation) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/heros/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de supprimer la fiche."
        );
      }

      showMessage(
        "Fiche supprimée avec succès."
      );

      await loadHeros();

    } catch (err) {
      showError(err.message);
    }
  };


  /* ============================================================
     MYTHE - CHANGEMENT
     ============================================================ */

  const handleMytheChange = (event) => {
    const { name, value } = event.target;

    setMytheData((current) => ({
      ...current,
      [name]: value,
    }));
  };


  /* ============================================================
     MYTHE - AJOUT
     ============================================================ */

  const addMythe = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        `${API_URL}/api/mythes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            titre: mytheData.titre,
            description: mytheData.description,
            image: mytheData.image,
            image2: mytheData.image2,
            image3: mytheData.image3,
            civilisation_id: Number(
              mytheData.civilisation_id
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible d'ajouter le mythe."
        );
      }

      showMessage(
        "Mythe ajouté avec succès."
      );

      resetMythe();
      await loadMythes();

    } catch (err) {
      showError(err.message);
    }
  };


  /* ============================================================
     MYTHE - MODIFICATION
     ============================================================ */

  const editMythe = (mythe) => {
    setEditingMythe(mythe);

    setMytheData({
      titre: mythe.titre || "",
      description: mythe.description || "",
      image: mythe.image || "",
      image2: mythe.image2 || "",
      image3: mythe.image3 || "",
      civilisation_id:
        mythe.civilisation_id || "",
    });

    setActiveSection("mythes");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  const updateMythe = async (event) => {
    event.preventDefault();

    if (!editingMythe) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/mythes/${editingMythe.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            titre: mytheData.titre,
            description: mytheData.description,
            image: mytheData.image,
            image2: mytheData.image2,
            image3: mytheData.image3,
            civilisation_id: Number(
              mytheData.civilisation_id
            ),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de modifier le mythe."
        );
      }

      showMessage(
        "Mythe modifié avec succès."
      );

      setEditingMythe(null);
      resetMythe();

      await loadMythes();

    } catch (err) {
      showError(err.message);
    }
  };


  /* ============================================================
     MYTHE - SUPPRESSION
     ============================================================ */

  const deleteMythe = async (id) => {
    const confirmation = window.confirm(
      "Voulez-vous vraiment supprimer ce mythe ?"
    );

    if (!confirmation) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/mythes/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Impossible de supprimer le mythe."
        );
      }

      showMessage(
        "Mythe supprimé avec succès."
      );

      await loadMythes();

    } catch (err) {
      showError(err.message);
    }
  };


  /* ============================================================
     RESET
     ============================================================ */

  const resetDieu = () => {
    setDieuData({
      ...emptyDieu,
    });
  };

  const resetHero = () => {
    setHeroData({
      ...emptyHero,
    });
  };

  const resetMythe = () => {
    setMytheData({
      ...emptyMythe,
    });
  };


  const cancelEdit = () => {
    setEditingDieu(null);
    setEditingHero(null);
    setEditingMythe(null);

    resetDieu();
    resetHero();
    resetMythe();
  };


  /* ============================================================
     PROTECTION
     ============================================================ */

  if (!user || user.role !== "admin") {
    return null;
  }


  /* ============================================================
     AFFICHAGE
     ============================================================ */

  return (
    <main className="admin-page">

      {/* ======================================================
          SIDEBAR
          ====================================================== */}

      <aside className="admin-sidebar">

        <div className="admin-logo">
          <span>🏛️</span>
          <strong>Mythologie</strong>
        </div>

        <div className="admin-title">
          Administration
        </div>

        <nav className="admin-menu">

          <button
            className={
              activeSection === "dashboard"
                ? "active"
                : ""
            }
            onClick={() => {
              cancelEdit();
              setActiveSection("dashboard");
            }}
          >
            📊
            <span>Tableau de bord</span>
          </button>

          <button
            className={
              activeSection === "users"
                ? "active"
                : ""
            }
            onClick={() => {
              cancelEdit();
              setActiveSection("users");
            }}
          >
            👥
            <span>Utilisateurs</span>
          </button>

          <button
            className={
              activeSection === "dieux"
                ? "active"
                : ""
            }
            onClick={() => {
              cancelEdit();
              setActiveSection("dieux");
            }}
          >
            🏛️
            <span>Dieux & déesses</span>
          </button>

          <button
            className={
              activeSection === "heros"
                ? "active"
                : ""
            }
            onClick={() => {
              cancelEdit();
              setActiveSection("heros");
            }}
          >
            ⚔️
            <span>Héros & créatures</span>
          </button>

          <button
            className={
              activeSection === "mythes"
                ? "active"
                : ""
            }
            onClick={() => {
              cancelEdit();
              setActiveSection("mythes");
            }}
          >
            📜
            <span>Mythes & légendes</span>
          </button>

        </nav>

        <div className="admin-sidebar-bottom">

          <button
            className="admin-home-button"
            onClick={() => navigate("/")}
          >
            🏠
            <span>Retour au site</span>
          </button>

          <button
            className="admin-logout-button"
            onClick={logout}
          >
            🚪
            <span>Déconnexion</span>
          </button>

        </div>

      </aside>


      {/* ======================================================
          CONTENU
          ====================================================== */}

      <section className="admin-content">

        <header className="admin-header">

          <div>
            <h1>Administration</h1>

            <p>
              Bienvenue,{" "}
              <strong>{user.username}</strong>
            </p>
          </div>

          <div className="admin-header-user">
            👑 Administrateur
          </div>

        </header>


        {message && (
          <div className="admin-message success">
            ✅ {message}
          </div>
        )}

        {error && (
          <div className="admin-message error">
            ❌ {error}
          </div>
        )}


        {/* ======================================================
            DASHBOARD
            ====================================================== */}

        {activeSection === "dashboard" && (
          <section>

            <div className="admin-section-header">
              <h2>📊 Tableau de bord</h2>
              <p>
                Vue générale du site.
              </p>
            </div>

            <div className="stats-grid">

              <div className="stat-card">
                <div className="stat-icon">
                  👥
                </div>

                <div>
                  <span>Utilisateurs</span>
                  <strong>
                    {stats.totalUsers}
                  </strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  🏛️
                </div>

                <div>
                  <span>Dieux & déesses</span>
                  <strong>
                    {stats.totalDieux}
                  </strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  ⚔️
                </div>

                <div>
                  <span>Héros & créatures</span>
                  <strong>
                    {stats.totalHeros}
                  </strong>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">
                  📜
                </div>

                <div>
                  <span>Mythes & légendes</span>
                  <strong>
                    {stats.totalMythes}
                  </strong>
                </div>
              </div>

            </div>


            <div className="dashboard-welcome">

              <div className="dashboard-welcome-icon">
                🏛️
              </div>

              <div>
                <h3>
                  Panneau d'administration
                </h3>

                <p>
                  Gérez les utilisateurs,
                  les dieux, les héros,
                  les créatures, les mythes
                  et les légendes du site.
                </p>
              </div>

            </div>

          </section>
        )}


        {/* ======================================================
            UTILISATEURS
            ====================================================== */}

        {activeSection === "users" && (
          <section>

            <div className="admin-section-header">
              <h2>👥 Utilisateurs</h2>

              <p>
                Gestion des comptes utilisateurs.
              </p>
            </div>

            <div className="admin-table-container">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Date</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {users.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="empty-table"
                      >
                        Aucun utilisateur.
                      </td>
                    </tr>
                  ) : (
                    users.map((item) => (
                      <tr key={item.id}>

                        <td>
                          #{item.id}
                        </td>

                        <td>
                          <strong>
                            {item.username}
                          </strong>
                        </td>

                        <td>
                          {item.email}
                        </td>

                        <td>
                          <span
                            className={
                              item.role === "admin"
                                ? "role admin"
                                : "role user"
                            }
                          >
                            {item.role === "admin"
                              ? "👑 Admin"
                              : "👤 User"}
                          </span>
                        </td>

                        <td>
                          {item.created_at
                            ? new Date(
                                item.created_at
                              ).toLocaleDateString(
                                "fr-FR"
                              )
                            : "-"}
                        </td>

                        <td>
                          {Number(item.id) ===
                          Number(user.id) ? (
                            <span className="current-user">
                              Votre compte
                            </span>
                          ) : (
                            <button
                              className="delete-button"
                              onClick={() =>
                                deleteUser(item.id)
                              }
                            >
                              🗑️ Supprimer
                            </button>
                          )}
                        </td>

                      </tr>
                    ))
                  )}

                </tbody>

              </table>

            </div>

          </section>
        )}


        {/* ======================================================
            DIEUX
            ====================================================== */}

        {activeSection === "dieux" && (
          <section>

            <div className="admin-section-header">
              <h2>🏛️ Dieux & déesses</h2>

              <p>
                Ajouter, modifier ou supprimer
                des divinités.
              </p>
            </div>


            <div className="admin-form-card">

              <h3>
                {editingDieu
                  ? "✏️ Modifier la fiche"
                  : "➕ Ajouter un dieu ou une déesse"}
              </h3>

              <form
                onSubmit={
                  editingDieu
                    ? updateDieu
                    : addDieu
                }
              >

                <div className="form-grid">

                  <div className="form-group">
                    <label>
                      Nom
                    </label>

                    <input
                      type="text"
                      name="nom"
                      value={dieuData.nom}
                      onChange={handleDieuChange}
                      placeholder="Ex : Quetzalcóatl"
                      required
                    />
                  </div>


                  <div className="form-group">
                    <label>
                      Civilisation
                    </label>

                    <select
                      name="civilisation_id"
                      value={
                        dieuData.civilisation_id
                      }
                      onChange={handleDieuChange}
                      required
                    >
                      <option value="">
                        Choisir une civilisation
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
                  </div>

                </div>


                <div className="images-section">

                  <h4>
                    🖼️ Images
                  </h4>

                  <p className="images-help">
                    Choisis jusqu'à 3 images
                    depuis ton ordinateur.
                    Elles seront utilisées dans
                    le carrousel.
                  </p>

                  <div className="image-fields">

                    <ImagePicker
                      label="Image 1 — principale"
                      value={dieuData.image}
                      onChange={(value) =>
                        setDieuData((current) => ({
                          ...current,
                          image: value,
                        }))
                      }
                    />

                    <ImagePicker
                      label="Image 2"
                      value={dieuData.image2}
                      onChange={(value) =>
                        setDieuData((current) => ({
                          ...current,
                          image2: value,
                        }))
                      }
                    />

                    <ImagePicker
                      label="Image 3"
                      value={dieuData.image3}
                      onChange={(value) =>
                        setDieuData((current) => ({
                          ...current,
                          image3: value,
                        }))
                      }
                    />

                  </div>

                </div>


                <div className="form-group">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={dieuData.description}
                    onChange={handleDieuChange}
                    placeholder="Description..."
                    rows="6"
                    required
                  />

                </div>


                <div className="form-actions">

                  <button
                    type="submit"
                    className="save-button"
                  >
                    {editingDieu
                      ? "💾 Enregistrer"
                      : "➕ Ajouter"}
                  </button>

                  {editingDieu && (
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={cancelEdit}
                    >
                      Annuler
                    </button>
                  )}

                </div>

              </form>

            </div>


            <div className="content-list">

              {dieux.map((dieu) => (
                <article
                  className="admin-content-card"
                  key={dieu.id}
                >

                  <CardImages
                    item={dieu}
                    fallback="🏛️"
                  />

                  <div className="admin-card-info">

                    <span className="content-tag">
                      {dieu.civilisation_nom ||
                        "Civilisation"}
                    </span>

                    <h3>
                      {dieu.nom}
                    </h3>

                    <p>
                      {dieu.description}
                    </p>

                    <div className="card-actions">

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

                  </div>

                </article>
              ))}

            </div>

          </section>
        )}


        {/* ======================================================
            HEROS & CREATURES
            ====================================================== */}

        {activeSection === "heros" && (
          <section>

            <div className="admin-section-header">
              <h2>⚔️ Héros & créatures</h2>

              <p>
                Ajouter, modifier ou supprimer
                des héros et créatures.
              </p>
            </div>


            <div className="admin-form-card">

              <h3>
                {editingHero
                  ? "✏️ Modifier la fiche"
                  : "➕ Ajouter une fiche"}
              </h3>

              <form
                onSubmit={
                  editingHero
                    ? updateHero
                    : addHero
                }
              >

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Nom
                    </label>

                    <input
                      type="text"
                      name="nom"
                      value={heroData.nom}
                      onChange={handleHeroChange}
                      placeholder="Ex : Thor"
                      required
                    />

                  </div>


                  <div className="form-group">

                    <label>
                      Type
                    </label>

                    <select
                      name="type"
                      value={heroData.type}
                      onChange={handleHeroChange}
                      required
                    >
                      <option value="héros">
                        ⚔️ Héros
                      </option>

                      <option value="créature">
                        🐉 Créature
                      </option>
                    </select>

                  </div>

                </div>


                <div className="form-group">

                  <label>
                    Civilisation
                  </label>

                  <select
                    name="civilisation_id"
                    value={
                      heroData.civilisation_id
                    }
                    onChange={handleHeroChange}
                    required
                  >
                    <option value="">
                      Choisir une civilisation
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

                </div>


                <div className="images-section">

                  <h4>
                    🖼️ Images
                  </h4>

                  <p className="images-help">
                    Choisis jusqu'à 3 images
                    depuis ton ordinateur.
                    Elles seront utilisées dans
                    le carrousel.
                  </p>

                  <div className="image-fields">

                    <ImagePicker
                      label="Image 1 — principale"
                      value={heroData.image}
                      onChange={(value) =>
                        setHeroData((current) => ({
                          ...current,
                          image: value,
                        }))
                      }
                    />

                    <ImagePicker
                      label="Image 2"
                      value={heroData.image2}
                      onChange={(value) =>
                        setHeroData((current) => ({
                          ...current,
                          image2: value,
                        }))
                      }
                    />

                    <ImagePicker
                      label="Image 3"
                      value={heroData.image3}
                      onChange={(value) =>
                        setHeroData((current) => ({
                          ...current,
                          image3: value,
                        }))
                      }
                    />

                  </div>

                </div>


                <div className="form-group">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={heroData.description}
                    onChange={handleHeroChange}
                    placeholder="Description..."
                    rows="6"
                    required
                  />

                </div>


                <div className="form-actions">

                  <button
                    type="submit"
                    className="save-button"
                  >
                    {editingHero
                      ? "💾 Enregistrer"
                      : "➕ Ajouter"}
                  </button>

                  {editingHero && (
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={cancelEdit}
                    >
                      Annuler
                    </button>
                  )}

                </div>

              </form>

            </div>


            <div className="content-list">

              {heros.map((hero) => (
                <article
                  className="admin-content-card"
                  key={hero.id}
                >

                  <CardImages
                    item={hero}
                    fallback={
                      hero.type === "héros"
                        ? "⚔️"
                        : "🐉"
                    }
                  />

                  <div className="admin-card-info">

                    <span className="content-tag">
                      {hero.type === "héros"
                        ? "⚔️ Héros"
                        : "🐉 Créature"}
                    </span>

                    <h3>
                      {hero.nom}
                    </h3>

                    <p>
                      {hero.description}
                    </p>

                    <p className="content-civilisation">
                      {hero.civilisation_nom ||
                        "Civilisation"}
                    </p>

                    <div className="card-actions">

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

                  </div>

                </article>
              ))}

            </div>

          </section>
        )}


        {/* ======================================================
            MYTHES
            ====================================================== */}

        {activeSection === "mythes" && (
          <section>

            <div className="admin-section-header">
              <h2>📜 Mythes & légendes</h2>

              <p>
                Ajouter, modifier ou supprimer
                des mythes et légendes.
              </p>
            </div>


            <div className="admin-form-card">

              <h3>
                {editingMythe
                  ? "✏️ Modifier le mythe"
                  : "➕ Ajouter un mythe"}
              </h3>

              <form
                onSubmit={
                  editingMythe
                    ? updateMythe
                    : addMythe
                }
              >

                <div className="form-group">

                  <label>
                    Titre
                  </label>

                  <input
                    type="text"
                    name="titre"
                    value={mytheData.titre}
                    onChange={handleMytheChange}
                    placeholder="Ex : La naissance du Soleil"
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    Civilisation
                  </label>

                  <select
                    name="civilisation_id"
                    value={
                      mytheData.civilisation_id
                    }
                    onChange={handleMytheChange}
                    required
                  >
                    <option value="">
                      Choisir une civilisation
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

                </div>


                <div className="images-section">

                  <h4>
                    🖼️ Images
                  </h4>

                  <p className="images-help">
                    Choisis jusqu'à 3 images
                    depuis ton ordinateur.
                    Elles seront utilisées dans
                    le carrousel.
                  </p>

                  <div className="image-fields">

                    <ImagePicker
                      label="Image 1 — principale"
                      value={mytheData.image}
                      onChange={(value) =>
                        setMytheData((current) => ({
                          ...current,
                          image: value,
                        }))
                      }
                    />

                    <ImagePicker
                      label="Image 2"
                      value={mytheData.image2}
                      onChange={(value) =>
                        setMytheData((current) => ({
                          ...current,
                          image2: value,
                        }))
                      }
                    />

                    <ImagePicker
                      label="Image 3"
                      value={mytheData.image3}
                      onChange={(value) =>
                        setMytheData((current) => ({
                          ...current,
                          image3: value,
                        }))
                      }
                    />

                  </div>

                </div>


                <div className="form-group">

                  <label>
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={mytheData.description}
                    onChange={handleMytheChange}
                    placeholder="Description du mythe..."
                    rows="7"
                    required
                  />

                </div>


                <div className="form-actions">

                  <button
                    type="submit"
                    className="save-button"
                  >
                    {editingMythe
                      ? "💾 Enregistrer"
                      : "➕ Ajouter"}
                  </button>

                  {editingMythe && (
                    <button
                      type="button"
                      className="cancel-button"
                      onClick={cancelEdit}
                    >
                      Annuler
                    </button>
                  )}

                </div>

              </form>

            </div>


            <div className="content-list">

              {mythes.map((mythe) => (
                <article
                  className="admin-content-card"
                  key={mythe.id}
                >

                  <CardImages
                    item={mythe}
                    fallback="📜"
                  />

                  <div className="admin-card-info">

                    <span className="content-tag">
                      📜 Mythe & légende
                    </span>

                    <h3>
                      {mythe.titre}
                    </h3>

                    <p>
                      {mythe.description}
                    </p>

                    <p className="content-civilisation">
                      {mythe.civilisation_nom ||
                        "Civilisation"}
                    </p>

                    <div className="card-actions">

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

                  </div>

                </article>
              ))}

            </div>

          </section>
        )}

      </section>

    </main>
  );
}

export default Admin;