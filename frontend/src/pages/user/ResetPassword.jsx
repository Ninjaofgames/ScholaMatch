import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthInput from '../../components/auth/AuthInput';
import AuthPasswordInput from '../../components/auth/AuthPasswordInput';
import AuthButton from '../../components/auth/AuthButton';
import * as userAuthService from '../../services/userAuthService';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [formData, setFormData] = useState({ code: '', new_password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
    setResendSuccess('');
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setResendSuccess('');
    try {
      const res = await userAuthService.passwordResetRequest(email);
      if (res.success) setResendSuccess('New code sent to your email');
    } catch (err) {
      const errData = err.response?.data?.errors || err.response?.data;
      setError(typeof errData === 'object' ? Object.values(errData).flat()[0] : 'Failed to resend');
    } finally {
      setResendLoading(false);
    }
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
      const res = await userAuthService.passwordResetConfirm({
        email,
        code: formData.code,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      });
      if (res.success) setSuccess(true);
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      const errData = err.response?.data?.errors || err.response?.data;
      const msg = typeof errData === 'object' ? (Object.values(errData).flat()[0] || 'Reset failed') : 'Reset failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    navigate('/forgot-password');
    return null;
  }

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle={`Enter the code sent to ${email} and your new password`}
      footerLink="/login"
      footerText="Back to login"
    >
      {error && (
        <div className="alert alert-error" role="alert">
          <span className="alert-icon" aria-hidden>!</span>
          {error}
        </div>
      )}
      {resendSuccess && (
        <div className="alert alert-success" role="status">{resendSuccess}</div>
      )}
      {success && (
        <div className="alert alert-success success-card" role="status">
          Password reset successful. Redirecting...
        </div>
      )}
      <form onSubmit={handleSubmit} className="auth-form-fields">
        <div className="input-group">
          <div className="input-group-row">
            <label htmlFor="code" className="input-label">Verification code</label>
            <button
              type="button"
              className="link-btn resend-btn"
              onClick={handleResend}
              disabled={resendLoading}
              aria-label="Resend verification code"
            >
              {resendLoading ? 'Sending...' : 'Resend code'}
            </button>
          </div>
          <input
            id="code"
            type="text"
            name="code"
            value={formData.code}
            onChange={(e) => handleChange({ target: { name: 'code', value: e.target.value.replace(/\D/g, '') } })}
            className="input-field verify-code-input"
            placeholder="000000"
            maxLength={6}
            inputMode="numeric"
            aria-label="Verification code"
          />
        </div>
        <AuthPasswordInput
          label="New password"
          name="new_password"
          value={formData.new_password}
          onChange={handleChange}
          placeholder="Min 8 characters"
          required
          showStrength
          error={null}
        />
        <AuthPasswordInput
          label="Confirm password"
          name="confirm_password"
          value={formData.confirm_password}
          onChange={handleChange}
          placeholder="••••••"
          required
          error={formData.confirm_password && formData.new_password !== formData.confirm_password ? 'Passwords do not match' : null}
        />
        <AuthButton type="submit" loading={loading} fullWidth>
          Reset password
        </AuthButton>
      </form>
    </AuthLayout>
  );
}
