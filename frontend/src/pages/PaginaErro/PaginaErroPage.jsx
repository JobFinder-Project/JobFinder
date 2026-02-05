import { useNavigate } from 'react-router-dom'
import styles from './PaginaErro.module.css'

function PaginaErro({ 
  status = '404', 
  title = 'Página não encontrada', 
  mensagem = 'A página que você está procurando não existe ou foi movida.',
  erro = null 
}) {
  const navigate = useNavigate()

  const handleVoltar = () => {
    navigate(-1)
  }

  return (
    <div className={styles.page}>
      <div className={styles.errorContainer}>
        <h1 className={styles.errorStatus}>{status}</h1>
        <h2 className={styles.errorTitle}>{title}</h2>
        <p className={styles.errorMessage}>{mensagem}</p>

        {erro && (
          <div className={styles.systemError}>
            <strong>Detalhes técnicos:</strong><br />
            {erro}
          </div>
        )}

        <button onClick={handleVoltar} className={styles.btnVoltar}>
          Voltar para a página anterior
        </button>
      </div>
    </div>
  )
}

export default PaginaErro
