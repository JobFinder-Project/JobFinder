import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import LoadingScreen from '../ui/LoadingScreen/LoadingScreen'

export default function GuestRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (isAuthenticated) {
    const dashboard = user?.role === 'candidato' ? '/candidato/dashboard' : '/empresa/dashboard';
    return <Navigate to={dashboard} replace />;
  }

  return children;
}

