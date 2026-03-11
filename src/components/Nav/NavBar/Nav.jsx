import "./Nav.css";
import { useState, useEffect } from "react";
import { CheckoutPage } from "../Cart/CartItems.jsx";  // ← Fixed import
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useCart } from "../Cart/UseCart.jsx";
import { useAuth } from "../../../context/AuthContext";  // ← ADD THIS

const Nav = ({ scrolledDesktopDistance = 440, alwaysScrolled = false }) => {
  const [open, setOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrolledDesktop, setScrolledDesktop] = useState(false);
  
  const location = useLocation();
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();  // ← ADD THIS

  useEffect(() => {
    let scrollDistance;

    if (alwaysScrolled) {
      setScrolled(true);
      return;
    }

    // mobile screens
    if (window.innerWidth <= 480 && location.pathname === "/") {
      scrollDistance = 820;
    } else if (window.innerWidth <= 480) {
      scrollDistance = 450;
    }
    // tablets
    else if (window.innerWidth <= 768 && location.pathname === "/") {
      scrollDistance = 1000;
    } else if (window.innerWidth <= 768) {
      scrollDistance = 700;
    } else if (window.innerWidth <= 820 && location.pathname === "/") {
      scrollDistance = 1150;
    } else if (window.innerWidth <= 820) {
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysScrolled, location.pathname]);

  useEffect(() => {
    if (alwaysScrolled) {
      setScrolledDesktop(true);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > scrolledDesktopDistance) {
        setScrolledDesktop(true);
      } else {
        setScrolledDesktop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysScrolled, scrolledDesktopDistance]);

  const handleLogout = () => {
    logout();
    setOpen(false);  // Close mobile menu after logout
  };

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
            <i className="fa-solid fa-cart-arrow-down">
              <p>{getTotalItems()}</p>
            </i>
          </span>
        </div>

        {/* MOBILE MENU */}
        <div className={`mobile-menu ${open ? "show" : ""}`}>
          <Link to="/" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/products" onClick={() => setOpen(false)}>Shop</Link>
          <Link to="/Our-Story" onClick={() => setOpen(false)}>Our story</Link>
          <Link to="/Contact" onClick={() => setOpen(false)}>Contact</Link>
          
          {/* ✅ CONDITIONAL MOBILE MENU ITEMS */}
          {user ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)}>
                Profile
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" onClick={() => setOpen(false)}>
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="mobile-logout-btn">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}>
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* DESKTOP MENU */}
      <div className={`desktop-view ${scrolledDesktop ? "scrolled" : ""}`}>
        <div className="desktop-menu">
          <Link to="/">Home</Link>
          
          {/* ✅ CONDITIONAL DESKTOP LINK: Show "Shop" when logged in, "Login" when not */}
          {user ? (
            <Link to="/products">Shop</Link>
          ) : (
            <Link to="/login">Login</Link>
          )}
          
          <Link to="/Our-Story">Our story</Link>
          <Link to="/Contact">Contact</Link>
          
        </div>

        <div className="header-logo-desktop">Brandi</div>

        <div className="header-icon">
          <span onClick={() => setShowCheckout(true)}>
            <i className="fa-solid fa-cart-arrow-down">
              <p>{getTotalItems()}</p>
            </i>
          </span>
        </div>
      </div>

      <CheckoutPage
        showCheckout={showCheckout}
        setShowCheckout={setShowCheckout}
      />
    </>
  );
};

export default Nav;