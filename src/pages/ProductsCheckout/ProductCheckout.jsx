import "./ProductCheckout.css";
import Footer from "../../components/Footer/Footer.jsx";
import { About } from "../../components/About/About.jsx";
import FAQ from "../../components/FAQ/FAQ.jsx";
import Nav from "../../components/Nav/NavBar/Nav.jsx";
import Socials from "../../components/Socials/Socials.jsx";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCart } from "../../components/Nav/Cart/UseCart.jsx";
import { useAuth } from "../../context/AuthContext";
import { addToWishlist, removeFromWishlist, getWishlist } from "../../api/user";
import { fetchProducts } from "../../api/product";
import ReviewSection from "../../components/ReviewSection/ReviewSection";

export const ProductCheckout = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { addToCart, isInCart } = useCart();
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  
  // ← ADD THESE STATES FOR GALLERY
  const [selectedImage, setSelectedImage] = useState("");
  const [allImages, setAllImages] = useState([]);

  // Load product
  useEffect(() => {
    loadProduct();
  }, [id]);

  // Check wishlist status
  useEffect(() => {
    if (user && token && product) {
      checkWishlistStatus();
    }
  }, [user, token, product]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await fetchProducts({});
      const foundProduct = response.data.find((p) => p._id === id);

      if (foundProduct) {
        setProduct(foundProduct);
        
        // ← ADD THIS: Set up image gallery
        const images = [foundProduct.image];
        if (foundProduct.images && foundProduct.images.length > 0) {
          images.push(...foundProduct.images);
        }
        setAllImages(images);
        setSelectedImage(foundProduct.image);
        
        // Set default selections
        if (foundProduct.sizes?.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        }
        if (foundProduct.colors?.length > 0) {
          setSelectedColor(foundProduct.colors[0]);
        }
      } else {
        alert("Product not found");
        navigate("/products");
      }
    } catch (error) {
      console.error("Error loading product:", error);
      alert("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    try {
      const response = await getWishlist(token);
      const wishlistIds = response.wishlist.map((item) => item._id);
      setIsInWishlist(wishlistIds.includes(product._id));
    } catch (error) {
      console.error("Error checking wishlist:", error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      alert("Please login to add items to wishlist");
      navigate("/Login");
      return;
    }

    setWishlistLoading(true);

    try {
      if (isInWishlist) {
        await removeFromWishlist(token, product._id);
        setIsInWishlist(false);
        showToast("Removed from wishlist");
      } else {
        await addToWishlist(token, product._id);
        setIsInWishlist(true);
        showToast("Added to wishlist ❤️");
      }
    } catch (error) {
      alert(error.message || "Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    setAddingToCart(true);

    setTimeout(() => {
      addToCart(product, quantity);
      setAddingToCart(false);
      setShowCartPopup(true);

      setTimeout(() => {
        setShowCartPopup(false);
      }, 2000);
    }, 500);
  };

  const incrementQuantity = () => {
    if (product.stock && quantity >= product.stock) {
      alert("Maximum stock reached");
      return;
    }
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const showToast = (message) => {
    const toast = document.createElement("div");
    toast.className = "wishlist-toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 10);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 2500);
  };

  if (loading) {
    return (
      <div>
        <Nav alwaysScrolled={true} />
        <div className="product-loading">
          <p>Loading product...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Nav alwaysScrolled={true} />
        <div className="product-not-found">
          <h2>Product not found</h2>
          <button onClick={() => navigate("/products")}>Browse Products</button>
        </div>
        <Footer />
      </div>
    );
  }

  const finalPrice = product.discountCents || product.priceCents;
  const hasDiscount =
    product.discountCents && product.discountCents < product.priceCents;

  return (
    <div className="bbb">
      <Nav alwaysScrolled={true} />

      <div className="product-container">
        {/* ← UPDATED: Product Image Section with Gallery */}
        <div className="product-image-section">
          {/* Main Image Display */}
          <div className="product-image">
            <img src={selectedImage} alt={product.name} />

            {hasDiscount && (
              <div className="discount-badge">
                Sale{" "}
                {Math.round(
                  ((product.priceCents - product.discountCents) /
                    product.priceCents) *
                    100,
                )}
                % OFF
              </div>
            )}
          </div>

          {/* ← ADD THIS: Thumbnail Gallery */}
          {allImages.length > 1 && (
            <div className="product-gallery">
              {allImages.map((img, index) => (
                <div
                  key={index}
                  className={`gallery-thumbnail ${selectedImage === img ? "active" : ""}`}
                  onClick={() => setSelectedImage(img)}
                >
                  <img src={img} alt={`${product.name} view ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details - REST OF YOUR EXISTING CODE */}
        <div className="product-area">
          {/* ... all your existing product detail code stays the same ... */}
          
          <button
            className={`product-wishlist-btn ${isInWishlist ? "active" : ""}`}
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
            title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <i
              className={`fa-${isInWishlist ? "solid" : "regular"} fa-heart`}
            ></i>
          </button>

          <div className="product-detail">
            {/* Product Header */}
            <div className="product-header">
              <h1>{product.name}</h1>
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fa-${
                        i < Math.round(product.rating?.stars || 0)
                          ? "solid"
                          : "regular"
                      } fa-star`}
                    ></i>
                  ))}
                </div>
                <span className="rating-text">
                  {product.rating?.stars || 0} ({product.rating?.count || 0}{" "}
                  reviews)
                </span>
              </div>
            </div>

            {/* Category & Brand */}
            <div className="product-meta">
              <span className="category-badge">{product.category}</span>
              {product.brand && (
                <span className="brand-text">by {product.brand}</span>
              )}
            </div>

            {/* Price */}
            <div className="product-price">
              <span className="current-price">
                ${(finalPrice / 100).toFixed(2)}
              </span>
              {hasDiscount && (
                <span className="original-price">
                  ${(product.priceCents / 100).toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            {product.stock !== undefined && (
              <div className="stock-status">
                {product.stock > 0 ? (
                  product.stock < 10 ? (
                    <span className="stock-low">
                      Only {product.stock} left in stock!
                    </span>
                  ) : (
                    <span className="stock-available">In Stock</span>
                  )
                ) : (
                  <span className="stock-out">Out of Stock</span>
                )}
              </div>
            )}

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="product-options">
                <label>Size:</label>
                <div className="size-options">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? "active" : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="product-options">
                <label>Color:</label>
                <div className="color-options">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`color-btn ${selectedColor === color ? "active" : ""}`}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button onClick={decrementQuantity} disabled={quantity <= 1}>
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button onClick={incrementQuantity}>+</button>
              </div>
            </div>

            {/* Tabs */}
            <div className="product-tabs">
              <div className="tabs-header">
                <button
                  className={`tab-btn ${activeTab === "description" ? "active" : ""}`}
                  onClick={() => setActiveTab("description")}
                >
                  Description
                </button>
                <button
                  className={`tab-btn ${activeTab === "reviews" ? "active" : ""}`}
                  onClick={() => setActiveTab("reviews")}
                >
                  Reviews
                </button>
              </div>

              <div className="tabs-content">
                {activeTab === "description" && (
                  <div className="tab-panel">
                    {product.description ? (
                      <p>{product.description}</p>
                    ) : (
                      <p>
                        Experience premium quality with our {product.name}.
                        Carefully crafted with attention to detail.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="tab-panel">
                    <p className="reviews-placeholder">
                      {product.rating?.count > 0
                        ? `This product has ${product.rating.count} customer reviews.`
                        : "Be the first to review this product!"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="product-actions">
            <button
              className={`add-to-cart-main ${addingToCart ? "loading" : ""} ${
                isInCart(product._id) ? "in-cart" : ""
              }`}
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
            >
              {addingToCart ? (
                <>
                  <span className="spinner"></span>
                  Adding...
                </>
              ) : isInCart(product._id) ? (
                <>
                  <i className="fa-solid fa-check"></i>
                  In Cart
                </>
              ) : product.stock === 0 ? (
                "Out of Stock"
              ) : (
                <>
                  <i className="fa-solid fa-cart-plus"></i>
                  Add to Cart
                </>
              )}
            </button>

            {showCartPopup && (
              <div className="cart-popup-success">
                <i className="fa-solid fa-check-circle"></i>
                Added to cart successfully!
              </div>
            )}
          </div>
        </div>
        
      </div>

      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 24px" }}>
        <ReviewSection productId={id} />
      </div>

      <FAQ />
      <About />
      <Socials />
      <Footer />
    </div>
  );
};

export default ProductCheckout;