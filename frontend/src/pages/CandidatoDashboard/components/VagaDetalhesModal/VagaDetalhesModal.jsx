import { useState } from 'react'
import Modal from '../../../../components/ui/Modal/Modal'
import { candidatoService } from '../../../../services'
import styles from './VagaDetalhesModal.module.css'

function VagaDetalhesModal({ vaga, candidatoId, onClose }) {
  const [loading, setLoading] = useState(false)
  const [showDuplicadaModal, setShowDuplicadaModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleCandidatar = async () => {
    setLoading(true)

    try {
      await candidatoService.candidatarVaga(candidatoId, vaga._id)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Erro ao candidatar:', error)
      if (error.status === 400 && error.data?.error?.includes('já')) {
        setShowDuplicadaModal(true)
      } else {
        alert(error.data?.error || 'Erro ao realizar candidatura. Tente novamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (showDuplicadaModal) {
    return (
      <Modal title="Candidatura Existente" onClose={onClose} size="sm">
        <Modal.Body>
          <div className={styles.warningContent}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className={styles.warningIcon}>
              <path fill="#FFA94D" d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM320 224C306.7 224 296 234.7 296 248V328C296 341.3 306.7 352 320 352C333.3 352 344 341.3 344 328V248C344 234.7 333.3 224 320 224zM320 400C306.7 400 296 410.7 296 424C296 437.3 306.7 448 320 448C333.3 448 344 437.3 344 424C344 410.7 333.3 400 320 400z" />
            </svg>
            <h4>Você já se candidatou a esta vaga!</h4>
            <p>Não é possível enviar uma nova candidatura para uma vaga em que você já está inscrito.</p>
            <button className={styles.btnOk} onClick={onClose}>Entendi</button>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  if (showSuccessModal) {
    return (
      <Modal title="Candidatura Enviada" onClose={onClose} size="sm">
        <Modal.Body>
          <div className={styles.successContent}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className={styles.checkIcon}>
              <path fill="#63E6BE" d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
            </svg>
            <h4>Candidatura enviada com sucesso!</h4>
            <button className={styles.btnOk} onClick={onClose}>OK</button>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <Modal title="Detalhes da Vaga" onClose={onClose}>
      <Modal.Body>
        <div className={styles.vagaInfo}>
          <h3>{vaga.nome}</h3>
          <p><strong>Empresa:</strong> {vaga.empresa?.nome}</p>
          <p><strong>Área:</strong> {vaga.area}</p>
          <p><strong>Descrição:</strong> {vaga.descricao}</p>
          <p><strong>Requisitos:</strong> {vaga.requisitos}</p>
          <p><strong>Benefícios:</strong> {vaga.beneficios}</p>
          <p><strong>Salário:</strong> {vaga.salario || 'A combinar'}</p>
          <p><strong>Localização:</strong> {vaga.localizacao}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          className={styles.candidatarBtn}
          onClick={handleCandidatar}
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Candidatar-se'}
        </button>
      </Modal.Footer>
    </Modal>
  )
}

export default VagaDetalhesModal
