import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { fetchOrderStats } from "../../../api/orders";
import { getAllUsers } from "../../../api/user";
import { fetchProducts } from "../../../api/product";
import "./Analytics.css";

function Analytics() {
  const { token, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAdmin) {
      loadAnalytics();
    }
  }, [isAdmin]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      const [orderStats, usersData, productsData] = await Promise.all([
        fetchOrderStats(token),
        getAllUsers(token),
        fetchProducts({}),
      ]);

      setStats({
        orders: orderStats.stats,
        users: {
          total: usersData.count,
          list: usersData.users,
        },
        products: {
          total: productsData.total || productsData.data.length,
          list: productsData.data,
        },
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
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
        <p>Loading analytics...</p>
      </div>
    );
  }

  const avgOrderValue = stats?.orders?.totalOrders > 0
    ? (stats.orders.totalRevenueCents / stats.orders.totalOrders / 100).toFixed(2)
    : "0.00";

  const conversionRate = stats?.users?.total > 0
    ? ((stats.orders.totalOrders / stats.users.total) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="analytics">
      {/* Header */}
      <div className="analytics-header">
        <h1>Analytics Dashboard</h1>
        <p>Comprehensive overview of your store performance</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card revenue">
          <div className="metric-icon">💰</div>
          <div className="metric-content">
            <p className="metric-label">Total Revenue</p>
            <p className="metric-value">
              ${((stats?.orders?.totalRevenueCents || 0) / 100).toFixed(2)}
            </p>
            <p className="metric-change">From {stats?.orders?.totalOrders || 0} orders</p>
          </div>
        </div>

        <div className="metric-card orders">
          <div className="metric-icon">📦</div>
          <div className="metric-content">
            <p className="metric-label">Total Orders</p>
            <p className="metric-value">{stats?.orders?.totalOrders || 0}</p>
            <p className="metric-change">
              {stats?.orders?.pendingOrders || 0} pending
            </p>
          </div>
        </div>

        <div className="metric-card avg-order">
          <div className="metric-icon">📊</div>
          <div className="metric-content">
            <p className="metric-label">Avg Order Value</p>
            <p className="metric-value">${avgOrderValue}</p>
            <p className="metric-change">Per transaction</p>
          </div>
        </div>

        <div className="metric-card conversion">
          <div className="metric-icon">🎯</div>
          <div className="metric-content">
            <p className="metric-label">Conversion Rate</p>
            <p className="metric-value">{conversionRate}%</p>
            <p className="metric-change">Orders per user</p>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="analytics-grid">
        {/* Order Status Breakdown */}
        <div className="analytics-card">
          <h2>Order Status Breakdown</h2>
          <div className="breakdown-list">
            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="breakdown-label">
                  <span className="status-dot pending"></span>
                  Pending
                </span>
                <span className="breakdown-value">
                  {stats?.orders?.pendingOrders || 0}
                </span>
              </div>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill pending"
                  style={{ 
                    width: `${((stats?.orders?.pendingOrders || 0) / (stats?.orders?.totalOrders || 1)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="breakdown-label">
                  <span className="status-dot processing"></span>
                  Processing
                </span>
                <span className="breakdown-value">
                  {stats?.orders?.processingOrders || 0}
                </span>
              </div>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill processing"
                  style={{ 
                    width: `${((stats?.orders?.processingOrders || 0) / (stats?.orders?.totalOrders || 1)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="breakdown-label">
                  <span className="status-dot shipped"></span>
                  Shipped
                </span>
                <span className="breakdown-value">
                  {stats?.orders?.shippedOrders || 0}
                </span>
              </div>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill shipped"
                  style={{ 
                    width: `${((stats?.orders?.shippedOrders || 0) / (stats?.orders?.totalOrders || 1)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="breakdown-label">
                  <span className="status-dot delivered"></span>
                  Delivered
                </span>
                <span className="breakdown-value">
                  {stats?.orders?.deliveredOrders || 0}
                </span>
              </div>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill delivered"
                  style={{ 
                    width: `${((stats?.orders?.deliveredOrders || 0) / (stats?.orders?.totalOrders || 1)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="breakdown-item">
              <div className="breakdown-header">
                <span className="breakdown-label">
                  <span className="status-dot cancelled"></span>
                  Cancelled
                </span>
                <span className="breakdown-value">
                  {stats?.orders?.cancelledOrders || 0}
                </span>
              </div>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill cancelled"
                  style={{ 
                    width: `${((stats?.orders?.cancelledOrders || 0) / (stats?.orders?.totalOrders || 1)) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Product & User Stats */}
        <div className="analytics-card">
          <h2>Store Overview</h2>
          <div className="overview-stats">
            <div className="overview-item">
              <div className="overview-icon">🛍️</div>
              <div className="overview-content">
                <p className="overview-label">Total Products</p>
                <p className="overview-value">{stats?.products?.total || 0}</p>
                <p className="overview-detail">
                  {stats?.products?.list?.filter(p => p.isActive).length || 0} active
                </p>
              </div>
            </div>

            <div className="overview-item">
              <div className="overview-icon">👥</div>
              <div className="overview-content">
                <p className="overview-label">Total Users</p>
                <p className="overview-value">{stats?.users?.total || 0}</p>
                <p className="overview-detail">
                  {stats?.users?.list?.filter(u => u.role === "admin").length || 0} admins
                </p>
              </div>
            </div>

            <div className="overview-item">
              <div className="overview-icon">✅</div>
              <div className="overview-content">
                <p className="overview-label">Active Users</p>
                <p className="overview-value">
                  {stats?.users?.list?.filter(u => u.isActive).length || 0}
                </p>
                <p className="overview-detail">Currently active</p>
              </div>
            </div>

            <div className="overview-item">
              <div className="overview-icon">📈</div>
              <div className="overview-content">
                <p className="overview-label">Success Rate</p>
                <p className="overview-value">
                  {stats?.orders?.totalOrders > 0
                    ? (((stats.orders.deliveredOrders / stats.orders.totalOrders) * 100).toFixed(1))
                    : "0.0"}%
                </p>
                <p className="overview-detail">Orders delivered</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Insights */}
      <div className="insights-grid">
        <div className="insight-card">
          <h3>💡 Insights</h3>
          <ul className="insights-list">
            <li>
              You have <strong>{stats?.orders?.pendingOrders || 0}</strong> pending orders 
              that need attention
            </li>
            <li>
              Average order value is <strong>${avgOrderValue}</strong>
            </li>
            <li>
              <strong>{conversionRate}%</strong> of registered users have placed orders
            </li>
            <li>
              <strong>{stats?.products?.list?.filter(p => !p.isActive).length || 0}</strong> products 
              are currently inactive
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Analytics;