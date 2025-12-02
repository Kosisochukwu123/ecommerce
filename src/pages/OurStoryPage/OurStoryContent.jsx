import React from "react";
import "./OurStory.css";
import image1 from '../../images/ourstory1.jpg'
import image2 from '../../images/ourstory2.jpg'
import image3 from '../../images/ourstory3.jpg'

const AboutContent = () => {
  return (
    <article>

      <div className="ourstory-header">
        <h1>Our Story</h1>
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
