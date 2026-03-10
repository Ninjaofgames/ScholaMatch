import { Link, useLocation } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import { useState, useEffect } from 'react';

const UserNavbar = () => {
  const { user, logout } = useUserAuth();
  const location = useLocation();
  const avatarUrl = user?.avatar_url;
  const API_URL = 'http://127.0.0.1:8000';
  const fullAvatarUrl = avatarUrl ? (avatarUrl.startsWith('http') ? avatarUrl : `${API_URL}${avatarUrl}`) : null;

  // Theme Toggler Hook Settings
  const [theme, setTheme] = useState(localStorage.getItem('userTheme') || 'light');

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('userTheme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <nav className="user-navbar">
      <Link to="/" className="navbar-brand">
        <img src="/assets/logo.png" alt="ScholaMatch" className="navbar-logo-img" />
        <span>ScholaMatch</span>
      </Link>
      <div className="navbar-actions">
        <Link to="/" className={`nav-link${location.pathname === '/' || location.pathname === '/schools' ? ' nav-link-active' : ''}`}>Schools</Link>
        <Link to="/profile" className="nav-link profile-link">
          {fullAvatarUrl ? (
            <img src={fullAvatarUrl} alt="Profile" className="navbar-avatar" />
          ) : (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </Link>
        <button 
          type="button" 
          onClick={toggleTheme} 
          className="nav-link" 
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          style={{color: theme === 'light' ? '#f59e0b' : '#38bdf8', fontSize: '1.2rem', padding: '0 8px'}}
        >
          <i className={`fa-solid ${theme === 'light' ? 'fa-sun' : 'fa-moon'}`}></i>
        </button>
        <button type="button" className="nav-link logout-btn" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default UserNavbar;
