import "./WomensContent.css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productLadies } from "../../../backend/products/productLadies";

const WomensContent = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const bg = document.querySelector(".contact-bg-women");

    const handleScroll = () => {
      const offset = window.scrollY * 0.3;
      bg.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <div className="contact-header">
        <div className="contact-bg-women">
          <p>For Women</p>
        </div>
      </div>

      <div className="womens-links">
        <a
          onClick={() => setSelectedCategory("all")}
          className={selectedCategory === "all" ? "active-link" : ""}
        >
          all
        </a>
        <a
          onClick={() => setSelectedCategory("hoodies")}
          className={selectedCategory === "hoodies" ? "active-link" : ""}
        >
          hoodies
        </a>
        <a
          onClick={() => setSelectedCategory("t-shirt")}
          className={selectedCategory === "t-shirt" ? "active-link" : ""}
        >
          t-shirt
        </a>
        <a
          onClick={() => setSelectedCategory("pants")}
          className={selectedCategory === "pants" ? "active-link" : ""}
        >
          pants
        </a>
      </div>

      {selectedCategory === "all" && (
        <div className="contents">
          {productLadies.map((product) => {
            return (
              <Link
                key={product.id}
                className="container"
                to={`/products/${product.id}`}
                state={{ product }}
              >
                <div className="image">
                  <img src={product.image} alt="Product-Image" />
                </div>

                <div className="name">
                  <p>{product.name}</p>
                  <p>
                    <i class="fa-solid fa-star"></i>
                    {product.rating.stars}
                  </p>
                </div>

                <div className="amount">
                  <p>${(product.priceCents / 100).toFixed(2)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {selectedCategory === "hoodies" && (
        <div className="contents">
          {productLadies
            .filter((product) => product.category === "hoodies")
            .map((product) => {
              return (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  state={{ product }}
                  className="container"
                >
                  <div className="image">
                    <img src={product.image} alt="Product-Image" />
                  </div>
                  <div className="name">
                    <p>{product.name}</p>
                    <p>
                      <i class="fa-solid fa-star"></i>
                      {product.rating.stars}
                    </p>
                  </div>

                  <div className="amount">
                    <p>${(product.priceCents / 100).toFixed(2)}</p>
                  </div>
                </Link>
              );
            })}
        </div>
      )}

      {selectedCategory === "t-shirt" && (
        <div className="contents">
          {productLadies
            .filter((product) => product.category === "t-shirt")
            .map((product) => {
              return (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  state={{ product }}
                  className="container"
                >
                  <div className="image">
                    <img src={product.image} alt="Product-Image" />
                  </div>
                  <div className="name">
                    <p>{product.name}</p>
                    <p>
                      <i class="fa-solid fa-star"></i>
                      {product.rating.stars}
                    </p>
                  </div>

                  <div className="amount">
                    <p>${(product.priceCents / 100).toFixed(2)}</p>
                  </div>
                </Link>
              );
            })}
        </div>
      )}

      {selectedCategory === "pants" && (
        <div className="contents">
            {productLadies
            .filter((product) => product.category === "pants")
            .map((product) => {
              return (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  state={{ product }}
                  className="container"
                >
                  <div className="image">
                    <img src={product.image} alt="Product-Image" />
                  </div>
                  <div className="name">
                    <p>{product.name}</p>
                    <p>
                      <i class="fa-solid fa-star"></i>
                      {product.rating.stars}
                    </p>
                  </div>

                  <div className="amount">
                    <p>${(product.priceCents / 100).toFixed(2)}</p>
                  </div>
                </Link>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default WomensContent;
