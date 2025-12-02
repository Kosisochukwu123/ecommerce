import React from "react";
import "./About.css";
import AboutImage from "../../images/About-image.jpg";

export const About = () => {
return (
    <section className="about-section">
        <img src={AboutImage} alt="About Brandi" />
        <div className="about-text">
            <h2>(About Brandi)</h2>
            <p>
                Quality products, unforgettable experiences, pure excellence.
            </p>
            <button>Learn Our Story</button>
        </div>
    </section>
);
};
