import  Nav  from "../components/Nav/NavBar/Nav.jsx";
import { Header } from "../components/Header/Header.jsx";
import { Body } from "../components/Body/Body.jsx";
import { MostPopular } from "../components/MostPopular/MostPopular.jsx";
import { About } from "../components/About/About.jsx";
import { Socials } from "../components/Socials/Socials.jsx";
import { Footer } from "../components/Footer/Footer.jsx";
import QuickLinks from "../components/QuickLink/QuickLinks.jsx";

const Home = () => {
  return (
    <div>

      <Nav/>

      <QuickLinks/>

      <Header />

      <MostPopular />

      <Body />

      <Socials />

      <About />

      <Footer />

    </div>
  );
};

export default Home;
