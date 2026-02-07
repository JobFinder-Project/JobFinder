import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../../components/Layout/AuthLayout/AuthLayout'
import { authService } from '../../services/authService'
import styles from './EsqueciSenha.module.css'

export default function EsqueciSenha() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await authService.recuperarSenha(email)
      setSuccess(true)
    } catch (err) {
      console.error('Erro:', err)
      setError(err.data?.message || 'Erro ao enviar email')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout title='Email Enviado' backTo='/login' showHelp={false}>
        <div className={styles.container}>
          <div className={styles.successIcon}>✓</div>
          <h1>Email Enviado!</h1>
          <p>
            Enviamos as instruções para redefinir sua senha para <strong>{email}</strong>.
            Verifique sua caixa de entrada e spam.
          </p>
          <Link to='/login' className={styles.loginLink}>
            Voltar ao Login
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title='Esqueci a Senha' backTo='/login' showHelp={false}>
      <div className={styles.container}>
        <p>
          Digite o endereço de e-mail associado à sua conta e enviaremos
          instruções para redefinir sua senha.
        </p>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor='email'>Endereço de Email</label>
          <input
            type='email'
            id='email'
            name='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='exemplo@email.com'
            required
          />
          <button type='submit' disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar Link de Redefinição'}
          </button>
        </form>

        <Link to='/login' className={styles.loginLink}>
          Voltar ao Login
        </Link>
      </div>
    </AuthLayout>
  )
}
