import { Link } from 'react-router-dom'
import styles from './Home.module.css'

function Home() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.logo}>JobFinder</div>
        <Link to="/login" className={styles.headerIcon}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </Link>
      </header>

      <main className={styles.container}>
        <div className={styles.content}>
          <h1>Bem-vindo ao JobFinder</h1>
          <p>
            No JobFinder, conectamos você com as melhores oportunidades de emprego
            em diversas áreas. Nossa plataforma é fácil de usar e oferece
            ferramentas poderosas para ajudar você a encontrar o emprego dos seus
            sonhos.
          </p>
          <div className={styles.buttonGroup}>
            <Link to="/cargo" className={`${styles.button} ${styles.primaryButton}`}>
              Cadastre-se
            </Link>
            <Link to="/login" className={`${styles.button} ${styles.secondaryButton}`}>
              Entrar
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img
            src="/img/imagem1.jpeg"
            alt="Pessoas trabalham em um ambiente de escritório moderno"
          />
        </div>
      </main>
    </div>
  )
}

export default Home
