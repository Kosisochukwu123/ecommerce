import { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { fetchOrders, updateOrderStatus } from "../../../api/orders";
import "./OrderManager.css";

function OrderManager() {
  const { token, isAdmin } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      loadOrders();
    }
  }, [isAdmin]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await fetchOrders(token);
      setOrders(response.orders);
    } catch (error) {
      console.error("Error loading orders:", error);
      alert("Failed to load orders: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    if (!window.confirm(`Change order status to "${newStatus}"?`)) {
      return;
    }

    try {
      await updateOrderStatus(token, orderId, newStatus);
      alert("Order status updated!");
      loadOrders();
    } catch (error) {
      alert("Failed to update status: " + error.message);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "pending",
      processing: "processing",
      shipped: "shipped",
      delivered: "delivered",
      cancelled: "cancelled",
    };
    return colors[status] || "pending";
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;
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
        <p>Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="order-manager">
      {/* Header */}
      <div className="order-manager-header">
        <div>
          <h1>Order Management</h1>
          <p>{orders.length} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="order-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by order number, customer name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="status-filter">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="order-stats">
        <div className="stat-item">
          <span className="stat-label">Total Orders</span>
          <span className="stat-value">{orders.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending</span>
          <span className="stat-value pending">
            {orders.filter(o => o.status === "pending").length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Processing</span>
          <span className="stat-value processing">
            {orders.filter(o => o.status === "processing").length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Shipped</span>
          <span className="stat-value shipped">
            {orders.filter(o => o.status === "shipped").length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Delivered</span>
          <span className="stat-value delivered">
            {orders.filter(o => o.status === "delivered").length}
          </span>
        </div>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-results">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td className="td-order-number">
                    <button
                      className="order-number-btn"
                      onClick={() => setSelectedOrder(order)}
                    >
                      {order.orderNumber}
                    </button>
                  </td>

                  <td className="td-customer">
                    <div className="customer-info">
                      <p className="customer-name">{order.user?.username || "N/A"}</p>
                      <p className="customer-email">{order.user?.email || "N/A"}</p>
                    </div>
                  </td>

                  <td className="td-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                    <br />
                    <small>{new Date(order.createdAt).toLocaleTimeString()}</small>
                  </td>

                  <td className="td-items">
                    {order.items?.length || 0} items
                  </td>

                  <td className="td-total">
                    <strong>${(order.totalCents / 100).toFixed(2)}</strong>
                  </td>

                  <td className="td-payment">
                    <span className={`payment-badge ${order.paymentStatus}`}>
                      {order.paymentStatus}
                    </span>
                  </td>

                  <td className="td-status">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`status-select ${getStatusColor(order.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="td-actions">
                    <button
                      className="btn-view"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content order-detail" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="modal-close" onClick={() => setSelectedOrder(null)}>
                ✕
              </button>
            </div>

            <div className="order-detail-body">
              <div className="detail-section">
                <h3>Order Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Order Number:</span>
                    <span className="detail-value">{selectedOrder.orderNumber}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date:</span>
                    <span className="detail-value">
                      {new Date(selectedOrder.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className={`status-badge ${selectedOrder.status}`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Payment:</span>
                    <span className={`payment-badge ${selectedOrder.paymentStatus}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Customer Information</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Name:</span>
                    <span className="detail-value">{selectedOrder.user?.username}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email:</span>
                    <span className="detail-value">{selectedOrder.user?.email}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.shippingAddress && (
                <div className="detail-section">
                  <h3>Shipping Address</h3>
                  <div className="address-block">
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                      {selectedOrder.shippingAddress.zipCode}
                    </p>
                    <p>{selectedOrder.shippingAddress.country}</p>
                  </div>
                </div>
              )}

              <div className="detail-section">
                <h3>Order Items</h3>
                <div className="order-items-list">
                  {selectedOrder.items?.map((item, index) => (
                    <div key={index} className="order-item">
                      {item.productImage && (
                        <img 
                          src={item.productImage} 
                          alt={item.productName}
                          className="item-image"
                        />
                      )}
                      <div className="item-info">
                        <p className="item-name">{item.productName || "Product"}</p>
                        <p className="item-price">
                          ${(item.priceCents / 100).toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <div className="item-total">
                        ${((item.priceCents * item.quantity) / 100).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-section">
                <div className="order-total">
                  <span className="total-label">Total Amount:</span>
                  <span className="total-value">
                    ${(selectedOrder.totalCents / 100).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManager;