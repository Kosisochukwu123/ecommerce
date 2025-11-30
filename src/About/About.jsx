import React from "react";
import "./About.css";
import AboutImage from "../images/About-image.jpg";

export const About = () => {
return (
    <section>
        <img src={AboutImage} alt="About" />

        <div className="about-text">
            <h2>(About Brandi)</h2>
            <p>
                Brandi offers high-quality men's fashion that 
            </p>
            <button>Our Story</button>
        </div>
    </section>
);
};
