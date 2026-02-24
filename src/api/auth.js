// const BASE_URL = "/api/users";
const backendAddress = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const BASE_URL = backendAddress + "/api/users";


const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

// Register new user
export const register = async (username, email, password) => {  // Added username
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),  // Include username
  });
  return handleResponse(response);
};

// Login
export const login = async (email, password) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

// Logout (optional - your backend doesn't have this route yet)
export const logout = async (token) => {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Get current user
export const getMe = async (token) => {
  const response = await fetch(`${BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};