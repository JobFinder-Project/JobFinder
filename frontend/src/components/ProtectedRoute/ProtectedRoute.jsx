import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingScreen from '../ui/LoadingScreen/LoadingScreen';

export default function ProtectedRoute({
    children,
    allowedRole,
    redirectTo = '/login',
    allowPendingConsent = false,
}) {
    const { isAuthenticated, user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    if (!allowPendingConsent && user?.consentimentosPendentes?.length > 0) {
        return <Navigate to="/consentimentos-pendentes" replace />;
    }

    if (allowedRole && user?.role !== allowedRole) {
        const correctDashboard = user?.role === 'candidato' ? '/candidato/dashboard' : '/empresa/dashboard';
        return <Navigate to={correctDashboard} replace />;
    }

    return children;
}
