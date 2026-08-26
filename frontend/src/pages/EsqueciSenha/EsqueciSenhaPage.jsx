import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BiBriefcase, BiCheckCircle, BiInfoCircle } from 'react-icons/bi'
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
      setError(err.data?.message || 'Erro ao enviar email. Tente novamente.')
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
              <h1 className={styles.pageTitle}>Recuperar Senha</h1>
              <p className={styles.pageSubtitle}>Não se preocupe, ajudaremos você a voltar a acessar sua conta.</p>
            </div>

            <div className={styles.card}>
              {success ? (
                  <div className={styles.successState}>
                    <BiCheckCircle size={64} className={styles.successIcon} />
                    <h2>E-mail Enviado!</h2>
                    <p>
                      Enviamos as instruções para redefinir sua senha para <strong>{email}</strong>.
                      Verifique sua caixa de entrada e spam.
                    </p>
                    <Link to="/login" className={styles.btnPrimary}>
                      Voltar para o Login
                    </Link>
                  </div>
              ) : (
                  <div className={styles.cardContent}>
                    <p className={styles.instructionText}>
                      Digite o endereço de e-mail associado à sua conta e enviaremos um link para redefinição.
                    </p>

                    {error && (
                        <div className={styles.errorAlert}>
                          <BiInfoCircle size={20} />
                          <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.form}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="email" className={styles.label}>Endereço de E-mail</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="exemplo@email.com"
                            required
                            className={styles.input}
                        />
                      </div>

                      <button type="submit" className={styles.btnPrimary} disabled={loading}>
                        {loading ? 'Enviando Link...' : 'Enviar Link de Redefinição'}
                      </button>
                    </form>

                    <div className={styles.footerLink}>
                      Lembrou da senha? <Link to="/login">Fazer login</Link>
                    </div>
                  </div>
              )}
            </div>

          </div>
        </div>
      </div>
  )
}