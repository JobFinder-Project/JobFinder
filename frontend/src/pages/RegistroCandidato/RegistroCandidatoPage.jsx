import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './RegistroCandidato.module.css'

function RegistroCandidato() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    imagem: null,
    cpf: '',
    educacao: '',
    qualificacoes: '',
    cursos: '',
    descricao: '',
    telefone: '',
    habilidades: '',
    idiomas: '',
    email: '',
    senha: ''
  })

  const steps = [
    { number: 1, label: 'Dados Básicos' },
    { number: 2, label: 'Formação' },
    { number: 3, label: 'Experiência' },
    { number: 4, label: 'Idiomas' },
    { number: 5, label: 'Finalizar' }
  ]

  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }))
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

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key])
        }
      })

      const response = await fetch('/api/candidato/cadastrar', {
        method: 'POST',
        body: formDataToSend
      })

      if (response.ok) {
        navigate('/login')
      } else {
        const data = await response.json()
        alert(data.message || 'Erro ao cadastrar')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.navigation}>
          <button 
            className={styles.backButton} 
            onClick={() => navigate('/cargo')}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        <div className={styles.logo}>Cadastro de Candidato</div>
        <button className={styles.helpButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
          </svg>
        </button>
      </header>

      <main className={styles.container}>
        <p className={styles.formDescription}>
          Preencha suas informações profissionais para criar seu perfil de candidato.
          Você poderá complementar as informações posteriormente.
        </p>

        <p className={styles.requiredNotice}>Campos com * são obrigatórios.</p>

        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            {steps.map((step) => (
              <div 
                key={step.number}
                className={`${styles.progressStep} ${currentStep >= step.number ? styles.active : ''} ${currentStep > step.number ? styles.completed : ''}`}
              >
                <div className={styles.stepCircle}>{step.number}</div>
                <div className={styles.stepLabel}>{step.label}</div>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Dados Básicos */}
          <div className={`${styles.stepContent} ${currentStep === 1 ? styles.active : ''}`}>
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
              <span className={styles.formHelper}>Digite apenas números</span>
            </div>

            <div className={styles.buttonGroup}>
              <button type="button" className={styles.buttonPrimary} onClick={nextStep}>
                Próximo
              </button>
            </div>
          </div>

          {/* Step 2: Formação */}
          <div className={`${styles.stepContent} ${currentStep === 2 ? styles.active : ''}`}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Educação*</label>
              <select
                name="educacao"
                value={formData.educacao}
                onChange={handleChange}
                className={styles.formInput}
                required
              >
                <option value="">Selecione seu nível de educação</option>
                <option value="medio">Ensino Médio</option>
                <option value="superior">Ensino Superior</option>
                <option value="pos">Pós-Graduação</option>
                <option value="mestrado">Mestrado</option>
                <option value="doutorado">Doutorado</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Qualificações*</label>
              <input
                type="text"
                name="qualificacoes"
                value={formData.qualificacoes}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Ex: Certificação PMP, CRM, etc."
                required
              />
            </div>

            <div className={styles.buttonGroup}>
              <button type="button" className={styles.buttonSecondary} onClick={prevStep}>
                Voltar
              </button>
              <button type="button" className={styles.buttonPrimary} onClick={nextStep}>
                Próximo
              </button>
            </div>
          </div>

          {/* Step 3: Experiência */}
          <div className={`${styles.stepContent} ${currentStep === 3 ? styles.active : ''}`}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Cursos</label>
              <input
                type="text"
                name="cursos"
                value={formData.cursos}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Ex: Curso de Inglês, Excel Avançado"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Descrição da Experiência</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Experiência em gestão de projetos, com foco em metodologias ágeis..."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Telefone*</label>
              <input
                type="tel"
                name="telefone"
                value={formData.telefone}
                onChange={handlePhoneChange}
                className={styles.formInput}
                placeholder="(00) 00000-0000"
                maxLength={15}
                required
              />
            </div>

            <div className={styles.buttonGroup}>
              <button type="button" className={styles.buttonSecondary} onClick={prevStep}>
                Voltar
              </button>
              <button type="button" className={styles.buttonPrimary} onClick={nextStep}>
                Próximo
              </button>
            </div>
          </div>

          {/* Step 4: Idiomas */}
          <div className={`${styles.stepContent} ${currentStep === 4 ? styles.active : ''}`}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Habilidades Técnicas</label>
              <input
                type="text"
                name="habilidades"
                value={formData.habilidades}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Ex: Python, JavaScript, Excel, Photoshop"
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Idiomas</label>
              <input
                type="text"
                name="idiomas"
                value={formData.idiomas}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Ex: Inglês - Avançado, Espanhol - Intermediário"
              />
            </div>

            <div className={styles.buttonGroup}>
              <button type="button" className={styles.buttonSecondary} onClick={prevStep}>
                Voltar
              </button>
              <button type="button" className={styles.buttonPrimary} onClick={nextStep}>
                Próximo
              </button>
            </div>
          </div>

          {/* Step 5: Finalizar */}
          <div className={`${styles.stepContent} ${currentStep === 5 ? styles.active : ''}`}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="seu.email@exemplo.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Senha*</label>
              <input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Mínimo 8 caracteres"
                minLength={8}
                required
              />
              <span className={styles.formHelper}>Mínimo 8 caracteres</span>
            </div>

            <div className={styles.buttonGroup}>
              <button type="button" className={styles.buttonSecondary} onClick={prevStep}>
                Voltar
              </button>
              <button type="submit" className={styles.buttonPrimary} disabled={loading}>
                {loading ? 'Cadastrando...' : 'Finalizar Cadastro'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

export default RegistroCandidato
