import { useState } from "react";
// import { useCart } from "../Cart/UseCart";
import { useCart } from "../Nav/Cart/UseCart"
import "./AddToCartButton.css";

function AddToCartButton({ product, className = "", children }) {
  const { addToCart, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    addToCart(product);

    // Reset animation after 600ms
    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <button
      className={`add-to-cart-btn ${className} ${isAdding ? "adding" : ""} ${
        isInCart(product._id) ? "in-cart" : ""
      }`}
      onClick={handleAddToCart}
    >
      {isAdding ? (
        <span className="adding-text">
          <i className="fa-solid fa-check"></i> Added!
        </span>
      ) : isInCart(product._id) ? (
        children || (
          <>
            <i className="fa-solid fa-cart-shopping"></i> In Cart
          </>
        )
      ) : (
        children || (
          <>
            <i className="fa-solid fa-cart-plus"></i> Add to Cart
          </>
        )
      )}
    </button>
  );
}

export default AddToCartButton;