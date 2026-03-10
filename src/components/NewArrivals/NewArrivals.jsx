import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchProducts } from "../../api/product";
import { useCart } from "../Nav/Cart/UseCart";
import { useAuth } from "../../context/AuthContext";
import { addToWishlist, removeFromWishlist, getWishlist } from "../../api/user";
import Star from "../../../public/images/star.png";
import "./NewArrivals.css";
import { Link } from "react-router-dom";

const NewArrivals = () => {
  const navigate = useNavigate();
  const rowRef = useRef(null);
  const { addToCart } = useCart();
  const { user, token } = useAuth();

  const [newArrivals, setNewArrivals] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlistIds, setWishlistIds] = useState([]);

  useEffect(() => {
    loadProducts();
    if (user && token) {
      loadWishlist();
    }
  }, [user, token]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetchProducts({});

      // Get 6 newest products (by createdAt)
      const newest = response.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6);

      // Get 6 top-rated products (by rating stars)
      const trending = response.data
        .filter((p) => p.rating && p.rating.stars > 0)
        .sort((a, b) => {
          // Sort by stars first, then by review count
          if (b.rating.stars !== a.rating.stars) {
            return b.rating.stars - a.rating.stars;
          }
          return b.rating.count - a.rating.count;
        })
        .slice(0, 6);

      setNewArrivals(newest);
      setTrendingProducts(trending);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = async () => {
    try {
      const response = await getWishlist(token);
      const ids = response.wishlist.map((item) => item._id);
      setWishlistIds(ids);
    } catch (error) {
      console.error("Error loading wishlist:", error);
    }
  };

  const handleWishlistToggle = async (productId) => {
    if (!user) {
      alert("Please login to add items to wishlist");
      navigate("/Login");
      return;
    }

    try {
      if (wishlistIds.includes(productId)) {
        await removeFromWishlist(token, productId);
        setWishlistIds(wishlistIds.filter((id) => id !== productId));
      } else {
        await addToWishlist(token, productId);
        setWishlistIds([...wishlistIds, productId]);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleProductClick = (product) => {
    navigate(`/products/${product._id}`, { state: { product } });
  };

  const slideLeft = () => {
    rowRef.current.scrollLeft -= 300;
  };

  const slideRight = () => {
    rowRef.current.scrollLeft += 300;
  };

  const calculateDiscount = (product) => {
    if (product.discountCents && product.discountCents < product.priceCents) {
      return Math.round(
        ((product.priceCents - product.discountCents) / product.priceCents) * 100
      );
    }
    return 0;
  };

  if (loading) {
    return (
      <div className="New-arrivals-container">
        <div className="loading-message">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="New-arrivals-container">
      {/* TRENDING SIDEBAR */}
      <aside>
        <h3>Trending Products</h3>

        <div className="aside-container">
          {trendingProducts.length > 0 ? (
            trendingProducts.map((product) => {
              const finalPrice = product.discountCents || product.priceCents;
              const hasDiscount = product.discountCents && product.discountCents < product.priceCents;

              return (
                <div
                  key={product._id}
                  className="aside-content"
                  onClick={() => handleProductClick(product)}
                  style={{ cursor: "pointer" }}
                >
                  <img src={product.image} alt={product.name} />

                  <div className="aside-content-detail">
                    <p>{product.name}</p>
                    <span>
                      <b>${(finalPrice / 100).toFixed(2)}</b>
                      {hasDiscount && (
                        <span className="old-price">
                          ${(product.priceCents / 100).toFixed(2)}
                        </span>
                      )}
                    </span>
                    {product.rating && product.rating.stars > 0 && (
                      <div className="trending-rating">
                        <img src={Star} alt="star" />
                        <span>{product.rating.stars.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-products">
              <p>No trending products yet</p>
            </div>
          )}
        </div>
      </aside>

      {/* NEW ARRIVALS SECTION */}
      <div className="New-arrivals">
        
        <div className="New-arrivals-head">
          <h3>New Arrivals</h3>
          <Link to="/products">see more</Link>
        </div>

        <div className="New-Arrivals-buttons">
          <button onClick={slideLeft}>◀</button>
          <button onClick={slideRight}>▶</button>
        </div>

        <div ref={rowRef} className="wrapper">
          {newArrivals.length > 0 ? (
            newArrivals.map((product) => {
              const finalPrice = product.discountCents || product.priceCents;
              const hasDiscount = product.discountCents && product.discountCents < product.priceCents;
              const discount = calculateDiscount(product);
              const isInWishlist = wishlistIds.includes(product._id);

              return (

                <div key={product._id} className="items">
                  {hasDiscount && (
                    <div className="items-banner">{discount}% off</div>
                  )}

                  <div className="innerdisplay">

                    <div
                      className="items-content"
                      onClick={() => handleProductClick(product)}
                      style={{ cursor: "pointer" }}
                    >
                      <img className="image-product" src={product.image} alt={product.name} />
                      <h2>{product.name}</h2>
                      
                      {product.rating && product.rating.stars > 0 && (
                        <span>
                          <img src={Star} alt="star" />
                          <b>{product.rating.stars.toFixed(1)}</b>
                          <small>({product.rating.count})</small>
                        </span>
                      )}

                      <p>
                        <b>${(finalPrice / 100).toFixed(2)}</b>
                        {hasDiscount && (
                          <span className="strike-price">
                            ${(product.priceCents / 100).toFixed(2)}
                          </span>
                        )}
                      </p>
                    </div>

                  </div>

                </div>

           
              );
            })
          ) : (
            <div className="no-products-grid">
              <p>No new arrivals yet</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default NewArrivals;