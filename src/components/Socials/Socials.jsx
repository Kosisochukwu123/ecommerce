import React from "react";
import "./Socials.css";
import body1 from "../../images/body1.jpg";
import body2 from "../../images/body2.jpg";
import body3 from "../../images/body3.jpg";
import body4 from "../../images/body4.jpg";
import body5 from "../../images/hoodie1.jpg";

export const Socials = () => {
  return (
    <div className="socials">
      <h2 data-aos="zoom-in">(Socials)</h2>
      <p data-aos="zoom-in">
        Follow us on social <a>@Brandi</a> for updates
      </p>
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
