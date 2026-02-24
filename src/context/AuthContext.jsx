import { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, getMe } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const response = await getMe(token);
          console.log("🔍 getMe response:", response);

          // Extract user data from response
          const userData = response.user || response;
          console.log("👤 Setting user:", userData);

          setUser(userData);
          setToken(token);
        } catch (error) {
          console.error("❌ Auth check failed:", error);
          // Only clear token if it's actually invalid, not on network errors
          if (
            error.message.includes("token") ||
            error.message.includes("401")
          ) {
            console.log("🗑️ Clearing invalid token");
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
          }
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const response = await loginApi(email, password);
    console.log("🔐 Login API response:", response);

    // Save token
    setToken(response.token);
    localStorage.setItem("token", response.token);

    // Create user object with all necessary fields
    const userData = {
      id: response.id,
      username: response.username,
      email: response.email,
      role: response.role,
      firstName: response.firstName,
      lastName: response.lastName,
      phone: response.phone,
    };

    console.log("✅ Setting user in context:", userData);
    setUser(userData);

    // Return the user data for Login.jsx to use
    return userData;
  };

  const logout = () => {
    console.log("👋 Logging out");
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const isAdmin = user?.role === "admin";

  // Debug log to see current state
  console.log("🎯 Current auth state:", {
    hasUser: !!user,
    userRole: user?.role,
    isAdmin,
    loading,
  });

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
