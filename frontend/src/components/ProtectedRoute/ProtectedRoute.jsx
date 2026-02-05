import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

/**
 * Componente para proteger rotas que requerem autenticação
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componente filho a ser renderizado
 * @param {string} [props.allowedRole] - Role permitida ('candidato' | 'empresa')
 * @param {string} [props.redirectTo] - Rota para redirecionar se não autenticado
 */
function ProtectedRoute({ children, allowedRole, redirectTo = '/login' }) {
  const { isAuthenticated, user, loading } = useAuth()
  const location = useLocation()

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <p>Carregando...</p>
      </div>
    )
  }

  // Não autenticado - redireciona para login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Verifica role se especificada
  if (allowedRole && user?.role !== allowedRole) {
    // Redireciona para o dashboard correto baseado no role
    const correctDashboard = user?.role === 'candidato' 
      ? '/candidato/dashboard' 
      : '/empresa/dashboard'
    return <Navigate to={correctDashboard} replace />
  }

  return children
}

export default ProtectedRoute
