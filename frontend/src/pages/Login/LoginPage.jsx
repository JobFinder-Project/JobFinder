import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { BiLogoGoogle } from 'react-icons/bi'
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
            <BiLogoGoogle size={16} />
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
