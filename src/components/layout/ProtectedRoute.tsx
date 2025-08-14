import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import FullScreenLoader from '../ui/FullScreenLoader';

interface ProtectedRouteProps {
    children?: ReactNode;
    roles?: string[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (roles && (!user.role || !roles.includes(user.role))) {
        return <Navigate to="/dashboard" replace />;
    }

    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;