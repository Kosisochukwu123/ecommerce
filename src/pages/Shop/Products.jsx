import React from "react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import bannerIMg from "../../../public/images/shopping-banner.png";
import profileImg from "../../../public/images/no-image.png";
import ShoeIcon from "../../../public/images/shoes-icon.png";
import WatchIcon from "../../../public/images/watch-icon.png";
import ClothIcon from "../../../public/images/cloth-icon.png";
import MakerIcon from "../../../public/images/maker-icon.png";
import AllIcon from "../../../public/images/all-icon.png";
import "./Products.css";
import QuickLinks from "../../components/QuickLink/QuickLinks";
import { useCart } from "../../components/Nav/Cart/UseCart";
import { CheckoutPage } from "../../components/Nav/Cart/CartItems";
import { fetchProducts } from "../../api/product";
import ProductCard from "../../components/ProductCard/ProductCard";
import adVideo from "../../../public/video/NikeAD.mp4";
import Footer from "../../components/Footer/Footer";
import img from "../../../public/images/aside-products.png";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigationType } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getTotalItems } = useCart();
  const searchRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const location = useLocation();
  const navigationType = useNavigationType();

  // ← ADD FILTER STATES
  const [priceRange, setPriceRange] = useState([0, 50000]); // in cents (0 to $500)
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Category configuration
  const categories = [
    { id: "all", name: "All", icon: AllIcon, filter: null },
    {
      id: "clothing",
      name: "Cloth",
      icon: ClothIcon,
      filter: ["t-shirt", "hoodies", "clothing", "clothes"],
    },
    {
      id: "shoes",
      name: "Shoes",
      icon: ShoeIcon,
      filter: ["shoes", "sneakers", "footwear"],
    },
    {
      id: "watches",
      name: "Watches",
      icon: WatchIcon,
      filter: ["watches", "watch", "glasses", "glass"],
    },
    {
      id: "beauty",
      name: "Beauty",
      icon: MakerIcon,
      filter: ["beauty", "makeup", "cosmetics"],
    },
  ];

  // ← FILTER CATEGORIES FOR SIDEBAR
  const filterCategories = [
    { id: "t-shirt", label: "T-Shirts" },
    { id: "hoodies", label: "Hoodies" },
    { id: "shoes", label: "Shoes" },
    { id: "sneakers", label: "Sneakers" },
    { id: "watches", label: "Watches" },
    { id: "glasses", label: "Glasses" },
    { id: "beauty", label: "Beauty" },
    { id: "makeup", label: "Makeup" },
    { id: "accessories", label: "Accessories" },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  // Filter products when category, search, price range, or selected categories change
  useEffect(() => {
    filterProducts();
  }, [products, activeCategory, searchTerm, priceRange, selectedCategories]);

  // Handle search dropdown
  useEffect(() => {
    if (searchTerm.trim().length > 0) {
      performSearch(searchTerm);
      setShowSearchDropdown(true);
    } else {
      setSearchResults([]);
      setShowSearchDropdown(false);
    }
  }, [searchTerm, products]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetchProducts();
      setProducts(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ← ADD THIS: Restore scroll AFTER products load
  useEffect(() => {
    if (!loading && navigationType === "POP") {
      const savedPosition = sessionStorage.getItem(
        `scroll-${location.pathname}`,
      );

      if (savedPosition) {
        const targetPosition = parseInt(savedPosition, 10);

        // Try multiple times to ensure content is fully loaded
        let attempts = 0;
        const maxAttempts = 10;

        const tryScroll = () => {
          setTimeout(() => {
            const pageHeight = document.documentElement.scrollHeight;
            const windowHeight = window.innerHeight;
            const maxScroll = pageHeight - windowHeight;

            if (targetPosition <= maxScroll || attempts >= maxAttempts) {
              // Content is ready or we've tried enough
              window.scrollTo({
                top: targetPosition,
                behavior: "instant",
              });
            } else {
              // Try again
              attempts++;
              tryScroll();
            }
          }, 100);
        };

        tryScroll();
      }
    }
  }, [loading, navigationType, location.pathname]);

  // ← ADD THIS: Save scroll position while scrolling
  useEffect(() => {
    let scrollTimer;
    const handleScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        sessionStorage.setItem(`scroll-${location.pathname}`, window.scrollY);
      }, 100);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearTimeout(scrollTimer);
      window.removeEventListener("scroll", handleScroll);
      sessionStorage.setItem(`scroll-${location.pathname}`, window.scrollY);
    };
  }, [location.pathname]);

  // ← UPDATED FILTER FUNCTION WITH PRICE RANGE AND CATEGORIES
  const filterProducts = () => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (product) =>
          product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.keywords?.some((keyword) =>
            keyword.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }
    // Filter by top category buttons (if NOT searching)
    else if (activeCategory !== "all") {
      const category = categories.find((cat) => cat.id === activeCategory);
      if (category && category.filter) {
        filtered = filtered.filter((product) =>
          category.filter.some((term) =>
            product.category?.toLowerCase().includes(term.toLowerCase()),
          ),
        );
      }
    }

    // Filter by price range
    filtered = filtered.filter((product) => {
      const price = product.discountCents || product.priceCents;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by selected sidebar categories
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((product) =>
        selectedCategories.some((cat) =>
          product.category?.toLowerCase().includes(cat.toLowerCase()),
        ),
      );
    }

    setFilteredProducts(filtered);
  };

  const performSearch = (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    const results = products.filter(
      (product) =>
        product.name?.toLowerCase().includes(term.toLowerCase()) ||
        product.category?.toLowerCase().includes(term.toLowerCase()) ||
        product.brand?.toLowerCase().includes(term.toLowerCase()) ||
        product.description?.toLowerCase().includes(term.toLowerCase()) ||
        product.keywords?.some((keyword) =>
          keyword.toLowerCase().includes(term.toLowerCase()),
        ),
    );

    setSearchResults(results.slice(0, 6));
  };

  const handleCategoryClick = (categoryId) => {
    setActiveCategory(categoryId);
    setSearchTerm("");
    setShowSearchDropdown(false);
    document.querySelector(".products-contents")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchResultClick = (product) => {
    setSearchTerm("");
    setShowSearchDropdown(false);
    navigate(`/products/${product._id}`, { state: { product } });
  };

  const handleViewAllResults = () => {
    setShowSearchDropdown(false);
    document.querySelector(".products-contents")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowSearchDropdown(false);
  };

  // ← ADD FILTER HANDLERS
  const handlePriceChange = (e) => {
    const value = parseInt(e.target.value);
    setPriceRange([0, value]);
  };

  const handleCategoryFilterToggle = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const clearFilters = () => {
    setPriceRange([0, 50000]);
    setSelectedCategories([]);
    setActiveCategory("all");
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="spinner-large"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-error">
        <p>Error loading products: {error}</p>
        <button onClick={loadProducts}>Retry</button>
      </div>
    );
  }

  return (
    <>
      <QuickLinks />

      <CheckoutPage
        showCheckout={showCheckout}
        setShowCheckout={setShowCheckout}
      />

      <div className="products-container">
        <div className="products-video">
          <video src={adVideo} muted loop playsInline autoPlay></video>
          <div className="overlay"></div>
        </div>

        <div class="marquee">
          <div class="marquee-content">
            🚚 Free Shipping Over $50 ⭐ Trusted by 25,000+ Customers 🔒 Secure
            Checkout 🔥 Flash Sale Up To 40% OFF 🎁 New User Discount 🚚 Free
            Shipping Over $50 ⭐ Trusted by 25,000+ Customers 🔒 Secure Checkout
            🔥 Flash Sale Up To 40% OFF 🎁 New User Discount
          </div>
        </div>

        <div className="products-container-top">
          <div className="products-container-top-1">
            <div className="products-container-top-details">
              <img src={profileImg} alt="Profile" />
              <div className="aaa">
                <h2>Good Morning!</h2>
                <p>{user?.username || "Guest"}</p>
              </div>
            </div>

            {/* SEARCH BAR WITH DROPDOWN */}
            <div className="products-container-search" ref={searchRef}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchTerm && (
                <button className="clear-search" onClick={clearSearch}>
                  ✕
                </button>
              )}

              {/* SEARCH DROPDOWN */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div className="search-dropdown">
                  <div className="search-dropdown-header">
                    <span>Found {searchResults.length} results</span>
                  </div>

                  <div className="search-results-list">
                    {searchResults.map((product) => (
                      <div
                        key={product._id}
                        className="search-result-item"
                        onMouseDown={() => handleSearchResultClick(product)}
                      >
                        <div className="search-result-image">
                          <img src={product.image} alt={product.name} />
                        </div>
                        <div className="search-result-info">
                          <p className="search-result-name">{product.name}</p>
                          <span className="search-result-category">
                            {product.category}
                          </span>
                        </div>
                        <div className="search-result-price">
                          $
                          {(
                            (product.discountCents || product.priceCents) / 100
                          ).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {searchResults.length === 6 && (
                    <div className="search-dropdown-footer">
                      <button
                        className="view-all-btn"
                        onMouseDown={handleViewAllResults}
                      >
                        View All Results →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* NO RESULTS MESSAGE */}
              {showSearchDropdown &&
                searchTerm &&
                searchResults.length === 0 && (
                  <div className="search-dropdown">
                    <div className="search-no-results">
                      <i className="fa-solid fa-search"></i>
                      <p>No products found for "{searchTerm}"</p>
                    </div>
                  </div>
                )}
            </div>

            <div className="products-container-top-buttons">
              <i
                onClick={() => setShowCheckout(true)}
                className="fa-solid fa-cart-arrow-down"
              >
                {getTotalItems() > 0 && <p>{getTotalItems()}</p>}
              </i>

              {/* <i className="fa-solid fa-bell">
                <p>0</p>
              </i> */}
            </div>
          </div>

          <div className="products-container-top-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${
                  activeCategory === category.id ? "active" : ""
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                <img src={category.icon} alt={`${category.name} icon`} />
                <p>{category.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="products-container-bottom">
          <aside className="left">
            <img src={img} alt="" />
          </aside>

          <div className="products-banner">
            <div className="white-style"></div>
            <div className="white-style1"></div>

            <div className="products-banner-text">
              <p>Brandi Launching tech gadgets, soon...</p>
            </div>

            <div className="product-banner-iamge">
              <img src={bannerIMg} alt="shopping banner" />
            </div>

            <button className="products-banner-button">
              up to <span>60% off</span>
            </button>
          </div>

          {/* ← UPDATED RIGHT SIDEBAR WITH FILTERS */}
          <aside className="right">
            <div className="filter-container">
              <div className="filter-header">
                <h3>Filters</h3>
                <button className="btn-clear-filters" onClick={clearFilters}>
                  Clear All
                </button>
              </div>

              {/* Price Range Filter */}
              <div className="filter-section">
                <h4>Price Range</h4>
                <div className="price-range-display">
                  <span>$0</span>
                  <span>${(priceRange[1] / 100).toFixed(0)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={handlePriceChange}
                  className="price-slider"
                />
                <div className="price-labels">
                  <small>Min: $0</small>
                  <small>Max: $500</small>
                </div>
              </div>

              {/* Category Filter */}
              <div className="filter-section">
                <h4>Categories</h4>
                <div className="category-checkboxes">
                  {filterCategories.map((cat) => (
                    <label key={cat.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.id)}
                        onChange={() => handleCategoryFilterToggle(cat.id)}
                      />
                      <span>{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Active Filters Count */}
              {(priceRange[1] < 50000 || selectedCategories.length > 0) && (
                <div className="active-filters">
                  <p>
                    {selectedCategories.length +
                      (priceRange[1] < 50000 ? 1 : 0)}{" "}
                    active filter(s)
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Products Grid */}
        <div className="products-contents">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <div className="no-products">
              <i className="fa-solid fa-box-open"></i>
              <h3>No products found</h3>
              <p>
                {searchTerm
                  ? `No results for "${searchTerm}"`
                  : `No products match your filters`}
              </p>
              <button className="btn-reset" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Products;
