import { useState, useEffect } from "react";
import { useAuth } from "../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { fetchOrderStats } from "../../../../api/orders";
import { getAllUsers } from "../../../../api/user";
import { fetchProducts } from "../../../../api/product";
import "./Dashboard.css";

function Dashboard() {
  const { token, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    orders: null,
    users: null,
    products: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch all stats in parallel
      const [orderStats, usersData, productsData] = await Promise.all([
        fetchOrderStats(token).catch(() => ({ stats: null })),
        getAllUsers(token).catch(() => ({ users: [], count: 0 })),
        fetchProducts({}).catch(() => ({ data: [], total: 0 })),
      ]);

      setStats({
        orders: orderStats.stats,
        users: {
          total: usersData.count || usersData.users?.length || 0,
          admins: usersData.users?.filter(u => u.role === "admin").length || 0,
        },
        products: {
          total: productsData.total || productsData.data?.length || 0,
          active: productsData.data?.filter(p => p.isActive).length || 0,
        },
      });
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.username}! 👋</h1>
          <p>Here's what's happening with your store today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid-large">
        {/* Revenue Card */}
        <div className="stat-card-large revenue">
          <div className="stat-header">
            <span className="stat-icon">💰</span>
            <h3>Total Revenue</h3>
          </div>
          <p className="stat-value-large">
            ${((stats.orders?.totalRevenueCents || 0) / 100).toFixed(2)}
          </p>
          <p className="stat-subtitle">From {stats.orders?.totalOrders || 0} orders</p>
        </div>

        {/* Orders Card */}
        <div className="stat-card-large orders">
          <div className="stat-header">
            <span className="stat-icon">📦</span>
            <h3>Total Orders</h3>
          </div>
          <p className="stat-value-large">{stats.orders?.totalOrders || 0}</p>
          <p className="stat-subtitle">
            {stats.orders?.pendingOrders || 0} pending
          </p>
        </div>

        {/* Users Card */}
        <div className="stat-card-large users">
          <div className="stat-header">
            <span className="stat-icon">👥</span>
            <h3>Total Users</h3>
          </div>
          <p className="stat-value-large">{stats.users?.total || 0}</p>
          <p className="stat-subtitle">
            {stats.users?.admins || 0} administrators
          </p>
        </div>

        {/* Products Card */}
        <div className="stat-card-large products">
          <div className="stat-header">
            <span className="stat-icon">🛍️</span>
            <h3>Total Products</h3>
          </div>
          <p className="stat-value-large">{stats.products?.total || 0}</p>
          <p className="stat-subtitle">
            {stats.products?.active || 0} active
          </p>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="section-grid">
        <div className="section-card">
          <h2>Order Status Overview</h2>
          <div className="status-list">
            <div className="status-item">
              <div className="status-info">
                <span className="status-dot pending"></span>
                <span className="status-label">Pending</span>
              </div>
              <span className="status-count">{stats.orders?.pendingOrders || 0}</span>
            </div>

            <div className="status-item">
              <div className="status-info">
                <span className="status-dot processing"></span>
                <span className="status-label">Processing</span>
              </div>
              <span className="status-count">{stats.orders?.processingOrders || 0}</span>
            </div>

            <div className="status-item">
              <div className="status-info">
                <span className="status-dot shipped"></span>
                <span className="status-label">Shipped</span>
              </div>
              <span className="status-count">{stats.orders?.shippedOrders || 0}</span>
            </div>

            <div className="status-item">
              <div className="status-info">
                <span className="status-dot delivered"></span>
                <span className="status-label">Delivered</span>
              </div>
              <span className="status-count">{stats.orders?.deliveredOrders || 0}</span>
            </div>

            <div className="status-item">
              <div className="status-info">
                <span className="status-dot cancelled"></span>
                <span className="status-label">Cancelled</span>
              </div>
              <span className="status-count">{stats.orders?.cancelledOrders || 0}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section-card">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <button 
              className="action-btn"
              onClick={() => navigate("/admin/products")}
            >
              <span className="action-icon">➕</span>
              <span>Add New Product</span>
            </button>

            <button 
              className="action-btn"
              onClick={() => navigate("/admin/orders")}
            >
              <span className="action-icon">📋</span>
              <span>View All Orders</span>
            </button>

            <button 
              className="action-btn"
              onClick={() => navigate("/admin/Users")}
            >
              <span className="action-icon">👤</span>
              <span>Manage Users</span>
            </button>

            <button 
              className="action-btn"
              onClick={() => navigate("/admin/analytics")}
            >
              <span className="action-icon">📊</span>
              <span>View Analytics</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;