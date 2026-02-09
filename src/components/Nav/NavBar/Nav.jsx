import "./Nav.css";
import { useState, useEffect } from "react";
import { Search } from "../Search/Search.jsx";
import { CheckoutPage } from "../Cart/CartItems.jsx";
import { Link } from "react-router-dom";
import {useLocation} from 'react-router-dom';
import { useCart } from "../Cart/UseCart.jsx";

const Nav = ({scrolledDesktopDistance = 440, alwaysScrolled = false,
}) => {
  const [open, setOpen] = useState(false);

  const [showCheckout, setShowCheckout] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrolledDesktop, setScrolledDesktop] = useState(false);

  const location = useLocation();

  const { getTotalItems } = useCart();

  useEffect(() => {

    let scrollDistance;
    
    if (alwaysScrolled) {
      setScrolled(true); // force scrolled state on this page
      return; // skip scroll logic
    }

    // mobile screens
    if (window.innerWidth <= 480 && location.pathname === "/") {
      scrollDistance = 820; 
    }

    else if (window.innerWidth <= 480) {
      scrollDistance = 450;
    }
    // tablets

      else if (window.innerWidth <= 768 && location.pathname === "/") {
      scrollDistance = 1000; 
    }
    

    else if (window.innerWidth <= 768) {
      scrollDistance = 700;
    }

     else if (window.innerWidth <= 820 && location.pathname === "/") {
      scrollDistance = 1150; 
    }

      else if (window.innerWidth <= 820) {
      scrollDistance = 800;
    }

  
    // small laptops
     else if (window.innerWidth <= 1024) {
      scrollDistance = 500;
    }
    // desktops
    else {
      scrollDistance = 1300;
    }

    const handleScroll = () => {
      if (window.scrollY > scrollDistance) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
  
   if (alwaysScrolled) {
      setScrolledDesktop(true); // force scrolled state on this page
      return; // skip scroll logic
    }

    const handleScroll = () => {

  if (window.scrollY > scrolledDesktopDistance) {
        setScrolledDesktop(true);
      } else {
        setScrolledDesktop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);



  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : "transparent"}`}>
        {/* HAMBURGER ICON */}
        <div
          className={`hamburger ${open ? "open" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className="header-logo">Brandi</div>

        <div className="header-icon">
          <span onClick={() => setShowCheckout(true)}>
            <i className="fa-solid fa-cart-arrow-down"> <p>{getTotalItems()}</p> </i>
          </span>

          <span onClick={() => setShowSearch(true)}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>

        {/* MOBILE MENU */}
        <div className={`mobile-menu ${open ? "show" : null}`}>
          <Link to="/loginFace"> Men </Link>
          <Link to="/For-Women"> Women </Link>
          <Link to="/Our-Story"> Our story </Link>
          <Link to="/Contact"> Contact </Link>
        </div>
      </nav>

      {/* desktop menu */}

      <div className={`desktop-view ${scrolledDesktop ? "scrolled" : null}`}>
        
        <div className="desktop-menu">
          <Link to="/For-Men"> Men </Link>
          <Link to="/For-Women"> Women </Link>
          <Link to="/Our-Story"> Our story </Link>
          <Link to="/Contact"> Contact </Link>
        </div>

        <div className="header-logo-desktop">Brandi</div>

        <div className="header-icon">

          <span onClick={() => setShowCheckout(true)}>
            <i className="fa-solid fa-cart-arrow-down"><p>{getTotalItems()}</p></i>
          </span>

          <span onClick={() => setShowSearch(true)}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>

      </div>

      <CheckoutPage
        showCheckout={showCheckout}
        setShowCheckout={setShowCheckout}
      />

      <Search setShowSearch={setShowSearch} showSearch={showSearch} />
    </>
  );
};

export default Nav;
