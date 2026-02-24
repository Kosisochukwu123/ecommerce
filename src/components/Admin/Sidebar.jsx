import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const OpenSidebar = () => {
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const links = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <i className="fa-solid fa-house"></i>,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: <i className="fa-solid fa-box"></i>,
    },
    {
      name: "Orders",
      path: "/admin/orders",
      icon: <i className="fa-brands fa-opencart"></i>,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <i className="fa-solid fa-users"></i>,
    },
    {
      name: "Analytics",
      path: "/admin/analytics",
      icon: <i className="fa-solid fa-chart-line"></i>,
    },
  ];



  const editLinks = [
    {
      name: "HomePage Content",
      path: "/HomePageContent",
      icon: <i class="fa-solid fa-gear"></i>,

      // hero text, hero image, featured products, cta text
    },
    {
      name: "Contact Edit",
      path: "/admin/products",
      icon: <i class="fa-solid fa-gear"></i>,
      // currency, shipping rules, contact email, business address
    },
    {
      name: "Website Identity",
      path: "/admin/orders",
      icon: <i class="fa-solid fa-gear"></i>,
      // site name, logo, primary color
    },
    {
      name: "FAQ Edit",
      path: "/admin/faq",
      icon: <i class="fa-solid fa-gear"></i>,
    },
    {
      name: "Product Edit",
      path: "/admin/UpdateProduct",
      icon: <i class="fa-solid fa-gear"></i>,
    },
    // {
    //   name: "Analytics",
    //   path: "/admin/analytics",
    //   icon: <i className="fa-solid fa-chart-line"></i>,
    // },
  ];

  return (
    <>
      {/* Hamburger Button (Mobile Only) */}
      {!isOpen && (
        <button className="hamburger-admin" onClick={OpenSidebar}>
          ☰
        </button>
      )}

      {/* Overlay (Mobile Only) */}
      {isOpen && <div className="overlay" onClick={closeSidebar}></div>}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <button className="close-hamburger" onClick={closeSidebar}>
          x
        </button>

        <h2 className="logo">Admin Panel</h2>

        <nav className="nav-link-adminSection">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link-admin ${
                location.pathname === link.path ? "active" : ""
              }`}
              onClick={closeSidebar}
            >
              <div className="nav-details">
                {link.icon}
                {link.name}
              </div>
            </Link>
          ))}

          <h2 className="nav-link-secondh2">Edit Content</h2>

          {editLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link-admin ${
                location.pathname === link.path ? "active" : ""
              }`}
              onClick={closeSidebar}
            >
              <div className="nav-details">
                {link.icon}
                {link.name}
              </div>
            </Link>
          ))}

        </nav>
      </aside>
    </>
  );
}
