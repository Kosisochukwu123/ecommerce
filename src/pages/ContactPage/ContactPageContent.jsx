import React, { useState, useEffect } from "react";
import "./ContactPage.css";
import contactImage from "../../../public/images/contact-body.jpg";
import contactService from "../../services/contactService";

const ContactPageContent = () => {
  const [contactInfo, setContactInfo] = useState({
    address: "Loading...",
    instagram: "#",
    twitter: "#",
    customerSupport: "support@brandi.com",
    partnership: "collab@brandi.com",
    phone: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContactInfo();
    
    const bg = document.querySelector(".contact-bg");

    const handleScroll = () => {
      const offset = window.scrollY * 0.3;
      if (bg) {
        bg.style.transform = `translateY(${offset}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadContactInfo = async () => {
    try {
      const settings = await contactService.getContactSettings();
      setContactInfo(settings);
    } catch (error) {
      console.error("Failed to load contact info:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="contact-header">
        <div className="contact-bg">
          <p>contact</p>
        </div>
      </div>

      <div className="contact-top">
        <div>
          <h2 data-aos="fade-up-right">(contact us)</h2>
          <h1 data-aos="fade-up-right">We would love to hear from you</h1>
        </div>
        
        <div>
          <h2 data-aos="fade-up-left">(address)</h2>
          <a href="#">{loading ? "Loading..." : contactInfo.address}</a>
          
          {contactInfo.phone && (
            <>
              <h2 data-aos="fade-up-left">(phone)</h2>
              <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
            </>
          )}
          
          <h2 data-aos="fade-up-left">(socials)</h2>
          <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <br /><br />
          <a href={contactInfo.twitter} target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
          
          <h2 data-aos="fade-up-left">(customer support)</h2>
          <a href={`mailto:${contactInfo.customerSupport}`}>
            {contactInfo.customerSupport}
          </a>
          
          <h2 data-aos="fade-up-left">(partnership and collaboration)</h2>
          <a href={`mailto:${contactInfo.partnership}`}>
            {contactInfo.partnership}
          </a>
          
          <img src={contactImage} alt="Contact" />
        </div>
      </div>
    </div>
  );
};

export default ContactPageContent;