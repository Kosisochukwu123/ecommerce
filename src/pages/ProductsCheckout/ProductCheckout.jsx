import "./ProductCheckout.css";
import Footer from "../../components/Footer/Footer.jsx";
import { About } from "../../components/About/About.jsx";
import FAQ from "../../components/FAQ/FAQ.jsx";
import Nav from "../../components/Nav/NavBar/Nav.jsx";
// import piece2 from "../../images/Top-Piece2.png";
import MightLike from "../../components/MightLike/MightLike.jsx";
import Socials from "../../components/Socials/Socials.jsx";
// import axios from "axios";
import { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useCart } from "../../components/Nav/Cart/UseCart.jsx";

export const ProductCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("description");

  const { addToCart } = useCart();
  const { id } = useParams();
  const location = useLocation();
  const product = location.state?.product;

  const handleAddToCart = () => {
    setLoading(true);

    // simulate loading
    setTimeout(() => {
      setLoading(false);
      addToCart(product);

      // wait before showing popup
      setTimeout(() => {
        setShowPopup(true);

        // hide popup after 2 seconds
        setTimeout(() => {
          setShowPopup(false);
        }, 800);
      });
    }, 1000); // loading duration
  };

  if (!product) {
    return <div>Loading product...</div>;
  }

  return (
    <div>
      <Nav alwaysScrolled={true} />

      <div className="product-container">
        <div className="product-image">
          <img
            src={product.image}
            alt="Product-Image"
            onError={(e) => console.log("Image failed to load:", e.target.src)}
          />
        </div>

        <div className="product-area">
          <div className="product-badge">
            <i class="fa-regular fa-heart"></i>
          </div>

          <div className="product-detail">
            <h3>
              {product.name}
              <p>
                <i class="fa-solid fa-star"></i>
                {product.rating.stars}
              </p>
            </h3>

            <div className="product-tabs">
              <div className="tabs-header">
                <h4
                  className={activeTab === "description" ? "active" : ""}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </h4>
                <h4
                  className={activeTab === "reviews" ? "active" : ""}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews
                </h4>
              </div>

              {/* CONTENT */}
              <div className="tabs-content">
                {activeTab === "description" && (
                  <p>
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. dygvg jhv sfv gvyfgv gyv fs gfvsgf gvs 
                  </p>
                )}

                {activeTab === "reviews" && (
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Labore dolore ad dicta facere iusto, quisquam nisi nemo
                    soluta error mollitia.
                  </p>
                )}
              </div>
            </div>

            <span>${(product.priceCents / 100).toFixed(2)}</span>
          </div>

          <div className="product-button">
            <button onClick={handleAddToCart} disabled={loading}>
              {loading ? <span className="spinner"></span> : "Add to cart"}
            </button>

            {showPopup && <div className="cart-popup"> Added to cart</div>}
          </div>

          <div className="product-question-faq"></div>
        </div>
      </div>

      <MightLike />
      <FAQ />
      <About />
      <Socials />
      <Footer />
    </div>
  );
};

export default ProductCheckout;
