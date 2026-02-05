import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

/**
 * Componente para rotas que só podem ser acessadas por usuários NÃO autenticados
 * (login, cadastro, etc.)
 * 
 * Se o usuário já estiver logado, redireciona para o dashboard apropriado
 */
function GuestRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth()

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

  // Se já autenticado, redireciona para o dashboard
  if (isAuthenticated) {
    const dashboard = user?.role === 'candidato' 
      ? '/candidato/dashboard' 
      : '/empresa/dashboard'
    return <Navigate to={dashboard} replace />
  }

  return children
}

export default GuestRoute
