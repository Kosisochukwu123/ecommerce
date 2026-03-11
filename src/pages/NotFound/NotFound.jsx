import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  // Auto redirect after 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="not-found-container">
      {/* Animated Background */}
      <div className="not-found-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      {/* Content */}
      <div className="not-found-content">
        {/* 404 Text */}
        <div className="error-code" data-aos="fade-down">
          <span className="four">4</span>
          <span className="zero">
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
          <span className="four">4</span>
        </div>

        {/* Error Message */}
        <h1 className="error-title" data-aos="fade-up" data-aos-delay="200">
          Oops! Page Not Found
        </h1>
        
        <p className="error-description" data-aos="fade-up" data-aos-delay="400">
          The page you're looking for seems to have wandered off into the fashion wilderness.
          Don't worry, we'll help you find your way back!
        </p>

        {/* Countdown Timer */}
        <div className="countdown-timer" data-aos="fade-up" data-aos-delay="600">
          <p>Redirecting to home in</p>
          <div className="countdown-circle">
            <span className="countdown-number">{countdown}</span>
          </div>
          <p>seconds</p>
        </div>

        {/* Quick Links */}
        <div className="quick-links" data-aos="fade-up" data-aos-delay="800">
          <h3>Or explore these sections:</h3>
          <div className="links-grid">
            <Link to="/" className="quick-link-card">
              <i className="fa-solid fa-house"></i>
              <span>Home</span>
              <p>Start fresh</p>
            </Link>

            <Link to="/products" className="quick-link-card">
              <i className="fa-solid fa-bag-shopping"></i>
              <span>Shop</span>
              <p>Browse products</p>
            </Link>

            <Link to="/Our-Story" className="quick-link-card">
              <i className="fa-solid fa-heart"></i>
              <span>Our Story</span>
              <p>Learn about us</p>
            </Link>

            <Link to="/Contact" className="quick-link-card">
              <i className="fa-solid fa-envelope"></i>
              <span>Contact</span>
              <p>Get in touch</p>
            </Link>
          </div>
        </div>

        {/* Main CTA Button */}
        <Link to="/" className="back-home-btn" data-aos="fade-up" data-aos-delay="1000">
          <i className="fa-solid fa-arrow-left"></i>
          Take Me Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;