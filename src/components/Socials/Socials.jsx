import React from "react";
import "./Socials.css";
import body1 from "../../../public/images/body1.jpg";
import body2 from "../../../public/images/body2.jpg";
import body3 from "../../../public/images/body3.jpg";
import body4 from "../../../public/images/body4.jpg";
import body5 from "../../../public/images/hoodie1.jpg";

export const Socials = () => {
  return (
    <div className="socials">
      <p data-aos="zoom-in">(Socials)</p>
      <h2 data-aos="zoom-in">
        Follow us <a>@Brandi</a> for updates
      </h2>
      <div className="image-scroller">
        <div className="image-track">
          <img src={body1} alt="" />
          <img src={body2} alt="" />
          <img src={body3} alt="" />
          <img src={body4} alt="" />
          <img src={body5} alt="" />

          {/* duplicate to make infinite loop */}
          <img src={body1} alt="" />
          <img src={body2} alt="" />
          <img src={body3} alt="" />
          <img src={body4} alt="" />
          <img src={body5} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Socials
