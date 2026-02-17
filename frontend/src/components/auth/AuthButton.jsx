export default function AuthButton({ type = 'button', children, onClick, disabled = false, loading = false, fullWidth = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-primary ${fullWidth ? 'btn-full' : ''}`}
      aria-busy={loading}
    >
      {loading ? (
        <span className="btn-loading">
          <span className="btn-spinner" aria-hidden />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
