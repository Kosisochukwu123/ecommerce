import { Link } from "react-router-dom";
import "./Body.css";
import bodytop from "../../../public/images/body-image-men.jpg";
import bodybottom from "../../../public/images/body-image-women.jpg";

export const Body = () => {
  return (
    <div className="body-container">
      <aside>
        <h3>customer comments</h3>

        <div className="customer-section">
          <h2>Best market place</h2>
          <p className="customer-section-p">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae,
            illum? Lorem ipsum dolor sit, amet consectetur adipisicing elit. Consectetur architecto accusamus id.
          </p>

          <div className="customer-detail">
            <img src={bodytop} alt="" />

            <div>
              <span>Tina Aja</span>
              <p>Sales Manager</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="body">
        <div className="body-top">
          <img src={bodytop} alt="body-top" />

          <div className="body-text">
            <p>men's collection</p>
            <Link to="/For-Men">
              <button>shop now</button>
            </Link>
          </div>
        </div>

        <div className="body-bottom">
          <img src={bodybottom} alt="body-bottom" />

          <div className="body-text">
            <p>women's collection</p>
            <Link to="/For-Women">
              <button>shop now</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
