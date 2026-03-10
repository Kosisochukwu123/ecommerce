import { Link } from 'react-router-dom';
import "./About.css";
import AboutImage from "../../../public/images/About-image.jpg";

export const About = () => {
  return (
    <section className="about-section">
      <div className="about-container">
        {/* Image Side */}
        <div className="about-image-wrapper" data-aos="fade-right" data-aos-duration="1000">
          <img src={AboutImage} alt="About Brandi" />
          <div className="image-overlay"></div>
          <div className="image-decoration"></div>
        </div>

        {/* Text Side */}
        <div className="about-content">
          <span className="about-label" data-aos="fade-left" data-aos-delay="100">
            Our Story
          </span>
          
          <h2 data-aos="fade-left" data-aos-delay="200">
            About <span className="brand-highlight">Brandi</span>
          </h2>
          
          <p className="about-description" data-aos="fade-left" data-aos-delay="300">
            Every crafted design has a story, and ours is no different. 
            We believe in creating timeless pieces that blend elegance with 
            everyday comfort, bringing style to life one product at a time.
          </p>

          <p className="about-subtitle" data-aos="fade-left" data-aos-delay="400">
            From our humble beginnings to becoming a trusted name in fashion, 
            we're committed to quality, authenticity, and making you look your best.
          </p>

          <div className="about-stats" data-aos="fade-up" data-aos-delay="500">
            <div className="stat-item">
              <h3>10K+</h3>
              <p>Happy Customers</p>
            </div>
            <div className="stat-item">
              <h3>500+</h3>
              <p>Products</p>
            </div>
            <div className="stat-item">
              <h3>5★</h3>
              <p>Average Rating</p>
            </div>
          </div>

          <Link 
            to="/our-story" 
            className="about-cta" 
            data-aos="fade-left" 
            data-aos-delay="600"
          >
            <button className="learn-more-btn">
              Learn Our Story
              <span className="btn-arrow">→</span>
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};