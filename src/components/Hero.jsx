import React from "react";
import "../css/Hero.css";

const Hero = () => {
  return (
    <div className="hero-container">
      <div className="hero-overlay"></div>
      <div className="hero-content">
        <h1>Experience Pod Comfort</h1>
        <p>
          Discover privacy and convenience in our state-of-the-art pods. Book
          yours now for a unique experience.
        </p>
        <button className="hero-cta-button">Book Now</button>
      </div>
    </div>
  );
};

export default Hero;
