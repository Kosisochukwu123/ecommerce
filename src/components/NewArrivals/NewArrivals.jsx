import { useRef } from "react";
import "./NewArrivals.css";
import { Link } from "react-router-dom";
import img1 from "../../../public/images/nike-shoe.webp";
import Star from "../../../public/images/star.png";

const NewArrivals = () => {
  const rowRef = useRef(null);

  const slideLeft = () => {
    rowRef.current.scrollLeft -= 200;
  };

  const slideRight = () => {
    rowRef.current.scrollLeft += 200;
  };

  return (
    <div className="New-arrivals-container">
      <aside>
        <h3>Trending Products</h3>

        <div className="aside-container">
          <div className="aside-content">
            <img src={img1} alt="" srcset="" />

            <div className="aside-content-detail">
              <p>Ofe akwu mixed with banger soup</p>
              <span>
                <b>$140</b>$200
              </span>
            </div>
          </div>

          <div className="aside-content">
            <img src={img1} alt="" srcset="" />

            <div className="aside-content-detail">
              <p>Ofe akwu mixed with banger soup</p>
              <span>
                {" "}
                <b>$140</b>$200
              </span>
            </div>
          </div>

          <div className="aside-content">
            <img src={img1} alt="" srcset="" />

            <div className="aside-content-detail">
              <p>Ofe akwu mixed with banger soup</p>
              <span>
                {" "}
                <b>$140</b>$200
              </span>
            </div>
          </div>

          <div className="aside-content">
            <img src={img1} alt="" srcset="" />

            <div className="aside-content-detail">
              <p>Ofe akwu mixed with banger soup</p>
              <span>
                {" "}
                <b>$140</b>$200
              </span>
            </div>
          </div>

          <div className="aside-content">
            <img src={img1} alt="" srcset="" />

            <div className="aside-content-detail">
              <p>Ofe akwu mixed with banger soup</p>
              <span>
                {" "}
                <b>$140</b>$200
              </span>
            </div>
          </div>

          <div className="aside-content">
            <img src={img1} alt="" srcset="" />

            <div className="aside-content-detail">
              <p>Ofe akwu mixed with banger soup</p>
              <span>
                {" "}
                <b>$140</b>$200
              </span>
            </div>
          </div>
        </div>
      </aside>

      <div className="New-arrivals">
        <div className="New-arrivals-head">
          <h3>New Arrivals</h3>
          <Link to="/products">see more</Link>
        </div>

        <div className="New-Arrivals-buttons">
          <button onClick={slideLeft}>◀</button>
          <button onClick={slideRight}>▶</button>
        </div>

        <div ref={rowRef} className="wrapper">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="items">
              <div className="items-banner">new</div>

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

                <div className="items-content">
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
            </div>
          ))}
        </div>

        <div className="New-Arrivals-buttons">
          <button onClick={slideLeft}>◀</button>
          <button onClick={slideRight}>▶</button>
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;
