import React from "react";
import "./Body.css";
import bodytop from "../../images/body-image-men.jpg";
import bodybottom from "../../images/body-image-women.jpg";

export const Body = () => {
  return (
    <div className="body">
      <div className="body-top">
        <img src={bodytop} alt="body-top" />

        <div className="body-top-text">
          <p>men's <br/> collection</p>
          <button>shop now</button>
        </div>
      </div>

      <div className="body-bottom">
        <img src={bodybottom} alt="body-bottom" />

        <div className="body-bottom-text">
          <p>women's <br/> collection</p>
          <button>shop now</button>
        </div>

      </div>
    </div>
  );
};
