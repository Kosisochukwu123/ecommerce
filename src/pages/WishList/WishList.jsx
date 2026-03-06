import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../../api/user";
import "./WishList.css";

function Wishlist() {
  const { user, token, loading: authLoading } = useAuth(); // ← Add loading from context
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔍 Wishlist component mounted");
    console.log("User:", user);
    console.log("Token:", token ? "exists" : "missing");
    console.log("Auth loading:", authLoading);

    // Wait for auth to finish loading
    if (authLoading) {
      console.log("⏳ Waiting for auth to load...");
      return;
    }

    // After auth loads, check if user exists
    if (!user || !token) {
      console.log("❌ No user after auth load, redirecting to login");
      navigate("/Login");
      return;
    }

    console.log("✅ User and token exist, loading wishlist");
    loadWishlist();
  }, [authLoading, user, token, navigate]); // ← Add authLoading to dependencies

  const loadWishlist = async () => {
    try {
      console.log(
        "📡 Fetching wishlist with token:",
        token?.substring(0, 20) + "...",
      );
      setLoading(true);
      const response = await getWishlist(token);
      console.log("✅ Full API response:", response);
      console.log("📦 Wishlist array:", response.wishlist);
      console.log("📊 Wishlist length:", response.wishlist?.length);
      setWishlist(response.wishlist || []);
    } catch (error) {
      console.error("❌ Error loading wishlist:", error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(token, productId);
      setWishlist(wishlist.filter((item) => item._id !== productId));
    } catch (error) {
      alert("Failed to remove item: " + error.message);
    }
  };

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`);
  };

  // Show loading while auth is checking
  if (authLoading) {
    return (
      <div className="wishlist-loading">
        <p>Loading...</p>
      </div>
    );
  }

  // After auth loads, if no user, show redirecting message
  if (!user) {
    return (
      <div className="wishlist-loading">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  // Show loading while fetching wishlist
  if (loading) {
    return (
      <div className="wishlist-loading">
        <p>Loading wishlist...</p>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      {/* Header */}
      <div className="wishlist-header">
        <button className="btn-back" onClick={() => navigate("/profile")}>
          ← Back to Profile
        </button>
        <h1>My Wishlist</h1>
        <p>
          {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
        </p>
      </div>

      {/* Wishlist Content */}
      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-icon">❤️</div>
          <h2>Your wishlist is empty</h2>
          <p>Save items you love to buy them later</p>
          <button className="btn-shop" onClick={() => navigate("/products")}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <div key={product._id} className="wishlist-item">
              <div className="item-image">
                <img src={product.image} alt={product.name} />
                <button
                  className="btn-remove"
                  onClick={() => handleRemove(product._id)}
                  title="Remove from wishlist"
                >
                  ✕
                </button>
              </div>

              <div className="item-details">
                <h3>{product.name}</h3>
                <p className="item-category">{product.category}</p>

                <div className="item-price">
                  {product.discountCents ? (
                    <>
                      <span className="price-original">
                        ${(product.priceCents / 100).toFixed(2)}
                      </span>
                      <span className="price-sale">
                        ${(product.discountCents / 100).toFixed(2)}
                      </span>
                      <span className="price-badge">Sale</span>
                    </>
                  ) : (
                    <span className="price-current">
                      ${(product.priceCents / 100).toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="item-rating">
                  <span className="stars">
                    {"⭐".repeat(Math.round(product.rating?.stars || 0))}
                  </span>
                  <span className="rating-count">
                    ({product.rating?.count || 0})
                  </span>
                </div>

                {product.stock === 0 ? (
                  <div className="out-of-stock">Out of Stock</div>
                ) : product.stock < 10 ? (
                  <div className="low-stock">Only {product.stock} left!</div>
                ) : null}

                <button
                  className="btn-view"
                  onClick={() => handleViewProduct(product._id)}
                >
                  View Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
