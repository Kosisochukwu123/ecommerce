import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import Nav from "../components/Nav/NavBar/Nav.jsx";
import { Header } from "../components/Header/Header.jsx";
import { About } from "../components/About/About.jsx";
import { Socials } from "../components/Socials/Socials.jsx";
import { Footer } from "../components/Footer/Footer.jsx";
import QuickLinks from "../components/QuickLink/QuickLinks.jsx";
import NewArrivals from "../components/NewArrivals/NewArrivals.jsx";

const Home = () => {
  const location = useLocation();
  const navigationType = useNavigationType();

  // Restore scroll position when navigating back
  useEffect(() => {
    if (navigationType === 'POP') {
      // User pressed back button
      const savedPosition = sessionStorage.getItem(`scroll-${location.pathname}`);
      
      if (savedPosition) {
        // Restore scroll position after components render
        setTimeout(() => {
          window.scrollTo({
            top: parseInt(savedPosition, 10),
            behavior: 'instant'
          });
        }, 100);
      }
    } else {
      // New navigation - scroll to top
      window.scrollTo(0, 0);
    }

    // Save scroll position while scrolling
    let scrollTimer;
    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        sessionStorage.setItem(`scroll-${location.pathname}`, window.scrollY);
      }, 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(scrollTimer);
      window.removeEventListener('scroll', handleScroll);
      // Save final position before unmounting
      sessionStorage.setItem(`scroll-${location.pathname}`, window.scrollY);
    };
  }, [location.pathname, navigationType]);

  return (
    <div>
      <Nav />
      <QuickLinks />
      <Header />
      <NewArrivals />
      <Socials />
      <About />
      <Footer />
    </div>
  );
};

export default Home;