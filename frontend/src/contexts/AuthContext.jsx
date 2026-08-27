import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const data = await authService.getMe()
      if (data && data.authenticated) {
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (err) {

      console.warn('Sessão inválida ou expirada:', err);
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (credentials) => {
    setError(null);

    try {
      const data = await authService.login(credentials);
      await checkAuth();
      return { success: true, data };
    } catch (err) {
      const errorMessage = err.data?.error || 'Erro ao fazer login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Erro no logout', err);
    } finally {
      setUser(null);
      setLoading(false);

    }
  }, []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isCandidato: user?.role === 'candidato',
    isEmpresa: user?.role === 'empresa',
    login,
    logout,
    checkAuth,
    clearError: () => setError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
