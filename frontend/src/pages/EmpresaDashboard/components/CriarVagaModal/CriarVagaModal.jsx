import { useState } from 'react'
import Modal from '../../../../components/ui/Modal/Modal'
import { empresaService } from '../../../../services'
import styles from './CriarVagaModal.module.css'

function CriarVagaModal({ empresaId, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    nome: '',
    area: '',
    requisitos: '',
  })
  const [imagem, setImagem] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

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
    setImagem(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      data.append('nome', formData.nome)
      data.append('area', formData.area)
      data.append('requisitos', formData.requisitos)
      if (imagem) {
        data.append('imagem', imagem)
      }

      await empresaService.criarVaga(empresaId, data)
      setShowSuccess(true)
    } catch (error) {
      console.error('Erro ao criar vaga:', error)
      alert(error.data?.error || 'Erro ao criar vaga. Tente novamente.')
    } finally {
      setLoading(true)
    }
  }

  const handleSuccessOk = () => {
    setShowSuccess(false)
    onSuccess()
  }

  if (showSuccess) {
    return (
      <Modal title="Sucesso" onClose={handleSuccessOk} size="sm" hideHeader>
        <Modal.Body>
          <div className={styles.successContent}>
            <div className={styles.successIcon}>✓</div>
            <h2>Vaga Publicada com Sucesso!</h2>
            <p>
              Sua vaga foi criada e está disponível para candidatos se inscreverem.
              Você pode visualizá-la na seção "Vagas" ou criar uma nova vaga.
            </p>
            <button className={styles.btnOkSuccess} onClick={handleSuccessOk}>
              OK
            </button>
          </div>
        </Modal.Body>
      </Modal>
    )
  }

  return (
    <Modal title="Criar Nova Vaga" onClose={onClose} size="lg">
      <Modal.Body>
        <form className={styles.formAddVaga} onSubmit={handleSubmit}>
          <div className={styles.formRow}>
            <label htmlFor="nome">Nome da Vaga:</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formRow}>
            <label htmlFor="area">Área *</label>
            <select
              id="area"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
            >
              <option value="">Selecione</option>
              {areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.formRow}>
            <label htmlFor="requisitos">Requisitos *:</label>
            <textarea
              id="requisitos"
              name="requisitos"
              rows="4"
              value={formData.requisitos}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formRow}>
            <label htmlFor="imagem">Imagem da Vaga:</label>
            <input
              type="file"
              id="imagem"
              name="imagem"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button type="submit" className={styles.btnAddVaga} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Vaga'}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default CriarVagaModal
