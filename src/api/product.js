// const BASE_URL = "/api";

const backendAddress = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const BASE_URL = backendAddress + "/api";


// Helper to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

// Get all products (with optional filters)
export const fetchProducts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/products${queryString ? `?${queryString}` : ""}`;
  
  const response = await fetch(url);
  return handleResponse(response);
};

// Get single product by ID
export const fetchProductById = async (id) => {
  const response = await fetch(`${BASE_URL}/products/${id}`);
  return handleResponse(response);
};

// Get all categories
export const fetchCategories = async () => {
  const response = await fetch(`${BASE_URL}/products/categories`);
  return handleResponse(response);
};

// Admin: Create product
export const createProduct = async (productData, token) => {
  const response = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
};

// Admin: Update product
export const updateProduct = async (id, productData, token) => {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
};

// Admin: Toggle product active status
export const toggleProduct = async (id, token) => {
  const response = await fetch(`${BASE_URL}/products/${id}/toggle`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// Admin: Delete product
export const deleteProduct = async (id, token) => {
  const response = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};