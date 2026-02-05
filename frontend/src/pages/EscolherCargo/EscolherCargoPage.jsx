import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './EscolherCargo.module.css'

function EscolherCargo() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (selected === 'candidate') {
      navigate('/candidato/cadastrar')
    } else if (selected === 'employer') {
      navigate('/empresa/cadastrar')
    } else {
      alert('Por favor, selecione uma opção.')
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.navigation}>
          <button 
            className={styles.backButton} 
            onClick={() => navigate('/home')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className={styles.logo}>JobFinder</div>
        <button className={styles.helpButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
          </svg>
        </button>
      </header>

      <main className={styles.container}>
        <h1>Registro</h1>
        <p>
          Bem-vindo ao JobFinder! Por favor, escolha se você está procurando um
          emprego ou se você é um empregador à procura de candidatos. Esta
          informação nos ajudará a personalizar sua experiência.
        </p>

        <form onSubmit={handleSubmit}>
          <div className={styles.options}>
            <label 
              className={`${styles.option} ${selected === 'candidate' ? styles.selected : ''}`}
            >
              <input
                type="radio"
                name="user-type"
                value="candidate"
                checked={selected === 'candidate'}
                onChange={(e) => setSelected(e.target.value)}
              />
              <div className={styles.optionContent}>
                <div className={styles.optionTitle}>Candidato</div>
                <div className={styles.optionDescription}>Estou procurando um emprego</div>
              </div>
            </label>

            <label 
              className={`${styles.option} ${selected === 'employer' ? styles.selected : ''}`}
            >
              <input
                type="radio"
                name="user-type"
                value="employer"
                checked={selected === 'employer'}
                onChange={(e) => setSelected(e.target.value)}
              />
              <div className={styles.optionContent}>
                <div className={styles.optionTitle}>Empregador</div>
                <div className={styles.optionDescription}>Estou procurando candidatos</div>
              </div>
            </label>
          </div>

          <button type="submit" className={styles.continueButton}>
            Continuar
          </button>
        </form>
      </main>
    </div>
  )
}

export default EscolherCargo
