import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });

  useEffect(() => {
    if (isAuthenticated) {
      const role = user?.role || 'user';
      navigate(role === 'admin' ? '/admin-dashboard' : '/dashboard');
    }
  }, [isAuthenticated, user?.role, navigate]);

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
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
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
      if (res.success) {
        const role = res.user?.role || 'user';
        navigate(role === 'admin' ? '/admin-dashboard' : '/dashboard');
      }
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
    <div className="auth-page">
      <div className="auth-split auth-image">
        <div className="auth-image-placeholder">
          <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="400" height="300" fill="url(#authGrad)" />
            <path d="M100 150 L200 80 L300 150 L200 220 Z" fill="rgba(255,255,255,0.2)" />
            <circle cx="200" cy="150" r="40" fill="rgba(255,255,255,0.3)" />
            <defs>
              <linearGradient id="authGrad" x1="0" y1="0" x2="400" y2="300" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4F46E5" />
                <stop offset="1" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      <div className="auth-split auth-form-wrap">
        <div className="auth-form">
          <h1>Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account</p>

          {serverError && (
            <div className="alert alert-error">{serverError}</div>
          )}

          <form onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <Button type="submit" loading={loading} fullWidth>
              Login
            </Button>
          </form>

          <p className="auth-footer">
            Don&apos;t have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
