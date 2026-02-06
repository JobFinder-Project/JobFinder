import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BiLogoGoogle } from 'react-icons/bi';
import AuthLayout from '../../components/Layout/AuthLayout/AuthLayout';
import { useAuth } from '../../contexts/AuthContext'
import styles from './Login.module.css';

export default function Login() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (searchParams.get('cadastro') === 'sucesso') {
      alert('Cadastro realizado com sucesso! Faça login para acessar sua conta.')
      navigate('/login', { replace: true })
    }
  }, [searchParams, navigate])

  if (isAuthenticated && user) {
      return (
          <div style={{padding: 20, textAlign: 'center'}}>
              <h2>Você já está logado como {user.nome}</h2>
              <Link to={user.role === 'empresa' ? '/empresa/dashboard' : '/candidato/dashboard'}>
                  Ir para Dashboard
              </Link>
          </div>
      );
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await login({ email, senha });

      if (result.success) {
        navigate(result.data.redirectUrl || '/home');
      } else {
        alert(result.error || 'Erro ao realizar o login.');
      }
    } catch (err) {
      console.error('Erro no login:', err)
      alert(err.message || 'Erro inesperado.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title='Área de Login' backTo='/home'>
      <div className={styles.loginContainer}>
        <h1>Bem-vindo ao JobFinder</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputField}>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              name='email'
              placeholder='Endereço de Email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.inputField}>
            <label htmlFor='senha'>Senha</label>
            <input
              type='password'
              id='senha'
              name='senha'
              placeholder='Senha'
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <button type='submit' className={styles.loginBtn} disabled={loading}>
            {loading ? 'Entrando...' : 'Login'}
          </button>
        </form>

        <p className={styles.forgotPassword}>
          <Link to='/recuperar_senha'>Esqueci a senha</Link>
        </p>

        <div className={styles.socialLogin}>
          <a href='#' className={styles.googleButton}>
            <BiLogoGoogle size={16} />
            Login com Google
          </a>
        </div>

        <p className={styles.signupLink}>
          Não tem uma conta? <Link to='/cargo'>Cadastre-se</Link>
        </p>
      </div>
    </AuthLayout>
  );
}