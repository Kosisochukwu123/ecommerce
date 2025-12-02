import "./WomensContent.css";
import piece1 from "../../images/Top-Piece1.png";

const WomensContent = () => {
  return (
    <div>
      <div className="header-image-women">
        <p>for women</p>
      </div>

      <div className="womens-links">
        <a href="">all</a>
        <a href="">hoodies</a>
        <a href="">t-shirt</a>
        <a href="">pants</a>
      </div>

      <div className="contents">

        <div className="container">
          <div className="image">
            <img src={piece1} alt="americana di na hoodie" />
          </div>
          <div className="name">
            <p>americana di na hoodie</p>
          </div>

          <div className="amount">
            <p>$300</p>
          </div>
        </div>

        <div className="container">
          <div className="image">
            <img src={piece1} alt="americana di na hoodie" />
          </div>
          <div className="name">
            <p>americana di na hoodie</p>
          </div>

          <div className="amount">
            <p>$300</p>
          </div>
        </div>

        <div className="container">
          <div className="image">
            <img src={piece1} alt="americana di na hoodie" />
          </div>
          <div className="name">
            <p>americana di na hoodie</p>
          </div>

          <div className="amount">
            <p>$300</p>
          </div>
        </div>

        <div className="container">
          <div className="image">
            <img src={piece1} alt="americana di na hoodie" />
          </div>
          <div className="name">
            <p>americana di na hoodie</p>
          </div>

          <div className="amount">
            <p>$300</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WomensContent;
