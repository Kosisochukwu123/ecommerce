import React from "react";
import Nav from "../../components/Nav/Nav.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Socials from "../../components/Socials/Socials.jsx";
import ContactPageContent from "./ContactPageContent";

const ContactPage = () => {
  return (
    <>
      <Nav />
      <ContactPageContent />

      <Socials />
      <Footer />
    </>
  );
};

export default ContactPage;
