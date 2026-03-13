import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';
import Button from '../components/Button';
import Input from '../components/Input';
import * as userAuthService from '../services/userAuthService';
import { Link } from 'react-router-dom';

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
    <div className="auth-form">
      <h1>Verify your email</h1>
      <p className="auth-subtitle">Enter the 6-digit code sent to {email}</p>

      {error && (
        <div className="alert alert-error">{error}</div>
      )}
      {success && <div className="alert alert-success success-card" role="status">{success}</div>}
      <form onSubmit={handleSubmit} className="auth-form-fields">
        <div className="input-group">
          <Input
            label="Verification code"
            name="code"
            id="code"
            type="text"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            inputMode="numeric"
            aria-label="Verification code"
          />
        </div>
        <Button type="submit" loading={loading} fullWidth>
          Verify
        </Button>
        <p className="auth-footer" style={{ marginTop: '16px', textAlign: 'center' }}>
          Didn&apos;t receive the code?{' '}
          <button type="button" onClick={handleResend} disabled={resendLoading} style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
            {resendLoading ? 'Sending...' : 'Resend'}
          </button>
        </p>
        <p className="auth-footer" style={{ marginTop: '8px', textAlign: 'center' }}>
          <Link to="/register">Back to register</Link>
        </p>
      </form>
    </div>
  );
}