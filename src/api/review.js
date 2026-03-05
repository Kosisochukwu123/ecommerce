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

// Add review
export const addReview = async (token, productId, reviewData) => {
  const response = await fetch(`/api/products/${productId}/reviews`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(reviewData),
  });

  return handleResponse(response);
};

// Get reviews
export const getReviews = async (productId) => {
  const response = await fetch(`/api/products/${productId}/reviews`);
  return handleResponse(response);
};

// Delete review
export const deleteReview = async (token, productId, reviewId) => {
  const response = await fetch(`/api/products/${productId}/reviews/${reviewId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  return handleResponse(response);
};