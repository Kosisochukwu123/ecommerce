import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../LoginPage/LoginPage.css";

const Register = ({ setUser }) => {
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
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
      const res = await axios.post("/api/users/register", formData);
      localStorage.setItem("token", res.data.token);
      setUser(res.data);
      navigate("/");
      console.log(res.data);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "registration failed");
    }
  };

  return (
    <div className="Login-page">
      <div className="login-page-head">
        <h2>Welcome</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      <form onSubmit={handleSummit}>
        <div>
          <label htmlFor="username"></label>
          <input
            value={formData.username}
            onChange={handleChange}
            placeholder="Type your username"
            type="username"
            id="username"
            name="username"
            required
            autoComplete="off"
          />
        </div>

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
          />
        </div>

        <button type="submit">Register</button>
      </form>

      <div style={{ marginTop: "1rem" }}>
        <p>
          Already have an account <Link to="/Login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
