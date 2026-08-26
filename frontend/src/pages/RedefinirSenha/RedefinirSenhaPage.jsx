import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/Layout/AuthLayout/AuthLayout'
import { authService } from '../../services/authService'
import styles from './RedefinirSenha.module.css'

export default function RedefinirSenha() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (senha !== confirmarSenha) {
      setError('As senhas não coincidem')
      return
    }

    if (senha.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres')
      return
    }

    setLoading(true)

    try {
      await authService.redefinirSenha(token, senha)
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (err) {
      console.error('Erro:', err)
      setError(err.data?.message || 'Erro ao redefinir senha')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthLayout title='Senha Redefinida' backTo='/login' showHelp={false}>
        <div className={styles.container}>
          <div className={styles.successIcon}>✓</div>
          <h1>Senha Redefinida!</h1>
          <p>
            Sua senha foi alterada com sucesso. Você será redirecionado para o login em instantes...
          </p>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title='Redefinir Senha' backTo='/login' showHelp={false}>
      <div className={styles.container}>
        <p>Digite sua nova senha abaixo.</p>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label htmlFor='senha'>Nova Senha</label>
          <input
            type='password'
            id='senha'
            name='senha'
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder='Digite sua nova senha'
            minLength={8}
            required
          />

          <label htmlFor='confirmarSenha'>Confirmar Senha</label>
          <input
            type='password'
            id='confirmarSenha'
            name='confirmarSenha'
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder='Confirme sua nova senha'
            minLength={8}
            required
          />

          <button type='submit' disabled={loading}>
            {loading ? 'Redefinindo...' : 'Redefinir Senha'}
          </button>
        </form>
      </div>
    </AuthLayout>
  )
}
