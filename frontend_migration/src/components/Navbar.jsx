import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ activeLink }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModePref = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(darkModePref);
    if (darkModePref) {
      document.body.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.body.classList.toggle('dark', newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <div className="brand-icon">
            <i className="fas fa-graduation-cap"></i>
          </div>
          <span className="brand-text">schola<strong>match</strong></span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${activeLink === 'schools' ? 'active' : ''}`}>Schools</Link>
          <a href="#" className="nav-link">Partner portal</a>
        </div>

        <div className="navbar-actions">
          <Link to="/admin" className="btn-login">
            <i className="fas fa-user"></i> Login
          </Link>
          <button 
            className="icon-btn" 
            id="dark-mode-toggle" 
            title="Toggle dark mode"
            onClick={toggleDarkMode}
          >
            <i className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'}`}></i>
          </button>
          <button className="icon-btn" title="Language">
            <i className="fas fa-globe"></i>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
