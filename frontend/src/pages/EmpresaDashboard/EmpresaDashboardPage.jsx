import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  BiBriefcase,
  BiGroup,
  BiTrendingUp,
  BiArchive,
  BiPlus,
  BiRightArrowAlt,
  BiUser
} from 'react-icons/bi'
import DashboardLayout from '../../components/Layout/DashboardLayout/DashboardLayout'
import VagasModal from '../../features/vagas/VagasModal/VagasModal'
import CriarVagaModal from '../../features/vagas/CriarVagaModal/CriarVagaModal'
import PerfilEmpresaModal from '../../features/empresa/PerfilEmpresaModal/PerfilEmpresaModal'
import { empresaService } from '../../services/empresaService'
import { useAuth } from '../../contexts/AuthContext'
import LoadingScreen from '../../components/ui/LoadingScreen/LoadingScreen'
import styles from './EmpresaDashboard.module.css'

export default function EmpresaDashboard() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user, isAuthenticated, logout } = useAuth()

  // Estados Reais da API
  const [empresa, setEmpresa] = useState(null)
  const [candidatos, setCandidatos] = useState([])
  const [vagas, setVagas] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  // Controle de Modais (Preservando a arquitetura original)
  const [showVagasModal, setShowVagasModal] = useState(false)
  const [showCriarVagaModal, setShowCriarVagaModal] = useState(false)
  const [showPerfilModal, setShowPerfilModal] = useState(false)

  useEffect(() => {
    const modalToOpen = searchParams.get('open');
    if (modalToOpen === 'criarVaga') {
      setShowCriarVagaModal(true);
      setSearchParams({});

    } else if (modalToOpen === 'vagas') {
      setShowVagasModal(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const fetchDashboardData = useCallback(async () => {
    if (!user || !isAuthenticated) return;

    try {
      setFetchError(false)
      const data = await empresaService.getDashboard()

      setEmpresa(data.empresa)
      setVagas(data.vagas || [])

      // Busca os candidatos reais da API
      const candidatosData = await empresaService.buscarCandidatos('')
      setCandidatos(candidatosData.candidatos || [])

    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
      setFetchError(true)

      if (error.status === 401 || error.message?.includes('401')) {
        await logout();
      }
    } finally {
      setLoading(false)
    }
  }, [user, isAuthenticated, logout])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  if (loading) {
    return <LoadingScreen />
  }

  // Cálculos baseados em dados reais
  const vagasAtivas = vagas.filter(v => v.status !== 'Fechada' && v.status !== 'Encerrada')
  const viewsDoPerfil = empresa?.visualizacoes || 0

  return (
      <DashboardLayout
          userType="employer"
          onOpenCriarVaga={() => setShowCriarVagaModal(true)}
          onOpenVagas={() => setShowVagasModal(true)}
      >
        <div className={styles.container}>
          {fetchError || !empresa ? (
              <div className={styles.errorState}>
                <h2>Não foi possível carregar os dados da empresa.</h2>
                <p>Tente recarregar a página ou faça login novamente.</p>
                <button className={styles.btnPrimary} onClick={() => window.location.reload()}>
                  Recarregar Página
                </button>
              </div>
          ) : (
              <>
                {/* Header de Boas-vindas */}
                <header className={styles.header}>
                  <h1 className={styles.title}>Bem-vindo de volta, {empresa.nome || 'Empresa'}!</h1>
                  <p className={styles.subtitle}>Aqui está uma visão geral da sua atividade de contratação.</p>
                </header>

                {/* Grid de Estatísticas */}
                <div className={styles.statsGrid}>
                  <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                      <span className={styles.statLabel}>Vagas Ativas</span>
                      <BiBriefcase className={styles.statIcon} color="#94a3b8" />
                    </div>
                    <div className={styles.statValue}>{vagasAtivas.length}</div>
                    <p className={styles.statDescription}>Atualmente abertas</p>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                      <span className={styles.statLabel}>Total de Vagas</span>
                      <BiGroup className={styles.statIcon} color="#3b82f6" />
                    </div>
                    <div className={styles.statValue}>{vagas.length}</div>
                    <p className={styles.statDescription}>Histórico completo</p>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                      <span className={styles.statLabel}>Candidatos</span>
                      <BiTrendingUp className={styles.statIcon} color="#22c55e" />
                    </div>
                    <div className={styles.statValue}>{candidatos.length}</div>
                    <p className={styles.statDescription}>No seu banco de talentos</p>
                  </div>

                  <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                      <span className={styles.statLabel}>Vagas Encerradas</span>
                      <div className={`${styles.statIcon} ${styles.iconPurple}`}>
                        <BiArchive size={24} />
                      </div>
                    </div>
                    <div className={styles.statInfo}>
                      <h3 className={styles.statValue}>
                        {vagas.filter(v => v.status === 'Fechada').length}
                      </h3>
                    </div>
                    <p className={styles.statDescription}>Histórico completo</p>
                  </div>
                </div>

                {/* Layout Principal: Listas e Ações */}
                <div className={styles.mainGrid}>

                  {/* Vagas Ativas (Ocupa 2 colunas no Desktop) */}
                  <div className={styles.jobsSection}>
                    <div className={styles.card}>
                      <div className={styles.cardHeader}>
                        <div>
                          <h2 className={styles.cardTitle}>Vagas Ativas</h2>
                          <p className={styles.cardSubtitle}>Suas vagas tualmente abertas</p>
                        </div>
                        <button
                            className={styles.btnGhost}
                            onClick={() => navigate('/empresa/vagas')}
                        >
                          Ver Todas <BiRightArrowAlt size={20} />
                        </button>
                      </div>

                      <div className={styles.cardBody}>
                        {vagasAtivas.length === 0 ? (
                            <p className={styles.emptyState}>Você não possui vagas ativas no momento.</p>
                        ) : (
                            vagasAtivas.slice(0, 3).map((vaga) => (
                                <div key={vaga._id} className={styles.jobItem}>
                                  <div className={styles.jobInfo}>
                                    <div>
                                      {/* CORREÇÃO AQUI: Usando vaga.nome e vaga.area */}
                                      <h3 className={styles.jobTitle}>{vaga.nome}</h3>
                                      <p className={styles.jobLocation}>{vaga.area}</p>
                                    </div>
                                    <span className={styles.statusBadge}>
                                      {vaga.status || 'Aberta'}
                                    </span>
                                  </div>
                                  <div className={styles.jobMeta}>
                                    <span className={styles.jobDate}>
                                      Publicado em {new Date(vaga.createdAt || Date.now()).toLocaleDateString('pt-BR')}
                                    </span>
                                  </div>
                                </div>
                            ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ações Rápidas e Candidatos Recentes (Ocupa 1 coluna) */}
                  <div className={styles.sideSection}>

                    {/* Ações Rápidas integradas aos Modais existentes */}
                    <div className={styles.card}>
                      <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Ações Rápidas</h2>
                      </div>
                      <div className={styles.actionButtons}>
                        <button
                            className={`${styles.actionBtn} ${styles.btnGreen}`}
                            onClick={() => setShowCriarVagaModal(true)}
                        >
                          <BiPlus size={18} /> Publicar Nova Vaga
                        </button>

                        <button
                            className={styles.actionBtnOutline}
                            onClick={() => navigate('/empresa/candidatos/buscar')}
                        >
                          <BiGroup size={18} /> Banco de Candidatos
                        </button>

                        <button
                            className={styles.actionBtnOutline}
                            onClick={() => navigate('/empresa/vagas')}
                        >
                          <BiBriefcase size={18} /> Gerenciar Vagas
                        </button>

                        <button
                            className={styles.actionBtnOutline}
                            onClick={() => setShowPerfilModal(true)}
                        >
                          <BiUser size={18} /> Editar Perfil da Empresa
                        </button>
                      </div>
                    </div>

                    {/* Candidatos Recentes */}
                    <div className={styles.card}>
                      <div className={styles.cardHeader}>
                        <h2 className={styles.cardTitle}>Candidatos Recentes</h2>
                      </div>
                      <div className={styles.cardBody}>
                        {candidatos.length === 0 ? (
                            <p className={styles.emptyState}>Nenhum candidato recente.</p>
                        ) : (
                            candidatos.slice(0, 3).map((candidato) => {
                                // Mesma lógica de validação dupla
                                const imgSrc = typeof candidato.imagem === 'string'
                                    ? candidato.imagem
                                    : (candidato.imagem?.data ? `data:${candidato.imagem.contentType};base64,${candidato.imagem.data}` : null);

                                return (
                                    <div key={candidato._id} className={styles.candidateItem}>
                                      <div className={styles.candidateAvatar}>
                                        {imgSrc ? (
                                            <img
                                                src={imgSrc}
                                                alt={`Foto de ${candidato.nome}`}
                                                style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            candidato.nome ? candidato.nome.charAt(0).toUpperCase() : 'C'
                                        )}
                                      </div>

                                      <div className={styles.candidateInfo}>
                                        <p className={styles.candidateName}>{candidato.nome}</p>
                                        <p className={styles.candidateRole}>{candidato.profissao || 'Candidato'}</p>
                                      </div>
                                    </div>
                                );
                              })
                        )}

                        <button
                            className={styles.btnGhostFull}
                            onClick={() => navigate('/empresa/candidatos/buscar')}
                        >
                          Ver Todos
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </>
          )}
        </div>

        {/* Renderização Condicional dos Modais */}
        {showVagasModal && (
            <VagasModal
                vagas={vagas}
                onClose={() => setShowVagasModal(false)}
            />
        )}

        {showCriarVagaModal && (
            <CriarVagaModal
                empresaId={empresa?._id}
                onClose={() => setShowCriarVagaModal(false)}
                onSuccess={(novaVaga) => {
                  setVagas([...vagas, novaVaga]);
                  setShowCriarVagaModal(false);
                  fetchDashboardData();
                }}
            />
        )}

        {showPerfilModal && (
            <PerfilEmpresaModal
                empresa={empresa}
                empresaId={empresa?._id}
                onClose={() => setShowPerfilModal(false)}
                onUpdate={fetchDashboardData}
            />
        )}
      </DashboardLayout>
  )
}