import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./LoginPage.css";

const Login = () => {
  const [formData, setFormData] = useState({
    identifier: "", // Can be email or phone
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Detect if input is email or phone number
  const detectInputType = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;

    if (emailRegex.test(value)) return "email";
    if (phoneRegex.test(value.replace(/\s/g, ""))) return "phone";
    return "unknown";
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const inputType = detectInputType(formData.identifier);

      if (inputType === "unknown") {
        throw new Error("Please enter a valid email or phone number");
      }

      // Format phone number if needed (remove spaces, dashes)
      let loginIdentifier = formData.identifier;
      if (inputType === "phone") {
        loginIdentifier = formData.identifier.replace(/[\s\-\(\)]/g, "");
      }

      // Call login with email or phone
      const userData = await login(loginIdentifier, formData.password);

      // Redirect based on user role
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="Login-page">
      <div className="login-container">
        <div className="login-header">
          <h2>Welcome Back!</h2>
          <p className="login-subtitle">Sign in to continue shopping</p>
        </div>

        {error && (
          <div className="error-message">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="identifier">
              <i className="fa-solid fa-envelope"></i>
              Email or Phone Number
            </label>
            <input
              value={formData.identifier}
              onChange={handleChange}
              placeholder="Enter your email or phone number"
              type="text"
              id="identifier"
              name="identifier"
              required
              disabled={loading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="fa-solid fa-lock"></i>
              Password
            </label>
            <div className="password-wrapper">
              <input
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                <i className={`fa-solid fa-eye${showPassword ? "-slash" : ""}`}></i>
              </button>
            </div>
          </div>

          <div className="form-footer">
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <i className="fa-solid fa-arrow-right"></i>
              </>
            )}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <button onClick={handleRegister} className="btn-secondary" disabled={loading}>
          <i className="fa-solid fa-user-plus"></i>
          Create New Account
        </button>

        <p className="login-footer">
          By continuing, you agree to our{" "}
          <Link to="/terms">Terms of Service</Link> and{" "}
          <Link to="/privacy">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;