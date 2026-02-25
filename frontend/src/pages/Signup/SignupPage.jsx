import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BiBriefcase, BiArrowBack, BiCheckCircle } from 'react-icons/bi';
import { candidatoService } from '../../services/candidatoService';
import { empresaService } from '../../services/empresaService';
import styles from './Signup.module.css';

export default function SignupPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const isEmployer = location.pathname.includes('empresa');
    const roleTitle = isEmployer ? 'Empresa' : 'Candidato';

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        senha: '',
        cpf: '',
        telefone: '',
        educacao: '',
        qualificacoes: '',
        cursos: '',
        habilidades: '',
        idiomas: '',
        imagem: null, // <--- NOVO
        cnpj: '',
        fone: '',
        bio: '',
        site: ''
    });

    const stepsCandidate = [
        { id: 1, title: 'Conta' },
        { id: 2, title: 'Pessoal' },
        { id: 3, title: 'Profissional' },
        { id: 4, title: 'Extra' }
    ];

    const stepsEmployer = [
        { id: 1, title: 'Conta' },
        { id: 2, title: 'Negócio' },
        { id: 3, title: 'Perfil' }
    ];

    const steps = isEmployer ? stepsEmployer : stepsCandidate;
    const totalSteps = steps.length;

    const formatCPF = (val) => {
        return val.replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
            .slice(0, 14);
    };

    const formatCNPJ = (val) => {
        return val.replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
            .slice(0, 18);
    };

    const formatPhone = (val) => {
        return val.replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
            setErrorMsg('');
            return;
        }

        let formattedValue = value;
        if (name === 'cpf') formattedValue = formatCPF(value);
        if (name === 'cnpj') formattedValue = formatCNPJ(value);
        if (name === 'telefone' || name === 'fone') formattedValue = formatPhone(value);

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
        setErrorMsg('');
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (currentStep < totalSteps) {
            setCurrentStep(prev => prev + 1);
        } else {
            submitForm();
        }
    };

    const handlePrev = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const submitForm = async () => {
        setLoading(true);
        setErrorMsg('');
        try {
            if (isEmployer) {
                await empresaService.cadastrar({
                    nome: formData.nome,
                    email: formData.email,
                    senha: formData.senha,
                    cnpj: formData.cnpj,
                    fone: formData.fone,
                    bio: formData.bio,
                    site: formData.site
                });
            } else {
                const payload = new FormData();
                Object.keys(formData).forEach(key => {
                    if (formData[key] !== null && formData[key] !== '') {
                        payload.append(key, formData[key]);
                    }
                });
                await candidatoService.cadastrar(payload);
            }
            navigate('/login?cadastro=sucesso');
        } catch (error) {
            console.error('Erro no cadastro:', error);
            setErrorMsg(error.data?.error || error.message || 'Erro ao realizar o cadastro. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        if (currentStep === 1) {
            return (
                <div className={styles.stepContent}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Nome {isEmployer ? 'da Empresa' : 'Completo'} *</label>
                        <input type="text" name="nome" value={formData.nome} onChange={handleChange} required className={styles.input} placeholder={isEmployer ? "Razão Social ou Nome Fantasia" : "Seu nome completo"} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>E-mail *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className={styles.input} placeholder="seu@email.com" />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Senha *</label>
                        <input type="password" name="senha" value={formData.senha} onChange={handleChange} required minLength={8} className={styles.input} placeholder="Mínimo de 8 caracteres" />
                        <span className={styles.hint}>Use letras, números e símbolos.</span>
                    </div>
                </div>
            );
        }

        if (currentStep === 2) {
            return (
                <div className={styles.stepContent}>

                    {!isEmployer && (
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Foto de Perfil (Opcional)</label>
                            <input
                                type="file"
                                name="imagem"
                                accept="image/*"
                                onChange={handleChange}
                                className={styles.fileInput}
                            />
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>{isEmployer ? 'CNPJ *' : 'CPF *'}</label>
                        <input type="text" name={isEmployer ? "cnpj" : "cpf"} value={isEmployer ? formData.cnpj : formData.cpf} onChange={handleChange} required className={styles.input} placeholder={isEmployer ? "00.000.000/0000-00" : "000.000.000-00"} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Telefone *</label>
                        <input type="text" name={isEmployer ? "fone" : "telefone"} value={isEmployer ? formData.fone : formData.telefone} onChange={handleChange} required className={styles.input} placeholder="(00) 00000-0000" />
                    </div>
                </div>
            );
        }

        if (currentStep === 3) {
            if (isEmployer) {
                return (
                    <div className={styles.stepContent}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Site da Empresa</label>
                            {/* CAMPO CORRIGIDO: TYPE="TEXT" NO LUGAR DE "URL" */}
                            <input type="text" name="site" value={formData.site} onChange={handleChange} className={styles.input} placeholder="www.suaempresa.com.br" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Sobre a Empresa (Bio)</label>
                            <textarea name="bio" value={formData.bio} onChange={handleChange} className={styles.textarea} placeholder="Conte um pouco sobre o que vocês fazem..." maxLength={500} rows={4} />
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className={styles.stepContent}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Escolaridade *</label>
                            <select name="educacao" value={formData.educacao} onChange={handleChange} required className={styles.input}>
                                <option value="" disabled>Selecione seu grau de instrução</option>
                                <option value="Ensino Médio Incompleto">Ensino Médio Incompleto</option>
                                <option value="Ensino Médio Completo">Ensino Médio Completo</option>
                                <option value="Ensino Superior Incompleto">Ensino Superior Incompleto</option>
                                <option value="Ensino Superior Completo">Ensino Superior Completo</option>
                                <option value="Pós-graduação/Mestrado">Pós-graduação / Mestrado</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Cargo / Qualificação</label>
                            <input type="text" name="qualificacoes" value={formData.qualificacoes} onChange={handleChange} className={styles.input} placeholder="Sua principal ocupação" />
                        </div>
                    </div>
                );
            }
        }

        if (currentStep === 4 && !isEmployer) {
            return (
                <div className={styles.stepContent}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Habilidades Técnicas</label>
                        <input type="text" name="habilidades" value={formData.habilidades} onChange={handleChange} className={styles.input} placeholder="Ex: React, Node.js, Excel (Separados por vírgula)" />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Idiomas</label>
                        <input type="text" name="idiomas" value={formData.idiomas} onChange={handleChange} className={styles.input} placeholder="Ex: Inglês Avançado, Espanhol Básico" />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Cursos Extracurriculares</label>
                        <input type="text" name="cursos" value={formData.cursos} onChange={handleChange} className={styles.input} placeholder="Ex: Curso de Lógica, Certificação Scrum" />
                    </div>
                </div>
            );
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <header className={styles.header}>
                <div className={styles.headerContainer}>
                    <Link to="/" className={styles.logoGroup}>
                        <BiBriefcase className={styles.logoIcon} />
                        <span className={styles.logoText}>JobFinder</span>
                    </Link>
                    <Link to="/" className={styles.backLink}>
                        <BiArrowBack /> Voltar
                    </Link>
                </div>
            </header>

            <div className={styles.contentWrapper}>
                <div className={styles.formContainer}>

                    <div className={styles.textCenter}>
                        <h1 className={styles.pageTitle}>Criar conta de {roleTitle}</h1>
                        <p className={styles.pageSubtitle}>Preencha os dados abaixo para começar a usar a plataforma.</p>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.progressContainer}>
                            <div className={styles.progressBarBackground}>
                                <div
                                    className={styles.progressBarFill}
                                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                                ></div>
                            </div>
                            <div className={styles.stepsRow}>
                                {steps.map((step) => {
                                    const isCompleted = currentStep > step.id;
                                    const isActive = currentStep === step.id;
                                    return (
                                        <div key={step.id} className={styles.stepIndicator}>
                                            <div className={`${styles.stepCircle} ${isActive ? styles.stepActive : ''} ${isCompleted ? styles.stepCompleted : ''}`}>
                                                {isCompleted ? <BiCheckCircle size={18} /> : step.id}
                                            </div>
                                            <span className={`${styles.stepTitle} ${isActive || isCompleted ? styles.textDark : ''}`}>
                        {step.title}
                      </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className={styles.cardContent}>
                            {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

                            <form onSubmit={handleNext} className={styles.form}>
                                {renderStepContent()}

                                <div className={styles.formFooter}>
                                    {currentStep > 1 ? (
                                        <button type="button" className={styles.btnOutline} onClick={handlePrev} disabled={loading}>
                                            Voltar
                                        </button>
                                    ) : (
                                        <div></div>
                                    )}

                                    <button type="submit" className={styles.btnPrimary} disabled={loading}>
                                        {loading ? 'Processando...' : (currentStep === totalSteps ? 'Finalizar Cadastro' : 'Próximo Passo')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    <div className={styles.footerLink}>
                        Já tem uma conta? <Link to="/login">Faça Login</Link>
                    </div>

                </div>
            </div>
        </div>
    );
}