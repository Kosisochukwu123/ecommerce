import { useState } from "react";
import { Link } from "react-router-dom";
import "./LoginPage.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Enter email, 2: Code sent, 3: Reset password
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset code");
      }

      setSuccess("Reset code sent! Check your email.");
      setStep(2);
    } catch (err) {
      setError(err.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: formData.email,
          code: formData.code 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid code");
      }

      setSuccess("Code verified! Set your new password.");
      setStep(3);
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: formData.code,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setSuccess("Password reset successful! Redirecting...");
      
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Login-page">
      <div className="login-container forgot-password-container">
        <div className="login-header">
          <div className="back-button">
            <Link to="/login">
              <i className="fa-solid fa-arrow-left"></i>
              Back to Login
            </Link>
          </div>
          <h2>Reset Password</h2>
          <p className="login-subtitle">
            {step === 1 && "Enter your email to receive a reset code"}
            {step === 2 && "Enter the code sent to your email"}
            {step === 3 && "Create your new password"}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            <div className="step-circle">1</div>
            <span>Email</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>
            <div className="step-circle">2</div>
            <span>Verify</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            <div className="step-circle">3</div>
            <span>Reset</span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-message">
            <i className="fa-solid fa-circle-check"></i>
            <span>{success}</span>
          </div>
        )}

        {/* STEP 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendCode} className="login-form">
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
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Code
                  <i className="fa-solid fa-paper-plane"></i>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: Verify Code */}
        {step === 2 && (
          <form onSubmit={handleVerifyCode} className="login-form">
            <div className="form-group">
              <label htmlFor="code">
                <i className="fa-solid fa-key"></i>
                Verification Code
              </label>
              <input
                value={formData.code}
                onChange={handleChange}
                placeholder="Enter 6-digit code"
                type="text"
                id="code"
                name="code"
                maxLength="6"
                required
                disabled={loading}
                autoComplete="off"
              />
              <small className="form-hint">Check your email for the code</small>
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Verifying...
                </>
              ) : (
                <>
                  Verify Code
                  <i className="fa-solid fa-check"></i>
                </>
              )}
            </button>

            <button
              type="button"
              className="btn-link"
              onClick={() => handleSendCode({ preventDefault: () => {} })}
              disabled={loading}
            >
              Didn't receive code? Resend
            </button>
          </form>
        )}

        {/* STEP 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="login-form">
            <div className="form-group">
              <label htmlFor="newPassword">
                <i className="fa-solid fa-lock"></i>
                New Password
              </label>
              <div className="password-wrapper">
                <input
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  type={showPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  required
                  disabled={loading}
                  autoComplete="new-password"
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
              <small className="form-hint">At least 6 characters</small>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <i className="fa-solid fa-lock"></i>
                Confirm Password
              </label>
              <input
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                required
                disabled={loading}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <i className="fa-solid fa-check-circle"></i>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;