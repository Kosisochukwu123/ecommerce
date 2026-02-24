import React from "react";
// import { useRef } from "react";
import { useState, useEffect } from "react";
import bannerIMg from "../../../public/images/shopping-banner.png";
import profileImg from "../../../public/images/no-image.png";
import ShoeIcon from "../../../public/images/shoes-icon.png";
import WatchIcon from "../../../public/images/watch-icon.png";
import ClothIcon from "../../../public/images/cloth-icon.png";
import MakerIcon from "../../../public/images/maker-icon.png";
import AllIcon from "../../../public/images/all-icon.png";
import Star from "../../../public/images/star.png";
import "./Products.css";
import { Link } from "react-router-dom";
import img1 from "../../../public/images/nike-shoe.webp";
import QuickLinks from "../../components/QuickLink/QuickLinks";
import { useCart } from "../../components/Nav/Cart/UseCart";
import { CheckoutPage } from "../../components/Nav/Cart/CartItems";
// import { products } from "../../../backend/products/product";
import { fetchProducts } from "../../api/product";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await fetchProducts();
        setProducts(response.data); // Backend returns { success: true, data: [...] }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const { getTotalItems } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <QuickLinks />

      <CheckoutPage
        showCheckout={showCheckout}
        setShowCheckout={setShowCheckout}
      />

      <div className="products-container">
        <div className="products-container-top">
          <div className="products-container-top-1">
            <div className="products-container-top-details">
              <img src={profileImg} alt="" />
              <div className="aaa">
                <h2>Good Morning!</h2>
                <p>Kosi</p>
              </div>
            </div>

            <div className="products-container-top-buttons">
              <i
                onClick={() => setShowCheckout(true)}
                className="fa-solid fa-cart-arrow-down"
              >
                <p>{getTotalItems()}</p>
              </i>

              <i class="fa-solid fa-bell">
                <p>0</p>
              </i>
            </div>
          </div>

          <div className="products-container-top-2">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="search" />
          </div>

          <div className="products-container-top-3">
            <Link to="">
              <img src={AllIcon} alt="all icon" />
              All
            </Link>
            <Link to="">
              <img src={ClothIcon} alt="cloth icon" />
              Cloth
            </Link>
            <Link to="">
              <img src={ShoeIcon} alt="shoe icon" />
              Shoe
            </Link>
            <Link to="">
              <img src={WatchIcon} alt="watch icon" />
              Watches
            </Link>
            <Link to="">
              <img src={MakerIcon} alt="maker icon" />
              Beauty
            </Link>
          </div>
        </div>

        <div className="products-container-bottom">
          <div className="products-banner">
            <div className="white-style"></div>
            <div className="white-style1"></div>

            <div className="products-banner-text">
              <p>Get 20% off on all products</p>
            </div>

            <div className="product-banner-iamge">
              <img src={bannerIMg} alt="shopping banner" />
            </div>

            <button className="products-banner-button">
              shop now <span>=</span>
            </button>
          </div>

          <div className="products-contents">
            <div className="main-area">
              <div className="main-area-image">
                <img src={img1} alt="" />
                <i></i>
              </div>

              <div className="main-area-detail">
                <h4>0034 nikie shoe nid uwaaa</h4>
                <h2>$20000</h2>
                <span>
                  {" "}
                  <b>5%</b> <p>$2000</p>{" "}
                </span>
                <h2>
                  <img src={Star} alt="star" />
                  4.9
                </h2>
              </div>
            </div>

            {products.map((product) => {
              return (
                <Link 
                  className="main-area"
                  key={product._id}
                >
                  <div className="main-area-image">
                    <img src={product.image} alt="" />
                  </div>

                  <div className="main-area-detail">
                    <h4>{product.name}</h4>
                    <h2>${(product.priceCents / 100).toFixed(2)}</h2>
                    <span>
                      <b>5%</b> <p>$2000</p>
                    </span>
                    <h2>
                      <img src={Star} alt="star" />
                      {product.rating.stars}
                    </h2>
                  </div>
                </Link>
              );
            })}

            {/* <div className="main-area">
              <div className="main-area-image">
                <img src={img1} alt="" />
                <i></i>
              </div>

              <div className="main-area-detail">
                <h4>0034 nikie shoe nid uwaaa</h4>
                <h2>$20000</h2>
                <span>
                  {" "}
                  <b>5%</b> <p>$2000</p>{" "}
                </span>
                <h2>
                  <img src={Star} alt="star" />
                  4.9
                </h2>
              </div>
            </div>

            <div className="main-area">
              <div className="main-area-image">
                <img src={img1} alt="" />
                <i></i>
              </div>

              <div className="main-area-detail">
                <h4>0034 nikie shoe nid uwaaa</h4>
                <h2>$20000</h2>
                <span>
                  {" "}
                  <b>5%</b> <p>$2000</p>{" "}
                </span>
                <h2>
                  <img src={Star} alt="star" />
                  4.9
                </h2>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
