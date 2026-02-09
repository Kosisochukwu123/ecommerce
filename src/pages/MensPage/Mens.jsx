import Nav from "../../components/Nav/NavBar/Nav.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Socials from "../../components/Socials/Socials.jsx";
import MensSection from "./MensContent.jsx";
import QuickLinks from "../../components/QuickLink/QuickLinks.jsx";

const Mens = () => {
  return (
    <div>
      <Nav scrolledDesktopDistance={400} />
      <QuickLinks/>
      <MensSection />
      <Socials />
      <Footer />
    </div>
  );
};

export default Mens;
