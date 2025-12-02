import { useEffect, useState } from "react";
import "./Header.css"; // import the css
import img1 from "../../images/header_image1.jpg";
import img2 from "../../images/header_image2.jpg";
import img3 from "../../images/header_image3.jpg";

export const Header = () => {
  const images = [img1, img2, img3];

  const texts = [
    "Women wears — empower and flattering.",
    "Men's refined — smart everyday look.",
    "Kid's favorites — durable, playful pieces.",
  ];

  const buttons = ["Shop Now", "Shop Now", "Shop Now"];

  const numbers = ["00-01", "00-02", "00-03"];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="header">
      <div className="header-slider">
        {images.map((src, i) => (
          <img
            key={i}
            src={src}
            className={`slide ${i === index ? "active" : ""}`}
            alt="header images"
          />
        ))}
      </div>

      <p className={`slide-number ${"active"}`}>{numbers[index]}</p>

      <p className={`slide-text ${"active"}`}>{texts[index]}</p>

      <button className={`btn active`}>
        <span className="icon">
          <svg
            viewBox="0 0 64 64"
            width="40"
            height="40"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M48 18h-4a8 8 0 00-16 0h-4a4 4 0 00-4 4v24a4 4 0 004 4h28a4 4 0 004-4V22a4 4 0 00-4-4z"
              fill="#f0f0f0"
            />
            <path
              d="M24 18a8 8 0 0116 0"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="text">{buttons[index]}</span>
      </button>

      <div className="black"></div>
    </div>
  );
};
