// Footer component
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-text">
            <p>© 2024 Job Portal. Connecting talent with opportunity.</p>
          </div>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/jobs">Jobs</Link>
            <Link to="#" onClick={(e) => e.preventDefault()}>About</Link>
            <Link to="#" onClick={(e) => e.preventDefault()}>Contact</Link>
            <Link to="#" onClick={(e) => e.preventDefault()}>Privacy Policy</Link>
            <Link to="#" onClick={(e) => e.preventDefault()}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
