import { useState, useMemo } from 'react';

function getPasswordStrength(pwd) {
  if (!pwd) return { level: 0, label: '', width: 0 };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^a-zA-Z0-9]/.test(pwd)) score++;
  const levels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
  const widths = [0, 20, 40, 60, 80, 100];
  const colors = ['', '#dc2626', '#f59e0b', '#84cc16', '#22c55e', '#16a34a'];
  return { level: score, label: levels[score], width: widths[score], color: colors[score] };
}

export default function AuthPasswordInput({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  autoComplete,
  showStrength = false,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const strength = useMemo(() => (showStrength ? getPasswordStrength(value) : null), [value, showStrength]);

  return (
    <div className={`input-group ${error ? 'input-group-error' : ''}`}>
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="required" aria-hidden>*</span>}
        </label>
      )}
      <div className="input-with-icon">
        <input
          id={name}
          type={showPassword ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`input-field ${error ? 'input-error' : ''}`}
        />
        <button
          type="button"
          className="input-icon-btn"
          onClick={() => setShowPassword((s) => !s)}
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {showStrength && value && (
        <div className="password-strength" role="status" aria-live="polite">
          <div className="password-strength-bar">
            <div
              className="password-strength-fill"
              style={{ width: `${strength.width}%`, backgroundColor: strength.color }}
            />
          </div>
          {strength.label && (
            <span className="password-strength-label" style={{ color: strength.color }}>
              {strength.label}
            </span>
          )}
          {value.length > 0 && value.length < 8 && (
            <p className="password-validation-text">At least 8 characters required</p>
          )}
        </div>
      )}
      {error && (
        <p id={`${name}-error`} className="input-error-text" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
