import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { BiBriefcase, BiArrowBack } from 'react-icons/bi'
import { empresaService } from '../../services/empresaService'
import styles from './RegistroEmpresa.module.css'

export default function RegistroEmpresa() {
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
    { number: 1, label: 'Básico' },
    { number: 2, label: 'Contato' },
    { number: 3, label: 'Detalhes' },
    { number: 4, label: 'Acesso' }
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await empresaService.cadastrar(formData)
      navigate('/login?cadastro=sucesso')
    } catch (error) {
      console.error('Erro:', error)
      alert(error.data?.message || 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className={styles.pageWrapper}>
        <header className={styles.header}>
          <div className={styles.headerContainer}>
            <Link to="/" className={styles.logoGroup}>
              <BiBriefcase className={styles.logoIcon} />
              <span className={styles.logoText}>JobFinder</span>
            </Link>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          <div className={styles.formContainer}>

            <div className={styles.textCenter}>
              <h1 className={styles.pageTitle}>Cadastro de Empresa</h1>
              <p className={styles.pageSubtitle}>Encontre os melhores talentos para sua equipe</p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <button onClick={() => navigate(-1)} className={styles.backButton}>
                  <BiArrowBack size={20} />
                </button>
                <div>
                  <h2 className={styles.cardTitle}>Etapa {currentStep} de 4</h2>
                  <p className={styles.cardDescription}>Preencha os dados da sua empresa</p>
                </div>
              </div>

              <div className={styles.cardContent}>
                <div className={styles.progressContainer}>
                  {steps.map((step) => (
                      <div key={step.number} className={styles.progressStepWrapper}>
                        <div className={`${styles.progressCircle} ${currentStep >= step.number ? styles.activeCircle : ''}`}>
                          {step.number}
                        </div>
                        {step.number < 4 && (
                            <div className={`${styles.progressLine} ${currentStep > step.number ? styles.activeLine : ''}`} />
                        )}
                      </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>

                  {currentStep === 1 && (
                      <div className={styles.stepContent}>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Nome da Empresa *</label>
                          <input
                              type="text"
                              name="nome"
                              value={formData.nome}
                              onChange={handleChange}
                              className={styles.input}
                              placeholder="Sua empresa"
                              required
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>CNPJ *</label>
                          <input
                              type="text"
                              name="cnpj"
                              value={formData.cnpj}
                              onChange={handleCNPJChange}
                              className={styles.input}
                              placeholder="00.000.000/0000-00"
                              maxLength={18}
                              required
                          />
                        </div>
                        <button type="button" className={styles.btnPrimary} onClick={nextStep}>
                          Continuar
                        </button>
                      </div>
                  )}

                  {currentStep === 2 && (
                      <div className={styles.stepContent}>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Telefone Comercial *</label>
                          <input
                              type="tel"
                              name="fone"
                              value={formData.fone}
                              onChange={handlePhoneChange}
                              className={styles.input}
                              placeholder="(00) 00000-0000"
                              required
                          />
                        </div>
                        <div className={styles.buttonGroup}>
                          <button type="button" className={styles.btnOutline} onClick={prevStep}>Voltar</button>
                          <button type="button" className={styles.btnPrimary} onClick={nextStep}>Continuar</button>
                        </div>
                      </div>
                  )}

                  {currentStep === 3 && (
                      <div className={styles.stepContent}>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Site da Empresa</label>
                          <input
                              type="url"
                              name="site"
                              value={formData.site}
                              onChange={handleChange}
                              className={styles.input}
                              placeholder="https://www.suaempresa.com"
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Bio da Empresa</label>
                          <textarea
                              name="bio"
                              value={formData.bio}
                              onChange={handleChange}
                              className={styles.textarea}
                              placeholder="Descreva brevemente sua empresa..."
                              rows={3}
                          />
                        </div>
                        <div className={styles.buttonGroup}>
                          <button type="button" className={styles.btnOutline} onClick={prevStep}>Voltar</button>
                          <button type="button" className={styles.btnPrimary} onClick={nextStep}>Continuar</button>
                        </div>
                      </div>
                  )}

                  {currentStep === 4 && (
                      <div className={styles.stepContent}>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>E-mail de Acesso *</label>
                          <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              className={styles.input}
                              placeholder="seu@email.com"
                              required
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Senha *</label>
                          <input
                              type="password"
                              name="senha"
                              value={formData.senha}
                              onChange={handleChange}
                              className={styles.input}
                              placeholder="Crie uma senha forte"
                              minLength={8}
                              required
                          />
                        </div>

                        <div className={styles.termsGroup}>
                          <input type="checkbox" required className={styles.checkbox} />
                          <span className={styles.termsText}>
                        Concordo com os <a href="#">Termos de Serviço</a> e <a href="#">Política de Privacidade</a>
                      </span>
                        </div>

                        <div className={styles.buttonGroup}>
                          <button type="button" className={styles.btnOutline} onClick={prevStep}>Voltar</button>
                          <button type="submit" className={styles.btnPrimary} disabled={loading}>
                            {loading ? 'Criando Conta...' : 'Criar Conta'}
                          </button>
                        </div>
                      </div>
                  )}
                </form>

                <div className={styles.footerLink}>
                  Já tem uma conta? <Link to="/login">Fazer login</Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
  )
}