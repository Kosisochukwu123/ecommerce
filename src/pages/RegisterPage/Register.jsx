import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../LoginPage/LoginPage.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    return strength;
  };

  // Real-time validation
  const validateField = (name, value) => {
    const errors = { ...validationErrors };

    switch (name) {
      case "username":
        if (value.length < 3) {
          errors.username = "Username must be at least 3 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
          errors.username = "Username can only contain letters, numbers, and underscores";
        } else {
          delete errors.username;
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.email = "Please enter a valid email address";
        } else {
          delete errors.email;
        }
        break;

      case "phone":
        if (value && !/^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/.test(value)) {
          errors.phone = "Please enter a valid phone number";
        } else {
          delete errors.phone;
        }
        break;

      case "password":
        if (value.length < 6) {
          errors.password = "Password must be at least 6 characters";
        } else {
          delete errors.password;
        }
        setPasswordStrength(calculatePasswordStrength(value));
        break;

      case "confirmPassword":
        if (value !== formData.password) {
          errors.confirmPassword = "Passwords do not match";
        } else {
          delete errors.confirmPassword;
        }
        break;

      default:
        break;
    }

    setValidationErrors(errors);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    setFormData({ ...formData, [name]: newValue });
    setError(null);

    // Validate field on change
    if (name !== "agreeToTerms") {
      validateField(name, newValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Final validation
    if (Object.keys(validationErrors).length > 0) {
      setError("Please fix all validation errors");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms of Service");
      return;
    }

    setLoading(true);

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      // Add phone if provided
      if (formData.phone) {
        userData.phone = formData.phone.replace(/[\s\-\(\)]/g, "");
      }

      const response = await register(userData);

      console.log("Registration successful:", response);
      navigate("/");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthLabel = () => {
    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    return labels[passwordStrength] || "Very Weak";
  };

  const getPasswordStrengthColor = () => {
    const colors = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];
    return colors[passwordStrength] || "#ef4444";
  };

  return (
    <div className="Login-page">
      <div className="login-container register-container">
        <div className="login-header">
          <h2>Create Account</h2>
          <p className="login-subtitle">Join us and start shopping today</p>
        </div>

        {error && (
          <div className="error-message">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {/* USERNAME */}
          <div className="form-group">
            <label htmlFor="username">
              <i className="fa-solid fa-user"></i>
              Username
            </label>
            <input
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a unique username"
              type="text"
              id="username"
              name="username"
              required
              disabled={loading}
              autoComplete="username"
              className={validationErrors.username ? "input-error" : ""}
            />
            {validationErrors.username && (
              <small className="error-hint">
                <i className="fa-solid fa-circle-exclamation"></i>
                {validationErrors.username}
              </small>
            )}
          </div>

          {/* EMAIL */}
          <div className="form-group">
            <label htmlFor="email">
              <i className="fa-solid fa-envelope"></i>
              Email Address
            </label>
            <input
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              type="email"
              id="email"
              name="email"
              required
              disabled={loading}
              autoComplete="email"
              className={validationErrors.email ? "input-error" : ""}
            />
            {validationErrors.email && (
              <small className="error-hint">
                <i className="fa-solid fa-circle-exclamation"></i>
                {validationErrors.email}
              </small>
            )}
          </div>

          {/* PHONE (OPTIONAL) */}
          <div className="form-group">
            <label htmlFor="phone">
              <i className="fa-solid fa-phone"></i>
              Phone Number
              <span className="optional-badge">Optional</span>
            </label>
            <input
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              type="tel"
              id="phone"
              name="phone"
              disabled={loading}
              autoComplete="tel"
              className={validationErrors.phone ? "input-error" : ""}
            />
            {validationErrors.phone && (
              <small className="error-hint">
                <i className="fa-solid fa-circle-exclamation"></i>
                {validationErrors.phone}
              </small>
            )}
            {!validationErrors.phone && formData.phone && (
              <small className="form-hint">
                <i className="fa-solid fa-circle-check"></i>
                You can login with this phone number
              </small>
            )}
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label htmlFor="password">
              <i className="fa-solid fa-lock"></i>
              Password
            </label>
            <div className="password-wrapper">
              <input
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                required
                disabled={loading}
                autoComplete="new-password"
                className={validationErrors.password ? "input-error" : ""}
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
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div
                    className="strength-fill"
                    style={{
                      width: `${(passwordStrength / 5) * 100}%`,
                      backgroundColor: getPasswordStrengthColor(),
                    }}
                  ></div>
                </div>
                <small style={{ color: getPasswordStrengthColor() }}>
                  {getPasswordStrengthLabel()}
                </small>
              </div>
            )}
            {validationErrors.password && (
              <small className="error-hint">
                <i className="fa-solid fa-circle-exclamation"></i>
                {validationErrors.password}
              </small>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="form-group">
            <label htmlFor="confirmPassword">
              <i className="fa-solid fa-lock"></i>
              Confirm Password
            </label>
            <div className="password-wrapper">
              <input
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                required
                disabled={loading}
                autoComplete="new-password"
                className={validationErrors.confirmPassword ? "input-error" : ""}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                <i className={`fa-solid fa-eye${showConfirmPassword ? "-slash" : ""}`}></i>
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <small className="error-hint">
                <i className="fa-solid fa-circle-exclamation"></i>
                {validationErrors.confirmPassword}
              </small>
            )}
            {!validationErrors.confirmPassword && formData.confirmPassword && formData.password === formData.confirmPassword && (
              <small className="success-hint">
                <i className="fa-solid fa-circle-check"></i>
                Passwords match
              </small>
            )}
          </div>

          {/* TERMS AGREEMENT */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                disabled={loading}
              />
              <span className="checkbox-text">
                I agree to the{" "}
                <Link to="/terms" target="_blank">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" target="_blank">
                  Privacy Policy
                </Link>
              </span>
            </label>
          </div>

          {/* SUBMIT BUTTON */}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <i className="fa-solid fa-user-plus"></i>
              </>
            )}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="login-footer-link">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="link-primary">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;