import Nav from "../../components/Nav/Nav.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Socials from "../../components/Socials/Socials.jsx";
import WomensSection from "./WomensContent.jsx";

const Womens = () => {
  return (
    <div>
      <Nav scrolledDesktopDistance={400} />
      <WomensSection />
      <Socials />
      <Footer />
    </div>
  );
};

export default Womens;
