import {Link} from 'react-router-dom';
import "./About.css";
import AboutImage from "../../images/About-image.jpg";

export const About = () => {
return (
    <section className="about-section">
        <img src={AboutImage} alt="About Brandi" />
        <div className="about-text">
            <h2>(About Brandi)</h2>
            <p>
                every Crafted design had a story and ours is no different.
            </p>
            <Link to="/our-story"><button>Learn Our Story</button></Link>
        </div>
    </section>
);
};
