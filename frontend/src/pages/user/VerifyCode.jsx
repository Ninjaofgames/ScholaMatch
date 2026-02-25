import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import AuthLayout from '../../components/auth/AuthLayout';
import AuthButton from '../../components/auth/AuthButton';
import * as userAuthService from '../../services/userAuthService';

export default function VerifyCode() {
  const navigate = useNavigate();
  const { setVerifiedUser } = useUserAuth();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !code) {
      setError('Email and code are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await userAuthService.verifyEmail(email, code);
      if (res.success) {
        setVerifiedUser(res.token, res.user);
        navigate('/preferences');
      }
    } catch (err) {
      const errData = err.response?.data?.errors || err.response?.data;
      const msg = typeof errData === 'object' ? (errData.code?.[0] || errData.email?.[0] || 'Verification failed') : 'Verification failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    setSuccess('');
    try {
      const res = await userAuthService.resendCode(email);
      if (res.success) setSuccess('Code sent to your email');
    } catch (err) {
      const errData = err.response?.data?.errors || err.response?.data;
      setError(typeof errData === 'object' ? Object.values(errData).flat()[0] : 'Failed to resend');
    } finally {
      setResendLoading(false);
    }
  };

  if (!email) {
    navigate('/register');
    return null;
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`Enter the 6-digit code sent to ${email}`}
      footerLink="/register"
      footerText="Back to register"
    >
      {error && (
        <div className="alert alert-error" role="alert">
          <span className="alert-icon" aria-hidden>!</span>
          {error}
        </div>
      )}
      {success && <div className="alert alert-success success-card" role="status">{success}</div>}
      <form onSubmit={handleSubmit} className="auth-form-fields">
        <div className="input-group">
          <label htmlFor="code" className="input-label">Verification code</label>
          <input
            id="code"
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            className="input-field verify-code-input"
            placeholder="000000"
            inputMode="numeric"
            aria-label="Verification code"
          />
        </div>
        <AuthButton type="submit" loading={loading} fullWidth>
          Verify
        </AuthButton>
        <p className="auth-footer-inline">
          Didn&apos;t receive the code?{' '}
          <button type="button" className="link-btn" onClick={handleResend} disabled={resendLoading} aria-label="Resend verification code">
            {resendLoading ? 'Sending...' : 'Resend'}
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}
