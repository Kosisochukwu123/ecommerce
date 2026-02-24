import {Link} from 'react-router-dom';
import "./About.css";
import AboutImage from "../../../public/images/About-image.jpg";

export const About = () => {
return (
    <section className="about-section">
        <img src={AboutImage} alt="About Brandi" />
        <div className="about-text">
            <h2 data-aos="fade-left">About Brandi</h2>
            <p data-aos="fade-left">
                every Crafted design had a story and ours is no different.
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Commodi tempore impedit dolorem! Obcaecati ullam doloribus, dolorem expedita magnam reprehenderit illum.
            </p>
            <Link to="/our-story" data-aos="fade-left"><button>Learn Our Story</button></Link>
        </div>
    </section>
);
};
