import React from "react";
import "./ProductCheckout.css";
import Footer from "../../components/Footer/Footer";
import { About } from "../../components/About/About";
import FAQ from "../../components/FAQ/FAQ";
import Nav from "../../components/Nav/Nav";
import piece2 from "../../images/Top-Piece2.png";

export const ProductCheckout = () => {
  return (
    <div>
      <Nav alwaysScrolled={true} />

      <div className="product-container">

        <div className="product-image">
          <img src={piece2} alt="" srcset="" />
        </div>

        <div className="product-area">
          <div className="product-badge">
            <p>sale</p>
          </div>

          <div className="product-detail">
            <h3> americana di na hoodie </h3>
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
            <span>$200</span>
          </div>

          <button>Add to cart</button>

          <div className="product-question-faq"></div>
        </div>
        
      </div>

      <FAQ />
      <About />
      <Footer />
    </div>
  );
};

export default ProductCheckout;
