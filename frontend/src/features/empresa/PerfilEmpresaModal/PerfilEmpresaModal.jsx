import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BiMailSend, BiPhone, BiGlobe, BiEditAlt, BiTrash } from 'react-icons/bi'
import Modal from '../../../components/ui/Modal/Modal'
import ExcluirContaModal from '../../conta/ExcluirContaModal/ExcluirContaModal'
import { useAuth } from '../../../contexts/AuthContext'
import { empresaService } from '../../../services/empresaService'
import styles from './PerfilEmpresaModal.module.css'

export default function PerfilEmpresaModal({ empresa, onClose, onUpdate }) {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [showExcluirConta, setShowExcluirConta] = useState(false)

  const [formData, setFormData] = useState({
    nome: empresa?.nome || '',
    cnpj: empresa?.cnpj || '',
    email: empresa?.email || '',
    fone: empresa?.fone || '',
    bio: empresa?.bio || '',
    site: empresa?.site || '',
  })

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1')
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'fone') {
      setFormData((prev) => ({ ...prev, [name]: formatPhone(value) }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      await empresaService.atualizarPerfil(formData)
      setIsEditing(false)
      onUpdate()
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      setErrorMsg(error.data?.error || error.message || 'Erro ao atualizar perfil. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  const handleExcluirConta = async (senha) => {
    await empresaService.excluirConta(senha)
    await logout()
    navigate('/', { replace: true })
  }

  const modalTitle = isEditing ? 'Editar Perfil da Empresa' : 'Perfil da Empresa'

  return (
    <>
      <Modal title={modalTitle} onClose={onClose} size='lg'>
        <Modal.Body>

          {!isEditing ? (
              <div className={styles.viewMode}>
                <div className={styles.headerProfile}>
                  <div className={styles.avatarLarge}>
                    {empresa?.nome ? empresa.nome.charAt(0).toUpperCase() : 'E'}
                  </div>
                  <div className={styles.headerInfo}>
                    <h2 className={styles.companyName}>{empresa?.nome}</h2>
                    <p className={styles.companyCnpj}>CNPJ: {empresa?.cnpj}</p>
                  </div>
                </div>

                <div className={styles.infoGrid}>
                  <div className={styles.infoCard}>
                    <BiMailSend className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Email de Contato</span>
                      <span className={styles.infoValue}>{empresa?.email}</span>
                    </div>
                  </div>

                  <div className={styles.infoCard}>
                    <BiPhone className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Telefone Comercial</span>
                      <span className={styles.infoValue}>{empresa?.fone || 'Não informado'}</span>
                    </div>
                  </div>

                  <div className={styles.infoCard}>
                    <BiGlobe className={styles.infoIcon} />
                    <div className={styles.infoContent}>
                      <span className={styles.infoLabel}>Site Institucional</span>
                      <span className={styles.infoValue}>
                    {empresa?.site ? (
                        <a href={empresa.site} target="_blank" rel="noopener noreferrer">{empresa.site}</a>
                    ) : 'Não informado'}
                  </span>
                    </div>
                  </div>
                </div>

                <div className={styles.bioSection}>
                  <h3 className={styles.sectionTitle}>Sobre a Empresa</h3>
                  <p className={styles.bioText}>
                    {empresa?.bio || 'Nenhuma descrição fornecida ainda. Edite seu perfil para contar mais sobre sua empresa!'}
                  </p>
                </div>

                <div className={styles.dangerZone}>
                  <div>
                    <h3 className={styles.dangerTitle}>Excluir conta</h3>
                    <p className={styles.dangerText}>
                      Remove o perfil da empresa, todas as vagas publicadas e as candidaturas recebidas. Não pode ser desfeito.
                    </p>
                  </div>
                  <button
                      type="button"
                      className={styles.btnDanger}
                      onClick={() => setShowExcluirConta(true)}
                  >
                    <BiTrash size={18} /> Excluir conta
                  </button>
                </div>

                <div className={styles.actionsFooter}>
                  <button className={styles.btnCancel} onClick={onClose}>
                    Fechar
                  </button>
                  <button className={styles.btnPrimary} onClick={() => setIsEditing(true)}>
                    <BiEditAlt size={18} /> Editar Informações
                  </button>
                </div>
              </div>
          ) : (

              <form onSubmit={handleSubmit} className={styles.editMode}>

                <p className={styles.formSubtitle}>
                  Atualize as informações de contato e a apresentação da sua empresa.
                </p>

                {errorMsg && (
                    <div id="empresa-perfil-error" role="alert" className={styles.alertError}>
                      <span>{errorMsg}</span>
                    </div>
                )}

                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Dados Cadastrais</h3>

                  <div className={styles.grid2Col}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label} htmlFor="empresa-field-1">Nome da Empresa *</label>
                      <input id="empresa-field-1" aria-describedby={errorMsg ? "empresa-perfil-error" : undefined} aria-invalid={Boolean(errorMsg)}
                          type="text"
                          name="nome"
                          value={formData.nome}
                          onChange={handleChange}
                          className={styles.input}
                          required
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label} htmlFor="empresa-field-2">CNPJ *</label>
                      <input id="empresa-field-2" aria-describedby={errorMsg ? "empresa-perfil-error" : undefined} aria-invalid={Boolean(errorMsg)}
                          type="text"
                          name="cnpj"
                          value={formData.cnpj}
                          onChange={handleChange}
                          className={styles.input}
                          disabled
                          title="O CNPJ não pode ser alterado por aqui"
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Contato e Web</h3>

                  <div className={styles.grid2Col}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label} htmlFor="empresa-field-3">Email *</label>
                      <input id="empresa-field-3" aria-describedby={errorMsg ? "empresa-perfil-error" : undefined} aria-invalid={Boolean(errorMsg)}
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={styles.input}
                          required
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label} htmlFor="empresa-field-4">Telefone Comercial *</label>
                      <input id="empresa-field-4" aria-describedby={errorMsg ? "empresa-perfil-error" : undefined} aria-invalid={Boolean(errorMsg)}
                          type="tel"
                          name="fone"
                          value={formData.fone}
                          onChange={handleChange}
                          className={styles.input}
                          placeholder="(XX) XXXXX-XXXX"
                          required
                      />
                    </div>

                    <div className={styles.inputGroup}>
                      <label className={styles.label} htmlFor="empresa-field-5">Site da Empresa</label>
                      <input id="empresa-field-5" aria-describedby={errorMsg ? "empresa-perfil-error" : undefined} aria-invalid={Boolean(errorMsg)}
                          type="url"
                          name="site"
                          value={formData.site}
                          onChange={handleChange}
                          className={styles.input}
                          placeholder="https://www.suaempresa.com"
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Apresentação</h3>
                  <div className={styles.inputGroup}>
                    <label className={styles.label} htmlFor="empresa-field-6">Biografia (Até 500 caracteres)</label>
                    <textarea id="empresa-field-6" aria-describedby={errorMsg ? "empresa-perfil-error" : undefined} aria-invalid={Boolean(errorMsg)}
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className={styles.textarea}
                        placeholder="Conte um pouco sobre a história e os valores da sua empresa..."
                        rows={4}
                        maxLength={500}
                    />
                  </div>
                </div>

                <div className={styles.actionsFooter}>
                  <button
                      type="button"
                      className={styles.btnCancel}
                      onClick={() => setIsEditing(false)}
                      disabled={loading}
                  >
                    Cancelar Edição
                  </button>
                  <button
                      type="submit"
                      className={styles.btnPrimary}
                      disabled={loading}
                  >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
          )}

        </Modal.Body>
      </Modal>

      {showExcluirConta && (
          <ExcluirContaModal
              tipo='empresa'
              onConfirm={handleExcluirConta}
              onClose={() => setShowExcluirConta(false)}
          />
      )}
    </>
  )
}
