
import { useState } from "react";
import "./App.css";
import { API_ENDPOINTS } from "./api";
import {  useEffect } from "react";

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
  const params = new URLSearchParams(window.location.search);
  return params.has("token") ? "reset-password" : "home";
  });
  const [currentUser, setCurrentUser] = useState(null);

  const [signupMessage, setSignupMessage] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

const [forgotMessage, setForgotMessage] = useState("");
const [forgotLoading, setForgotLoading] = useState(false);

const [resetMessage, setResetMessage] = useState("");
const [resetLoading, setResetLoading] = useState(false);

  const [stores, setStores] = useState([]);
  const [storeSearch, setStoreSearch] = useState("");
  const [storesLoading, setStoresLoading] = useState(false);
  const [storesError, setStoresError] = useState("");

const [adminStats, setAdminStats] = useState(null);
const [adminUsers, setAdminUsers] = useState([]);
const [adminStores, setAdminStores] = useState([]);
const [adminUserSearch, setAdminUserSearch] = useState("");
const [adminUserRole, setAdminUserRole] = useState("");
const [adminUserSort, setAdminUserSort] = useState("name");
const [adminUserOrder, setAdminUserOrder] = useState("ASC");
const [adminUsersLoading, setAdminUsersLoading] = useState(false);
const [adminUsersError, setAdminUsersError] = useState("");

const [editingUserId, setEditingUserId] = useState(null);

const [editUserData, setEditUserData] = useState({
  name: "",
  email: "",
  address: "",
  role: "user",
});

const [editUserLoading, setEditUserLoading] = useState(false);
const [editUserError, setEditUserError] = useState("");
const [editUserMessage, setEditUserMessage] = useState("");
const [adminUserSuccess, setAdminUserSuccess] = useState("");

const [adminStoreSearch, setAdminStoreSearch] = useState("");
const [adminStoreSort, setAdminStoreSort] = useState("name");
const [adminStoreOrder, setAdminStoreOrder] = useState("ASC");
const [adminStoresLoading, setAdminStoresLoading] = useState(false);
const [adminStoresError, setAdminStoresError] = useState("");

const [showAddStoreForm, setShowAddStoreForm] = useState(false);

const [newStore, setNewStore] = useState({
  name: "",
  email: "",
  address: "",
  ownerId: "",
});

const [addStoreLoading, setAddStoreLoading] = useState(false);
const [addStoreMessage, setAddStoreMessage] = useState("");
const [addStoreError, setAddStoreError] = useState("");

const [editingStoreId, setEditingStoreId] = useState(null);

const [editStoreData, setEditStoreData] = useState({
  name: "",
  email: "",
  address: "",
  ownerId: "",
});

const [editStoreLoading, setEditStoreLoading] = useState(false);
const [editStoreError, setEditStoreError] = useState("");
const [editStoreMessage, setEditStoreMessage] = useState("");


const [deletingStoreId, setDeletingStoreId] = useState(null);
const [deleteStoreLoading, setDeleteStoreLoading] = useState(false);
const [deleteStoreError, setDeleteStoreError] = useState("");
const [adminStoreSuccess, setAdminStoreSuccess] = useState("");

const [deletingUserId, setDeletingUserId] = useState(null);
const [deleteUserLoading, setDeleteUserLoading] = useState(false);
const [deleteUserError, setDeleteUserError] = useState("");

const [ratingValues, setRatingValues] = useState({});
const [ratingMessages, setRatingMessages] = useState({});
const [ratingLoading, setRatingLoading] = useState({});

const [ratingSearch, setRatingSearch] = useState("");
const [ratingFilter, setRatingFilter] = useState("");
const [ratingSort, setRatingSort] = useState("newest");

const [adminRatings, setAdminRatings] = useState([]);
const [adminRatingsLoading, setAdminRatingsLoading] = useState(false);
const [adminRatingsError, setAdminRatingsError] = useState("");

const [ownerStores, setOwnerStores] = useState([]);
const [ownerLoading, setOwnerLoading] = useState(false);
const [ownerError, setOwnerError] = useState("");


const [selectedOwnerStore, setSelectedOwnerStore] = useState(null);
const [ownerRatings, setOwnerRatings] = useState([]);
const [ownerRatingsLoading, setOwnerRatingsLoading] = useState(false);
const [ownerRatingsError, setOwnerRatingsError] = useState("");


  const navigateTo = (page) => {
    setCurrentPage(page);
    setSignupMessage("");
    setLoginMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  useEffect(() => {
  if (!adminStoreSuccess) return;

  const timer = setTimeout(() => {
    setAdminStoreSuccess("");
  }, 3000);

  return () => clearTimeout(timer);
}, [adminStoreSuccess]);
useEffect(() => {
  if (!resetMessage.toLowerCase().includes("successful")) {
    return;
  }

  const timer = setTimeout(() => {
    setResetMessage("");
    window.history.replaceState({}, "", "/");
    setCurrentPage("login");
  }, 3000);

  return () => clearTimeout(timer);
}, [resetMessage]);

const handleSignup = async (event) => {
  event.preventDefault();

  // Save the form before starting the API request
  const form = event.currentTarget;
  const formData = new FormData(form);

  setSignupMessage("");
  setSignupLoading(true);

  const payload = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    address: String(formData.get("address") || "").trim(),
    password: String(formData.get("password") || ""),
  };

  try {
    const response = await fetch(API_ENDPOINTS.signup, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || "Registration failed.");
    }

    // Signup successful
    form.reset();

    setSignupMessage("");
    setLoginMessage(
      data.message || "Account created successfully! Please log in."
    );

    setCurrentPage("login");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } catch (error) {
    setSignupMessage(
      error.message || "Unable to connect to the server."
    );
  } finally {
    setSignupLoading(false);
  }
};

  const fetchStores = async (search = "") => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStoresError("Please log in to view stores.");
      return;
    }

    setStoresLoading(true);
    setStoresError("");

    try {
      const url = new URL(API_ENDPOINTS.stores);
      url.searchParams.set("search", search);

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Unable to fetch stores.");
      }

      setStores(data.stores || []);
    } catch (error) {
      setStoresError(error.message || "Unable to connect to the server.");
    } finally {
      setStoresLoading(false);
    }
  };

  const fetchAdminDashboard = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(API_ENDPOINTS.adminDashboard, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch admin dashboard");
    }

    setAdminStats(data.stats || data);
  } catch (error) {
    console.error("Admin dashboard error:", error);
  }
};

