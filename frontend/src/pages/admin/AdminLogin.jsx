import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import Input from '../../components/Input';
import PasswordInput from '../../components/PasswordInput';
import Button from '../../components/Button';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setServerError('');
    try {
      const res = await login(formData.email, formData.password);
      if (res.success) navigate('/admin/dashboard');
    } catch (err) {
      const errData = err.response?.data?.errors || err.response?.data;
      if (typeof errData === 'object') {
        const firstKey = Object.keys(errData)[0];
        const val = errData[firstKey];
        setServerError(Array.isArray(val) ? val[0] : val);
      } else {
        setServerError('Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1>Admin Portal</h1>
        <p className="admin-login-subtitle">Sign in to access the admin dashboard</p>
        {serverError && <div className="alert alert-error">{serverError}</div>}
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="admin@example.com"
            required
            autoComplete="email"
          />
          <PasswordInput
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
          <Button type="submit" loading={loading} fullWidth>
            Sign In
          </Button>
          <p className="admin-forgot-link">
            <Link to="/admin/forgot-password">Forgot password?</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
