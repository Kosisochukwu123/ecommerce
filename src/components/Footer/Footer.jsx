import React from "react";
import "./Footer.css";
import {Link} from "react-router-dom";
import mastercardImage from "../../../public/images/apple-pay_5968209.png";
import card from "../../../public/images/card_16174534.png";
import paypal from "../../../public/images/paypal_888870.png";
import visa from "../../../public/images/visa_217425.png";

export const Footer = () => {
  return (
    <footer>
        
      <div className="footer-top">
        <div className="box">
          <i className="fa-solid fa-box-open"></i>
          <p>
            Free shipping from <br /> <span>$200</span>
          </p>
        </div>
        <div className="box">
          <i className="fa-solid fa-arrow-right-arrow-left"></i>
          <p>
            Easy returns within <br /> <span>30 days</span>
          </p>
        </div>
        <div className="box">
          <i className="fa-solid fa-lock"></i>
          <p>
            Secure payments <br /> <span>online</span>
          </p>
        </div>
        <div className="box">
          <i className="fa-solid fa-user-shield"></i>
          <p>
            24/7 customer <br /> <span>support</span>
          </p>
        </div>
      </div>

      <div className="footer-middle">
        <div className="content">
          <h2>Navigation</h2>
          <div className="links">
            <Link to="/">Home</Link>
            <Link to="/For-Men">Men</Link>
            <Link to="/For-Women">Women</Link>
            {/* <Link to="/kids">Kids</Link> */}
            <Link to="/Our-Story">Our Story</Link>
          </div>
        </div>
        <div className="content">
          <h2>Legal</h2>
          <div className="links">
            <Link to="/Privacy-Policy">Privacy Policy</Link>
            <Link to="/Terms">Terms of services</Link>
          </div>
        </div>

        <div className="content">
          <h2>Help</h2>
          <div className="links">
            <Link to="/Contact">Contact</Link>
            <Link to="/Contact">FAQ</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <h3>Brandi</h3>
        <p>&copy; All rights reserved</p>
        <span>
          <img src={mastercardImage} alt="Mastercard" />
          <img src={card} alt="Card" />
          <img src={paypal} alt="PayPal" />
          <img src={visa} alt="Visa" />
        </span>
      </div>

    </footer>
  );
};


export default Footer;