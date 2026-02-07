import { useState } from "react";
import { Link } from "react-router-dom";
import "./QuickLinks.css";

const QuickLinks = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="quick-links">
      {/* RADIAL LINKS */}
      <div className={`radial-menu ${open ? "open" : ""}`}>
        <Link to="/shop" className="item item-1">Shop</Link>
        <Link to="/cart" className="item item-2">Cart</Link>
        <Link to="/profile" className="item item-3">Profile</Link>
        <Link to="/contact" className="item item-4">Contact</Link>
      </div>

      {/* MAIN BUTTON */}
      <button
        className="quick-links-btn"
        onClick={() => setOpen(!open)}
      >
        {open ? "×" : "+"}
      </button>
    </div>
  );
};

export default QuickLinks;
