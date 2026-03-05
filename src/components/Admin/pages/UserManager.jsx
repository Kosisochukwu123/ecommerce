import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { getAllUsers, updateUserRole, deleteUser } from "../../../api/user";
import "./UserManager.css";

function UserManager() {
  const { token, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers(token);
      setUsers(response.users);
    } catch (error) {
      console.error("Error loading users:", error);
      alert("Failed to load users: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) {
      return;
    }

    try {
      await updateUserRole(token, userId, newRole);
      alert("User role updated successfully!");
      loadUsers();
    } catch (error) {
      alert("Failed to update role: " + error.message);
    }
  };

  const handleDelete = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteUser(token, userId);
      alert("User deleted successfully!");
      loadUsers();
    } catch (error) {
      alert("Failed to delete user: " + error.message);
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "all" || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  if (!isAdmin) {
    return (
      <div className="access-denied">
        <h1>Access Denied</h1>
        <p>You must be an admin to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-state">
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-manager">
      {/* Header */}
      <div className="user-manager-header">
        <div>
          <h1>User Management</h1>
          <p>{users.length} total users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="user-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="role-filter">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <p className="stat-label">Total Users</p>
            <p className="stat-value">{users.length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-info">
            <p className="stat-label">Regular Users</p>
            <p className="stat-value">{users.filter(u => u.role === "user").length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🛡️</div>
          <div className="stat-info">
            <p className="stat-label">Administrators</p>
            <p className="stat-value">{users.filter(u => u.role === "admin").length}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <p className="stat-label">Active Users</p>
            <p className="stat-value">{users.filter(u => u.isActive).length}</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Wishlist</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-results">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="td-user">
                    <div className="user-cell">
                      <div className="user-avatar">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.username} />
                        ) : (
                          <span>{user.username?.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="user-info">
                        <p className="username">{user.username}</p>
                        {user.firstName && user.lastName && (
                          <p className="full-name">
                            {user.firstName} {user.lastName}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="td-email">{user.email}</td>

                  <td className="td-role">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className={`role-select ${user.role}`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  <td className="td-date">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="td-wishlist">
                    <span className="wishlist-count">
                      {user.wishlist?.length || 0} items
                    </span>
                  </td>

                  <td className="td-status">
                    <span className={`status-badge ${user.isActive ? "active" : "inactive"}`}>
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="td-actions">
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(user._id, user.username)}
                      title="Delete user"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManager;