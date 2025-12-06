import Nav from "../../components/Nav/NavBar/Nav.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Socials from "../../components/Socials/Socials.jsx";
import OurStoryContent from "./OurStoryContent.jsx";

const AboutPage = () => {
  return (
    <div>
      <Nav scrolledDesktopDistance={400}  />
      <OurStoryContent/>
      <Socials />
      <Footer />
    </div>
  );
};

export default AboutPage;
