import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) {
    return (
      <div className="loading-screen admin-loading">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default AdminRoute;
