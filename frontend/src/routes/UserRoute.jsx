import { Navigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';

const UserRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUserAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default UserRoute;
