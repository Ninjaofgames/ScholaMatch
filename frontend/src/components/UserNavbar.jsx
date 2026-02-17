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
            <span className="navbar-avatar-placeholder">{user?.first_name?.[0] || user?.email?.[0] || '?'}</span>
          )}
          Profile
        </Link>
        <button type="button" className="nav-link logout-btn" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
};

export default UserNavbar;
