import { Link } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';

const UserNavbar = () => {
  const { user, logout } = useUserAuth();
  const avatarUrl = user?.avatar_url;
  const API_URL = 'http://127.0.0.1:8000';
  const fullAvatarUrl = avatarUrl ? (avatarUrl.startsWith('http') ? avatarUrl : `${API_URL}${avatarUrl}`) : null;

  return (
    <nav className="user-navbar">
      <Link to="/dashboard" className="navbar-brand">ScholaMatch</Link>
      <div className="navbar-actions">
        <Link to="/dashboard" className="nav-link">Dashboard</Link>
        <Link to="/profile" className="nav-link profile-link">
          {fullAvatarUrl ? (
            <img src={fullAvatarUrl} alt="Profile" className="navbar-avatar" />
          ) : (
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </Link>
        <button type="button" className="nav-link logout-btn" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default UserNavbar;
