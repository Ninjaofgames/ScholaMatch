import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import Button from '../../components/Button';
import * as adminAuthService from '../../services/adminAuthService';

const UserActivityLogs = () => {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await adminAuthService.getActivityLogs();
        setLogs(res.data || []);
      } catch (err) {
        if (err.response?.status === 403) navigate('/admin');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const formatAction = (action) => {
    const map = { password_change: 'Password Change', profile_update: 'Profile Update', email_change: 'Email Change' };
    return map[action] || action;
  };

  return (
    <div className="dashboard admin-dashboard">
      <header className="dashboard-header admin-header">
        <h1>User Activity Logs</h1>
        <div className="dashboard-header-actions">
          <button type="button" className="nav-link" onClick={() => navigate('/admin/dashboard')}>Dashboard</button>
          <Button variant="secondary" onClick={handleLogout}>Logout</Button>
        </div>
      </header>
      <main className="dashboard-main">
        {loading ? (
          <div className="loading-screen"><div className="spinner" /><p>Loading...</p></div>
        ) : (
          <div className="section-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>IP Address</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={4}>No activity yet</td></tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id}>
                      <td>{log.user_email}</td>
                      <td>{formatAction(log.action)}</td>
                      <td>{log.ip_address || '-'}</td>
                      <td>{new Date(log.created_at).toLocaleString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserActivityLogs;
