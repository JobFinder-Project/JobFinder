import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function ProtectedRoute({ children, allowedRole, redirectTo = '/login' }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className='loading-screen'>Carregando...</div>; 
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  if (allowedRole && user?.role !== allowedRole) {
    const correctDashboard = user?.role === 'candidato' ? '/candidato/dashboard' : '/empresa/dashboard';
    return <Navigate to={correctDashboard} replace />;
  }

  return children;
}
