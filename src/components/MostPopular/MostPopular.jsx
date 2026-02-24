import "./MostPopular.css";
// import piece1 from "../../../public/images/Top-Piece1.png";
// import piece2 from "../../../public/images/Top-Piece2.png";
import asidePhoto from "../../../public/images/aside-bestseller.png";
import img1 from "../../../public/images/nike-shoe.webp";
import Star from "../../../public/images/star.png";
import { useRef } from "react";

export const MostPopular = () => {

const rowRef = useRef(null);

  return (
    <div className="most-popular-container">
      
      <aside>
        <img src={asidePhoto} alt="" srcset="" />
      </aside>

      <div className="Most-popular">

        <div className="Most-popular-top">
          <h3 data-aos="zoom-in">BestSellers</h3>
          <p data-aos="zoom-in">Our Most popular pieces this season</p>
        </div>

        <div className="Most-popular-body">

          <div ref={rowRef} className="wrapper">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="items">
                <div className="items-banner">best sellers</div>

                <div className="innerdisplay">
                  <div className="image-wrapper">
                    {/* HOVER ICONS */}
                    <div className="hover-icons">
                      <button className="icon-btn">
                        <i className="fa-regular fa-heart"></i>
                      </button>
                      <button className="icon-btn">
                        <i className="fa-solid fa-arrow-up-right-from-square"></i>
                      </button>
                    </div>

                    {/* ADD TO CART */}
                    <button className="add-to-cart">Add To Cart</button>
                  </div>

                  <img src={img1} alt="" />
                  <h2>jumbo shoe low 77 pro</h2>
                  <span>
                    <img src={Star} alt="star" /> <b>3.5</b>
                  </span>
                  <p>
                    <b>$99.9</b> $120{" "}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
