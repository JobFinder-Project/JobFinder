import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { BiBriefcase, BiErrorCircle, BiCheckCircle } from 'react-icons/bi'
import { authService } from '../../services/authService'
import styles from './RedefinirSenha.module.css'

export default function RedefinirSenha() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (senha !== confirmarSenha) {
      setErrorMsg('As senhas não coincidem.')
      return
    }

    if (senha.length < 8) {
      setErrorMsg('A senha deve ter no mínimo 8 caracteres.')
      return
    }

    setLoading(true)
    try {
      await authService.redefinirSenha(token, senha)
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      console.error('Erro:', err)
      setErrorMsg(err.data?.message || 'Erro ao redefinir senha. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.logoGroup}>
            <BiBriefcase className={styles.logoIcon} />
            <span className={styles.logoText}>JobFinder</span>
          </Link>
        </div>
      </header>

      <div className={styles.contentWrapper}>
        <div className={styles.formContainer}>
          <div className={styles.textCenter}>
            <h1 className={styles.pageTitle}>
              {success ? 'Senha Redefinida!' : 'Redefinir Senha'}
            </h1>
            <p className={styles.pageSubtitle}>
              {success
                ? 'Sua senha foi alterada com sucesso.'
                : 'Digite sua nova senha abaixo.'}
            </p>
          </div>

          <div className={styles.card}>
            <div className={styles.cardContent}>
              {success ? (
                <div className={styles.successAlert}>
                  <BiCheckCircle size={20} className={styles.successIcon} />
                  <span>Você será redirecionado para o login em instantes...</span>
                </div>
              ) : (
                <>
                  {errorMsg && (
                    <div className={styles.errorAlert}>
                      <BiErrorCircle size={20} />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                      <label htmlFor="senha" className={styles.label}>Nova Senha</label>
                      <input
                        type="password"
                        id="senha"
                        className={styles.input}
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="Mínimo de 8 caracteres"
                        minLength={8}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="confirmarSenha" className={styles.label}>Confirmar Senha</label>
                      <input
                        type="password"
                        id="confirmarSenha"
                        className={styles.input}
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        placeholder="Confirme sua nova senha"
                        minLength={8}
                        required
                      />
                    </div>

                    <button type="submit" className={styles.btnPrimary} disabled={loading}>
                      {loading ? 'Redefinindo...' : 'Redefinir Senha'}
                    </button>
                  </form>
                </>
              )}

              <p className={styles.footerLink}>
                Lembrou sua senha?{' '}
                <Link to="/login">Entrar na conta</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
