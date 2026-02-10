import { useState } from 'react'
import Modal from '../../../components/ui/Modal/Modal'
import { empresaService } from '../../../services/empresaService'
import styles from './PerfilEmpresaModal.module.css'

export default function PerfilEmpresaModal({ empresa, empresaId, onClose, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    nome: empresa?.nome || '',
    cnpj: empresa?.cnpj || '',
    email: empresa?.email || '',
    fone: empresa?.fone || '',
    bio: empresa?.bio || '',
    site: empresa?.site || '',
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await empresaService.atualizarPerfil(empresaId, formData)
      alert('Perfil atualizado com sucesso!')
      setIsEditing(false)
      onUpdate()
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      alert(error.data?.error || 'Erro ao atualizar perfil. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const modalTitle = isEditing ? 'Editar Perfil' : 'Meu Perfil'

  return (
    <Modal title={modalTitle} onClose={onClose} size='lg'>
      <Modal.Body>
        {isEditing ? (
          <form className={styles.formEditPerfil} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <label htmlFor='editNome'>Nome:</label>
              <input
                type='text'
                id='editNome'
                name='nome'
                value={formData.nome}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formRow}>
              <label htmlFor='editCnpj'>CNPJ:</label>
              <input
                type='text'
                id='editCnpj'
                name='cnpj'
                value={formData.cnpj}
                onChange={handleChange}
                placeholder='00.000.000/0000-00'
                required
              />
            </div>
            <div className={styles.formRow}>
              <label htmlFor='editEmail'>Email:</label>
              <input
                type='email'
                id='editEmail'
                name='email'
                value={formData.email}
                onChange={handleChange}
                placeholder='email@empresa.com'
                required
              />
            </div>
            <div className={styles.formRow}>
              <label htmlFor='editFone'>Telefone:</label>
              <input
                type='text'
                id='editFone'
                name='fone'
                value={formData.fone}
                onChange={handleChange}
                placeholder='(00) 00000-0000'
                required
              />
            </div>
            <div className={styles.formRow}>
              <label htmlFor='editBio'>Biografia:</label>
              <textarea
                id='editBio'
                name='bio'
                value={formData.bio}
                onChange={handleChange}
                rows='3'
              />
            </div>
            <div className={styles.formRow}>
              <label htmlFor='editSite'>Site:</label>
              <input
                type='url'
                id='editSite'
                name='site'
                value={formData.site}
                onChange={handleChange}
              />
            </div>
            <div className={styles.formActions}>
              <button type='submit' className={styles.btnSave} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar alterações'}
              </button>
              <button
                type='button'
                className={styles.btnBack}
                onClick={() => setIsEditing(false)}
              >
                Voltar
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.perfilVisualizacao}>
            <div className={styles.perfilInfoCard}>
              <div className={styles.infoRow}>
                <strong>Nome da Empresa:</strong>
                <span>{empresa?.nome}</span>
              </div>
              <div className={styles.infoRow}>
                <strong>CNPJ:</strong>
                <span>{empresa?.cnpj}</span>
              </div>
              <div className={styles.infoRow}>
                <strong>Email:</strong>
                <span>{empresa?.email}</span>
              </div>
              <div className={styles.infoRow}>
                <strong>Telefone:</strong>
                <span>{empresa?.fone}</span>
              </div>
              <div className={styles.infoRow}>
                <strong>Biografia:</strong>
                <span>{empresa?.bio || 'Não informado'}</span>
              </div>
              <div className={styles.infoRow}>
                <strong>Site:</strong>
                <span>{empresa?.site || 'Não informado'}</span>
              </div>
            </div>
            <div className={styles.perfilActions}>
              <button
                className={styles.btnEdit}
                onClick={() => setIsEditing(true)}
              >
                Editar Perfil
              </button>
              <button className={styles.btnClose} onClick={onClose}>
                Fechar
              </button>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}