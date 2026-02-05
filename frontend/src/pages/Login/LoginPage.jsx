import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import AuthLayout from '../../components/Layout/AuthLayout/AuthLayout'
import { authService } from '../../services'
import styles from './Login.module.css'

function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    // Verifica se a URL contém o parâmetro "cadastro=sucesso"
    if (searchParams.get('cadastro') === 'sucesso') {
      alert('Cadastro realizado com sucesso! Faça login para acessar sua conta.')
      // Remove o parâmetro da URL
      navigate('/login', { replace: true })
    }
  }, [searchParams, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = await authService.login({ email, senha })

      if (data.message === 'Login bem-sucedido') {
        window.location.href = data.redirectUrl
      } else {
        alert(data.error || 'Erro ao realizar o login. Tente novamente.')
      }
    } catch (err) {
      console.error('Erro no login:', err)
      alert(err.data?.error || 'Erro ao realizar o login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Área de Login" backTo="/home">
      <div className={styles.loginContainer}>
        <h1>Bem-vindo ao JobFinder</h1>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputField}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Endereço de Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.inputField}>
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              placeholder="Senha"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <button type="submit" className={styles.loginBtn} disabled={loading}>
            {loading ? 'Entrando...' : 'Login'}
          </button>
        </form>

        <p className={styles.forgotPassword}>
          <Link to="/recuperar_senha">Esqueci a senha</Link>
        </p>

        <div className={styles.socialLogin}>
          <a href="#" className={styles.googleButton}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
            </svg>
            Login com Google
          </a>
        </div>

        <p className={styles.signupLink}>
          Não tem uma conta? <Link to="/cargo">Cadastre-se</Link>
        </p>
      </div>
    </AuthLayout>
  )
}

export default Login
