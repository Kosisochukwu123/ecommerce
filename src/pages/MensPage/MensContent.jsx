import "./MensContent.css";
import { useEffect, useState } from "react";
import piece2 from "../../images/Top-Piece2.png";
import mensTop1 from "../../images/mens-top1.png";
import mensTop2 from "../../images/mens-top2.png";

const MensContent = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const bg = document.querySelector(".contact-bg-men");

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
        <div className="contact-bg-men">
          <p>For Men</p>
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
          <div className="container">
            <div className="image">
              <img src={piece2} alt="americana di na hoodie" />
            </div>
            <div className="name">
              <p>americana di na hoodie</p>
            </div>

            <div className="amount">
              <p>$300</p>
            </div>
          </div>

          <div className="container">
            <div className="image">
              <img src={mensTop1} alt="americana di na hoodie" />
            </div>
            <div className="name">
              <p>americana di na hoodie</p>
            </div>

            <div className="amount">
              <p>$300</p>
            </div>
          </div>

          <div className="container">
            <div className="image">
              <img src={mensTop2} alt="americana di na hoodie" />
            </div>
            <div className="name">
              <p>americana di na hoodie</p>
            </div>

            <div className="amount">
              <p>$300</p>
            </div>
          </div>

          <div className="container">
            <div className="image">
              <img src={piece2} alt="americana di na hoodie" />
            </div>
            <div className="name">
              <p>americana di na hoodie</p>
            </div>

            <div className="amount">
              <p>$300</p>
            </div>
          </div>
        </div>
      )}

      {selectedCategory === "hoodies" && (
        <div className="contents">
          <div className="container">
            <div className="image">
              <img src={piece2} alt="hoodie" />
            </div>
            <div className="name">
              <p>Hoodie Product</p>
            </div>
            <div className="amount">
              <p>$220</p>
            </div>
          </div>
        </div>
      )}

      {selectedCategory === "t-shirt" && (
        <div className="contents">
          <div className="container">
            <div className="image">
              <img src={mensTop1} alt="t-shirt" />
            </div>
            <div className="name">
              <p>T-Shirt Product</p>
            </div>
            <div className="amount">
              <p>$120</p>
            </div>
          </div>

          <div className="container">
            <div className="image">
              <img src={mensTop2} alt="t-shirt" />
            </div>
            <div className="name">
              <p>T-Shirt Product</p>
            </div>
            <div className="amount">
              <p>$120</p>
            </div>
          </div>
        </div>
      )}

      {selectedCategory === "pants" && (
        <div className="contents">
          <div className="container">
            <div className="image">
              <img src={piece2} alt="pants" />
            </div>
            <div className="name">
              <p>Pants Product</p>
            </div>
            <div className="amount">
              <p>$180</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MensContent;
