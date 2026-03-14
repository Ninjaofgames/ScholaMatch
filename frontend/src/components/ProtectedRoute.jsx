import { Navigate } from 'react-router-dom';
import { useUserAuth } from '../context/UserAuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useUserAuth();
    if (loading) return null;
    if (!isAuthenticated) return <Navigate to="/login" />;
    return children;
};

export default ProtectedRoute;