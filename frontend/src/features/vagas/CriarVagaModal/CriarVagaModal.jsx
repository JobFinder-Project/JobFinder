import { useState } from 'react'
import { BiUpload, BiInfoCircle } from 'react-icons/bi'
import Modal from '../../../components/ui/Modal/Modal'
import { empresaService } from '../../../services/empresaService'
import styles from './CriarVagaModal.module.css'

const allowedImageExtensionsByType = {
  'image/svg+xml': ['.svg'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/jpg': ['.jpg', '.jpeg'],
}

const getFileExtension = (fileName = '') => {
  const dotIndex = fileName.toLowerCase().lastIndexOf('.')

  return dotIndex === -1 ? '' : fileName.toLowerCase().slice(dotIndex)
}

const isAllowedVagaImageFile = (file) => {
  const allowedExtensions = allowedImageExtensionsByType[file.type]
  const fileExtension = getFileExtension(file.name)

  return Boolean(allowedExtensions?.includes(fileExtension))
}

export default function CriarVagaModal({ empresaId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nome: '',
    area: '',
    requisitos: '',
    localizacao: '',
    tipo: 'Tempo Integral',
    salario: '',
    descricao: ''
  })

  const [imagem, setImagem] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const areas = [
    'Comercial/Vendas',
    'Administrativa',
    'Gastronomia',
    'Logística',
    'Construção Civil',
    'Industrial',
    'Serviços Gerais',
    'Finanças',
    'Saúde',
    'TI - Tecnologia da Informação',
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return;

    const maxSize = 10 * 1024 * 1024;

    if (!isAllowedVagaImageFile(file)) {
      setErrorMsg('Formato inválido. Apenas SVG, PNG ou JPG são permitidos.');
      setImagem(null);
      setPreview(null);
      e.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      setErrorMsg('A imagem excede o limite máximo de 10MB.');
      setImagem(null);
      setPreview(null);
      e.target.value = '';
      return;
    }

    setErrorMsg('');
    setImagem(file)
    const reader = new FileReader()
    reader.onloadend = () => setPreview(reader.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const data = new FormData()
      data.append('nome', formData.nome)
      data.append('area', formData.area)
      data.append('requisitos', formData.requisitos)
      if (imagem) {
        data.append('imagem', imagem)
      }

      const response = await empresaService.criarVaga(data)
      if (response.success) {
        onSuccess(response.vaga)
      }
    } catch (err) {
      console.error('Erro ao criar vaga:', err)
      setErrorMsg(err.message || 'Erro ao publicar a vaga. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
      <Modal title="Publicar Nova Vaga" onClose={onClose} size="lg">
        <Modal.Body>
          <div className={styles.modalHeader}>
            <p className={styles.modalSubtitle}>
              Preencha os detalhes abaixo para encontrar o candidato ideal para sua equipe.
            </p>
          </div>

          {errorMsg && (
              <div className={styles.alertError}>
                <BiInfoCircle size={20} />
                <span>{errorMsg}</span>
              </div>
          )}

          <form onSubmit={handleSubmit} className={styles.formContainer}>

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Informações Básicas</h3>

              <div className={styles.grid2Col}>
                <div className={styles.formGroup}>
                  <label htmlFor="nome" className={styles.label}>Título da Vaga *</label>
                  <input
                      type="text"
                      id="nome"
                      name="nome"
                      className={styles.input}
                      placeholder="Ex: Desenvolvedor Frontend Sênior"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="area" className={styles.label}>Área / Categoria *</label>
                  <select
                      id="area"
                      name="area"
                      className={styles.select}
                      value={formData.area}
                      onChange={handleChange}
                      required
                  >
                    <option value="">Selecione uma área</option>
                    {areas.map((area) => (
                        <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="localizacao" className={styles.label}>Localização</label>
                  <input
                      type="text"
                      id="localizacao"
                      name="localizacao"
                      className={styles.input}
                      placeholder="Ex: São Paulo, SP (ou Remoto)"
                      value={formData.localizacao}
                      onChange={handleChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="tipo" className={styles.label}>Tipo de Vaga</label>
                  <select
                      id="tipo"
                      name="tipo"
                      className={styles.select}
                      value={formData.tipo}
                      onChange={handleChange}
                  >
                    <option value="Tempo Integral">Tempo Integral</option>
                    <option value="Meio Período">Meio Período</option>
                    <option value="Contrato">Contrato PJ</option>
                    <option value="Estágio">Estágio</option>
                  </select>
                </div>
              </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Detalhes e Requisitos</h3>

              <div className={styles.formGroup}>
                <label htmlFor="descricao" className={styles.label}>Descrição da Vaga</label>
                <textarea
                    id="descricao"
                    name="descricao"
                    className={styles.textarea}
                    placeholder="Descreva o dia a dia da vaga, cultura da empresa e benefícios..."
                    value={formData.descricao}
                    onChange={handleChange}
                    rows={3}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="requisitos" className={styles.label}>Requisitos Exigidos *</label>
                <textarea
                    id="requisitos"
                    name="requisitos"
                    className={styles.textarea}
                    placeholder="Liste as habilidades técnicas e experiências exigidas para o cargo..."
                    value={formData.requisitos}
                    onChange={handleChange}
                    rows={4}
                    required
                />
              </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Imagem de Destaque</h3>
              <p className={styles.sectionSubtitle}>
                Adicione uma imagem para chamar a atenção dos candidatos (opcional).
              </p>

              <div className={styles.uploadArea}>
                <input
                    type="file"
                    id="imagem"
                    name="imagem"
                    accept=".svg, .png, .jpg, .jpeg"
                    onChange={handleImageChange}
                    className={styles.fileInputHidden}
                />
                <label htmlFor="imagem" className={styles.uploadLabel}>
                  {preview ? (
                      <img src={preview} alt="Preview da Vaga" className={styles.imagePreview} />
                  ) : (
                      <div className={styles.uploadContent}>
                        <div className={styles.uploadIconWrapper}>
                          <BiUpload size={24} />
                        </div>
                        <span className={styles.uploadTextPrimary}>Clique para selecionar uma imagem</span>
                        <span className={styles.uploadTextSecondary}>SVG, PNG ou JPG (Max 10MB)</span>
                      </div>
                  )}
                </label>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                  type="button"
                  className={styles.btnCancel}
                  onClick={onClose}
                  disabled={loading}
              >
                Cancelar
              </button>
              <button
                  type="submit"
                  className={styles.btnSubmit}
                  disabled={loading}
              >
                {loading ? 'Publicando...' : 'Publicar Vaga'}
              </button>
            </div>

          </form>
        </Modal.Body>
      </Modal>
  )
}
