import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useUser from '../../hooks/useUser';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }
    return children;
};

export const AdminRoute = ({ children }) => {
    const isAuthenticated = useAuth();
    const user = useUser();
    if (!isAuthenticated || !user?.roles.includes('admin')) {
        return <Navigate to="/" replace />;
    }
    return children;
}

export default ProtectedRoute;
