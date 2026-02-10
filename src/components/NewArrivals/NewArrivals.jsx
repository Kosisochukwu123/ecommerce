import { useRef } from "react";
import "./NewArrivals.css";
import { Link } from "react-router-dom";
import img1 from "../../../public/images/nike-shoe.webp";

const NewArrivals = () => {
  const rowRef = useRef(null);

  const slideLeft = () => {
    rowRef.current.scrollLeft -= 200;
  };

  const slideRight = () => {
    rowRef.current.scrollLeft += 200;
  };

  return (
    <>
      <div className="New-arrivals-head">
        <h3>New Arrivals</h3>
        <Link>see more</Link>
      </div>

      <div ref={rowRef} className="wrapper">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="items">
            <div className="innerdisplay">
              <img src={img1} alt="" srcset="" />
              <h2>jumbo shoe low 77 pro</h2>
              <span>women shoe</span>
              <p>
                $120 <i class="fa-regular fa-heart"></i>
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="New-Arrivals-buttons">
        <button onClick={slideLeft}>◀</button>
        <button onClick={slideRight}>▶</button>
      </div>
    </>
  );
};

export default NewArrivals;
