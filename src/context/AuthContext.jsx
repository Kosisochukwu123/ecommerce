import { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, register as registerApi, getMe } from "../api/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem("token");
      
      console.log("🔍 AuthContext: Checking auth, token exists:", !!storedToken);
      
      if (storedToken) {
        try {
          console.log("📡 Calling /me endpoint...");
          const response = await getMe(storedToken);
          console.log("✅ /me response:", response);
          
          // Handle different response structures
          const userData = response.user || response;
          console.log("👤 Setting user:", userData);
          
          setUser(userData);
          setToken(storedToken);
        } catch (error) {
          console.error("❌ AuthContext: /me failed:", error);
          console.error("Error message:", error.message);
          
          // Only clear token if it's truly invalid (401/403/expired)
          if (
            error.message.includes("401") || 
            error.message.includes("403") || 
            error.message.includes("Invalid token") ||
            error.message.includes("Token expired") ||
            error.message.includes("Not authorized")
          ) {
            console.log("🗑️ Clearing invalid token");
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
          } else {
            // Network/server error - keep token but don't set user yet
            console.log("⚠️ Network/server error, keeping token");
          }
        }
      } else {
        console.log("ℹ️ No token found");
      }
      
      console.log("🏁 Auth check complete");
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (identifier, password) => {
    try {
      console.log("🔐 Attempting login with:", identifier);
      const response = await loginApi(identifier, password);
      console.log("✅ Login response:", response);
      
      const newToken = response.token;
      setToken(newToken);
      localStorage.setItem("token", newToken);
      
      const userData = {
        id: response.id,
        username: response.username,
        email: response.email,
        role: response.role,
        firstName: response.firstName,
        lastName: response.lastName,
        phone: response.phone,
        avatar: response.avatar,
      };
      
      console.log("✅ User logged in:", userData);
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error("❌ Login failed:", error);
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      console.log("📝 Attempting registration with:", {
        username: userData.username,
        email: userData.email,
        phone: userData.phone || "not provided",
      });

      const response = await registerApi(userData);
      console.log("✅ Registration response:", response);
      
      const newToken = response.token;
      setToken(newToken);
      localStorage.setItem("token", newToken);
      
      const newUser = {
        id: response.id,
        username: response.username,
        email: response.email,
        role: response.role,
        firstName: response.firstName,
        lastName: response.lastName,
        phone: response.phone,
        avatar: response.avatar,
      };
      
      console.log("✅ User registered:", newUser);
      setUser(newUser);
      
      return newUser;
    } catch (error) {
      console.error("❌ Registration failed:", error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    console.log("👋 Logging out");
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  // Update user function (for profile updates)
  const updateUser = (updatedData) => {
    console.log("🔄 Updating user:", updatedData);
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedData,
    }));
  };

  // Refresh user data
  const refreshUser = async () => {
    if (!token) {
      console.log("⚠️ No token available for refresh");
      return;
    }

    try {
      console.log("🔄 Refreshing user data...");
      const response = await getMe(token);
      const userData = response.user || response;
      
      console.log("✅ User data refreshed:", userData);
      setUser(userData);
      
      return userData;
    } catch (error) {
      console.error("❌ Failed to refresh user:", error);
      
      // If token is invalid, log out
      if (
        error.message.includes("401") || 
        error.message.includes("403") ||
        error.message.includes("Invalid token")
      ) {
        logout();
      }
      
      throw error;
    }
  };

  // Check if user is admin
  const isAdmin = user?.role === "admin";

  // Check if user is authenticated
  const isAuthenticated = !!user && !!token;

  const value = {
    user,
    token,
    loading,
    isAdmin,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
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