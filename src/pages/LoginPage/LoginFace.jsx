import React from "react";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const LoginFace = () => {
  const navigate = useNavigate();

  const toLogin = () => {
    navigate("/Login");
  };
  return (
    <div className="Login-home">
      <div className="Login-home-top"></div>

      <div className="Login-home-bottom">
        <p>the best palce to shop</p>
        <span>lets deep dive into the new world</span>
        <button onClick={toLogin}>
          Get started <i class="fa-solid fa-caret-right"></i>
        </button>
      </div>
    </div>
  );
};

export default LoginFace;
