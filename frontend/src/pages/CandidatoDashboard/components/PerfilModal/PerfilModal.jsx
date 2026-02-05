import { useNavigate } from 'react-router-dom'
import styles from './PerfilModal.module.css'

function PerfilModal({ candidato, candidatoId, onClose }) {
  const navigate = useNavigate()

  const handleEdit = () => {
    navigate(`/candidato/perfil/${candidatoId}/editar`)
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Meu Perfil</h2>
          <span className={styles.closeButton} onClick={onClose}>&times;</span>
        </div>

        <div className={styles.modalBody}>
          {candidato?.cpf ? (
            <section className={styles.perfilInfo}>
              {candidato.imagem && (
                <div className={styles.perfilImagem}>
                  <img
                    src={`data:${candidato.imagem.contentType};base64,${candidato.imagem.data}`}
                    alt="Imagem do candidato"
                  />
                </div>
              )}
              <p className={styles.perfilNome}>{candidato.nome}</p>
              <p><strong>CPF:</strong> {candidato.cpf}</p>
              <p><strong>Email:</strong> {candidato.email}</p>
              <p><strong>Telefone:</strong> {candidato.telefone}</p>
              <p><strong>Educação:</strong> {candidato.educacao}</p>
              <p><strong>Qualificações:</strong> {candidato.qualificacao}</p>
              <p>
                <strong>Cursos:</strong>{' '}
                {candidato.cursos?.length > 0
                  ? candidato.cursos.join(', ')
                  : 'Não informado'}
              </p>
              <p><strong>Descrição:</strong> {candidato.descricao}</p>
              <p><strong>Habilidades Técnicas:</strong> {candidato.habilidadesTecnicas}</p>
              <p>
                <strong>Idiomas:</strong>{' '}
                {candidato.idiomas?.length > 0
                  ? candidato.idiomas.join(', ')
                  : 'Não informado'}
              </p>
            </section>
          ) : (
            <p className={styles.errorMessage}>Erro: Usuário não encontrado.</p>
          )}

          {candidato?.cpf && (
            <div className={styles.buttons}>
              <button className={styles.btnEdit} onClick={handleEdit}>
                Editar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PerfilModal
