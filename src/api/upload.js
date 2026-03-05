// const BASE_URL = "/api/upload";

const backendAddress = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const BASE_URL = backendAddress + "/api/upload";

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

// Upload image
export const uploadImage = async (token, imageFile) => {
  // Convert image to base64
  const base64Image = await convertToBase64(imageFile);

  const response = await fetch(`${BASE_URL}/image`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ image: base64Image }),
  });

  return handleResponse(response);
};

// Delete image
export const deleteImage = async (token, publicId) => {
  const encodedPublicId = publicId.replace(/\//g, "--");

  const response = await fetch(`${BASE_URL}/image/${encodedPublicId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  return handleResponse(response);
};

// Helper function to convert file to base64
const convertToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};