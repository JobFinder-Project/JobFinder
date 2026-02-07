import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import AuthLayout from '../../components/Layout/AuthLayout/AuthLayout'
import { candidatoService } from '../../services'
import LoadingScreen from '../../components/ui/LoadingScreen/LoadingScreen'
import styles from './EditarPerfilCandidato.module.css'

function EditarPerfilCandidato() {
  const navigate = useNavigate()
  const { candidatoId } = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    educacao: '',
    qualificacao: '',
    cursos: '',
    descricao: '',
    habilidadesTecnicas: '',
    idiomas: '',
    imagem: null
  })
  const [previewImage, setPreviewImage] = useState(null)

  useEffect(() => {
    fetchCandidatoData()
  }, [candidatoId])

  const fetchCandidatoData = async () => {
    try {
      const data = await candidatoService.getDashboard()
      const candidato = data.candidato

      if (candidato) {
        setFormData({
          nome: candidato.nome || '',
          cpf: candidato.cpf || '',
          email: candidato.email || '',
          telefone: candidato.telefone || '',
          educacao: candidato.educacao || '',
          qualificacao: candidato.qualificacao || '',
          cursos: Array.isArray(candidato.cursos) ? candidato.cursos.join(', ') : candidato.cursos || '',
          descricao: candidato.descricao || '',
          habilidadesTecnicas: candidato.habilidadesTecnicas || '',
          idiomas: Array.isArray(candidato.idiomas) ? candidato.idiomas.join(', ') : candidato.idiomas || '',
          imagem: null
        })

        if (candidato.imagem && candidato.imagem.data) {
          setPreviewImage(`data:${candidato.imagem.contentType};base64,${candidato.imagem.data}`)
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files && files[0]) {
      setFormData(prev => ({ ...prev, [name]: files[0] }))
      // Preview da nova imagem
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
      }
      reader.readAsDataURL(files[0])
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value)
    setFormData(prev => ({ ...prev, cpf: formatted }))
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value)
    setFormData(prev => ({ ...prev, telefone: formatted }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formDataToSend = new FormData()
      
      // Adiciona todos os campos
      formDataToSend.append('nome', formData.nome)
      formDataToSend.append('cpf', formData.cpf)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('telefone', formData.telefone)
      formDataToSend.append('educacao', formData.educacao)
      formDataToSend.append('qualificacao', formData.qualificacao)
      formDataToSend.append('cursos', formData.cursos)
      formDataToSend.append('descricao', formData.descricao)
      formDataToSend.append('habilidadesTecnicas', formData.habilidadesTecnicas)
      formDataToSend.append('idiomas', formData.idiomas)
      
      // Só adiciona imagem se foi selecionada uma nova
      if (formData.imagem) {
        formDataToSend.append('imagem', formData.imagem)
      }

      await candidatoService.atualizarPerfil(candidatoId, formDataToSend)
      alert('Perfil atualizado com sucesso!')
      navigate('/candidato/dashboard')
    } catch (error) {
      console.error('Erro:', error)
      alert(error.data?.error || 'Erro ao atualizar perfil')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingScreen />
  }

  return (
    <AuthLayout title="Editar Perfil" backTo="/candidato/dashboard" showHelp={false}>
      <div className={styles.container}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Foto de Perfil */}
          <div className={styles.imageSection}>
            {previewImage && (
              <img src={previewImage} alt="Preview" className={styles.previewImage} />
            )}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Foto de Perfil</label>
              <input
                type="file"
                name="imagem"
                onChange={handleChange}
                className={styles.formInput}
                accept="image/*"
              />
              <span className={styles.formHelper}>Formatos aceitos: JPG, PNG, GIF</span>
            </div>
          </div>

          {/* Dados Básicos */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Dados Básicos</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nome*</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>CPF*</label>
                <input
                  type="text"
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleCPFChange}
                  className={styles.formInput}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Telefone*</label>
                <input
                  type="text"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handlePhoneChange}
                  className={styles.formInput}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          {/* Formação */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Formação</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Educação</label>
              <input
                type="text"
                name="educacao"
                value={formData.educacao}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Ex: Graduação em Administração"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Cursos</label>
              <textarea
                name="cursos"
                value={formData.cursos}
                onChange={handleChange}
                className={styles.formTextarea}
                placeholder="Liste seus cursos separados por vírgula"
                rows={3}
              />
            </div>
          </div>

          {/* Experiência */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Experiência</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Qualificações</label>
              <textarea
                name="qualificacao"
                value={formData.qualificacao}
                onChange={handleChange}
                className={styles.formTextarea}
                placeholder="Descreva suas qualificações profissionais"
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Habilidades Técnicas</label>
              <textarea
                name="habilidadesTecnicas"
                value={formData.habilidadesTecnicas}
                onChange={handleChange}
                className={styles.formTextarea}
                placeholder="Liste suas habilidades técnicas"
                rows={3}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Descrição</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                className={styles.formTextarea}
                placeholder="Fale um pouco sobre você"
                rows={4}
              />
            </div>
          </div>

          {/* Idiomas */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Idiomas</h3>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Idiomas</label>
              <input
                type="text"
                name="idiomas"
                value={formData.idiomas}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Ex: Português, Inglês, Espanhol"
              />
            </div>
          </div>

          {/* Botões */}
          <div className={styles.buttonGroup}>
            <button 
              type="button" 
              className={styles.buttonSecondary}
              onClick={() => navigate('/candidato/dashboard')}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className={styles.buttonPrimary}
              disabled={saving}
            >
              {saving ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
}

export default EditarPerfilCandidato
