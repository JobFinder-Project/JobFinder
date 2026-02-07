import { useNavigate } from 'react-router-dom'
import { BiArrowBack, BiHelpCircle } from 'react-icons/bi'
import styles from './AuthLayout.module.css'

export default function AuthLayout({
  children,
  title = 'Área de Login',
  backTo = '/home',
  showHelp = true,
  className = ''
}) {
  const navigate = useNavigate()

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <header className={styles.header}>
        <div className={styles.navigation}>
          {backTo && (
            <button
              className={styles.backButton}
              onClick={() => navigate(backTo)}
              aria-label='Voltar'
            >
              <BiArrowBack size={24} />
            </button>
          )}
        </div>
        <div className={styles.logo}>{title}</div>
        <div className={styles.helpContainer}>
          {showHelp && (
            <button className={styles.helpButton} aria-label='Ajuda'>
              <BiHelpCircle size={24} />
            </button>
          )}
        </div>
      </header>

      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  )
}
