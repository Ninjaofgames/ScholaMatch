import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../pages/userXP.css';
import { useUserAuth } from '../context/UserAuthContext';

const Navbar = ({ activeLink }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, isAuthenticated } = useUserAuth();

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
          <div className="brand-logo-container" style={{ display: 'flex', alignItems: 'center' }}>
            <img src="/logo.jpeg" alt="Logo" style={{ height: '44px', width: 'auto', borderRadius: '8px' }} />
          </div>
          <span className="brand-text" style={{ fontSize: '1.6rem', fontWeight: '800', marginLeft: '8px' }}>
            <span style={{ color: 'var(--green-500)' }}>schola</span><span style={{ color: '#56cbf9' }}>match</span>
          </span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${activeLink === 'schools' ? 'active' : ''}`}>Schools</Link>
          <a href="#" className="nav-link">Partner portal</a>
        </div>

        <div className="navbar-actions">
          {isAuthenticated && user ? (
            <Link to="/user_profile" className="btn-login" style={{ background: 'var(--green-600)', borderColor: 'var(--green-500)', color: 'white' }}>
              <i className="fas fa-user-circle"></i> {user?.username}
            </Link>
          ) : (
            <Link to="/login" className="btn-login">
              <i className="fas fa-user"></i> Login
            </Link>
          )}
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