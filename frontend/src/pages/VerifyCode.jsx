import { useState, useEffect } from 'react';
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
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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
        if (res.token) {
          setVerifiedUser(res.token, res.user);
          navigate('/preferences');
        } else {
          setSuccess(res.message || 'Email verified! Please login.');
          setTimeout(() => navigate('/login'), 3000);
        }
      }
    } catch (err) {
      const errData = err.response?.data?.errors || err.response?.data || {};
      let msg = 'Verification failed';
      
      if (typeof errData === 'object') {
        const firstError = errData.code?.[0] || 
                           errData.email?.[0] || 
                           errData.non_field_errors?.[0] || 
                           errData.detail ||
                           errData.error;
        if (firstError) msg = firstError;
      }
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
      if (res.success) {
        setSuccess('Code sent to your email');
        setTimeLeft(600); // Reset timer
      }
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
        <div className="countdown-timer" style={{ 
          textAlign: 'center', 
          marginTop: '15px', 
          fontSize: '0.92rem', 
          color: timeLeft < 60 ? '#ef4444' : 'rgba(255, 255, 255, 0.6)'
        }}>
          Code expires in: <span style={{ 
            color: timeLeft < 60 ? '#ef4444' : '#4BB84B', 
            fontWeight: '600' 
          }}>{formatTime(timeLeft)}</span>
        </div>
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