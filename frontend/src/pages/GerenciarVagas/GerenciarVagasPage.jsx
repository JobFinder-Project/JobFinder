import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BiSearch, BiFilterAlt, BiBriefcase, BiUser, BiCalendar, BiInfoCircle, BiPlus } from 'react-icons/bi'
import DashboardLayout from '../../components/Layout/DashboardLayout/DashboardLayout'
import Modal from '../../components/ui/Modal/Modal'
import CriarVagaModal from '../../features/vagas/CriarVagaModal/CriarVagaModal'
import { empresaService } from '../../services/empresaService'
import styles from './GerenciarVagas.module.css'

export default function GerenciarVagas() {
    const navigate = useNavigate()
    const [empresa, setEmpresa] = useState(null)
    const [vagas, setVagas] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const [vagaSelecionada, setVagaSelecionada] = useState(null)
    const [showCriarVagaModal, setShowCriarVagaModal] = useState(false)

    useEffect(() => {
        fetchVagas()
    }, [])

    const fetchVagas = async () => {
        setLoading(true)
        try {
            const data = await empresaService.getDashboard()
            setVagas(data.vagas || [])
            setEmpresa(data.empresa || null)
        } catch (error) {
            console.error('Erro ao buscar vagas:', error)
        } finally {
            setLoading(false)
        }
    }

    const vagasFiltradas = vagas.filter((vaga) => {
        const termo = searchTerm.toLowerCase()
        const matchBusca =
            (vaga.nome && vaga.nome.toLowerCase().includes(termo)) ||
            (vaga.area && vaga.area.toLowerCase().includes(termo))

        const statusVaga = vaga.status || 'Aberta'
        const matchStatus = statusFilter === 'all' || statusVaga === statusFilter

        return matchBusca && matchStatus
    })

    return (
        <DashboardLayout userType="employer">
            <div className={styles.container}>

                <div className={styles.pageHeader}>
                    <div>
                        <h1 className={styles.pageTitle}>Gerenciar Vagas</h1>
                        <p className={styles.pageSubtitle}>Acompanhe suas vagas abertas e visualize os candidatos interessados.</p>
                    </div>

                    <button
                        className={styles.btnPrimary}
                        onClick={() => setShowCriarVagaModal(true)}
                    >
                        <BiPlus size={18} /> Publicar Nova Vaga
                    </button>
                </div>

                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Total de Vagas</span>
                        <span className={styles.statValue}>{vagas.length}</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Ativas</span>
                        <span className={styles.statValueBlue}>
                            {vagas.filter(v => (v.status || 'Aberta') === 'Aberta').length}
                        </span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>Fechadas</span>
                        <span className={styles.statValueGray}>
                            {vagas.filter(v => v.status === 'Fechada').length}
                        </span>
                    </div>
                </div>

                <div className={styles.searchSection}>
                    <div className={styles.searchWrapper}>
                        <BiSearch className={styles.searchIcon} size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por título ou área..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                    </div>
                    <div className={styles.filterWrapper}>
                        <BiFilterAlt className={styles.filterIcon} size={20} />
                        <select
                            className={styles.selectFilter}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Todos os Status</option>
                            <option value="Aberta">Abertas</option>
                            <option value="Fechada">Fechadas</option>
                        </select>
                    </div>
                </div>

                <div className={styles.jobsList}>
                    {loading ? (
                        <div className={styles.emptyState}>Carregando vagas...</div>
                    ) : vagasFiltradas.length > 0 ? (
                        vagasFiltradas.map((vaga) => (
                            <div key={vaga._id} className={styles.jobCard}>

                                <div className={styles.jobCardHeader}>
                                    <div className={styles.jobMainInfo}>
                                        {vaga.imagem ? (
                                            <img src={vaga.imagem} alt={vaga.nome} className={styles.jobAvatar} />
                                        ) : (
                                            <div className={styles.jobAvatarPlaceholder}>
                                                <BiBriefcase size={24} />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className={styles.jobTitle}>{vaga.nome}</h3>
                                            <p className={styles.jobArea}>{vaga.area}</p>
                                        </div>
                                    </div>
                                    <span className={`${styles.badge} ${vaga.status === 'Fechada' ? styles.badgeGray : styles.badgeGreen}`}>
                                        {vaga.status || 'Aberta'}
                                    </span>
                                </div>

                                <div className={styles.jobCardBody}>
                                    <div className={styles.infoRow}>
                                        <BiCalendar size={18} className={styles.infoIcon} />
                                        <span>Publicada em: {new Date(vaga.createdAt || Date.now()).toLocaleDateString('pt-BR')}</span>
                                    </div>
                                </div>

                                <div className={styles.jobCardFooter}>
                                    <button
                                        className={styles.btnOutline}
                                        onClick={() => setVagaSelecionada(vaga)}
                                    >
                                        <BiInfoCircle size={18} /> Detalhes
                                    </button>
                                    <button
                                        className={styles.btnSecondary}
                                        onClick={() => navigate(`/empresa/candidaturas?vagaId=${vaga._id}`)}
                                    >
                                        <BiUser size={18} /> Ver Candidatos
                                    </button>
                                </div>

                            </div>
                        ))
                    ) : (
                        <div className={styles.emptyState}>
                            <BiBriefcase size={48} color="#cbd5e1" />
                            <h3>Nenhuma vaga encontrada</h3>
                            <p>Você ainda não publicou nenhuma vaga ou não encontrou resultados para a busca.</p>
                        </div>
                    )}
                </div>
            </div>

            {vagaSelecionada && (
                <Modal
                    title="Detalhes da Vaga"
                    onClose={() => setVagaSelecionada(null)}
                    size="lg"
                >
                    <Modal.Body>
                        <div className={styles.modalContent}>
                            {vagaSelecionada.imagem && (
                                <img
                                    src={vagaSelecionada.imagem}
                                    alt={vagaSelecionada.nome}
                                    className={styles.modalImage}
                                />
                            )}
                            <h2 className={styles.modalTitle}>{vagaSelecionada.nome}</h2>
                            <div className={styles.modalTags}>
                                <span className={styles.tag}>{vagaSelecionada.area}</span>
                                <span className={styles.tag}>{vagaSelecionada.status || 'Aberta'}</span>
                            </div>

                            <div className={styles.modalSection}>
                                <h4>Requisitos</h4>
                                <p>{vagaSelecionada.requisitos}</p>
                            </div>

                        </div>
                    </Modal.Body>
                </Modal>
            )}

            {showCriarVagaModal && (
                <CriarVagaModal
                    empresaId={empresa?._id}
                    onClose={() => setShowCriarVagaModal(false)}
                    onSuccess={(novaVaga) => {
                        setVagas([...vagas, novaVaga]);
                        setShowCriarVagaModal(false);
                        // Opcional: chamar fetchVagas() novamente se precisar de dados do backend atualizados
                    }}
                />
            )}

        </DashboardLayout>
    )
}