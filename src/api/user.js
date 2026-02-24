const BASE_URL = "/api/users";

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