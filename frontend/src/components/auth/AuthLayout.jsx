import { Link } from 'react-router-dom';

const AUTH_IMAGE_URL = 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80';

export default function AuthLayout({ title, subtitle, children, footerLink, footerText, showFooter = true }) {
  return (
    <div className="auth-page auth-page-split">
      <div className="auth-split auth-image">
        <div className="auth-image-inner">
          <div className="auth-image-overlay" />
          <img src={AUTH_IMAGE_URL} alt="Education" />
        </div>
      </div>
      <div className="auth-split auth-form-wrap">
        <div className="auth-form">
          <div className="auth-brand">
            <img src="/assets/logo.png" alt="ScholaMatch" className="auth-logo-img" />
            <span className="auth-brand-text">ScholaMatch</span>
          </div>
          <h1>{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>
          {children}
          {showFooter && footerLink && (
            <p className="auth-footer">
              <Link to={footerLink}>{footerText}</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
