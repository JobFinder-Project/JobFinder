import { useState } from 'react'
import { BiCheckCircle, BiInfoCircle } from 'react-icons/bi'
import Modal from '../../../components/ui/Modal/Modal'
import { candidatoService } from '../../../services/candidatoService'
import styles from './VagaDetalhesModal.module.css'

export default function VagaDetalhesModal({ vaga, candidatoId, onClose }) {
  const [loading, setLoading] = useState(false)
  const [showDuplicadaModal, setShowDuplicadaModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleCandidatar = async () => {
    setLoading(true)

    try {
      await candidatoService.candidatarVaga(vaga._id)
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
      <Modal title='Candidatura Existente' onClose={onClose} size='sm'>
        <Modal.Body>
          <div className={styles.warningContent}>
            <BiInfoCircle className={styles.warningIcon} size={64} color='#FFA94D' />
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
      <Modal title='Candidatura Enviada' onClose={onClose} size='sm'>
        <Modal.Body>
          <div className={styles.successContent}>
            <BiCheckCircle className={styles.checkIcon} size={64} color='#63E6BE' />
            <h4>Candidatura enviada com sucesso!</h4>
            <button className={styles.btnOk} onClick={onClose}>OK</button>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <Modal title='Detalhes da Vaga' onClose={onClose}>
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
