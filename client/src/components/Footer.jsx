import React from "react";
import { Link } from "react-router-dom";
import Logo from "../images/logo.png";

const Footer = () => {
 return (
    <footer>
      <div className="footer-container">
        <div className="footer-logo">
          <img src={Logo} alt="Logo del sito" />
        </div>
        <div className="footer-links">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
          </ul>
        </div>
        <div className="footer-contact">
          <p>Contact us:</p>
          <p>Email: info@example.com</p>
          <p>Phone: +1 (123) 456-7890</p>
        </div>
        <div className="footer-social">
          <ul>
            <li><a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://www.twitter.com/yourhandle" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://www.instagram.com/yourhandle" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          </ul>
        </div>
        <div className="footer-copyright">
          <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
        </div>
      </div>
      </footer>
  );
};

export default Footer;
