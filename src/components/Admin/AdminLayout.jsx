import { Outlet, useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import "./AdminLayout.css";

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      logout();
      navigate("/Login");
    }
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="admin-layout">
      {/* Top Header with Profile */}
      <header className="admin-header">
        {/* Mobile Menu Toggle */}
        <button
          className="menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <div className="admin-brand">
          <h1>Admin Dashboard</h1>
        </div>

        <div className="admin-profile">
          <div className="admin-user-info">
            <div className="admin-avatar">
              {user?.username?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="admin-details">
              <p className="admin-username">{user?.username || "Admin"}</p>
              <p className="admin-role">{user?.role || "Administrator"}</p>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="admin-container">
        {/* Sidebar Overlay (Mobile) */}
        <div
          className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
          onClick={closeSidebar}
        />

        {/* Sidebar Navigation */}
        <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
          <nav className="admin-nav">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={closeSidebar}
            >
              📊 Dashboard
            </NavLink>

            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={closeSidebar}
            >
              📦 Products
            </NavLink>

            <NavLink
              to="/admin/Users"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={closeSidebar}
            >
              👥 Users
            </NavLink>

            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={closeSidebar}
            >
              🛒 Orders
            </NavLink>

            <NavLink
              to="/admin/analytics"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={closeSidebar}
            >
              📈 Analytics
            </NavLink>

            <NavLink
              to="/admin/faq"
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              onClick={closeSidebar}
            >
              ❓ FAQ
            </NavLink>
          </nav>

          {/* Quick Actions in Sidebar */}
          <div className="sidebar-footer">
            <button
              className="btn-secondary"
              onClick={() => {
                navigate("/");
                closeSidebar();
              }}
            >
              🏠 View Store
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
