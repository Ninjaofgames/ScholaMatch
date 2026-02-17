import { useUserAuth } from '../../context/UserAuthContext';
import UserNavbar from '../../components/UserNavbar';

const UserDashboard = () => {
  const { user } = useUserAuth();

  return (
    <div className="dashboard">
      <UserNavbar />
      <main className="dashboard-main">
        <h1>Dashboard</h1>
        <div className="welcome-card">
          <h2>Welcome, {user?.first_name || 'User'}!</h2>
          <div className="profile-info">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Name:</strong> {user?.first_name} {user?.last_name}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