const fetchAdminUsers = async () => {
  try {
    setAdminUsersLoading(true);
    setAdminUsersError("");

    const token = localStorage.getItem("token");

    const params = new URLSearchParams({
      search: adminUserSearch,
      sortBy: adminUserSort,
      order: adminUserOrder,
    });

    if (adminUserRole) {
      params.set("role", adminUserRole);
    }

    const response = await fetch(
      `${API_ENDPOINTS.adminUsers}?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch users");
    }

    setAdminUsers(data.users || []);
  } catch (error) {
    setAdminUsersError(
      error.message || "Unable to load users"
    );
  } finally {
    setAdminUsersLoading(false);
  }
};


const fetchAdminStores = async () => {
  try {
    setAdminStoresLoading(true);
    setAdminStoresError("");

    const token = localStorage.getItem("token");

    const params = new URLSearchParams({
      search: adminStoreSearch,
      sortBy: adminStoreSort,
      order: adminStoreOrder,
    });

    const response = await fetch(
      `${API_ENDPOINTS.adminStores}?${params.toString()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch stores");
    }

    setAdminStores(data.stores || []);
  } catch (error) {
    setAdminStoresError(
      error.message || "Unable to load stores"
    );
  } finally {
    setAdminStoresLoading(false);
  }
};



const handleAddStore = async (event) => {
  event.preventDefault();

  try {
    setAddStoreLoading(true);
    setAddStoreMessage("");
    setAddStoreError("");

    const token = localStorage.getItem("token");

    const payload = {
      name: newStore.name.trim(),
      email: newStore.email.trim(),
      address: newStore.address.trim(),
    };

    if (newStore.ownerId) {
      payload.ownerId = Number(newStore.ownerId);
    }

    const response = await fetch(API_ENDPOINTS.adminStores, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add store");
    }

    setAddStoreMessage(data.message || "Store added successfully!");

    setNewStore({
      name: "",
      email: "",
      address: "",
      ownerId: "",
    });

    setShowAddStoreForm(false); // YAHAN ADD KARO

    await fetchAdminStores();
    await fetchAdminDashboard();
  } catch (error) {
    setAddStoreError(error.message || "Unable to add store");
  } finally {
    setAddStoreLoading(false);
  }
};


const handleEditStore = async (event) => {
  event.preventDefault();

  setEditStoreLoading(true);
  setEditStoreError("");
  setEditStoreMessage("");

  try {
    const token = localStorage.getItem("token");

    const payload = {
      name: editStoreData.name.trim(),
      email: editStoreData.email.trim(),
      address: editStoreData.address.trim(),
      ownerId: editStoreData.ownerId
        ? Number(editStoreData.ownerId)
        : null,
    };

    const response = await fetch(
      `${API_ENDPOINTS.adminStores}/${editingStoreId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update store");
    }

    setEditStoreMessage(
      data.message || "Store updated successfully!"
    );

    setEditingStoreId(null);

    setEditStoreData({
      name: "",
      email: "",
      address: "",
      ownerId: "",
    });

    await fetchAdminStores();
    await fetchAdminDashboard();
  } catch (error) {
    setEditStoreError(
      error.message || "Unable to update store"
    );
  } finally {
    setEditStoreLoading(false);
  }
};


const handleEditUser = async (event) => {
  event.preventDefault();

  if (editingUserId === null) return;

  setEditUserLoading(true);
  setEditUserError("");
  setEditUserMessage("");
  setAdminUserSuccess("");

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_ENDPOINTS.adminUsers}/${editingUserId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editUserData.name,
          email: editUserData.email,
          address: editUserData.address,
          role: editUserData.role,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to update user.");
    }

    setEditingUserId(null);
    setAdminUserSuccess("User updated successfully!");

    await fetchAdminUsers();
    await fetchAdminDashboard();
  } catch (error) {
    setEditUserError(error.message || "Something went wrong.");
  } finally {
    setEditUserLoading(false);
  }
};


const handleDeleteUser = async () => {
  if (deletingUserId === null) return;

  setDeleteUserLoading(true);
  setDeleteUserError("");
  setAdminUserSuccess("");

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_ENDPOINTS.adminUsers}/${deletingUserId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete user.");
    }

    setDeletingUserId(null);
    setAdminUserSuccess("User deleted successfully!");

    await fetchAdminUsers();
    await fetchAdminDashboard();
  } catch (error) {
    setDeleteUserError(
      error.message || "Something went wrong."
    );
  } finally {
    setDeleteUserLoading(false);
  }
};


const handleDeleteStore = async () => {
  if (deletingStoreId === null) return;

  try {
    setDeleteStoreLoading(true);
    setAdminStoreSuccess("");
    setDeleteStoreError("");

    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_ENDPOINTS.adminStores}/${deletingStoreId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

  if (!response.ok) {
  throw new Error(data.message || "Failed to delete store");
 }

setDeletingStoreId(null);
setDeleteStoreError("");
setAdminStoreSuccess("Store deleted successfully!");

await fetchAdminStores();
await fetchAdminDashboard();

  } catch (error) {
    setDeleteStoreError(
      error.message || "Unable to delete store"
    );
  } finally {
    setDeleteStoreLoading(false);
  }
};

const handleForgotPassword = async (event) => {
  event.preventDefault();
  setForgotMessage("");
  setForgotLoading(true);

  const formData = new FormData(event.currentTarget);
  const email = String(formData.get("email") || "").trim();

  try {
    const response = await fetch(API_ENDPOINTS.forgotPassword, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || "Unable to send reset link.");
    }

    setForgotMessage(
      data.message || "If this email is registered, a reset link will be sent."
    );
  } catch (error) {
    setForgotMessage(error.message || "Unable to connect to the server.");
  } finally {
    setForgotLoading(false);
  }
};


const handleResetPassword = async (event) => {
  event.preventDefault();
  setResetMessage("");
  setResetLoading(true);

  const formData = new FormData(event.currentTarget);
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (password !== confirmPassword) {
    setResetMessage("Passwords do not match.");
    setResetLoading(false);
    return;
  }

  const token = new URLSearchParams(window.location.search).get("token");

  if (!token) {
    setResetMessage("Reset token is missing. Please request a new link.");
    setResetLoading(false);
    return;
  }

  try {
    const response = await fetch(API_ENDPOINTS.resetPassword, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();

    if (!response.ok || data.success === false) {
      throw new Error(data.message || "Unable to reset password.");
    }

   setResetMessage("Password reset successful. Redirecting to login...");
    
  } catch (error) {
    setResetMessage(error.message || "Unable to connect to the server.");
  } finally {
    setResetLoading(false);
  }
};

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || ""),
    };

    setLoginLoading(true);

    try {
      const response = await fetch(API_ENDPOINTS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        throw new Error(data.message || "Login failed.");
      }

      if (!data.token || !data.user) {
        throw new Error("Login response is missing token or user details.");
      }

     
localStorage.setItem("token", data.token);
setCurrentUser(data.user);
setStoreSearch("");
setRatingValues({});
setRatingMessages({});


if (data.user.role === "admin") {
  setCurrentPage("admin");
  await fetchAdminDashboard();
  await fetchAdminUsers();
  await fetchAdminStores();
} else if (data.user.role === "store_owner") {
  setCurrentPage("owner");
  await fetchOwnerDashboard();
} else {
  setCurrentPage("dashboard");
  await fetchStores("");
}



      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setLoginMessage(error.message || "Unable to connect to the server.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRatingSubmit = async (storeId) => {
    const rating = Number(ratingValues[storeId]);

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setRatingMessages((prev) => ({
        ...prev,
        [storeId]: {
          success: false,
          message: "Please select a rating between 1 and 5.",
        },
      }));
      return;
    }

    const token = localStorage.getItem("token");

    setRatingLoading((prev) => ({ ...prev, [storeId]: true }));
    setRatingMessages((prev) => ({ ...prev, [storeId]: null }));

    try {
      const response = await fetch(API_ENDPOINTS.ratings, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ storeId, rating }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to submit rating.");
      }

      setRatingMessages((prev) => ({
        ...prev,
        [storeId]: {
          success: true,
          message: data.message || "Rating submitted successfully!",
        },
      }));

      await fetchStores(storeSearch);
    } catch (error) {
      setRatingMessages((prev) => ({
        ...prev,
        [storeId]: {
          success: false,
          message: error.message || "Unable to submit rating.",
        },
      }));
    } finally {
      setRatingLoading((prev) => ({ ...prev, [storeId]: false }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    setStores([]);
    setStoreSearch("");
    setStoresError("");
    setRatingValues({});
    setRatingMessages({});
    setRatingLoading({});
    setLoginMessage("");
    setSignupMessage("");
    setCurrentPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  
const fetchAdminRatings = async () => {
  setAdminRatingsLoading(true);
  setAdminRatingsError("");

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(API_ENDPOINTS.ratings, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch ratings.");
    }

    setAdminRatings(data.ratings || []);
  } catch (error) {
    setAdminRatingsError(
      error.message || "Unable to load ratings."
    );
  } finally {
    setAdminRatingsLoading(false);
  }
};

const filteredAdminRatings = adminRatings
  .filter((rating) => {
    const search = ratingSearch.toLowerCase().trim();

    const matchesSearch =
      rating.user_name?.toLowerCase().includes(search) ||
      rating.user_email?.toLowerCase().includes(search) ||
      rating.store_name?.toLowerCase().includes(search);

    const matchesRating =
      ratingFilter === "" ||
      Number(rating.rating) === Number(ratingFilter);

    return matchesSearch && matchesRating;
  })
  .sort((a, b) => {
    const dateA = new Date(a.updated_at || a.created_at).getTime();
    const dateB = new Date(b.updated_at || b.created_at).getTime();

    return ratingSort === "newest"
      ? dateB - dateA
      : dateA - dateB;
  });

  const fetchOwnerDashboard = async () => {
  setOwnerLoading(true);
  setOwnerError("");

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(API_ENDPOINTS.ownerDashboard, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to load owner dashboard."
      );
    }

    setOwnerStores(data.stores || []);
  } catch (error) {
    setOwnerError(
      error.message || "Unable to load owner dashboard."
    );
  } finally {
    setOwnerLoading(false);
  }
};


const fetchOwnerStoreRatings = async (storeId) => {
  setSelectedOwnerStore(storeId);
  setOwnerRatingsLoading(true);
  setOwnerRatingsError("");
  setOwnerRatings([]);

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      `${API_ENDPOINTS.ownerDashboard.replace("/dashboard", "")}/stores/${storeId}/ratings`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to load customer ratings."
      );
    }

    setOwnerRatings(data.ratings || []);
  } catch (error) {
    setOwnerRatingsError(
      error.message || "Unable to load customer ratings."
    );
  } finally {
    setOwnerRatingsLoading(false);
  }
};


  return (

    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">
        <button
          className="logo"
          onClick={() => navigateTo("home")}
          aria-label="Go to home"
          style={{ border: "none", background: "transparent", cursor: "pointer" }}
        >
          <span className="logo-icon">★</span>
          <span>
            Rate<span className="logo-highlight">Store</span>
          </span>
        </button>

        <nav className="nav-links">
          <button onClick={() => navigateTo("home")}>Home</button>
          <a
            href="#about"
            onClick={(event) => {
              event.preventDefault();
              navigateTo("home");
              setTimeout(() => {
                document.getElementById("about")?.scrollIntoView({
                  behavior: "smooth",
                });
              }, 100);
            }}
          >
            About
          </a>

          {currentUser ? (
            <button onClick={() => navigateTo("dashboard")}>My Account</button>
          ) : (
            <button onClick={() => navigateTo("login")}>Login</button>
          )}
        </nav>

        {currentUser ? (
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="nav-button" onClick={() => navigateTo("signup")}>
            Get Started
          </button>
        )}
      </header>

      {/* HOME PAGE */}
      {currentPage === "home" && (
        <main>
          <section className="hero" id="home">
            <div className="hero-content">
              <span className="hero-badge">
                Your trusted store rating platform
              </span>

              <h1>
                Every Rating
                <br />
                <span>Builds Trust.</span>
              </h1>

              <p className="hero-description">
                Discover trusted stores, share your experiences, and help
                others make better shopping decisions with honest ratings.
              </p>

              <div className="hero-actions">
                <button
                  className="primary-button"
                  onClick={() => navigateTo(currentUser ? "dashboard" : "login")}
                >
                  Explore Stores →
                </button>

                {!currentUser && (
                  <button
                    className="secondary-button"
                    onClick={() => navigateTo("signup")}
                  >
                    Create Account
                  </button>
                )}
              </div>

              <div className="hero-note">
                <span className="note-star">★★★★★</span>
                <span>Real experiences. Honest ratings. Better choices.</span>
              </div>
            </div>

            <div className="hero-visual">
              <div className="rating-card">
                <div className="rating-card-top">
                  <div className="store-icon">S</div>
                  <div>
                    <h3>Store Rating</h3>
                    <p>Customer experience matters</p>
                  </div>
                </div>

                <div className="rating-score">
                  <span className="score-number">4.8</span>
                  <span className="score-out-of">/ 5</span>
                </div>

                <div className="rating-stars">★★★★★</div>
                <p className="rating-caption">
                  Every opinion makes a difference.
                </p>
                <div className="rating-divider"></div>
                <div className="rating-footer">
                  <span className="footer-dot"></span>
                  Built on customer feedback
                </div>
              </div>

              <div className="floating-star">★</div>
              <div className="floating-check">✓</div>
            </div>
          </section>

          <section className="features" id="about">
            <div className="section-heading">
              <span className="section-label">WHY RATESTORE?</span>
              <h2>A better way to rate stores</h2>
              <p>
                A simple platform designed for customers, store owners, and
                administrators.
              </p>
            </div>

            <div className="feature-grid">
              <article className="feature-card">
                <div className="feature-icon purple-icon">★</div>
                <h3>Rate with Confidence</h3>
                <p>
                  Share a rating from 1 to 5 and help other customers choose
                  stores confidently.
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon blue-icon">⌕</div>
                <h3>Discover Stores</h3>
                <p>
                  Find stores by name or address and compare their customer
                  ratings.
                </p>
              </article>

              <article className="feature-card">
                <div className="feature-icon orange-icon">↗</div>
                <h3>Grow with Feedback</h3>
                <p>
                  Store owners can understand customer feedback and track their
                  average ratings.
                </p>
              </article>
            </div>
          </section>
        </main>
      )}

      {/* LOGIN PAGE */}
      {currentPage === "login" && (
        <main className="auth-page" id="login">

          <section className="auth-card">
            <h1>Welcome Back</h1>
            <p>Log in to your RateStore account.</p>

            <form onSubmit={handleLogin}>
              <label htmlFor="login-email">Email Address</label>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />

              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />

{/* Forgot Password link */}
              
<div style={{ textAlign: "right", marginBottom: "16px" }}>
  <button
    type="button"
    className="back-button"
    onClick={() => {
      setForgotMessage("");
      setCurrentPage("forgot-password");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }}
  >
    Forgot Password?
  </button>
</div>


              <button
                className="primary-button auth-submit"
                type="submit"
                disabled={loginLoading}
              >
                {loginLoading ? "Logging in..." : "Login"}
              </button>

              {loginMessage && (
                <p role="status" aria-live="polite" className="form-message">
                  {loginMessage}
                </p>
              )}
            </form>

            <p className="auth-switch">
              Don&apos;t have an account?{" "}
              <button onClick={() => navigateTo("signup")}>Sign up</button>
            </p>

            <button className="back-button" onClick={() => navigateTo("home")}>
              ← Back to Home
            </button>
          </section>

        </main>
      )}

      
{/* FORGOT PASSWORD PAGE */}
   {currentPage === "forgot-password" && (
  <main className="auth-page">
    <section className="auth-card">
      <h1>Forgot Password?</h1>
      <p>Enter your registered email to receive a reset link.</p>

      <form onSubmit={handleForgotPassword}>
        <label htmlFor="forgot-email">Email Address</label>

        <input
          id="forgot-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />

        <button
          className="primary-button auth-submit"
          type="submit"
          disabled={forgotLoading}
        >
          {forgotLoading ? "Sending..." : "Send Reset Link"}
        </button>

        {forgotMessage && (
          <p
            role="status"
            aria-live="polite"
            className="form-message"
          >
            {forgotMessage}
          </p>
        )}
      </form>

      <button
        className="back-button"
        onClick={() => {
          setForgotMessage("");
          setCurrentPage("login");
        }}
      >
        ← Back to Login
      </button>
    </section>
  </main>
   )}


      {/* SIGNUP PAGE */}
      {currentPage === "signup" && (
        <main className="auth-page" id="signup">
          <section className="auth-card">
            <h1>Create Account</h1>
            <p>Join RateStore and share your experience.</p>

            <form onSubmit={handleSignup}>
              <label htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                name="name"
                type="text"
                placeholder="Your full name"
                minLength={20}
                maxLength={60}
                autoComplete="name"
                required
              />

              <label htmlFor="signup-email">Email Address</label>
              <input
                id="signup-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
              />

              <label htmlFor="signup-address">Address</label>
              <textarea
                id="signup-address"
                name="address"
                placeholder="Your address"
                maxLength={400}
                autoComplete="street-address"
                required
              />

              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                name="password"
                type="password"
                placeholder="8–16 characters, uppercase and special character"
                minLength={8}
                maxLength={16}
                pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}"
                title="Use 8–16 characters with at least one uppercase letter and one special character."
                autoComplete="new-password"
                required
              />

              <button
                className="primary-button auth-submit"
                type="submit"
                disabled={signupLoading}
              >
                {signupLoading ? "Creating Account..." : "Create Account"}
              </button>

              {signupMessage && (
                <p role="alert" aria-live="polite" className="form-message">
                  {signupMessage}
                </p>
              )}
            </form>

            <p className="auth-switch">
              Already registered?{" "}
              <button onClick={() => navigateTo("login")}>Login</button>
            </p>

            <button className="back-button" onClick={() => navigateTo("home")}>
              ← Back to Home
            </button>
          </section>
        </main>
      )}

      {/* DASHBOARD */}
      {currentPage === "dashboard" && currentUser && (
        <main className="dashboard-page">

          {/* Separate, centered account card */}

         
<section className="dashboard-account">
  <div className="account-profile-icon">
    {currentUser.name?.trim()?.charAt(0)?.toUpperCase() || "U"}
  </div>

  <span className="account-eyebrow">YOUR ACCOUNT</span>

  <h1>Welcome, {currentUser.name}!</h1>
  <p className="account-subtitle">
    Manage your profile and explore your favourite stores.
  </p>

  <div className="dashboard-details">
    <h3>Account Information</h3>

    <div className="account-detail-row">
      <div className="account-detail-icon">👤</div>
      <div className="account-detail-text">
        <span>Full Name</span>
        <strong>{currentUser.name}</strong>
      </div>
    </div>

    <div className="account-detail-row">
      <div className="account-detail-icon">✉️</div>
      <div className="account-detail-text">
        <span>Email Address</span>
        <strong>{currentUser.email}</strong>
      </div>
    </div>

    <div className="account-detail-row">
      <div className="account-detail-icon">🛡️</div>
      <div className="account-detail-text">
        <span>Account Role</span>
        <strong className="account-role-badge">
          {currentUser.role}
        </strong>
      </div>
    </div>
  </div>

  <div className="account-actions">
    <button
      className="primary-button"
      onClick={() => navigateTo("home")}
    >
      Explore RateStore →
    </button>

    <button
      className="account-logout-button"
      onClick={handleLogout}
    >
      Logout
    </button>
  </div>
</section>


          {/* Separate stores section below the account card */}
          <section className="stores-section">
            <h2>Explore Stores</h2>
            <p>Search stores and check their ratings.</p>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                fetchStores(storeSearch);
              }}
              className="store-search-form"
            >
              <input
                type="text"
                value={storeSearch}
                onChange={(event) => setStoreSearch(event.target.value)}
                placeholder="Search by store name or address..."
                aria-label="Search stores"
              />
              <button
                className="primary-button"
                type="submit"
                disabled={storesLoading}
              >
                {storesLoading ? "Searching..." : "Search"}
              </button>
            </form>

            {storesError && <p role="alert" className="form-message">{storesError}</p>}
            {storesLoading && <p>Loading stores...</p>}
            {!storesLoading && !storesError && stores.length === 0 && (
              <p>No stores found.</p>
            )}

            <div className="store-list">
              {stores.map((store) => (

<article className="store-card" key={store.id}>
  <div className="store-card-header">
    <div className="store-icon-box">🏪</div>
    <div className="store-title">
      <h3>{store.name}</h3>
      <span className="store-label">Verified Store Listing</span>
    </div>
  </div>

  <div className="store-address">
    <span className="detail-icon">📍</span>
    <p>{store.address}</p>
  </div>

  <div className="store-rating-summary">
    <div>
      <span className="summary-label">Average Rating</span>
      <div className="average-rating">
        <span className="stars">
          {"★".repeat(
            Math.min(5, Math.max(0, Math.round(Number(store.average_rating || 0))))
          )}
          {"☆".repeat(
            5 - Math.min(5, Math.max(0, Math.round(Number(store.average_rating || 0))))
          )}
        </span>
        <strong>{Number(store.average_rating || 0).toFixed(1)}</strong>
        <span className="out-of">/ 5</span>
      </div>
    </div>

    <div className="your-rating-box">
      <span className="summary-label">Your Rating</span>
      <strong>
        {Number(store.user_rating || 0) > 0
          ? `${store.user_rating} / 5`
          : "Not rated"}
      </strong>
    </div>
  </div>

  <div className="rating-form">
    <label htmlFor={`rating-${store.id}`}>Rate this store</label>

    <select
      id={`rating-${store.id}`}
      value={
        ratingValues[store.id] !== undefined &&
        ratingValues[store.id] !== ""
          ? ratingValues[store.id]
          : Number(store.user_rating) > 0
            ? String(store.user_rating)
            : ""
      }
      onChange={(event) => {
        setRatingValues((prev) => ({
          ...prev,
          [store.id]: event.target.value,
        }));
        setRatingMessages((prev) => ({
          ...prev,
          [store.id]: null,
        }));
      }}
    >
      <option value="">Select rating</option>
      <option value="1">1 - Poor</option>
      <option value="2">2 - Fair</option>
      <option value="3">3 - Good</option>
      <option value="4">4 - Very Good</option>
      <option value="5">5 - Excellent</option>
    </select>

    <button
      type="button"
      className="primary-button"
      disabled={Boolean(ratingLoading[store.id])}
      onClick={() => handleRatingSubmit(store.id)}
    >
      {ratingLoading[store.id]
        ? "Saving..."
        : Number(store.user_rating || 0) > 0
          ? "Update Rating"
          : "Submit Rating"}
    </button>

    {ratingMessages[store.id] && (
      <p
        role="status"
        className={
          ratingMessages[store.id].success
            ? "rating-success"
            : "rating-error"
        }
      >
        {ratingMessages[store.id].message}
      </p>
    )}
  </div>
</article>


              ))}
            </div>
          </section>
        </main>
      )}

      
{/* RESET PASSWORD PAGE */}
     {currentPage === "reset-password" && (
  <main className="auth-page">
    <section className="auth-card">
      <h1>Reset Password</h1>
      <p>Choose a new password for your RateStore account.</p>

      <form onSubmit={handleResetPassword}>
        <label htmlFor="reset-password">New Password</label>
        <input
          id="reset-password"
          name="password"
          type="password"
          placeholder="8–16 characters"
          minLength={8}
          maxLength={16}
          pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}"
          title="Use 8–16 characters with an uppercase letter and a special character."
          autoComplete="new-password"
          required
        />

        <label htmlFor="confirm-password">Confirm New Password</label>
        <input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter new password"
          minLength={8}
          maxLength={16}
          autoComplete="new-password"
          required
        />

        <button
          className="primary-button auth-submit"
          type="submit"
          disabled={resetLoading}
        >
          {resetLoading ? "Resetting..." : "Reset Password"}
        </button>

        {resetMessage && (
          <p
            role="status"
            aria-live="polite"
            className="form-message"
          >
            {resetMessage}
          </p>
        )}
      </form>

      {resetMessage.toLowerCase().includes("successful") && (
        <button
          className="back-button"
          onClick={() => {
            window.history.replaceState({}, "", "/");
            setResetMessage("");
            setCurrentPage("login");
          }}
        >
          Go to Login
        </button>
      )}
    </section>
  </main>
     )}

      
      {/* ADMIN DASHBOARD */}
      {currentPage === "admin" && currentUser && (
        <main className="dashboard-page">

          <section className="dashboard-account">
            <div className="account-profile-icon">
              {currentUser.name?.trim()?.charAt(0)?.toUpperCase() || "A"}
            </div>

            <span className="account-eyebrow">ADMIN PANEL</span>

            <h1>Welcome, {currentUser.name}!</h1>
            <p className="account-subtitle">
              Manage users, stores, and platform activity.
            </p>
          </section>

          <section className="stores-section">
            <h2>Dashboard Overview</h2>

            <div className="admin-stats-grid">
              <article className="store-card">
                <h3>Total Users</h3>
                <p>{adminStats?.totalUsers ?? adminStats?.total_users ?? "—"}</p>
              </article>

              <article className="store-card">
                <h3>Total Stores</h3>
                <p>{adminStats?.totalStores ?? adminStats?.total_stores ?? "—"}</p>
              </article>

              <article className="store-card">
                <h3>Total Ratings</h3>
                <p>{adminStats?.totalRatings ?? adminStats?.total_ratings ?? "—"}</p>
              </article>
            </div>

            <p>
              Logged in as <strong>{currentUser.role}</strong>
            </p>

            <button
              className="primary-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </section>

          
          {/* USER MANAGEMENT */}

          <section className="stores-section">

            <h2>User Management</h2>
            <p>Search, filter, and sort registered users.</p>

            <form
              className="store-search-form"
              onSubmit={(event) => {
                event.preventDefault();
                fetchAdminUsers();
              }}
            >
              <input
                type="text"
                value={adminUserSearch}
                onChange={(event) =>
                  setAdminUserSearch(event.target.value)
                }
                placeholder="Search by name, email, or address..."
                aria-label="Search users"
              />

              <select
                value={adminUserRole}
                onChange={(event) =>
                  setAdminUserRole(event.target.value)
                }
                aria-label="Filter by role"
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
                <option value="store_owner">Store Owner</option>
              </select>

              <select
                value={adminUserSort}
                onChange={(event) =>
                  setAdminUserSort(event.target.value)
                }
                aria-label="Sort users by"
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="address">Address</option>
                <option value="role">Role</option>
              </select>

              <select
                value={adminUserOrder}
                onChange={(event) =>
                  setAdminUserOrder(event.target.value)
                }
                aria-label="Sort order"
              >
                <option value="ASC">Ascending</option>
                <option value="DESC">Descending</option>
              </select>

              <button
                className="primary-button"
                type="submit"
                disabled={adminUsersLoading}
              >
                {adminUsersLoading ? "Loading..." : "Apply Filters"}
              </button>
            </form>

            {adminUsersError && (
              <p role="alert" className="form-message">
                {adminUsersError}
              </p>
            )}

            {adminUsersLoading && <p>Loading users...</p>}

            {!adminUsersLoading && !adminUsersError && (
              <div style={{ overflowX: "auto", marginTop: "24px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ padding: "12px" }}>Name</th>
                      <th style={{ padding: "12px" }}>Email</th>
                      <th style={{ padding: "12px" }}>Address</th>
                      <th style={{ padding: "12px" }}>Role</th>
                      <th style={{ padding: "12px" }}>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {adminUsers.map((user) => (
                      <tr key={user.id}>
                        <td style={{ padding: "12px" }}>
                          {user.name}
                        </td>
                        <td style={{ padding: "12px" }}>
                          {user.email}
                        </td>
                        <td style={{ padding: "12px" }}>
                          {user.address}
                        </td>
                        <td style={{ padding: "12px" }}>
                          {user.role}
                        </td>

                        
       <td style={{ padding: "12px" }}>
      <div className="store-action-buttons">

   
<button
  type="button"
  onClick={() => {
    setEditingUserId(user.id);

    setEditUserData({
      name: user.name || "",
      email: user.email || "",
      address: user.address || "",
      role: user.role || "user",
    });

    setEditUserError("");
    setEditUserMessage("");
  }}
>
  Edit
</button>

   
<button
  type="button"
  onClick={() => {
    setDeletingUserId(user.id);
    setDeleteUserError("");
  }}
>
  Delete
</button>


  </div>
</td>



                      </tr>
                    ))}

                    {adminUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} style={{ padding: "16px" }}>
                          No users found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          
        <section className="stores-section">
          <h2>Rating Management</h2>
       <p>View ratings submitted by users for different stores.</p>

       <div className="rating-filters">
  <input
    type="text"
    placeholder="Search by user, email, or store..."
    value={ratingSearch}
    onChange={(e) => setRatingSearch(e.target.value)}
  />

  <select
    value={ratingFilter}
    onChange={(e) => setRatingFilter(e.target.value)}
  >
    <option value="">All Ratings</option>
    <option value="5">5 Stars</option>
    <option value="4">4 Stars</option>
    <option value="3">3 Stars</option>
    <option value="2">2 Stars</option>
    <option value="1">1 Star</option>
  </select>

  <select
    value={ratingSort}
    onChange={(e) => setRatingSort(e.target.value)}
  >
    <option value="newest">Newest First</option>
    <option value="oldest">Oldest First</option>
  </select>

     <button
       type="button"
      className="primary-button"
      onClick={() => {
         setRatingSearch("");
         setRatingFilter("");
        setRatingSort("newest");
       }}
     >
      Clear Filters
   </button>
  </div>

    <button
        type="button"
        className="primary-button"
        onClick={fetchAdminRatings}
        disabled={adminRatingsLoading}
     >
     {adminRatingsLoading ? "Loading..." : "Refresh Ratings"}
   </button>

  {adminRatingsError && (
    <p role="alert" className="form-message">
      {adminRatingsError}
    </p>
  )}

  {adminRatingsLoading && <p>Loading ratings...</p>}

  {!adminRatingsLoading && !adminRatingsError && (
    <div style={{ overflowX: "auto", marginTop: "24px" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
        }}
      >
        <thead>
          <tr>
            <th style={{ padding: "12px" }}>User Name</th>
            <th style={{ padding: "12px" }}>User Email</th>
            <th style={{ padding: "12px" }}>Store</th>
            <th style={{ padding: "12px" }}>Rating</th>
            <th style={{ padding: "12px" }}>Updated At</th>
          </tr>
        </thead>

        <tbody>
          {filteredAdminRatings.map((rating) => (
            <tr key={rating.id}>
              <td style={{ padding: "12px" }}>
                {rating.user_name}
              </td>
              <td style={{ padding: "12px" }}>
                {rating.user_email}
              </td>
              <td style={{ padding: "12px" }}>
                {rating.store_name}
              </td>
              <td style={{ padding: "12px" }}>
                {"⭐".repeat(Number(rating.rating))}
                {" "}
                ({rating.rating}/5)
              </td>
              <td style={{ padding: "12px" }}>
                {rating.updated_at
                  ? new Date(rating.updated_at).toLocaleString()
                  : "N/A"}
              </td>
            </tr>
          ))}

         {filteredAdminRatings.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: "16px" }}>
                No ratings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )}
            </section>

          
          {/* STORE MANAGEMENT */}
          <section className="stores-section">
            
            <div className="store-management-header">
              <h2>Store Management</h2>

          {adminStoreSuccess && (
         <p className="admin-store-success" role="status">
         {adminStoreSuccess}
        </p>
     )}

       <button
         type="button"
          onClick={() => {
          setShowAddStoreForm(!showAddStoreForm);
          setAddStoreMessage("");
          setAddStoreError("");
         }}
       >
       {showAddStoreForm ? "Cancel" : "+ Add New Store"}
      </button>
     </div>

       <p>View, search, and sort registered stores.</p>

       {showAddStoreForm && (
       <form onSubmit={handleAddStore} className="add-store-form">
       <h3>Add New Store</h3>

    <div>
      <label htmlFor="storeName">Store Name</label>
      <input
        id="storeName"
        type="text"
        value={newStore.name}
        onChange={(e) =>
          setNewStore({ ...newStore, name: e.target.value })
        }
        required
        maxLength={100}
        placeholder="Enter store name"
      />
    </div>

    <div>
      <label htmlFor="storeEmail">Store Email</label>
      <input
        id="storeEmail"
        type="email"
        value={newStore.email}
        onChange={(e) =>
          setNewStore({ ...newStore, email: e.target.value })
        }
        required
        placeholder="Enter store email"
      />
    </div>

    <div>
      <label htmlFor="storeAddress">Store Address</label>
      <textarea
        id="storeAddress"
        value={newStore.address}
        onChange={(e) =>
          setNewStore({ ...newStore, address: e.target.value })
        }
        required
        maxLength={400}
        placeholder="Enter store address"
      />
    </div>

    <div>
      <label htmlFor="storeOwner">Assign Store Owner (Optional)</label>
      <select
        id="storeOwner"
        value={newStore.ownerId}
        onChange={(e) =>
          setNewStore({ ...newStore, ownerId: e.target.value })
        }
      >
        <option value="">No owner assigned</option>

        {adminUsers
          .filter((user) => user.role === "store_owner")
          .map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} — {user.email}
            </option>
          ))}
      </select>
    </div>

    {addStoreError && (
      <p className="error-message">{addStoreError}</p>
    )}

    {addStoreMessage && (
      <p className="success-message">{addStoreMessage}</p>
    )}

    <button type="submit" disabled={addStoreLoading}>
      {addStoreLoading ? "Adding Store..." : "Add Store"}
    </button>
  </form>
      )}

            <form
              className="store-search-form"
              onSubmit={(event) => {
                event.preventDefault();
                fetchAdminStores();
              }}
            >
              <input
                type="text"
                value={adminStoreSearch}
                onChange={(event) =>
                  setAdminStoreSearch(event.target.value)
                }
                placeholder="Search by store name, email, or address..."
                aria-label="Search stores"
              />

              <select
                value={adminStoreSort}
                onChange={(event) =>
                  setAdminStoreSort(event.target.value)
                }
                aria-label="Sort stores by"
              >
                <option value="name">Store Name</option>
                <option value="email">Email</option>
                <option value="address">Address</option>
                <option value="rating">Average Rating</option>
              </select>

              <select
                value={adminStoreOrder}
                onChange={(event) =>
                  setAdminStoreOrder(event.target.value)
                }
                aria-label="Sort order"
              >
                <option value="ASC">Ascending</option>
                <option value="DESC">Descending</option>
              </select>

              <button
                className="primary-button"
                type="submit"
                disabled={adminStoresLoading}
              >
                {adminStoresLoading ? "Loading..." : "Apply Filters"}
              </button>
            </form>

            {adminStoresError && (
              <p role="alert" className="form-message">
                {adminStoresError}
              </p>
            )}

            {adminStoresLoading && <p>Loading stores...</p>}

            {!adminStoresLoading && !adminStoresError && (
              <div style={{ overflowX: "auto", marginTop: "24px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    textAlign: "left",
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ padding: "12px" }}>Store Name</th>
                      <th style={{ padding: "12px" }}>Email</th>
                      <th style={{ padding: "12px" }}>Address</th>
                      <th style={{ padding: "12px" }}>Owner</th>
                      <th style={{ padding: "12px" }}>Average Rating</th>
                      <th style={{ padding: "12px" }}>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                   
                   
          {adminStores.map((store) => (
          <tr key={store.id}>
          <td style={{ padding: "12px" }}>
          {store.name}
          </td>

    <td style={{ padding: "12px" }}>
      {store.email}
    </td>

    <td style={{ padding: "12px" }}>
      {store.address}
    </td>

    <td style={{ padding: "12px" }}>
      {store.owner_name || "Not assigned"}
    </td>

    <td style={{ padding: "12px" }}>
      {store.average_rating == null
        ? "No ratings"
        : Number(store.average_rating).toFixed(1)}
    </td>

    <td style={{ padding: "12px" }}>
      
 
       <div className="store-action-buttons">
        
     <button
      type="button"

      onClick={() => {
     console.log("Edit clicked:", store);

      setEditingStoreId(store.id);

     setEditStoreData({
      name: store.name || "",
      email: store.email || "",
      address: store.address || "",
      ownerId: store.owner_id
        ? String(store.owner_id)
        : "",
      });

       setEditStoreError("");
      setEditStoreMessage("");
     }}
    >
         Edit
         </button>

    <button
  type="button"
  onClick={() => {
    setDeletingStoreId(store.id);
    setDeleteStoreError("");
  }}
>
  Delete
    </button>

       </div>


    </td>
  </tr>
          ))}

            {adminStores.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          style={{ padding: "16px" }}
                        >
                          No stores found.
                        </td>
                      </tr>
                    )}

             </tbody>

           </table>

                
        {editingStoreId !== null && (
  <div className="edit-modal-overlay">
    <div
      className="edit-modal-content"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-store-title"
    >
      <div className="edit-modal-header">
        <h3 id="edit-store-title">Edit Store</h3>

        <button
          type="button"
          className="edit-modal-close"
          onClick={() => {
            setEditingStoreId(null);
            setEditStoreError("");
            setEditStoreMessage("");
          }}
          disabled={editStoreLoading}
          aria-label="Close edit form"
        >
          &times;
        </button>
      </div>

      {editStoreError && (
        <p style={{ color: "red" }}>{editStoreError}</p>
      )}

      {editStoreMessage && (
        <p style={{ color: "green" }}>{editStoreMessage}</p>
      )}

      <form onSubmit={handleEditStore} className="add-store-form">
        <label>Store Name</label>
        <input
          type="text"
          value={editStoreData.name}
          onChange={(e) =>
            setEditStoreData({
              ...editStoreData,
              name: e.target.value,
            })
          }
          required
        />

        <label>Store Email</label>
        <input
          type="email"
          value={editStoreData.email}
          onChange={(e) =>
            setEditStoreData({
              ...editStoreData,
              email: e.target.value,
            })
          }
          required
        />

        <label>Store Address</label>
        <textarea
          value={editStoreData.address}
          onChange={(e) =>
            setEditStoreData({
              ...editStoreData,
              address: e.target.value,
            })
          }
          maxLength={400}
          required
        />

        <label>Store Owner</label>
        <select
          value={editStoreData.ownerId}
          onChange={(e) =>
            setEditStoreData({
              ...editStoreData,
              ownerId: e.target.value,
            })
          }
        >
          <option value="">No owner assigned</option>

          {adminUsers
            .filter((user) => user.role === "store_owner")
            .map((user) => (
              <option key={user.id} value={String(user.id)}>
                {user.name} ({user.email})
              </option>
            ))}
        </select>

        <div className="edit-modal-actions">
          <button type="submit" disabled={editStoreLoading}>
            {editStoreLoading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingStoreId(null);
              setEditStoreError("");
              setEditStoreMessage("");
            }}
            disabled={editStoreLoading}
          >
            Cancel
          </button>

        </div>
      </form>
    </div>
  </div>
        )}

        
       {editingUserId !== null && (
  <div className="edit-modal-overlay">
    <div
      className="edit-modal-content"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-user-title"
    >
      <div className="edit-modal-header">
        <h3 id="edit-user-title">Edit User</h3>

        <button
          type="button"
          className="edit-modal-close"
          onClick={() => {
            setEditingUserId(null);
            setEditUserError("");
            setEditUserMessage("");
          }}
          disabled={editUserLoading}
          aria-label="Close edit form"
        >
          &times;
        </button>
      </div>

      {editUserError && (
        <p style={{ color: "red" }}>{editUserError}</p>
      )}

      {editUserMessage && (
        <p style={{ color: "green" }}>{editUserMessage}</p>
      )}

      <form onSubmit={handleEditUser} className="add-store-form">
        <label>Name</label>
        <input
          type="text"
          value={editUserData.name}
          onChange={(e) =>
            setEditUserData({
              ...editUserData,
              name: e.target.value,
            })
          }
          minLength={20}
          maxLength={60}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={editUserData.email}
          onChange={(e) =>
            setEditUserData({
              ...editUserData,
              email: e.target.value,
            })
          }
          required
        />

        <label>Address</label>
        <textarea
          value={editUserData.address}
          onChange={(e) =>
            setEditUserData({
              ...editUserData,
              address: e.target.value,
            })
          }
          maxLength={400}
        />

        <label>Role</label>
        <select
          value={editUserData.role}
          onChange={(e) =>
            setEditUserData({
              ...editUserData,
              role: e.target.value,
            })
          }
          required
        >
          <option value="user">User</option>
          <option value="store_owner">Store Owner</option>
          <option value="admin">Admin</option>
        </select>

        <div className="edit-modal-actions">
          <button type="submit" disabled={editUserLoading}>
            {editUserLoading ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingUserId(null);
              setEditUserError("");
              setEditUserMessage("");
            }}
            disabled={editUserLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
       )}

       
       {deletingUserId !== null && (
  <div className="edit-modal-overlay">
    <div
      className="edit-modal-content"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-user-title"
    >
      <div className="edit-modal-header">
        <h3 id="delete-user-title">Delete User</h3>

        <button
          type="button"
          className="edit-modal-close"
          onClick={() => {
            setDeletingUserId(null);
            setDeleteUserError("");
          }}
          disabled={deleteUserLoading}
          aria-label="Close confirmation"
        >
          &times;
        </button>
      </div>

      <p>
        Are you sure you want to delete{" "}
        <strong>
          {adminUsers.find(
            (user) => user.id === deletingUserId
          )?.name || "this user"}
        </strong>
        ?
      </p>

      <p>This action cannot be undone.</p>

      {deleteUserError && (
        <p style={{ color: "red" }} role="alert">
          {deleteUserError}
        </p>
      )}

      <div className="edit-modal-actions">
        <button
          type="button"
          onClick={handleDeleteUser}
          disabled={deleteUserLoading}
        >
          {deleteUserLoading
            ? "Deleting..."
            : "Confirm Delete"}
        </button>

        <button
          type="button"
          onClick={() => {
            setDeletingUserId(null);
            setDeleteUserError("");
          }}
          disabled={deleteUserLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
      )}



        {deletingStoreId !== null && (
  <div className="edit-modal-overlay">
    <div
      className="edit-modal-content delete-modal-content"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-store-title"
    >
      <div className="edit-modal-header">
        <h3 id="delete-store-title">Delete Store</h3>

        <button
          type="button"
          className="edit-modal-close"
          onClick={() => {
            setDeletingStoreId(null);
            setDeleteStoreError("");
          }}
          disabled={deleteStoreLoading}
          aria-label="Close delete confirmation"
        >
          &times;
        </button>
      </div>

      <p>
        Are you sure you want to delete{" "}
        <strong>
          {adminStores.find(
            (store) => store.id === deletingStoreId
          )?.name || "this store"}
        </strong>
        ?
      </p>

      <p>This action cannot be undone.</p>

      {deleteStoreError && (
        <p className="delete-store-error" role="alert">
          {deleteStoreError}
        </p>
      )}

      <div className="edit-modal-actions">
        <button
          type="button"
          onClick={handleDeleteStore}
          disabled={deleteStoreLoading}
        >
          {deleteStoreLoading ? "Deleting..." : "Confirm Delete"}
        </button>

        <button
          type="button"
          onClick={() => {
            setDeletingStoreId(null);
            setDeleteStoreError("");
          }}
          disabled={deleteStoreLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
        )}


              </div>
            )}
          </section>


        </main>
      )}

      {/* STORE OWNER DASHBOARD */}
      {currentPage === "owner" && currentUser && (

  <main className="dashboard-page">

    <section className="dashboard-account">
      <div className="account-profile-icon">
        {currentUser.name?.trim()?.charAt(0)?.toUpperCase() || "O"}
      </div>

      <span className="account-eyebrow">STORE OWNER PANEL</span>

      <h1>Welcome, {currentUser.name}!</h1>

      <p className="account-subtitle">
        View your stores and their rating performance.
      </p>
    </section>

    {/* Yahan hum agle step mein Owner Dashboard cards add karenge */}
     
     
{/* OWNER STORES SECTION */}
<section className="owner-stores-section">
  <div className="owner-stores-heading">
    <div>
      <h2>My Stores</h2>
      <p>Monitor your store ratings and performance.</p>
    </div>

    <button
      type="button"
      onClick={fetchOwnerDashboard}
      disabled={ownerLoading}
    >
      {ownerLoading ? "Loading..." : "Refresh Dashboard"}
    </button>
  </div>

  {ownerLoading && (
    <p>Loading your stores...</p>
  )}

  {ownerError && (
    <p className="error-message">{ownerError}</p>
  )}

  {!ownerLoading && !ownerError && ownerStores.length === 0 && (
    <p>No stores are assigned to your account yet.</p>
  )}

  {!ownerLoading && !ownerError && ownerStores.length > 0 && (
    <div className="owner-stores-grid">
      {ownerStores.map((store) => (
        <article className="owner-store-card" key={store.id}>
          <h3>{store.name}</h3>

          <p>{store.address || "Address not available"}</p>

          <p>
            <strong>Email:</strong>{" "}
            {store.email || "Not available"}
          </p>

          <div className="owner-store-stats">

            <div>
              <span>Average Rating</span>
              <strong>
                ⭐ {Number(store.average_rating || 0).toFixed(1)} / 5
              </strong>
            </div>

            <div>
              <span>Total Ratings</span>
              <strong>{store.total_ratings || 0}</strong>
            </div>

           
<div className="owner-rating-distribution">
  <h4>Rating Distribution</h4>

  {[
    { label: "5 Stars", key: "five_star" },
    { label: "4 Stars", key: "four_star" },
    { label: "3 Stars", key: "three_star" },
    { label: "2 Stars", key: "two_star" },
    { label: "1 Star", key: "one_star" },
  ].map((item) => {
    const count = Number(store[item.key] || 0);
    const total = Number(store.total_ratings || 0);
    const percentage = total > 0 ? (count / total) * 100 : 0;

    return (

       <div className="owner-rating-bar-row" key={item.key}>
  <span className="owner-rating-bar-label">
    {item.label}
  </span>

  <div className="owner-rating-bar-track">
    <div
      className="owner-rating-bar-fill"
      style={{
        width: `${percentage}%`,
        minWidth: count > 0 ? "24px" : "0",
      }}
    />
  </div>

  <span className="owner-rating-percentage">
    {percentage.toFixed(1)}%
  </span>

  <span className="owner-rating-bar-count">
    {count}
  </span>
</div>
    

    );
  })}
</div>


          </div>

          
<button
  type="button"
  className="owner-view-ratings-btn"
  onClick={() => fetchOwnerStoreRatings(store.id)}
  disabled={ownerRatingsLoading}
>
  {ownerRatingsLoading && selectedOwnerStore === store.id
    ? "Loading Ratings..."
    : "View Customer Ratings"}
</button>


        </article>
      ))}
    </div>
  )}
</section>


{selectedOwnerStore !== null && (
  <section className="owner-ratings-section">

  
      
<div className="owner-ratings-header">
  <div>
    <p className="owner-ratings-eyebrow">
      STORE PERFORMANCE
    </p>

    <h2>
      Customer Ratings
      {ownerStores.find(
        (store) => String(store.id) === String(selectedOwnerStore)
      )?.name && (
        <span className="owner-selected-store-name">
          {" "}—{" "}
          {ownerStores.find(
            (store) => String(store.id) === String(selectedOwnerStore)
          ).name}
        </span>
      )}
    </h2>

    <p className="owner-ratings-subtitle">
      See what your customers think about your store.
    </p>
  </div>

  <button
    type="button"
    className="owner-close-ratings-btn"
    onClick={() => {
      setSelectedOwnerStore(null);
      setOwnerRatings([]);
      setOwnerRatingsError("");
    }}
  >
    ✕ Close Ratings
  </button>
</div>


    {ownerRatingsLoading && <p>Loading customer ratings...</p>}

    {ownerRatingsError && (
      <p className="error-message">{ownerRatingsError}</p>
    )}

    {!ownerRatingsLoading && !ownerRatingsError &&
      ownerRatings.length === 0 && (
        <p>No customer ratings found for this store.</p>
      )}

    {!ownerRatingsLoading && !ownerRatingsError &&
      ownerRatings.length > 0 && (
        <div className="owner-ratings-list">
          {ownerRatings.map((rating, index) => (
            <article
              className="owner-rating-card"
              key={`${rating.user_id}-${index}`}
            >
              <h3>{rating.user_name}</h3>
              <p>{rating.user_email}</p>

              
<div className="owner-rating-score">
  <span className="owner-rating-stars">
    {"⭐".repeat(Number(rating.rating))}
  </span>
  <span className="owner-rating-value">
    {rating.rating}/5
  </span>
</div>

              <p>
                <strong>Rated on:</strong>{" "}
                {rating.updated_at
                  ? new Date(rating.updated_at).toLocaleDateString()
                  : "Date unavailable"}
              </p>
            </article>
          ))}
        </div>
      )}
  </section>
)}

  </main>
 )}


      {/* FOOTER */}
      <footer className="footer">
        <button
          className="logo"
          onClick={() => navigateTo("home")}
          aria-label="Go to home"
          style={{ border: "none", background: "transparent", cursor: "pointer" }}
        >
          <span className="logo-icon">★</span>
          <span>
            Rate<span className="logo-highlight">Store</span>
          </span>
        </button>

        <p>Making every rating count.</p>
        <p>© {new Date().getFullYear()} RateStore</p>
      </footer>


    </div>
  );
}

export default App;
