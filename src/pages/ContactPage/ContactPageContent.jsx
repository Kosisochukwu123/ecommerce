import React from "react";
import "./ContactPage.css";
import { useEffect } from "react";
import contactImage from "../../images/contact-body.jpg";

const ContactPageContent = () => {
useEffect(() => {
  const bg = document.querySelector(".contact-bg");

  const handleScroll = () => {
    const offset = window.scrollY * 0.3;
    bg.style.transform = `translateY(${offset}px)`;
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);


  return (
    <div>

      <div className="contact-header">
        <div className="contact-bg">
          <p>contact</p>
        </div>
      </div>

      <div className="contact-top">
        <h2> (contact us)</h2>
        <h1>We would love to hear from you</h1>
        <h2> (address)</h2>
        <a href="">Lorem ipsum, dolor sit amet consectetur adipisicing.</a>
        <h2> (socials)</h2>
        <a href="">instagram</a> <br /> <br />
        <a href="">Twitter</a>
        <h2> (customer support)</h2>
        <a href="">Brandi@gmail.com</a>
        <h2> (partnership and collaboration)</h2>
        <a href="">collab@brandi.com</a>
        <img src={contactImage} alt="" srcset="" />
      </div>
    </div>
  );
};

export default ContactPageContent;
