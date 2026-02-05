import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/Layout/AuthLayout/AuthLayout'
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
    <AuthLayout title="JobFinder" backTo="/home">
      <div className={styles.container}>
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
      </div>
    </AuthLayout>
  )
}

export default EscolherCargo
