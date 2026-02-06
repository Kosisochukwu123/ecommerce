import { Link } from "react-router-dom";
import "./Body.css";
import bodytop from "../../../public/images/body-image-men.jpg";
import bodybottom from "../../../public/images/body-image-women.jpg";



export const Body = () => {


  return (
    <div className="body">
      <div className="body-top">
        <img src={bodytop} alt="body-top" />

        <div className="body-top-text" >
          <p>
            men's <br /> collection
          </p>
          <Link to="/For-Men">
            <button>shop now</button>
          </Link>
        </div>
      </div>

      <div className="body-bottom">
        <img src={bodybottom} alt="body-bottom" />

        <div className="body-bottom-text">
          <p>
            women's <br /> collection
          </p>
          <Link to="/For-Women">
            <button>shop now</button>
          </Link>
        </div>
      </div>
    </div>
  );
};
