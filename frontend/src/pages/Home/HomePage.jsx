import { Link } from 'react-router-dom'
import { BiLogIn } from 'react-icons/bi'
import styles from './Home.module.css'

function Home() {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.logo}>JobFinder</div>
        <Link to="/login" className={styles.headerIcon}>
          <BiLogIn size={24} />
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
