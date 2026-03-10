import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import EmailInput from '../../components/EmailInput';
import PasswordInput from '../../components/PasswordInput';
import Button from '../../components/Button';

const UserLogin = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useUserAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

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
      if (res.success) navigate('/');
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
    <div className="auth-page auth-page-split">
      <div className="auth-split auth-image">
        <div className="auth-image-inner">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80"
            alt="Education"
          />
        </div>
      </div>
      <div className="auth-split auth-form-wrap">
        <div className="auth-form">
          <div className="auth-brand">
            <img src="/assets/logo.png" alt="ScholaMatch" className="auth-logo-img" />
            <span className="auth-brand-text">ScholaMatch</span>
          </div>
          <h1>Find the Right School for You</h1>
          <p className="auth-subtitle">
            Discover schools that truly match your needs through intelligent recommendations.
          </p>
          {serverError && <div className="alert alert-error">{serverError}</div>}
          <form onSubmit={handleSubmit} className="auth-form-fields">
            <EmailInput
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="@example.com"
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
            <div className="auth-forgot">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
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

export default UserLogin;
