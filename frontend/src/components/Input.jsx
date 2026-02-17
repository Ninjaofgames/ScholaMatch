/**
 * Reusable form input with label, error message, and validation styling.
 */
const Input = ({
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
}) => {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        className={`input-field ${error ? 'input-error' : ''}`}
      />
      {error && <p className="input-error-text">{error}</p>}
    </div>
  );
};

export default Input;
