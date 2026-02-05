import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { empresaService } from '../../services'
import styles from './RegistroEmpresa.module.css'

function RegistroEmpresa() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    fone: '',
    bio: '',
    site: '',
    email: '',
    senha: ''
  })

  const steps = [
    { number: 1, label: 'Dados Básicos' },
    { number: 2, label: 'Contato' },
    { number: 3, label: 'Detalhes' },
    { number: 4, label: 'Credenciais' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const formatCNPJ = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const formatPhone = (value) => {
    const numbers = value.replace(/\D/g, '')
    return numbers
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  const handleCNPJChange = (e) => {
    const formatted = formatCNPJ(e.target.value)
    setFormData(prev => ({ ...prev, cnpj: formatted }))
  }

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value)
    setFormData(prev => ({ ...prev, fone: formatted }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
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
      await empresaService.cadastrar(formData)
      navigate('/login')
    } catch (error) {
      console.error('Erro:', error)
      alert(error.data?.message || 'Erro ao cadastrar')
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
        <div className={styles.logo}>Cadastro de Empresa</div>
        <button className={styles.helpButton}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
          </svg>
        </button>
      </header>

      <main className={styles.container}>
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

        <p className={styles.formDescription}>
          Preencha as informações básicas da sua empresa para criar seu cadastro.
          Você poderá complementar as informações posteriormente.
        </p>

        <p className={styles.requiredNotice}>Campos com * são obrigatórios.</p>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Dados Básicos */}
          <div className={`${styles.stepContent} ${currentStep === 1 ? styles.active : ''}`}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Nome da Empresa*</label>
              <input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Digite o nome da sua empresa"
                required
              />
              {errors.nome && <span className={styles.errorMessage}>{errors.nome}</span>}
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>CNPJ*</label>
              <input
                type="text"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleCNPJChange}
                className={styles.formInput}
                placeholder="00.000.000/0000-00"
                required
              />
              <span className={styles.formHelper}>Digite apenas números</span>
              {errors.cnpj && <span className={styles.errorMessage}>{errors.cnpj}</span>}
            </div>

            <div className={styles.buttonGroup}>
              <button type="button" className={styles.buttonPrimary} onClick={nextStep}>
                Próximo
              </button>
            </div>
          </div>

          {/* Step 2: Contato */}
          <div className={`${styles.stepContent} ${currentStep === 2 ? styles.active : ''}`}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Telefone Comercial*</label>
              <input
                type="tel"
                name="fone"
                value={formData.fone}
                onChange={handlePhoneChange}
                className={styles.formInput}
                placeholder="(00) 00000-0000"
                required
              />
              {errors.fone && <span className={styles.errorMessage}>{errors.fone}</span>}
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

          {/* Step 3: Detalhes */}
          <div className={`${styles.stepContent} ${currentStep === 3 ? styles.active : ''}`}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Bio da Empresa</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="Descreva brevemente sua empresa..."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Site da Empresa</label>
              <input
                type="url"
                name="site"
                value={formData.site}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="https://www.suaempresa.com"
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

          {/* Step 4: Credenciais */}
          <div className={`${styles.stepContent} ${currentStep === 4 ? styles.active : ''}`}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.formInput}
                placeholder="email@suaempresa.com"
                required
              />
              {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
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
              {errors.senha && <span className={styles.errorMessage}>{errors.senha}</span>}
            </div>

            <div className={styles.buttonGroup}>
              <button type="button" className={styles.buttonSecondary} onClick={prevStep}>
                Voltar
              </button>
              <button type="submit" className={styles.buttonPrimary} disabled={loading}>
                {loading ? 'Cadastrando...' : 'Salvar Cadastro'}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  )
}

export default RegistroEmpresa
