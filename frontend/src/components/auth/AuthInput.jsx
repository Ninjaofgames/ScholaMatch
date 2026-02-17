export default function AuthInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  autoComplete,
  id,
  className = '',
  maxLength,
  inputMode,
}) {
  const inputId = id || name;
  return (
    <div className={`input-group ${error ? 'input-group-error' : ''}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="required" aria-hidden>*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        maxLength={maxLength}
        inputMode={inputMode}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        className={`input-field ${error ? 'input-error' : ''} ${className}`}
      />
      {error && (
        <p id={`${inputId}-error`} className="input-error-text" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
