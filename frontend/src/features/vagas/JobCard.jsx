import styles from './JobCard.module.css'

export default function JobCard({ vaga, onViewDetails }) {
  return (
    <li className={styles.jobCard}>
      <img
        src={vaga.imagem || '/img/default-job.png'}
        alt={vaga.nome}
        className={styles.jobImage}
      />
      <h2 className={styles.jobTitle}>{vaga.nome}</h2>
      <p className={styles.jobCompany}>{vaga.empresa?.nome}</p>
      <p className={styles.jobArea}>{vaga.area}</p>
      <button className={styles.registerButton} onClick={onViewDetails}>
        Ver Vaga
      </button>
    </li>
  )
}