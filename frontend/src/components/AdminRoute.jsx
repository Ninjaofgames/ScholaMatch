import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAdminAuth();
    if (loading) return null;
    if (!isAuthenticated) return <Navigate to="/adminLgin" />;
    return children;
};

export default AdminRoute;