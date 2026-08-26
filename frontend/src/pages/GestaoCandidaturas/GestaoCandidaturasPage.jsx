import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
    BiTime, BiCheckCircle, BiXCircle, BiArrowBack, BiUser,
    BiChevronUp, BiChevronDown, BiEnvelope, BiPhone,
    BiBookOpen, BiCodeAlt, BiGlobe, BiCertification
} from 'react-icons/bi';
import DashboardLayout from '../../components/Layout/DashboardLayout/DashboardLayout';
import Modal from '../../components/ui/Modal/Modal';
import { empresaService } from '../../services/empresaService';
import styles from './GestaoCandidaturas.module.css';

export default function GestaoCandidaturas() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const vagaIdFilter = searchParams.get('vagaId');

    const [candidaturas, setCandidaturas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Controle das seções expansíveis (Acordeão)
    const [openSections, setOpenSections] = useState({
        pendentes: true,
        aceitas: true,
        rejeitadas: true
    });

    // Controle do Modal de Perfil
    const [selectedCandidato, setSelectedCandidato] = useState(null);

    useEffect(() => {
        fetchCandidaturas();
    }, []);

    const fetchCandidaturas = async () => {
        setLoading(true);
        try {
            const data = await empresaService.getCandidaturas();
            const lista = data.candidaturas || data || [];
            setCandidaturas(lista);
        } catch (error) {
            console.error('Erro ao buscar candidaturas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (candidaturaId, novoStatus) => {
        try {
            setCandidaturas(prev => prev.map(c =>
                c._id === candidaturaId ? { ...c, status: novoStatus } : c
            ));
            await empresaService.atualizarStatusCandidatura(candidaturaId, novoStatus);
        } catch (error) {
            console.error('Erro ao atualizar status:', error);
            alert('Falha ao atualizar o status. Tente novamente.');
            fetchCandidaturas();
        }
    };

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const candidaturasFiltradas = vagaIdFilter
        ? candidaturas.filter(c => c.vaga && c.vaga._id === vagaIdFilter)
        : candidaturas;

    const pendentes = candidaturasFiltradas.filter(c => c.status === 'Pendente');
    const aceitas = candidaturasFiltradas.filter(c => c.status === 'Aceita');
    const rejeitadas = candidaturasFiltradas.filter(c => c.status === 'Rejeitada');

    // Funções de formatação para o Modal
    const getImagemSrc = (imagem) => {
        if (!imagem) return null;
        if (typeof imagem === 'string') return imagem;
        if (imagem.data && imagem.contentType) return `data:${imagem.contentType};base64,${imagem.data}`;
        return null;
    };

    const parseList = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data.filter(item => item && typeof item === 'string' && item.trim() !== '');
        if (typeof data === 'string') return data.split(',').map(i => i.trim()).filter(i => i !== '');
        return [];
    };

    const renderCard = (candidatura) => {
        const candidato = candidatura.candidato;
        if (!candidato) return null;

        const imgSrc = getImagemSrc(candidato.imagem);

        return (
            <div key={candidatura._id} className={styles.candidateCard}>
                <div className={styles.cardHeader}>
                    <div className={styles.avatar}>
                        {imgSrc ? (
                            <img src={imgSrc} alt={candidato.nome} />
                        ) : (
                            <span>{candidato.nome ? candidato.nome.charAt(0).toUpperCase() : 'C'}</span>
                        )}
                    </div>
                    <div className={styles.candidateInfo}>
                        <h4 className={styles.candidateName} title={candidato.nome}>{candidato.nome}</h4>
                        <p className={styles.candidateRole}>{candidato.qualificacao || 'Candidato'}</p>
                    </div>
                </div>

                <div className={styles.jobInfo}>
                    <small>Vaga: <strong>{candidatura.vaga?.nome || 'Desconhecida'}</strong></small>
                    <small>Data: {new Date(candidatura.createdAt).toLocaleDateString('pt-BR')}</small>
                </div>

                <div className={styles.cardActions}>
                    <button
                        className={styles.btnViewProfile}
                        title="Ver Perfil Completo"
                        onClick={() => setSelectedCandidato(candidato)}
                    >
                        <BiUser size={16} /> Perfil
                    </button>

                    {/* ATUALIZADO: Adicionada a opção de voltar para pendente */}
                    <div className={styles.statusButtons}>
                        {candidatura.status !== 'Pendente' && (
                            <button
                                className={styles.btnPendente}
                                onClick={() => handleStatusChange(candidatura._id, 'Pendente')}
                                title="Mover para Pendentes"
                            >
                                <BiTime size={22} />
                            </button>
                        )}
                        {candidatura.status !== 'Rejeitada' && (
                            <button
                                className={styles.btnReject}
                                onClick={() => handleStatusChange(candidatura._id, 'Rejeitada')}
                                title="Rejeitar"
                            >
                                <BiXCircle size={22} />
                            </button>
                        )}
                        {candidatura.status !== 'Aceita' && (
                            <button
                                className={styles.btnAccept}
                                onClick={() => handleStatusChange(candidatura._id, 'Aceita')}
                                title="Aprovar"
                            >
                                <BiCheckCircle size={22} />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Variáveis para o Modal ativo
    let modalImgSrc, modalHabilidades, modalIdiomas, modalCursos, modalDescricao, modalQualificacao;
    if (selectedCandidato) {
        modalImgSrc = getImagemSrc(selectedCandidato.imagem);
        modalHabilidades = parseList(selectedCandidato.habilidadesTecnicas || selectedCandidato.habilidades);
        modalIdiomas = parseList(selectedCandidato.idiomas);
        modalCursos = parseList(selectedCandidato.cursos);
        modalDescricao = parseList(selectedCandidato.descricao).join('\n');
        modalQualificacao = selectedCandidato.qualificacoes || selectedCandidato.qualificacao;
        if (!modalQualificacao || modalQualificacao === 'undefined' || String(modalQualificacao).trim() === '') {
            modalQualificacao = 'Profissional';
        }
    }

    return (
        <DashboardLayout userType="employer">
            <div className={styles.container}>
                <div className={styles.pageHeader}>
                    {vagaIdFilter && (
                        <button className={styles.backButton} onClick={() => navigate('/empresa/vagas')}>
                            <BiArrowBack size={20} /> Voltar para Vagas
                        </button>
                    )}
                    <h1 className={styles.pageTitle}>Gestão de Candidaturas</h1>
                    <p className={styles.pageSubtitle}>
                        {vagaIdFilter ? 'Gerenciando inscritos para uma vaga específica.' : 'Acompanhe o funil de todas as suas vagas.'}
                    </p>
                </div>

                {loading ? (
                    <div className={styles.loadingState}>Carregando candidaturas...</div>
                ) : (
                    <div className={styles.sectionsContainer}>

                        {/* CAIXA: PENDENTES */}
                        <div className={`${styles.sectionBox} ${styles.boxPendente}`}>
                            <div className={styles.sectionHeader} onClick={() => toggleSection('pendentes')}>
                                {openSections.pendentes ? <BiChevronUp size={24} className={styles.chevronIcon} /> : <BiChevronDown size={24} className={styles.chevronIcon} />}
                                <div className={styles.headerTitleGroup}>
                                    <BiTime size={22} className={styles.iconPendente} />
                                    <h3>Novos / Pendentes</h3>
                                    <span className={styles.badge}>{pendentes.length}</span>
                                </div>
                            </div>
                            {openSections.pendentes && (
                                <div className={styles.sectionBody}>
                                    {pendentes.length > 0 ? pendentes.map(renderCard) : <p className={styles.emptyText}>Nenhum candidato pendente.</p>}
                                </div>
                            )}
                        </div>

                        {/* CAIXA: APROVADOS */}
                        <div className={`${styles.sectionBox} ${styles.boxAceita}`}>
                            <div className={styles.sectionHeader} onClick={() => toggleSection('aceitas')}>
                                {openSections.aceitas ? <BiChevronUp size={24} className={styles.chevronIcon} /> : <BiChevronDown size={24} className={styles.chevronIcon} />}
                                <div className={styles.headerTitleGroup}>
                                    <BiCheckCircle size={22} className={styles.iconAceita} />
                                    <h3>Aprovados</h3>
                                    <span className={styles.badge}>{aceitas.length}</span>
                                </div>
                            </div>
                            {openSections.aceitas && (
                                <div className={styles.sectionBody}>
                                    {aceitas.length > 0 ? aceitas.map(renderCard) : <p className={styles.emptyText}>Nenhum candidato aprovado ainda.</p>}
                                </div>
                            )}
                        </div>

                        {/* CAIXA: REJEITADOS */}
                        <div className={`${styles.sectionBox} ${styles.boxRejeitada}`}>
                            <div className={styles.sectionHeader} onClick={() => toggleSection('rejeitadas')}>
                                {openSections.rejeitadas ? <BiChevronUp size={24} className={styles.chevronIcon} /> : <BiChevronDown size={24} className={styles.chevronIcon} />}
                                <div className={styles.headerTitleGroup}>
                                    <BiXCircle size={22} className={styles.iconRejeitada} />
                                    <h3>Rejeitados</h3>
                                    <span className={styles.badge}>{rejeitadas.length}</span>
                                </div>
                            </div>
                            {openSections.rejeitadas && (
                                <div className={styles.sectionBody}>
                                    {rejeitadas.length > 0 ? rejeitadas.map(renderCard) : <p className={styles.emptyText}>Nenhum candidato rejeitado.</p>}
                                </div>
                            )}
                        </div>

                    </div>)}
            </div>

            {/* MODAL DE PERFIL DO CANDIDATO */}
            {selectedCandidato && (
                <Modal title="Perfil do Candidato" onClose={() => setSelectedCandidato(null)} size="lg">
                    <Modal.Body>
                        <div className={styles.modalContent}>
                            <div className={styles.modalHeader}>
                                {modalImgSrc ? (
                                    <img src={modalImgSrc} alt={selectedCandidato.nome} className={styles.modalAvatar} />
                                ) : (
                                    <div className={styles.modalAvatarPlaceholder}>
                                        {selectedCandidato.nome ? selectedCandidato.nome.charAt(0).toUpperCase() : 'C'}
                                    </div>
                                )}
                                <div className={styles.modalHeaderInfo}>
                                    <h2>{selectedCandidato.nome}</h2>
                                    <p className={styles.modalRole}>{modalQualificacao}</p>
                                </div>
                            </div>

                            <div className={styles.modalGrid}>
                                <div className={styles.contactItem}>
                                    <BiEnvelope size={20} className={styles.sectionIcon} />
                                    <span>{selectedCandidato.email || 'Email não informado'}</span>
                                </div>
                                <div className={styles.contactItem}>
                                    <BiPhone size={20} className={styles.sectionIcon} />
                                    <span>{selectedCandidato.telefone || 'Telefone não informado'}</span>
                                </div>
                            </div>

                            <hr className={styles.divider} />

                            <div className={styles.modalSection}>
                                <h3 className={styles.sectionTitle}><BiUser className={styles.sectionIcon} /> Sobre</h3>
                                {modalDescricao ? (
                                    <p className={styles.modalText}>{modalDescricao}</p>
                                ) : (
                                    <p className={styles.emptyText}>O candidato não adicionou uma descrição.</p>
                                )}
                            </div>

                            <div className={styles.modalSection}>
                                <h3 className={styles.sectionTitle}><BiBookOpen className={styles.sectionIcon} /> Nível de Escolaridade</h3>
                                <p className={styles.modalText} style={{ textTransform: 'capitalize' }}>
                                    {selectedCandidato.educacao || 'Não informado'}
                                </p>
                            </div>

                            <hr className={styles.divider} />

                            <div className={styles.modalGrid}>
                                <div className={styles.modalSection}>
                                    <h3 className={styles.sectionTitle}><BiCodeAlt className={styles.sectionIcon} /> Habilidades Técnicas</h3>
                                    {modalHabilidades.length > 0 ? (
                                        <div className={styles.modalTags}>
                                            {modalHabilidades.map((hab, idx) => (
                                                <span key={idx} className={styles.tagBlue}>{hab}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className={styles.emptyText}>Nenhuma habilidade cadastrada.</p>
                                    )}
                                </div>

                                <div className={styles.modalSection}>
                                    <h3 className={styles.sectionTitle}><BiGlobe className={styles.sectionIcon} /> Idiomas</h3>
                                    {modalIdiomas.length > 0 ? (
                                        <div className={styles.modalTags}>
                                            {modalIdiomas.map((idm, idx) => (
                                                <span key={idx} className={styles.tagGreen}>{idm}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className={styles.emptyText}>Nenhum idioma cadastrado.</p>
                                    )}
                                </div>

                                <div className={styles.modalSection} style={{ gridColumn: '1 / -1' }}>
                                    <h3 className={styles.sectionTitle}><BiCertification className={styles.sectionIcon} /> Cursos / Certificações</h3>
                                    {modalCursos.length > 0 ? (
                                        <ul className={styles.modalList}>
                                            {modalCursos.map((curso, idx) => (
                                                <li key={idx}>{curso}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className={styles.emptyText}>Nenhum curso extra cadastrado.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            )}

        </DashboardLayout>
    );
}