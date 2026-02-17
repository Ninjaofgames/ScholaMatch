import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import * as authService from '../services/authService';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const res = await authService.getAdminData();
        setStats(res.data);
      } catch (err) {
        if (err.response?.status === 403) {
          navigate('/dashboard');
        } else {
          setError('Failed to load admin data');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-header-actions">
          <span className="user-badge">{user?.email}</span>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>
      <main className="dashboard-main">
        {error && <div className="alert alert-error">{error}</div>}
        {stats && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-value">{stats.total_users}</p>
              </div>
              <div className="stat-card">
                <h3>Active Users</h3>
                <p className="stat-value">{stats.active_users}</p>
              </div>
              <div className="stat-card">
                <h3>Registered Today</h3>
                <p className="stat-value">{stats.registered_today}</p>
              </div>
            </div>
            {stats.role_breakdown && Object.keys(stats.role_breakdown).length > 0 && (
              <div className="section-card">
                <h3>Role Breakdown</h3>
                <ul className="role-list">
                  {Object.entries(stats.role_breakdown).map(([role, count]) => (
                    <li key={role}>
                      <strong>{role}</strong>: {count}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="section-card">
              <h3>Last Registered Users</h3>
              {stats.last_registered?.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Name</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.last_registered.map((u) => (
                      <tr key={u.id}>
                        <td>{u.email}</td>
                        <td>{u.first_name} {u.last_name}</td>
                        <td>{u.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No users yet.</p>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
