import { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, getMe } from "../api/auth";

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
          if (error.message.includes("401") || 
              error.message.includes("403") || 
              error.message.includes("Invalid token") ||
              error.message.includes("Token expired") ||
              error.message.includes("Not authorized")) {
            console.log("🗑️ Clearing invalid token");
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
          } else {
            // Network/server error - keep token but don't set user yet
            console.log("⚠️ Network/server error, keeping token");
            // User will need to refresh or the next API call will work
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

  const login = async (email, password) => {
    const response = await loginApi(email, password);
    console.log("🔐 Login response:", response);
    
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
  };

  const logout = () => {
    console.log("👋 Logging out");
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, isAdmin }}>
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