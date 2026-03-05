import  Nav  from "../components/Nav/NavBar/Nav.jsx";
import { Header } from "../components/Header/Header.jsx";
import { About } from "../components/About/About.jsx";
import { Socials } from "../components/Socials/Socials.jsx";
import { Footer } from "../components/Footer/Footer.jsx";
import QuickLinks from "../components/QuickLink/QuickLinks.jsx";
import NewArrivals from "../components/NewArrivals/NewArrivals.jsx";

const Home = () => {
  return (
    <div>

      <Nav/>

      <QuickLinks/>

      <Header />
      
      <NewArrivals />

      <Socials />

      <About />

      <Footer />

    </div>
  );
};

export default Home;
