import { useState, useEffect } from 'react'
import Modal from '../../../../components/ui/Modal/Modal'
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
      const response = await fetch('/api/candidato/candidaturas')
      if (response.ok) {
        const data = await response.json()
        setCandidaturas(data.candidaturas || [])
      }
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
      const response = await fetch(`/api/candidato/${candidatoId}/vagas/delete/${selectedCandidatura._id}`, {
        method: 'POST'
      })
      
      if (response.ok) {
        setResultMessage('Candidatura cancelada com sucesso!')
        setView('resultado')
        fetchCandidaturas()
      } else {
        setResultMessage('Erro ao cancelar candidatura.')
        setView('resultado')
      }
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
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className={styles.checkIcon}>
              <path fill="#63E6BE" d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
            </svg>
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
