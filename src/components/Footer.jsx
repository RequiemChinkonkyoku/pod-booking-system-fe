import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import "../css/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>About Pod Rooms</h3>
          <p>
            Discover a new way of working with our modern, comfortable pods.
            Perfect for focused work or relaxation, our spaces are designed to
            boost your productivity.
          </p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#pods">Our Pods</a>
            </li>
            <li>
              <a href="#booking">Book Now</a>
            </li>
            <li>
              <a href="#faq">FAQs</a>
            </li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact Us</h3>
          <p>
            <Phone size={18} /> 099 999 9999
          </p>
          <p>
            <Mail size={18} /> info@podrooms.com
          </p>
          <p>
            <MapPin size={18} /> 1234 District 1, Ho Chi Minh
          </p>
        </div>
        <div className="footer-section">
          <h3>Connect With Us</h3>
          <div className="social-icons">
            <a href="#" aria-label="Facebook">
              <Facebook />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram />
            </a>
          </div>
          <p className="newsletter">
            Subscribe to our newsletter for updates and special offers!
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 Pod Rooms. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
