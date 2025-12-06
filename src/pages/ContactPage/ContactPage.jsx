import React from "react";
import Nav from "../../components/Nav/NavBar/Nav.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Socials from "../../components/Socials/Socials.jsx";
import ContactPageContent from "./ContactPageContent";
import FAQ from '../../components/FAQ/FAQ.jsx'

const ContactPage = () => {
  return (
    <>
      <Nav scrolledDesktopDistance={400} />
      <ContactPageContent />
      <FAQ/>
      <Socials />
      <Footer />
    </>
  );
};

export default ContactPage;
