/**
 * Reusable button with loading and disabled states.
 */
const Button = ({
  type = 'button',
  children,
  onClick,
  disabled = false,
  loading = false,
  variant = 'primary',
  fullWidth = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant} ${fullWidth ? 'btn-full' : ''}`}
    >
      {loading ? (
        <span className="btn-loading">
          <span className="btn-spinner" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
