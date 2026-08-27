import { useState } from 'react'
import Modal from '../../../components/ui/Modal/Modal'
import styles from './VagasModal.module.css'

export default function VagasModal({ vagas, onClose }) {
  const [selectedVaga, setSelectedVaga] = useState(null)

  const handleViewDetails = (vaga) => {
    setSelectedVaga(vaga)
  }

  const handleBackToList = () => {
    setSelectedVaga(null)
  }

  const modalTitle = selectedVaga ? 'Detalhes da Vaga' : 'Vagas Disponíveis'

  return (
    <Modal title={modalTitle} onClose={onClose} size='lg'>
      <Modal.Body>
        {selectedVaga ? (
          <div className={styles.vagaDetalhes}>
            {selectedVaga.imagem && (
              <img
                src={selectedVaga.imagem}
                alt={selectedVaga.nome}
                className={styles.vagaImageLarge}
              />
            )}
            <h2>{selectedVaga.nome}</h2>
            <p><strong>Empresa:</strong> {selectedVaga.empresa?.nome}</p>
            <p><strong>Área:</strong> {selectedVaga.area}</p>
            <p><strong>Requisitos:</strong> {selectedVaga.requisitos}</p>
            <button className={styles.backButton} onClick={handleBackToList}>
              Voltar para lista
            </button>
          </div>
        ) : (
          <div className={styles.vagasListScroll}>
            {vagas.length > 0 ? (
              vagas.map((vaga) => (
                <div key={vaga._id} className={styles.vagaCardRow}>
                  {vaga.imagem && (
                    <img
                      src={vaga.imagem}
                      alt={vaga.nome}
                      className={styles.jobImage}
                    />
                  )}
                  <div className={styles.vagaCardInfo}>
                    <h2 className={styles.jobTitle}>{vaga.nome}</h2>
                    {vaga.empresa && (
                      <span className={styles.jobCompany}>{vaga.empresa.nome}</span>
                    )}
                    <div className={styles.vagaInfo}>
                      <span className={styles.jobArea}>{vaga.area}</span>
                      <button
                        className={styles.viewJobButton}
                        onClick={() => handleViewDetails(vaga)}
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.noData}>
                <p>Não existem vagas cadastradas.</p>
              </div>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}