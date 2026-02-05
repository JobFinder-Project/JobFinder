import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLayout from '../../components/Layout/AuthLayout/AuthLayout'
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
    <AuthLayout title="Cadastro de Empresa" backTo="/cargo">
      <div className={styles.container}>
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
      </div>
    </AuthLayout>
  )
}

export default RegistroEmpresa
