import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { addToWishlist, removeFromWishlist, getWishlist } from "../../api/user";
import "./ProductCard.css";
import Star from "../../../public/images/star.png"; // Update path as needed
import AddToCartButton from "../../components/AddToCartButton/AddToCartButton";

function ProductCard({ product }) {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if product is in wishlist on mount
  useEffect(() => {
    if (user && token) {
      checkWishlistStatus();
    }
  }, [user, product._id]);

  const checkWishlistStatus = async () => {
    try {
      const response = await getWishlist(token);
      const wishlistIds = response.wishlist.map((item) => item._id);
      setIsInWishlist(wishlistIds.includes(product._id));
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // If not logged in, redirect to login
    if (!user) {
      navigate("/Login");
      return;
    }

    // Trigger animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        await removeFromWishlist(token, product._id);
        setIsInWishlist(false);
        showToast("Removed from wishlist", "remove");
      } else {
        // Add to wishlist
        await addToWishlist(token, product._id);
        setIsInWishlist(true);
        showToast("Added to wishlist ❤️", "add");
      }
    } catch (error) {
      console.error("Wishlist error:", error);
      alert(error.message || "Failed to update wishlist");
    }
  };

  const showToast = (message, type) => {
    // Create toast element
    const toast = document.createElement("div");
    toast.className = `wishlist-toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add("show"), 10);

    // Remove toast after 2.5 seconds
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2500);
  };

  const handleViewProduct = () => {
    navigate(`/products/${product._id}`);
  };

  return (
    // <div className="productcard-wrapper">
    <div className="productsCard-items">
      <div className="productscard-items-banner">best sellers</div>

      <div className="productcard-innerdisplay">

        <div className="productcard-image-wrapper">
          {/* HOVER ICONS */}
          <div className="hover-icons">
            <button
              className={`icon-btn wishlist-btn ${isAnimating ? "animating" : ""}`}
              onClick={handleWishlistToggle}
              title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
            >
              <i
                className={`fa-${isInWishlist ? "solid" : "regular"} fa-heart`}
                style={{ color: isInWishlist ? "#ef4444" : "#6b7280" }}
              ></i>
            </button>
            <button
              className="icon-btn"
              onClick={handleViewProduct}
              title="View product"
            >
              <i className="fa-solid fa-arrow-up-right-from-square"></i>
            </button>
          </div>

          {/* ADD TO CART */}
          <AddToCartButton product={product} className="add-to-cartinho" />
        </div>

        <div className="zzz">
          <img
            src={product.image}
            alt={product.name}
            onClick={handleViewProduct}
            style={{ cursor: "pointer" }}
            className="product-image"
          />
          <h2 onClick={handleViewProduct} style={{ cursor: "pointer" }}>
            {product.name}
          </h2>
          <span>
            <img src={Star} alt="star" />
            <b>{product.rating?.stars || 0}</b>
            <small> ({product.rating?.count || 0})</small>
          </span>
          <p>
            {product.discountCents ? (
              <>
                <b>${(product.discountCents / 100).toFixed(2)}</b>
                <span style={{ textDecoration: "line-through", color: "#999" }}>
                  ${(product.priceCents / 100).toFixed(2)}
                </span>
              </>
            ) : (
              <b>${(product.priceCents / 100).toFixed(2)}</b>
            )}
          </p>
        </div>

      </div>
    </div>
  );
}

export default ProductCard;
