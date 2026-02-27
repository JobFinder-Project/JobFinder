import { useState, useEffect } from 'react';
import { BiMap, BiCalendar, BiBuilding, BiCheckCircle, BiFile } from 'react-icons/bi';
import DashboardLayout from '../../components/Layout/DashboardLayout/DashboardLayout';
import { candidatoService } from '../../services/candidatoService';
import LoadingScreen from '../../components/ui/LoadingScreen/LoadingScreen';
import VagaDetalhesModal from '../../features/vagas/VagaDetalhesModal/VagaDetalhesModal';
import Modal from '../../components/ui/Modal/Modal';
import styles from './MinhasCandidaturas.module.css';

export default function MinhasCandidaturasPage() {
    const [candidaturas, setCandidaturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Todas');

    const [selectedCandidatura, setSelectedCandidatura] = useState(null);
    const [candidaturaToCancel, setCandidaturaToCancel] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isCanceling, setIsCanceling] = useState(false);

    useEffect(() => {
        fetchCandidaturas();
    }, []);

    const fetchCandidaturas = async () => {
        try {
            const data = await candidatoService.getCandidaturas();
            setCandidaturas(data.candidaturas || []);
        } catch (error) {
            console.error('Erro ao carregar candidaturas:', error);
        } finally {
            setLoading(false);
        }
    };

    const isApproved = (s) => ['aceito', 'aceita', 'aprovado', 'aprovada'].includes(s?.toLowerCase());
    const isPending = (s) => s?.toLowerCase().includes('pendente');
    const isRejected = (s) => ['rejeitado', 'rejeitada', 'cancelado', 'cancelada'].includes(s?.toLowerCase());

    const filteredCandidaturas = candidaturas.filter(app => {
        if (activeTab === 'Todas') return true;
        if (activeTab === 'Pendente') return isPending(app.status);
        if (activeTab === 'Aprovado') return isApproved(app.status);
        if (activeTab === 'Rejeitado') return isRejected(app.status);
        return true;
    });

    const countStatus = (type) => candidaturas.filter(app => {
        if (type === 'pendente') return isPending(app.status);
        if (type === 'aprovado') return isApproved(app.status);
        return false;
    }).length;

    const handleRequestCancel = (candidatura) => {
        setSelectedCandidatura(null);
        setCandidaturaToCancel(candidatura);
    };

    const confirmCancel = async () => {
        if (!candidaturaToCancel) return;
        setIsCanceling(true);
        try {
            await candidatoService.cancelarCandidatura(candidaturaToCancel._id);
            setCandidaturaToCancel(null);
            setShowSuccessModal(true); // Abre o Check verde
            fetchCandidaturas();
        } catch (error) {
            console.error('Erro ao cancelar:', error);
            alert('Erro ao cancelar candidatura. Tente novamente.');
        } finally {
            setIsCanceling(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Data não informada';
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const getStatusStyle = (status) => {
        if (isPending(status)) return styles.badgeWarning;
        if (isApproved(status)) return styles.badgeSuccess;
        if (isRejected(status)) return styles.badgeDanger;
        return styles.badgeNeutral;
    };

    if (loading) return <LoadingScreen />;

    return (
        <DashboardLayout userType="candidate">
            <div className={styles.container}>

                <div className={styles.header}>
                    <h1 className={styles.title}>Minhas Candidaturas</h1>
                    <p className={styles.subtitle}>Acompanhe o status dos seus processos seletivos.</p>
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>Total de Candidaturas</p>
                        <p className={styles.statValue}>{candidaturas.length}</p>
                    </div>
                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>Pendentes</p>
                        <p className={`${styles.statValue} ${styles.textWarning}`}>{countStatus('pendente')}</p>
                    </div>
                    <div className={styles.statCard}>
                        <p className={styles.statLabel}>Aprovadas</p>
                        <p className={`${styles.statValue} ${styles.textSuccess}`}>{countStatus('aprovado')}</p>
                    </div>
                </div>

                <div className={styles.tabsContainer}>
                    {['Todas', 'Pendente', 'Aprovado', 'Rejeitado'].map(tab => (
                        <button
                            key={tab}
                            className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {filteredCandidaturas.length > 0 ? (
                    <div className={styles.grid}>
                        {filteredCandidaturas.map((app) => (
                            <div key={app._id} className={styles.appCard}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.jobInfo}>
                                        <h3 className={styles.jobTitle}>{app.vaga?.nome}</h3>
                                        <p className={styles.companyName}>
                                            <BiBuilding size={16} /> {app.vaga?.empresa?.nome}
                                        </p>
                                    </div>
                                    <span className={`${styles.badge} ${getStatusStyle(app.status)}`}>
                    {app.status}
                  </span>
                                </div>

                                <div className={styles.cardBody}>
                                    {app.vaga?.localizacao && (
                                        <span className={styles.metaItem}>
                      <BiMap size={16} /> {app.vaga?.localizacao}
                    </span>
                                    )}
                                    <span className={styles.metaItem}>
                    <BiCalendar size={16} /> Candidatou-se em {formatDate(app.dataCandidatura)}
                  </span>
                                </div>

                                <div className={styles.cardFooter}>
                                    <button
                                        className={styles.btnOutline}
                                        onClick={() => setSelectedCandidatura(app)}
                                    >
                                        Ver Detalhes da Vaga
                                    </button>

                                    {isPending(app.status) && (
                                        <button
                                            className={styles.btnCancelText}
                                            onClick={() => handleRequestCancel(app)}
                                        >
                                            Cancelar Candidatura
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <BiFile size={48} className={styles.emptyIcon} />
                        <h3>Nenhuma candidatura encontrada</h3>
                        <p>Você não possui candidaturas com o status selecionado.</p>
                    </div>
                )}

            </div>

            {selectedCandidatura && (
                <VagaDetalhesModal
                    vaga={selectedCandidatura.vaga}
                    candidatura={selectedCandidatura} // Prop nova!
                    onClose={() => setSelectedCandidatura(null)}
                    onCancelRequest={handleRequestCancel} // Prop nova!
                />
            )}

            {candidaturaToCancel && (
                <Modal title="Cancelar Candidatura" onClose={() => !isCanceling && setCandidaturaToCancel(null)}>
                    <Modal.Body>
                        <div className={styles.modalContent}>
                            <h3 className={styles.modalTitle}>Você tem certeza?</h3>
                            <p className={styles.modalText}>
                                Deseja realmente cancelar sua candidatura para a vaga de <strong>{candidaturaToCancel.vaga?.nome}</strong>? Esta ação não pode ser desfeita.
                            </p>
                            <div className={styles.modalActions}>
                                <button
                                    className={styles.btnBack}
                                    onClick={() => setCandidaturaToCancel(null)}
                                    disabled={isCanceling}
                                >
                                    Voltar
                                </button>
                                <button
                                    className={styles.btnCancelConfirm}
                                    onClick={confirmCancel}
                                    disabled={isCanceling}
                                >
                                    {isCanceling ? 'Cancelando...' : 'Sim, cancelar'}
                                </button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            )}

            {showSuccessModal && (
                <Modal title="Sucesso" onClose={() => setShowSuccessModal(false)}>
                    <Modal.Body>
                        <div className={styles.modalContent}>
                            <BiCheckCircle size={64} className={styles.successIcon} />
                            <h3 className={styles.modalTitle}>Candidatura Cancelada</h3>
                            <p className={styles.modalText}>Sua candidatura foi cancelada com sucesso.</p>
                            <button className={styles.btnPrimary} onClick={() => setShowSuccessModal(false)}>
                                Entendi
                            </button>
                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </DashboardLayout>
    );
}