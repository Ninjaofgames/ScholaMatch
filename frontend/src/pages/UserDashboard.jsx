import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

const UserDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </header>
      <main className="dashboard-main">
        <div className="welcome-card">
          <h2>Welcome, {user?.first_name || 'User'}!</h2>
          <div className="profile-info">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Name:</strong> {user?.first_name} {user?.last_name}</p>
            <p><strong>Role:</strong> {user?.role || 'user'}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
