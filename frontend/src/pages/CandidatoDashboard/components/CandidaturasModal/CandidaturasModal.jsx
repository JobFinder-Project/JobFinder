import { useState, useEffect } from 'react'
import { BiCheckCircle } from 'react-icons/bi'
import Modal from '../../../../components/ui/Modal/Modal'
import { candidatoService } from '../../../../services'
import styles from './CandidaturasModal.module.css'

function CandidaturasModal({ candidatoId, onClose }) {
  const [candidaturas, setCandidaturas] = useState([])
  const [view, setView] = useState('lista') // lista, detalhe, confirmacao, resultado
  const [selectedCandidatura, setSelectedCandidatura] = useState(null)
  const [resultMessage, setResultMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCandidaturas()
  }, [candidatoId])

  const fetchCandidaturas = async () => {
    try {
      const data = await candidatoService.getCandidaturas()
      setCandidaturas(data.candidaturas || [])
    } catch (error) {
      console.error('Erro ao carregar candidaturas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectCandidatura = (candidatura) => {
    setSelectedCandidatura(candidatura)
    setView('detalhe')
  }

  const handleCancelar = () => {
    setView('confirmacao')
  }

  const handleConfirmarCancelamento = async () => {
    try {
      await candidatoService.cancelarCandidatura(candidatoId, selectedCandidatura._id)
      setResultMessage('Candidatura cancelada com sucesso!')
      setView('resultado')
      fetchCandidaturas()
    } catch (error) {
      console.error('Erro ao cancelar:', error)
      setResultMessage('Erro ao cancelar candidatura.')
      setView('resultado')
    }
  }

  const handleVoltar = () => {
    if (view === 'detalhe') setView('lista')
    else if (view === 'confirmacao') setView('detalhe')
    else if (view === 'resultado') {
      setView('lista')
      setSelectedCandidatura(null)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Não informada'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  return (
    <Modal title="Minhas Candidaturas" onClose={onClose}>
      <Modal.Body>
        {loading ? (
          <p>Carregando...</p>
        ) : view === 'lista' ? (
          <div className={styles.listaView}>
            {candidaturas.length > 0 ? (
              <ul className={styles.candidaturasList}>
                {candidaturas.map((candidatura) => (
                  <li
                    key={candidatura._id}
                    className={styles.candidaturaItem}
                    onClick={() => handleSelectCandidatura(candidatura)}
                  >
                    <h3>{candidatura.vaga?.nome}</h3>
                    <p><strong>Empresa:</strong> {candidatura.vaga?.empresa?.nome}</p>
                    <p><strong>Status:</strong> {candidatura.status}</p>
                    <p><strong>Data:</strong> {formatDate(candidatura.dataCandidatura)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.noData}>Você ainda não possui candidaturas.</p>
            )}
          </div>
        ) : view === 'detalhe' && selectedCandidatura ? (
          <div className={styles.detalheView}>
            <h3>{selectedCandidatura.vaga?.nome}</h3>
            <p><strong>Empresa:</strong> {selectedCandidatura.vaga?.empresa?.nome}</p>
            <p><strong>Status:</strong> {selectedCandidatura.status}</p>
            <p><strong>Área:</strong> {selectedCandidatura.vaga?.area}</p>
            <p><strong>Requisitos:</strong> {selectedCandidatura.vaga?.requisitos}</p>
            <p><strong>Data:</strong> {formatDate(selectedCandidatura.dataCandidatura)}</p>
            <hr />
            <div className={styles.detalheActions}>
              <button className={styles.btnVoltar} onClick={handleVoltar}>
                Voltar para a Lista
              </button>
              <button className={styles.btnCancelar} onClick={handleCancelar}>
                Cancelar Candidatura
              </button>
            </div>
          </div>
        ) : view === 'confirmacao' && selectedCandidatura ? (
          <div className={styles.confirmacaoView}>
            <h4>Tem certeza que deseja cancelar sua candidatura para a vaga?</h4>
            <div className={styles.confirmacaoInfo}>
              <strong>{selectedCandidatura.vaga?.nome}</strong>
              <p><strong>Empresa:</strong> {selectedCandidatura.vaga?.empresa?.nome}</p>
              <p><strong>Status:</strong> {selectedCandidatura.status}</p>
            </div>
            <div className={styles.detalheActions}>
              <button className={styles.btnVoltar} onClick={handleVoltar}>
                Voltar
              </button>
              <button className={styles.btnConfirmar} onClick={handleConfirmarCancelamento}>
                Sim, Cancelar
              </button>
            </div>
          </div>
        ) : view === 'resultado' ? (
          <div className={styles.resultadoView}>
            <BiCheckCircle className={styles.checkIcon} size={64} color="#63E6BE" />
            <h4>{resultMessage}</h4>
            <div className={styles.detalheActions}>
              <button className={styles.btnOk} onClick={handleVoltar}>OK</button>
            </div>
          </div>
        ) : null}
      </Modal.Body>
    </Modal>
  )
}

export default CandidaturasModal
