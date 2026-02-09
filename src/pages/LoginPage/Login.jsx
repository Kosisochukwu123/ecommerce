import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginPage.css";

const Login = ({ setUser }) => {
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSummit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/users/login", formData);
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      navigate("/Home");
      console.log(res.data);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "login failed");
    }
  };

  const handleHome = () => {
    navigate("/register")
  }
  return (
    <div className="Login-page">
      {/* <div className="login-page-top"> */}
        <div className="login-page-head">
          <h2>Hello!</h2>
          <span>Welcome back</span>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>

        <form onSubmit={handleSummit}>
          <div>
            <label htmlFor="email"></label>
            <input
              value={formData.email}
              onChange={handleChange}
              placeholder="type your email"
              type="email"
              id="email"
              name="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password"></label>
            <input
              value={formData.password}
              onChange={handleChange}
              placeholder="type your password"
              type="password"
              id="password"
              name="password"
              required
            />
          </div>

          <div>
            
          <button type="submit">Login</button>

          </div>
        </form>

        <div className="other-button">
          <Link to="/forgot-password">forgot password</Link>
          <button onClick={handleHome}>Register</button>
        </div>
      </div>
    // </div>
  );
};

export default Login;
