import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmailInput from '../../components/EmailInput';
import Button from '../../components/Button';
import * as adminAuthService from '../../services/adminAuthService';

const AdminForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await adminAuthService.adminPasswordResetRequest(email.trim());
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate(`/admin/reset-password?email=${encodeURIComponent(email.trim())}`), 1500);
      }
    } catch (err) {
      const errData = err.response?.data?.errors || err.response?.data;
      setError(typeof errData === 'object' ? Object.values(errData).flat()[0] : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1>Admin Forgot Password</h1>
        <p className="admin-login-subtitle">Enter your admin email to receive a reset code</p>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">Code sent. Redirecting...</div>}
        <form onSubmit={handleSubmit}>
          <EmailInput
            label="Admin email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={null}
            placeholder="admin@example.com"
            required
          />
          <Button type="submit" loading={loading} fullWidth>Send code</Button>
        </form>
        <p className="auth-footer" style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link to="/admin" style={{ color: '#818cf8' }}>Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminForgotPassword;
