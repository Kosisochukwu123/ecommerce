const backendAddress = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const BASE_URL = backendAddress + "/api/users";
// const BASE_URL = "/api/users";

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

// Get full user profile
export const getUserProfile = async (token) => {
  const response = await fetch(`${BASE_URL}/profile`, {
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

// Update user profile
export const updateUserProfile = async (token, profileData) => {
  const response = await fetch(`${BASE_URL}/profile`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(profileData),
  });
  return handleResponse(response);
};

// Change password
export const changePassword = async (token, passwordData) => {
  const response = await fetch(`${BASE_URL}/change-password`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(passwordData),
  });
  return handleResponse(response);
};

// Add address
export const addAddress = async (token, addressData) => {
  const response = await fetch(`${BASE_URL}/address`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(addressData),
  });
  return handleResponse(response);
};

// Update address
export const updateAddress = async (token, addressId, addressData) => {
  const response = await fetch(`${BASE_URL}/address/${addressId}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(addressData),
  });
  return handleResponse(response);
};

// Delete address
export const deleteAddress = async (token, addressId) => {
  const response = await fetch(`${BASE_URL}/address/${addressId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

// Add to wishlist
export const addToWishlist = async (token, productId) => {
  const response = await fetch(`${BASE_URL}/wishlist/${productId}`, {
    method: "POST",
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

// Remove from wishlist
export const removeFromWishlist = async (token, productId) => {
  const response = await fetch(`${BASE_URL}/wishlist/${productId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

// Get wishlist with full product details
export const getWishlist = async (token) => {
  const response = await fetch(`${BASE_URL}/wishlist`, {
    headers: authHeaders(token),
  });
  return handleResponse(response);
};


// Get all users (Admin only)
export const getAllUsers = async (token) => {
  const response = await fetch(`${BASE_URL}/all`, {
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

// Update user role (Admin only)
export const updateUserRole = async (token, userId, role) => {
  const response = await fetch(`${BASE_URL}/${userId}/role`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ role }),
  });
  return handleResponse(response);
};

// Delete user (Admin only)
export const deleteUser = async (token, userId) => {
  const response = await fetch(`${BASE_URL}/${userId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

