import React from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";

const LoginFace = () => {
  const navigate = useNavigate();

  const toLogin = () => {
    navigate("/Login");
  };

  return (
    <div className="Login-home">
      <div className="Login-home-top">
        <div className="hero-overlay"></div>
      </div>

      <div className="Login-home-bottom">
        <div className="welcome-content">
          <span className="welcome-label">Welcome to Brandi</span>
          <h1>The Best Place to Shop</h1>
          <p>Let's dive into a new world of fashion and style</p>
          
          <button onClick={toLogin} className="get-started-btn">
            Get Started
            <i className="fa-solid fa-arrow-right"></i>
          </button>

          <div className="features">
            <div className="feature-item">
              <i className="fa-solid fa-truck-fast"></i>
              <span>Free Shipping</span>
            </div>
            <div className="feature-item">
              <i className="fa-solid fa-shield-halved"></i>
              <span>Secure Payment</span>
            </div>
            <div className="feature-item">
              <i className="fa-solid fa-headset"></i>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFace;