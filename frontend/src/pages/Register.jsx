import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import Input from '../components/Input';
import EmailInput from '../components/EmailInput';
import PasswordInput from '../components/PasswordInput';
import Button from '../components/Button';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useUserAuth();

  useEffect(() => {
    if (isAuthenticated) navigate('/');
  }, [isAuthenticated, navigate]);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setServerError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (formData.password !== formData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match';
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
      const payload = {
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirm_password: formData.confirm_password,
      };
      const res = await register(payload);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate(`/verify?email=${encodeURIComponent(res.user.email)}`), 1000);
      }
    } catch (err) {
      const errData = err.response?.data?.errors || err.response?.data;
      if (typeof errData === 'object') {
        const firstKey = Object.keys(errData)[0];
        const val = errData[firstKey];
        setServerError(Array.isArray(val) ? val[0] : val);
      } else {
        setServerError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form auth-form-register">
      <div className="auth-brand">
        <img src="/public/logo.jpeg" alt="ScholaMatch" className="auth-logo-img" />
        <span className="auth-brand-text" style={{fontWeight: 900}}>ScholaMatch</span>
      </div>
      <h1>Find the Right School for You</h1>
      <p className="auth-subtitle">
        Discover schools that truly match your needs through our intelligent recommendations.
      </p>

      {success && (
        <div className="alert alert-success">Verification code sent to your email. Redirecting...</div>
      )}
      {serverError && (
        <div className="alert alert-error">{serverError}</div>
      )}

      <form onSubmit={handleSubmit} className="auth-form-fields">
        <div className="form-row">
          <Input
            label="First name"
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            error={errors.first_name}
            placeholder="John"
            required
            autoComplete="given-name"
          />
          <Input
            label="Last name"
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            error={errors.last_name}
            placeholder="Doe"
            required
            autoComplete="family-name"
          />
        </div>
        <EmailInput
          label="Email Address"
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
          placeholder="Min 8 characters"
          required
          autoComplete="new-password"
        />
        <PasswordInput
          label="Confirm password"
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleChange}
          error={errors.confirm_password}
          placeholder="••••••••"
          required
          autoComplete="new-password"
        />
        <Button type="submit" loading={loading} fullWidth>
          Sign Up
        </Button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;