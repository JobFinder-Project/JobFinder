import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import NavbarEmpresa from '../../components/Navbar/NavbarEmpresa/NavbarEmpresa'
import CandidateCard from './components/CandidateCard/CandidateCard'
import VagasModal from './components/VagasModal/VagasModal'
import CriarVagaModal from './components/CriarVagaModal/CriarVagaModal'
import PerfilEmpresaModal from './components/PerfilEmpresaModal/PerfilEmpresaModal'
import { empresaService } from '../../services'
import styles from './EmpresaDashboard.module.css'

function EmpresaDashboard() {
  const navigate = useNavigate()
  const [empresa, setEmpresa] = useState(null)
  const [empresaId, setEmpresaId] = useState(null)
  const [candidatos, setCandidatos] = useState([])
  const [vagas, setVagas] = useState([])
  const [selectedTab, setSelectedTab] = useState('Todos')
  const [loading, setLoading] = useState(true)

  // Modais
  const [showVagasModal, setShowVagasModal] = useState(false)
  const [showCriarVagaModal, setShowCriarVagaModal] = useState(false)
  const [showPerfilModal, setShowPerfilModal] = useState(false)

  const tabs = ['Todos', 'Área de TI', 'Estoque', 'Caixa', 'Vendas']

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const data = await empresaService.getDashboard()
      setEmpresa(data.user)
      setEmpresaId(data.empresaId)
      setCandidatos(data.candidatos || [])
      setVagas(data.vagas || [])
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleVagaCriada = () => {
    setShowCriarVagaModal(false)
    fetchDashboardData()
  }

  const filteredCandidatos = selectedTab === 'Todos'
    ? candidatos
    : candidatos.filter((c) => c.area === selectedTab)

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className={styles.dashboardWrapper}>
      <NavbarEmpresa />

      <main className={styles.mainContent}>
        <div className={styles.categoryTabs}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${selectedTab === tab ? styles.active : ''}`}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.candidatesGrid}>
          {filteredCandidatos.length > 0 ? (
            filteredCandidatos.map((candidato) => (
              <CandidateCard key={candidato._id} candidato={candidato} />
            ))
          ) : (
            <p className={styles.noData}>Nenhum candidato encontrado.</p>
          )}
        </div>
      </main>

      {/* Navegação inferior */}
      <nav className={styles.bottomNav}>
        <button className={styles.navBtn} onClick={() => setShowVagasModal(true)}>
          <div className={styles.navIcon}>
            <svg width="36" height="36" fill="#fff" viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 15h-2v-2h2v2zm0-4h-2v-6h2v6z" />
            </svg>
          </div>
          <span>Vagas</span>
        </button>
        <button className={styles.navBtn} onClick={() => setShowCriarVagaModal(true)}>
          <div className={styles.navIcon}>
            <svg width="36" height="36" fill="#fff" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6h-6v-2h6v-6h2v6h6v2z" />
            </svg>
          </div>
          <span>Add Vagas</span>
        </button>
        <button className={styles.navBtn} onClick={() => setShowPerfilModal(true)}>
          <div className={styles.navIcon}>
            <svg width="36" height="36" fill="#fff" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
            </svg>
          </div>
          <span>Perfil</span>
        </button>
      </nav>

      {/* Modais */}
      {showVagasModal && (
        <VagasModal
          vagas={vagas}
          onClose={() => setShowVagasModal(false)}
        />
      )}

      {showCriarVagaModal && (
        <CriarVagaModal
          empresaId={empresaId}
          onClose={() => setShowCriarVagaModal(false)}
          onSuccess={handleVagaCriada}
        />
      )}

      {showPerfilModal && (
        <PerfilEmpresaModal
          empresa={empresa}
          empresaId={empresaId}
          onClose={() => setShowPerfilModal(false)}
          onUpdate={fetchDashboardData}
        />
      )}
    </div>
  )
}

export default EmpresaDashboard
