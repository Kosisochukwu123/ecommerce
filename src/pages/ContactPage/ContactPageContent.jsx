import React from "react";
import "./ContactPage.css";
import { useEffect } from "react";
import contactImage from "../../../public/images/contact-body.jpg";

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
        <div>
          <h2 data-aos="fade-up-right"> (contact us)</h2>
          <h1 data-aos="fade-up-right">We would love to hear from you</h1>
        </div>
        <div>
          <h2 data-aos="fade-up-left"> (address)</h2>
          <a href="">Lorem ipsum, dolor sit amet consectetur adipisicing.</a>
          <h2 data-aos="fade-up-left"> (socials)</h2>
          <a href="">instagram</a> <br /> <br />
          <a href="">Twitter</a>
          <h2 data-aos="fade-up-left"> (customer support)</h2>
          <a href="">Brandi@gmail.com</a>
          <h2 data-aos="fade-up-left"> (partnership and collaboration)</h2>
          <a href="">collab@brandi.com</a>
          <img src={contactImage} alt="" srcset="" />
        </div>
      </div>
    </div>
  );
};

export default ContactPageContent;
