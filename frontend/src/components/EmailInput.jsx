const EmailInput = ({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  autoComplete,
}) => {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="input-with-icon input-email-wrap">
        <input
          id={name}
          type="email"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`input-field ${error ? 'input-error' : ''}`}
        />
        <span className="input-icon-btn" aria-hidden>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </span>
      </div>
      {error && <p className="input-error-text">{error}</p>}
    </div>
  );
};

export default EmailInput;
