const backendAddress = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const BASE_URL = `${backendAddress}/api/auth`;

// ============================================
// HELPER FUNCTIONS
// ============================================

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
};

// ============================================
// AUTHENTICATION
// ============================================

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password
 * @param {string} [userData.phone] - Phone number (optional)
 * @param {string} [userData.firstName] - First name (optional)
 * @param {string} [userData.lastName] - Last name (optional)
 */
export const register = async (userData) => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

/**
 * Login with email/phone and password
 * @param {string} identifier - Email or phone number
 * @param {string} password - Password
 */
export const login = async (identifier, password) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });
  return handleResponse(response);
};

/**
 * Logout (invalidate token)
 * @param {string} token - JWT token
 */
export const logout = async (token) => {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

/**
 * Get current user data
 * @param {string} token - JWT token
 */
export const getMe = async (token) => {
  const response = await fetch(`${BASE_URL}/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

// ============================================
// PASSWORD RESET
// ============================================

/**
 * Request password reset code
 * @param {string} email - User's email address
 */
export const forgotPassword = async (email) => {
  const response = await fetch(`${BASE_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse(response);
};

/**
 * Verify reset code
 * @param {string} email - User's email address
 * @param {string} code - 6-digit verification code
 */
export const verifyResetCode = async (email, code) => {
  const response = await fetch(`${BASE_URL}/verify-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  return handleResponse(response);
};

/**
 * Reset password with code
 * @param {string} email - User's email address
 * @param {string} code - 6-digit verification code
 * @param {string} newPassword - New password
 */
export const resetPassword = async (email, code, newPassword) => {
  const response = await fetch(`${BASE_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, newPassword }),
  });
  return handleResponse(response);
};

// ============================================
// EMAIL VERIFICATION (OPTIONAL)
// ============================================

/**
 * Send email verification code
 * @param {string} token - JWT token
 */
export const sendVerificationEmail = async (token) => {
  const response = await fetch(`${BASE_URL}/send-verification`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

/**
 * Verify email with code
 * @param {string} token - JWT token
 * @param {string} code - 6-digit verification code
 */
export const verifyEmail = async (token, code) => {
  const response = await fetch(`${BASE_URL}/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ code }),
  });
  return handleResponse(response);
};

// ============================================
// PROFILE MANAGEMENT
// ============================================

/**
 * Update user profile
 * @param {string} token - JWT token
 * @param {Object} profileData - Profile update data
 */
export const updateProfile = async (token, profileData) => {
  const response = await fetch(`${BASE_URL}/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });
  return handleResponse(response);
};

/**
 * Change password
 * @param {string} token - JWT token
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 */
export const changePassword = async (token, currentPassword, newPassword) => {
  const response = await fetch(`${BASE_URL}/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  return handleResponse(response);
};

/**
 * Delete account
 * @param {string} token - JWT token
 * @param {string} password - Password confirmation
 */
export const deleteAccount = async (token, password) => {
  const response = await fetch(`${BASE_URL}/account`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ password }),
  });
  return handleResponse(response);
};

// ============================================
// TOKEN MANAGEMENT
// ============================================

/**
 * Refresh JWT token
 * @param {string} token - Current JWT token
 */
export const refreshToken = async (token) => {
  const response = await fetch(`${BASE_URL}/refresh-token`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

/**
 * Validate token
 * @param {string} token - JWT token to validate
 */
export const validateToken = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/validate-token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    return data.valid || false;
  } catch (error) {
    return false;
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Check if email exists
 * @param {string} email - Email to check
 */
export const checkEmailExists = async (email) => {
  const response = await fetch(`${BASE_URL}/check-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleResponse(response);
};

/**
 * Check if username exists
 * @param {string} username - Username to check
 */
export const checkUsernameExists = async (username) => {
  const response = await fetch(`${BASE_URL}/check-username`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });
  return handleResponse(response);
};

/**
 * Check if phone exists
 * @param {string} phone - Phone number to check
 */
export const checkPhoneExists = async (phone) => {
  const response = await fetch(`${BASE_URL}/check-phone`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
  return handleResponse(response);
};

// ============================================
// EXPORTS
// ============================================

export default {
  // Auth
  register,
  login,
  logout,
  getMe,
  
  // Password Reset
  forgotPassword,
  verifyResetCode,
  resetPassword,
  
  // Email Verification
  sendVerificationEmail,
  verifyEmail,
  
  // Profile
  updateProfile,
  changePassword,
  deleteAccount,
  
  // Token
  refreshToken,
  validateToken,
  
  // Utilities
  checkEmailExists,
  checkUsernameExists,
  checkPhoneExists,
};