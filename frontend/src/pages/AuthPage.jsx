import { useLocation } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import VerifyCode from './VerifyCode';
import './loginStyle.css';

const AuthPage = () => {
  const location = useLocation();
  const isRegister = location.pathname === '/register';
  const isVerify = location.pathname === '/verify';

  if (isVerify) {
    return (
      <div className="auth-page">
        {/* Image / illustration panel */}
        <div className="auth-split auth-image">
          <div className="auth-image-placeholder">
            <img
              src="/undraw_access-account_aydp.svg"
              alt="Access account illustration"
              className="auth-illustration"
            />
          </div>
        </div>

        {/* Form panel */}
        <div className="auth-split auth-form-wrap">
          <div style={{ width: '100%', maxWidth: '400px' }}>
            <VerifyCode />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      {/* Image / illustration panel */}
      <div className="auth-split auth-image">
        <div className="auth-image-placeholder">
          <img
            src="/undraw_access-account_aydp.svg"
            alt="Access account illustration"
            className="auth-illustration"
          />
        </div>
      </div>

      {/* Form panel with 3D flip */}
      <div className="auth-split auth-form-wrap">
        <div className="auth-flip-perspective">
          <div className={`auth-flip-card ${isRegister ? 'auth-flipped' : ''}`}>
            <div className="auth-flip-front">
              <Login />
            </div>
            <div className="auth-flip-back">
              <Register />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
