import "./MensContent.css";
import { useEffect } from "react";
import piece2 from "../../images/Top-Piece2.png";

const MensContent = () => {
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

      <div className="mens-links">
        <a href="">all</a>
        <a href="">hoodies</a>
        <a href="">t-shirt</a>
        <a href="">pants</a>
      </div>

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
    </div>
  );
};

export default MensContent;
