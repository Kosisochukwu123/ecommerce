import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./LoginPage.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userData = await login(formData.email, formData.password);

      // console.log("✅ Login successful!");
      // console.log("User data:", userData);
      // console.log("User role:", userData.role);

      // Redirect based on user role
      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }

      console.log("Login successful:", userData);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="Login-page">
      <div className="login-page-head">
        <h2>Hello!</h2>
        <span>Welcome back</span>
        {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email"></label>
          <input
            value={formData.email}
            onChange={handleChange}
            placeholder="Type your email"
            type="email"
            id="email"
            name="email"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="password"></label>
          <input
            value={formData.password}
            onChange={handleChange}
            placeholder="Type your password"
            type="password"
            id="password"
            name="password"
            required
            disabled={loading}
          />
        </div>

        <div>
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>

      <div className="other-button">
        <Link to="/forgot-password">Forgot password</Link>
        <button onClick={handleRegister} disabled={loading}>
          Register
        </button>
      </div>
    </div>
  );
};

export default Login;
