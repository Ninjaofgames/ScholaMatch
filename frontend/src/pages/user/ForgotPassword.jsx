import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import AuthButton from '../../components/auth/AuthButton';
import * as userAuthService from '../../services/userAuthService';

export default function ForgotPassword() {
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
      const res = await userAuthService.passwordResetRequest(email.trim());
      if (res.success) {
        setSuccess(true);
        setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(email.trim())}`), 1500);
      }
    } catch (err) {
      const errData = err.response?.data?.errors || err.response?.data;
      setError(typeof errData === 'object' ? Object.values(errData).flat()[0] : 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email to receive a reset code"
      footerLink="/login"
      footerText="Back to login"
    >
      {error && (
        <div className="alert alert-error" role="alert">
          <span className="alert-icon" aria-hidden>!</span>
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success success-card" role="status">
          Check your email for the code. Redirecting...
        </div>
      )}
      <form onSubmit={handleSubmit} className="auth-form-fields">
        <AuthInput
          label="Email"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={null}
          placeholder="@example.com"
          required
          autoComplete="email"
        />
        <AuthButton type="submit" loading={loading} fullWidth>
          Send code
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
