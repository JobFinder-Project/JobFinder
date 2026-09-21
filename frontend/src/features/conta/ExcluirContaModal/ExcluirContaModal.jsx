import { useState } from 'react'
import { BiErrorCircle } from 'react-icons/bi'
import Modal from '../../../components/ui/Modal/Modal'
import styles from './ExcluirContaModal.module.css'

const consequencias = {
  candidato: 'Seu perfil e todas as suas candidaturas serão removidos permanentemente.',
  empresa: 'O perfil da empresa, todas as vagas publicadas e as candidaturas recebidas nelas serão removidos permanentemente.',
}

export default function ExcluirContaModal({ tipo = 'candidato', onConfirm, onClose }) {
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      await onConfirm(senha)
    } catch (error) {
      setErrorMsg(error.data?.message || error.message || 'Não foi possível excluir a conta. Tente novamente.')
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) onClose()
  }

  return (
    <Modal title="Excluir conta" onClose={handleClose} size="md">
      <Modal.Body>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.warning}>
            <BiErrorCircle size={22} className={styles.warningIcon} />
            <div>
              <strong>Esta ação não pode ser desfeita.</strong>
              <p>{consequencias[tipo] ?? consequencias.candidato}</p>
            </div>
          </div>

          {errorMsg && (
            <div className={styles.alertError} role="alert">
              {errorMsg}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label htmlFor="senha-exclusao" className={styles.label}>
              Confirme sua senha para continuar
            </label>
            <input
              id="senha-exclusao"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className={styles.input}
              autoComplete="current-password"
              autoFocus
              disabled={loading}
            />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.btnCancel} onClick={handleClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnDanger} disabled={loading || !senha}>
              {loading ? 'Excluindo...' : 'Excluir minha conta'}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}
