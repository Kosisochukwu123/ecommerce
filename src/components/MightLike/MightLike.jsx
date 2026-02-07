import piece2 from "../../../public/images/Top-Piece2.png"
import { Link } from "react-router-dom";
import "./MightLike.css"

const MightLike = () => {
  return (
    <div>

      <div className="mightlike-head">
        <p>(Recommended for you)</p>
        <h2>you might like</h2>
      </div>

      <div className="mightlike-content">

        <Link to="/products" className="container">
          <div className="image">
            <img src={piece2} alt="americana di na hoodie" />
          </div>
          <div className="name">
            <p>americana di na hoodie</p>
          </div>

          <div className="amount">
            <p>$300</p>
          </div>
        </Link>

        <Link to="/products" className="container">
          <div className="image">
            <img src={piece2} alt="americana di na hoodie" />
          </div>
          <div className="name">
            <p>americana di na hoodie</p>
          </div>

          <div className="amount">
            <p>$300</p>
          </div>
        </Link>

        <Link to="/products" className="container">
          <div className="image">
            <img src={piece2} alt="americana di na hoodie" />
          </div>
          <div className="name">
            <p>americana di na hoodie</p>
          </div>

          <div className="amount">
            <p>$300</p>
          </div>
        </Link>

      </div>
    </div>
  );
};

export default MightLike;
