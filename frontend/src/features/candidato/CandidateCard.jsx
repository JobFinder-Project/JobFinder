import styles from './CandidateCard.module.css'

function CandidateCard({ candidato }) {
  const handleViewProfile = () => {
    console.log('Ver perfil do candidato:', candidato._id)
  }

  return (
    <div className={styles.candidateCard}>
      {candidato.imagem && (
        <img
          src={candidato.imagem}
          alt={candidato.nome}
          className={styles.candidateImage}
        />
      )}
      <h3 className={styles.candidateName}>{candidato.nome}</h3>
      <p className={styles.candidateQualification}>{candidato.qualificacao}</p>
      <button className={styles.viewProfileButton} onClick={handleViewProfile}>
        Ver Perfil
      </button>
    </div>
  )
}

export default CandidateCard
