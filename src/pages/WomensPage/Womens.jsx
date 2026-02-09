import Nav from "../../components/Nav/NavBar/Nav.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import Socials from "../../components/Socials/Socials.jsx";
import WomensSection from "./WomensContent.jsx";
import QuickLinks from "../../components/QuickLink/QuickLinks.jsx";


const Womens = () => {
  return (
    <div>
      <Nav scrolledDesktopDistance={400} />
      <QuickLinks/>
      <WomensSection />
      <Socials />
      <Footer />
    </div>
  );
};

export default Womens;
