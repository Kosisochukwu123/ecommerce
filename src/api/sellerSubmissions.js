const backendAddress = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const BASE_URL = backendAddress + "/api/seller-submissions";


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

// Submit product
export const submitProduct = async (token, productData) => {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
};

// Get my submissions
export const getMySubmissions = async (token) => {
  const response = await fetch(`${BASE_URL}/my-submissions`, {
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

// Get all submissions (admin)
export const getAllSubmissions = async (token, status = "all") => {
  const url = status !== "all" ? `${BASE_URL}?status=${status}` : BASE_URL;
  const response = await fetch(url, {
    headers: authHeaders(token),
  });
  return handleResponse(response);
};

// Approve submission (admin)
export const approveSubmission = async (token, submissionId, notes = "") => {
  const response = await fetch(`${BASE_URL}/${submissionId}/approve`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ notes }),
  });
  return handleResponse(response);
};

// Reject submission (admin)
export const rejectSubmission = async (token, submissionId, reason = "") => {
  const response = await fetch(`${BASE_URL}/${submissionId}/reject`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ reason }),
  });
  return handleResponse(response);
};

// Delete submission
export const deleteSubmission = async (token, submissionId) => {
  const response = await fetch(`${BASE_URL}/${submissionId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  return handleResponse(response);
};