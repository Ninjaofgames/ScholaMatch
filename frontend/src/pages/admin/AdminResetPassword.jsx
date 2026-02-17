import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import PasswordInput from '../../components/PasswordInput';
import Button from '../../components/Button';
import * as adminAuthService from '../../services/adminAuthService';

const AdminResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [formData, setFormData] = useState({ code: '', new_password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.new_password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    if (formData.new_password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await adminAuthService.adminPasswordResetConfirm({
        email,
        code: formData.code,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      });
      if (res.success) {
        navigate('/admin');
      }
    } catch (err) {
      const errData = err.response?.data?.errors || err.response?.data;
      const msg = typeof errData === 'object' ? (Object.values(errData).flat()[0] || 'Reset failed') : 'Reset failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    navigate('/admin/forgot-password');
    return null;
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1>Reset Admin Password</h1>
        <p className="admin-login-subtitle">Enter the code and your new password</p>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Verification code</label>
            <input
              type="text"
              name="code"
              maxLength={6}
              value={formData.code}
              onChange={(e) => handleChange({ target: { name: 'code', value: e.target.value.replace(/\D/g, '') } })}
              className="input-field verify-code-input"
              placeholder="000000"
            />
          </div>
          <PasswordInput
            label="New password"
            name="new_password"
            value={formData.new_password}
            onChange={handleChange}
            placeholder="Min 8 characters"
            required
          />
          <PasswordInput
            label="Confirm password"
            name="confirm_password"
            value={formData.confirm_password}
            onChange={handleChange}
            placeholder="••••••"
            required
          />
          <Button type="submit" loading={loading} fullWidth>Reset password</Button>
        </form>
        <p className="auth-footer" style={{ marginTop: '1rem', textAlign: 'center' }}>
          <Link to="/admin" style={{ color: '#818cf8' }}>Back to login</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminResetPassword;
