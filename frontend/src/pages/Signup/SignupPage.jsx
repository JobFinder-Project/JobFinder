import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BiBriefcase, BiArrowBack, BiCheckCircle } from 'react-icons/bi';
import { candidatoService } from '../../services/candidatoService';
import { empresaService } from '../../services/empresaService';
import TagInput from '../../components/ui/TagInput/TagInput';
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
        site: '',
        aceiteTermosUso: false,
        aceitePoliticaPrivacidade: false,
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
        const { name, value, files, type, checked } = e.target;

        if (files) {
            setFormData(prev => ({ ...prev, [name]: files[0] }));
            setErrorMsg('');
            return;
        }

        let formattedValue = type === 'checkbox' ? checked : value;
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
                    site: formData.site,
                    aceiteTermosUso: formData.aceiteTermosUso,
                    aceitePoliticaPrivacidade: formData.aceitePoliticaPrivacidade,
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

    const calcularForcaSenha = (senha) => {
        if (!senha) return { score: 0, label: '', key: '' };
        const temMinimo = senha.length >= 8;
        const temNumero = /\d/.test(senha);
        const temMaiuscula = /[A-Z]/.test(senha);
        const temSimbolo = /[^A-Za-z0-9]/.test(senha);
        const criterios = [temMinimo, temNumero || temMaiuscula, temSimbolo].filter(Boolean).length;
        if (criterios <= 1) return { score: 1, label: 'Fraca', key: 'weak' };
        if (criterios === 2) return { score: 2, label: 'Média', key: 'fair' };
        return { score: 3, label: 'Forte', key: 'strong' };
    };

    const renderStepContent = () => {
        if (currentStep === 1) {
            const senhaForca = calcularForcaSenha(formData.senha);
            return (
                <div className={styles.stepContent}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="signup-field-1">Nome {isEmployer ? 'da Empresa' : 'Completo'} *</label>
                        <input id="signup-field-1" aria-describedby={errorMsg ? "signup-error" : undefined} aria-invalid={Boolean(errorMsg)} type="text" name="nome" value={formData.nome} onChange={handleChange} required className={styles.input} placeholder={isEmployer ? "Razão Social ou Nome Fantasia" : "Seu nome completo"} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="signup-field-2">E-mail *</label>
                        <input id="signup-field-2" aria-describedby={errorMsg ? "signup-error" : undefined} aria-invalid={Boolean(errorMsg)} type="email" name="email" value={formData.email} onChange={handleChange} required className={styles.input} placeholder="seu@email.com" />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="signup-field-3">Senha *</label>
                        <input id="signup-field-3" aria-describedby={errorMsg ? "signup-error" : undefined} aria-invalid={Boolean(errorMsg)} type="password" name="senha" value={formData.senha} onChange={handleChange} required minLength={8} className={styles.input} placeholder="Mínimo de 8 caracteres" />
                        {formData.senha && (
                            <div className={styles.passwordStrength}>
                                <div className={styles.strengthBar}>
                                    {[1, 2, 3].map(level => (
                                        <div
                                            key={level}
                                            className={`${styles.strengthSegment} ${senhaForca.score >= level ? `${styles.active} ${styles[senhaForca.key]}` : ''}`}
                                        />
                                    ))}
                                </div>
                                <span className={`${styles.strengthLabel} ${styles[senhaForca.key]}`}>
                                    {senhaForca.label}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (currentStep === 2) {
            return (
                <div className={styles.stepContent}>

                    {!isEmployer && (
                        <div className={styles.inputGroup}>
                            <label className={styles.label} htmlFor="signup-field-4">Foto de Perfil (Opcional)</label>
                            <input id="signup-field-4" aria-describedby={errorMsg ? "signup-error" : undefined} aria-invalid={Boolean(errorMsg)}
                                type="file"
                                name="imagem"
                                accept="image/*"
                                onChange={handleChange}
                                className={styles.fileInput}
                            />
                        </div>
                    )}

                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="signup-field-5">{isEmployer ? 'CNPJ *' : 'CPF *'}</label>
                        <input id="signup-field-5" aria-describedby={errorMsg ? "signup-error" : undefined} aria-invalid={Boolean(errorMsg)} type="text" name={isEmployer ? "cnpj" : "cpf"} value={isEmployer ? formData.cnpj : formData.cpf} onChange={handleChange} required className={styles.input} placeholder={isEmployer ? "00.000.000/0000-00" : "000.000.000-00"} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="signup-field-6">Telefone *</label>
                        <input id="signup-field-6" aria-describedby={errorMsg ? "signup-error" : undefined} aria-invalid={Boolean(errorMsg)} type="text" name={isEmployer ? "fone" : "telefone"} value={isEmployer ? formData.fone : formData.telefone} onChange={handleChange} required className={styles.input} placeholder="(00) 00000-0000" />
                    </div>
                </div>
            );
        }

        if (currentStep === 3) {
            if (isEmployer) {
                return (
                    <div className={styles.stepContent}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label} htmlFor="signup-field-7">Site da Empresa</label>
                            {/* CAMPO CORRIGIDO: TYPE="TEXT" NO LUGAR DE "URL" */}
                            <input id="signup-field-7" aria-describedby={errorMsg ? "signup-error" : undefined} aria-invalid={Boolean(errorMsg)} type="text" name="site" value={formData.site} onChange={handleChange} className={styles.input} placeholder="www.suaempresa.com.br" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label} htmlFor="signup-field-bio">Sobre a Empresa (Bio)</label>
                            <textarea id="signup-field-bio" aria-describedby={errorMsg ? "signup-error" : undefined} aria-invalid={Boolean(errorMsg)} name="bio" value={formData.bio} onChange={handleChange} className={styles.textarea} placeholder="Conte um pouco sobre o que vocês fazem..." maxLength={500} rows={4} />
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className={styles.stepContent}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label} htmlFor="signup-field-8">Escolaridade *</label>
                            <select id="signup-field-8" aria-describedby={errorMsg ? "signup-error" : undefined} aria-invalid={Boolean(errorMsg)} name="educacao" value={formData.educacao} onChange={handleChange} required className={styles.input}>
                                <option value="" disabled>Selecione seu grau de instrução</option>
                                <option value="Ensino Médio Incompleto">Ensino Médio Incompleto</option>
                                <option value="Ensino Médio Completo">Ensino Médio Completo</option>
                                <option value="Ensino Superior Incompleto">Ensino Superior Incompleto</option>
                                <option value="Ensino Superior Completo">Ensino Superior Completo</option>
                                <option value="Pós-graduação/Mestrado">Pós-graduação / Mestrado</option>
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label className={styles.label} htmlFor="signup-field-9">Cargo / Qualificação</label>
                            <input id="signup-field-9" aria-describedby={errorMsg ? "signup-error" : undefined} aria-invalid={Boolean(errorMsg)} type="text" name="qualificacoes" value={formData.qualificacoes} onChange={handleChange} className={styles.input} placeholder="Sua principal ocupação" />
                        </div>
                    </div>
                );
            }
        }

        if (currentStep === 4 && !isEmployer) {
            const handleTagChange = (field) => (newValue) => {
                setFormData(prev => ({ ...prev, [field]: newValue }));
                setErrorMsg('');
            };
            return (
                <div className={styles.stepContent}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="habilidades">Habilidades Técnicas</label>
                        <TagInput
                            id="habilidades"
                            value={formData.habilidades}
                            onChange={handleTagChange('habilidades')}
                            placeholder="Ex: React, Node.js... (Enter para adicionar)"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="idiomas">Idiomas</label>
                        <TagInput
                            id="idiomas"
                            value={formData.idiomas}
                            onChange={handleTagChange('idiomas')}
                            placeholder="Ex: Inglês Avançado... (Enter para adicionar)"
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label} htmlFor="cursos">Cursos Extracurriculares</label>
                        <TagInput
                            id="cursos"
                            value={formData.cursos}
                            onChange={handleTagChange('cursos')}
                            placeholder="Ex: Certificação Scrum... (Enter para adicionar)"
                        />
                    </div>
                </div>
            );
        }
    };

    const isLastStep = currentStep === totalSteps;
    const consentimentosAceitos =
        formData.aceiteTermosUso && formData.aceitePoliticaPrivacidade;

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

            <main id="main-content" tabIndex={-1} className={styles.contentWrapper}>
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
                            <div aria-live="polite" className="sr-only">Etapa {currentStep} de {totalSteps}: {steps[currentStep - 1].title}</div>
                            {errorMsg && <div id="signup-error" role="alert" className={styles.errorAlert}>{errorMsg}</div>}

                            <form onSubmit={handleNext} className={styles.form}>
                                <div key={currentStep}>{renderStepContent()}</div>

                                {isLastStep && (
                                    <div className={styles.consentBox}>
                                        <p className={styles.consentTitle}>Consentimentos obrigatórios</p>
                                        <label className={styles.consentOption}>
                                            <input
                                                type="checkbox"
                                                name="aceiteTermosUso"
                                                checked={formData.aceiteTermosUso}
                                                onChange={handleChange}
                                            />
                                            <span>
                                                Li e aceito os <Link to="/termos-de-uso" target="_blank" rel="noopener noreferrer">Termos de Uso</Link>.
                                            </span>
                                        </label>
                                        <label className={styles.consentOption}>
                                            <input
                                                type="checkbox"
                                                name="aceitePoliticaPrivacidade"
                                                checked={formData.aceitePoliticaPrivacidade}
                                                onChange={handleChange}
                                            />
                                            <span>
                                                Li e aceito a <Link to="/politica-de-privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</Link>.
                                            </span>
                                        </label>
                                    </div>
                                )}

                                <div className={styles.formFooter}>
                                    {currentStep > 1 ? (
                                        <button type="button" className={styles.btnOutline} onClick={handlePrev} disabled={loading}>
                                            Voltar
                                        </button>
                                    ) : (
                                        <div></div>
                                    )}

                                    <button
                                        type="submit"
                                        className={styles.btnPrimary}
                                        disabled={loading || (isLastStep && !consentimentosAceitos)}
                                    >
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
            </main>
        </div>
    );
}
