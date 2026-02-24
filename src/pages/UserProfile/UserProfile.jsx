import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../../api/user";
import "./UserProfile.css";

function UserProfile() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user) {
      navigate("/LoginFace");
      return;
    }

    loadProfile();
  }, [user, navigate]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      console.log(
        "📡 Loading profile with token:",
        token?.substring(0, 20) + "...",
      );

      const response = await getUserProfile(token);
      console.log("✅ Profile response:", response);

      // Handle different response structures
      const userData = response.user || response;
      console.log("👤 Setting profile:", userData);

      setProfile(userData);
    } catch (error) {
      console.error("❌ Error loading profile:", error);

      // Don't logout on profile load error, just show the error
      alert("Could not load full profile. Showing basic info.");

      // Use the user from context as fallback
      setProfile(user);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/");
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <p>Loading profile...</p>
      </div>
    );
  }

  // Use profile if available, otherwise fall back to user from context
  const displayUser = profile || user;

  if (!displayUser) {
    return (
      <div className="profile-error">
        <p>Failed to load profile</p>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="user-profile">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {displayUser.avatar ? (
                <img src={displayUser.avatar} alt={displayUser.username} />
              ) : (
                <span className="avatar-initials">
                  {(displayUser.username || displayUser.email)
                    ?.charAt(0)
                    .toUpperCase()}
                </span>
              )}
            </div>
            <div className="profile-info">
              <h1>
                {displayUser.fullName ||
                  (displayUser.firstName && displayUser.lastName
                    ? `${displayUser.firstName} ${displayUser.lastName}`
                    : displayUser.username)}
              </h1>
              <p className="profile-email">{displayUser.email}</p>
              <span className={`profile-badge ${displayUser.role}`}>
                {displayUser.role === "admin" ? "Administrator" : "Customer"}
              </span>
            </div>
          </div>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-container">
        {/* Sidebar Navigation */}
        <aside className="profile-sidebar">
          <nav className="profile-nav">
            <button
              className={`profile-nav-item ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              <span className="nav-icon">👤</span>
              <span>Overview</span>
            </button>
            <button
              className={`profile-nav-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <span className="nav-icon">⚙️</span>
              <span>Settings</span>
            </button>
            <button
              className={`profile-nav-item ${activeTab === "addresses" ? "active" : ""}`}
              onClick={() => setActiveTab("addresses")}
            >
              <span className="nav-icon">📍</span>
              <span>Addresses</span>
            </button>
            <button
              className={`profile-nav-item ${activeTab === "wishlist" ? "active" : ""}`}
              onClick={() => setActiveTab("wishlist")}
            >
              <span className="nav-icon">❤️</span>
              <span>Wishlist</span>
            </button>
            <button
              className={`profile-nav-item ${activeTab === "orders" ? "active" : ""}`}
              onClick={() => setActiveTab("orders")}
            >
              <span className="nav-icon">📦</span>
              <span>Orders</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="profile-main">
          {activeTab === "overview" && (
            <div className="profile-tab-content">
              <h2>Account Overview</h2>
              <div className="overview-grid">
                <div className="overview-card">
                  <h3>Personal Information</h3>
                  <div className="info-row">
                    <span className="info-label">Username:</span>
                    <span className="info-value">{displayUser.username}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Email:</span>
                    <span className="info-value">{displayUser.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Phone:</span>
                    <span className="info-value">
                      {displayUser.phone || "Not provided"}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Member since:</span>
                    <span className="info-value">
                      {displayUser.createdAt
                        ? new Date(displayUser.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <button
                    className="btn-edit"
                    onClick={() => setActiveTab("settings")}
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="overview-card">
                  <h3>Quick Stats</h3>
                  <div className="stat-item">
                    <span className="stat-icon">📦</span>
                    <div>
                      <p className="stat-value">0</p>
                      <p className="stat-label">Total Orders</p>
                    </div>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">❤️</span>
                    <div>
                      <p className="stat-value">
                        {displayUser.wishlist?.length || 0}
                      </p>
                      <p className="stat-label">Wishlist Items</p>
                    </div>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">📍</span>
                    <div>
                      <p className="stat-value">
                        {displayUser.addresses?.length || 0}
                      </p>
                      <p className="stat-label">Saved Addresses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="profile-tab-content">
              <h2>Profile Settings</h2>
              <p>Edit your profile information below:</p>
              <button
                className="btn-primary"
                onClick={() => navigate("/profile/settings")}
                style={{ marginTop: "20px" }}
              >
                Go to Settings →
              </button>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="profile-tab-content">
              <h2>Saved Addresses</h2>
              {displayUser.addresses && displayUser.addresses.length > 0 ? (
                <div className="addresses-grid">
                  {displayUser.addresses.map((address) => (
                    <div key={address._id} className="address-card">
                      <div className="address-header">
                        <span className="address-type">{address.type}</span>
                        {address.isDefault && (
                          <span className="badge-default">Default</span>
                        )}
                      </div>
                      <p>{address.street}</p>
                      <p>
                        {address.city}, {address.state} {address.zipCode}
                      </p>
                      <p>{address.country}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-message">
                  <p>No saved addresses yet.</p>
                  <button className="btn-primary">Add Address</button>
                </div>
              )}
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="profile-tab-content">
              <h2>My Wishlist</h2>
              {displayUser.wishlist && displayUser.wishlist.length > 0 ? (
                <p>
                  You have {displayUser.wishlist.length} items in your wishlist.
                </p>
              ) : (
                <div className="empty-message">
                  <p>Your wishlist is empty.</p>
                  <button
                    className="btn-primary"
                    onClick={() => navigate("/products")}
                  >
                    Browse Products
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className="profile-tab-content">
              <h2>Order History</h2>
              <div className="empty-message">
                <p>No orders yet. Start shopping!</p>
                <button
                  className="btn-primary"
                  onClick={() => navigate("/products")}
                >
                  Shop Now
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default UserProfile;
