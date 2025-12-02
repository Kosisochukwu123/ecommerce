import "./MensContent.css";
import piece2 from '../../images/Top-Piece2.png'

const MensContent = () => {
  return (
    <div>
      <div className="header-image">
        <p>for men</p>
      </div>

      <div className="mens-links">
        <a href="">all</a>
        <a href="">hoodies</a>
        <a href="">t-shirt</a>
        <a href="">pants</a>
      </div>

      <div className="contents">

        <div className="container">
          <div className="image">
            <img src={piece2} alt="americana di na hoodie" />
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
            <img src={piece2} alt="americana di na hoodie" />
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
            <img src={piece2} alt="americana di na hoodie" />
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
            <img src={piece2} alt="americana di na hoodie" />
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

export default MensContent;
