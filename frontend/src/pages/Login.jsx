import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import EmailInput from '../components/EmailInput';
import PasswordInput from '../components/PasswordInput';
import Button from '../components/Button';
import { useUserAuth } from '../context/UserAuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login, isAuthenticated } = useUserAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
      document.title = "Welcome to ScholaMatch"
  }, []);
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
      await login(formData.email, formData.password);
      navigate('/dashboard')
    } catch (err) {
      const errData = err.response?.data;
      setServerError(errData?.detail || errData?.message || 'Invalid email or password');
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="auth-form">
      <h1>Welcome back</h1>
      <p className="auth-subtitle">Sign in to your ScholaMatch account</p>

      {serverError && (
        <div className="alert alert-error">{serverError}</div>
      )}

      <form onSubmit={handleSubmit}>
        <EmailInput
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="yourmail@example.com"
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
          Login
        </Button>
      </form>

      <p className="auth-footer">
        Don&apos;t have an account? <Link to="/register">Sign Up</Link>
      </p>
    </div>
  );
};

export default Login;