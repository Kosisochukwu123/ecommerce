import React from "react";
import "./Socials.css";
import img3 from "../images/header_image3.jpg";

export const Socials = () => {
  return (
    <div className="socials">
      <h2>(Socials)</h2>
      <p>
        Follow us on social <a>@Brandi</a> for updates
      </p>
      <div className="image-scroller">
        <div className="image-track">
          <img src={img3} alt="" />
          <img src={img3} alt="" />
          <img src={img3} alt="" />
          <img src={img3} alt="" />

          {/* duplicate to make infinite loop */}
          <img src={img3} alt="" />
          <img src={img3} alt="" />
          <img src={img3} alt="" />
          <img src={img3} alt="" />
        </div>
      </div>
    </div>
  );
};
