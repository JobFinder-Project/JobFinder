import { useState } from 'react'
import { BiArchive, BiBriefcase, BiCalendar, BiRefresh, BiUser } from 'react-icons/bi'
import Modal from '../../../components/ui/Modal/Modal'
import styles from './VagaEmpresaDetalhesModal.module.css'

export default function VagaEmpresaDetalhesModal({
  vaga,
  onClose,
  onStatusChange,
  onViewCandidates,
}) {
  const [updatingStatus, setUpdatingStatus] = useState(false)

  if (!vaga) return null

  const isClosed = vaga.status === 'Fechada'
  const publishedAt = vaga.createdAt
    ? new Date(vaga.createdAt).toLocaleDateString('pt-BR')
    : 'Data não informada'

  const handleStatusChange = async () => {
    if (!onStatusChange) return

    setUpdatingStatus(true)
    try {
      await onStatusChange(vaga, isClosed ? 'Aberta' : 'Fechada')
    } finally {
      setUpdatingStatus(false)
    }
  }

  return (
    <Modal title="Detalhes da Vaga" onClose={onClose} size="lg">
      <div className={styles.content}>
        {vaga.imagem ? (
          <img src={vaga.imagem} alt="" className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder} aria-hidden="true">
            <BiBriefcase size={36} />
          </div>
        )}

        <div>
          <h3 className={styles.title}>{vaga.nome}</h3>
          <div className={styles.tags}>
            <span className={styles.tag}>{vaga.area}</span>
            <span className={`${styles.tag} ${isClosed ? styles.closed : styles.open}`}>
              {vaga.status || 'Aberta'}
            </span>
          </div>
        </div>

        <p className={styles.date}>
          <BiCalendar size={18} aria-hidden="true" /> Publicada em {publishedAt}
        </p>

        <section className={styles.section}>
          <h4>Requisitos</h4>
          <p>{vaga.requisitos}</p>
        </section>

        {(onViewCandidates || onStatusChange) && (
          <div className={styles.actions}>
            {onViewCandidates && (
              <button type="button" className={styles.secondaryButton} onClick={() => onViewCandidates(vaga)}>
                <BiUser size={18} /> Ver candidatos
              </button>
            )}
            {onStatusChange && (
              <button
                type="button"
                className={isClosed ? styles.reopenButton : styles.closeButton}
                onClick={handleStatusChange}
                disabled={updatingStatus}
              >
                {isClosed ? <BiRefresh size={18} /> : <BiArchive size={18} />}
                {updatingStatus ? 'Atualizando...' : isClosed ? 'Reabrir vaga' : 'Encerrar vaga'}
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  )
}
