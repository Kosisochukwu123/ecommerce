import React from "react";
import "./Footer.css";
import mastercardImage from "../../images/apple-pay_5968209.png";
import card from "../../images/card_16174534.png";
import paypal from "../../images/paypal_888870.png";
import visa from "../../images/visa_217425.png";

export const Footer = () => {
  return (
    <footer>
        
      <div className="footer-top">
        <div className="box">
          <i class="fa-solid fa-box-open"></i>
          <p>
            Free shipping from <br /> <span>$200</span>{" "}
          </p>
        </div>
        <div className="box">
          <i class="fa-solid fa-arrow-right-arrow-left"></i>
          <p>
            Easy returns within <br /> <span>30 days</span>{" "}
          </p>
        </div>
        <div className="box">
          <i class="fa-solid fa-lock"></i>
          <p>
            Secure payments <br /> <span>online</span>{" "}
          </p>
        </div>
        <div className="box">
          <i class="fa-solid fa-user-shield"></i>
          <p>
            24/7 customer <br /> <span>support</span>{" "}
          </p>
        </div>
      </div>

      <div className="footer-middle">
        <div className="content">
          <h2>(Navigation)</h2>
          <div className="links">
            <a href="">Home</a>
            <a href="">Men</a>
            <a href="">Women</a>
            <a href="">Kids</a>
            <a href="">Our Story</a>
          </div>
        </div>
        <div className="content">
          <h2>(Legal)</h2>

          <div className="links">
            <a href="">Privacy Policy</a>
            <a href="">Terms of services</a>
          </div>
        </div>

        <div className="content">
          <h2>(Help)</h2>
          <div className="links">
            <a href="">Contact</a>
            <a href="">FAQ</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <h3>Brandi</h3>
        <p>&nbps All copy right Reserved</p>
        <span>
          <img src={mastercardImage} alt="" srcset="" />
          <img src={card} alt="" srcset="" />
          <img src={paypal} alt="" srcset="" />
          <img src={visa} alt="" srcset="" />
        </span>
      </div>

    </footer>
  );
};


export default Footer;