import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import Button from '../../components/Button';
import * as adminAuthService from '../../services/adminAuthService';

const AdminDashboard = () => {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminAuthService.getAdminDashboard();
        setStats(res.data);
      } catch (err) {
        if (err.response?.status === 403) {
          navigate('/admin');
        } else {
          setError('Failed to load admin data');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="loading-screen admin-loading">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard admin-dashboard">
      <header className="dashboard-header admin-header">
        <h1>Admin Dashboard</h1>
        <div className="dashboard-header-actions">
          <button type="button" className="nav-link" onClick={() => navigate('/admin/activity-logs')}>Activity Logs</button>
          <span className="user-badge">{admin?.email}</span>
          <Button variant="secondary" onClick={handleLogout}>Logout</Button>
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
                <h3>Staff Count</h3>
                <p className="stat-value">{stats.staff_count}</p>
              </div>
              <div className="stat-card">
                <h3>Registered Today</h3>
                <p className="stat-value">{stats.registered_today}</p>
              </div>
            </div>
            <div className="section-card">
              <h3>Last Registered Users</h3>
              {stats.last_registered?.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.last_registered.map((u) => (
                      <tr key={u.id}>
                        <td>{u.email}</td>
                        <td>{u.first_name} {u.last_name}</td>
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
