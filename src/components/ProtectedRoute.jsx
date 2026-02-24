import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAdmin } = useAuth();

  // Show loading while checking auth
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // Not logged in at all
  if (!user) {
    return <Navigate to="/Login" replace />;
  }

  // Logged in but not admin (when admin is required)
  if (requireAdmin && !isAdmin) {
    return (
      <div style={{ 
        padding: "50px", 
        textAlign: "center" 
      }}>
        <h1>Access Denied</h1>
        <p>You must be an admin to access this page.</p>
        <button 
          onClick={() => window.location.href = "/"}
          style={{
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginTop: "20px"
          }}
        >
          Go Home
        </button>
      </div>
    );
  }

  // All checks passed - show the protected content
  return children;
}

export default ProtectedRoute;