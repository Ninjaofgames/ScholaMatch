import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="brand-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <span className="brand-text">schola<strong>match</strong></span>
          </div>

          <div className="footer-columns">
            <div className="footer-col">
              <h3>About</h3>
              <ul>
                <li><a href="#">About us</a></li>
                <li><a href="#">Our mission</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Platform</h3>
              <ul>
                <li><a href="#">Schools</a></li>
                <li><a href="#">Compare Schools</a></li>
                <li><a href="#">How it works</a></li>
                <li><a href="#">Partner Portal</a></li>
                <li><a href="#">Success stories</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h3>Information</h3>
              <ul>
                <li><a href="#">Contact us</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of service</a></li>
                <li><a href="#">Data Transparency</a></li>
                <li><a href="#">Help center</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Created by team &mdash; all rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
