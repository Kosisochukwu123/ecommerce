import React from "react";
import "./OurStory.css";
import { useEffect } from "react";
import image1 from "../../images/ourstory1.jpg";
import image2 from "../../images/ourstory2.jpg";
import image3 from "../../images/ourstory3.jpg";

const AboutContent = () => {
  useEffect(() => {
    const bg = document.querySelector(".contact-bg-about");

    const handleScroll = () => {
      const offset = window.scrollY * 0.3;
      bg.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <article>

      <div className="contact-header">
        <div className="contact-bg-about">
          <p>Our Story</p>
        </div>
      </div>

      <div className="ourstory-content">
        <div className="paragraph">
          <h2>Origin</h2>

          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque, nam
            assumenda repellat beatae laborum, odio suscipit ad, tenetur optio
            architecto sint aperiam quo sunt. <br /> <br /> Et blanditiis ex
            pariatur odio at. Fuga, hic. Doloribus est exercitationem, aperiam
            quae et, minus soluta quibusdam omnis asperiores, molestias autem
            placeat eum reiciendis a! Optio.
          </p>

          <img src={image1} alt="" />
        </div>

        <div className="paragraph">
          <h2>crafts</h2>

          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque, nam
            assumenda repellat beatae laborum, odio suscipit ad, tenetur optio
            architecto sint aperiam quo sunt. <br /> <br /> Et blanditiis ex
            pariatur odio at. Fuga, hic. Doloribus est exercitationem, aperiam
            quae et, minus soluta quibusdam omnis asperiores, molestias autem
            placeat eum reiciendis a! Optio.
          </p>

          <img src={image2} alt="" />
        </div>

        <div className="paragraph">
          <h2>philosophy</h2>

          <p>
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eaque, nam
            assumenda repellat beatae laborum, odio suscipit ad, tenetur optio
            architecto sint aperiam quo sunt. <br /> <br /> Et blanditiis ex
            pariatur odio at. Fuga, hic. Doloribus est exercitationem, aperiam
            quae et, minus soluta quibusdam omnis asperiores, molestias autem
            placeat eum reiciendis a! Optio.
          </p>

          <img src={image3} alt="" />
        </div>
      </div>
    </article>
  );
};

export default AboutContent;
