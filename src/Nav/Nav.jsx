import "./Nav.css";
import { useState } from "react";
import { Search } from "./Search";
import { CheckoutPage } from "./CartItems";

const Nav = () => {
  const [open, setOpen] = useState(false);

  const [showCheckout, setShowCheckout] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <>
      <nav>
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
          <a href="#">Men</a>
          <a href="#">Women</a>
          <a href="#">Kids</a>
          <a href="#">Our Story</a>
          <a href="#">Contact</a>
        </div>
      </nav>

      {/* desktop menu */}

      <div className="desktop-view">
        <div className="desktop-menu">
          <a href="#">Men</a>
          <a href="#">Women</a>
          <a href="#">Kids</a>
          <a href="#">Our Story</a>
          <a href="#">Contact</a>
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
