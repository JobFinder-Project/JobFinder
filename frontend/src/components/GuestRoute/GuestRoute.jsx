import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function GuestRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className='loading-screen'>Carregando...</div>;
  }

  if (isAuthenticated) {
    const dashboard = user?.role === 'candidato' ? '/candidato/dashboard' : '/empresa/dashboard';
    return <Navigate to={dashboard} replace />;
  }

  return children;
}

