import "./Nav.css";
import { useState, useEffect } from "react";
import { Search } from "./Search";
import { CheckoutPage } from "./CartItems";
import { Link } from "react-router-dom";

const Nav = () => {
  const [open, setOpen] = useState(false);

  const [showCheckout, setShowCheckout] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrolledDesktop, setScrolledDesktop] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
     if (window.scrollY > 870) {    
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
    const handleScroll = () => {
     if (window.scrollY > 440) {    
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
      <nav className={`navbar ${scrolled ? 'scrolled' : 'transparent'}`} >
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
            <i className="fa-solid fa-cart-arrow-down"></i>
          </span>

          <span onClick={() => setShowSearch(true)}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </span>
        </div>

        {/* MOBILE MENU */}
        <div className={`mobile-menu ${open ? "show" : ""}`}>
          <Link to= "/For-Men" > Men </Link>
          <Link to= "/For-Women" > Women </Link>
          <a href="#">Kids</a>
          <Link to= "/Our-Story" > Our story </Link>
          <Link to= "/Contact" > Contact </Link>
        </div>

      </nav>

      {/* desktop menu */}

      <div className={`desktop-view ${scrolledDesktop ? 'scrolled': null}`}>
        <div className="desktop-menu">
          <Link to= "/For-Men" > Men </Link>
          <Link to= "/For-Women" > Women </Link>
          <a href="#">Kids</a>
          <Link to= "/Our-Story" > Our story </Link>
          <Link to= "/Contact" > Contact </Link>
        </div>

        <div className="header-logo-desktop">Brandi</div>

        <div className="header-icon">
          <span onClick={() => setShowCheckout(true)}>
            <i className="fa-solid fa-cart-arrow-down"></i>
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
