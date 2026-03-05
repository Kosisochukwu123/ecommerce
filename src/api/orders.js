const backendAddress = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const BASE_URL = backendAddress + "/api/orders";


const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

const authHeaders = (token) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

// Get all orders
export const fetchOrders = async (token) => {
  const response = await fetch(BASE_URL, {
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

// Get single order
export const fetchOrder = async (token, orderId) => {
  const response = await fetch(`${BASE_URL}/${orderId}`, {
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

// Create order
export const createOrder = async (token, orderData) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(orderData),
  });
  return handleResponse(response);
};

// Update order status
export const updateOrderStatus = async (token, orderId, status) => {
  const response = await fetch(`${BASE_URL}/${orderId}/status`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
};

// Get order stats
export const fetchOrderStats = async (token) => {
  const response = await fetch(`${BASE_URL}/stats/overview`, {
    headers: authHeaders(token),
  });
  return handleResponse(response);
};