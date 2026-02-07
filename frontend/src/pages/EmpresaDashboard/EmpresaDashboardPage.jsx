import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { BiInfoCircle, BiPlus, BiUser } from 'react-icons/bi'
import Navbar from '../../components/Navbar/Navbar'
import CandidateCard from '../../features/candidato/CandidateCard'
import VagasModal from '../../features/vagas/VagasModal/VagasModal' 
import CriarVagaModal from '../../features/vagas/CriarVagaModal/CriarVagaModal'
import PerfilEmpresaModal from '../../features/empresa/PerfilEmpresaModal/PerfilEmpresaModal'
import { empresaService } from '../../services'
import { useAuth } from '../../contexts/AuthContext'
import LoadingScreen from '../../components/ui/LoadingScreen/LoadingScreen'
import styles from './EmpresaDashboard.module.css'

function EmpresaDashboard() {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuth()

  const [empresa, setEmpresa] = useState(null)
  const [candidatos, setCandidatos] = useState([])
  const [vagas, setVagas] = useState([])
  const [selectedTab, setSelectedTab] = useState('Todos')
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false) 

  // Modais
  const [showVagasModal, setShowVagasModal] = useState(false)
  const [showCriarVagaModal, setShowCriarVagaModal] = useState(false)
  const [showPerfilModal, setShowPerfilModal] = useState(false)

  const tabs = ['Todos', 'Área de TI', 'Estoque', 'Caixa', 'Vendas', 'Limpeza']

  const fetchDashboardData = useCallback(async () => {
    if (!user || !isAuthenticated) return;

    try {
      setFetchError(false) 
      const data = await empresaService.getDashboard()
      
      setEmpresa(data.empresa)
      setVagas(data.vagas || [])
      
      // Busca candidatos
      const candidatosData = await empresaService.buscarCandidatos('')
      setCandidatos(candidatosData.candidatos || [])
      
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
      setFetchError(true) // Marca que deu erro
      
      if (error.status === 401 || error.message.includes('401')) {
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

  
  return (
    <div className={styles.dashboardWrapper}>
      <Navbar />
      
      <main className={styles.mainContent}>
        
        {fetchError || !empresa ? (
          <div className={styles.noData}>
            <h2>Não foi possível carregar os dados da empresa.</h2>
            <p>Tente recarregar a página ou faça login novamente.</p>
            <button 
                onClick={() => window.location.reload()} 
                style={{marginTop: '20px', padding: '10px 20px', cursor: 'pointer'}}
            >
                Recarregar Página
            </button>
          </div>
        ) : (
          <>

            <div className={styles.tabsContainer}>
              {tabs.map(tab => (
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
              {candidatos.length > 0 ? (
                candidatos.map(candidato => (
                  <CandidateCard key={candidato._id} candidato={candidato} />
                ))
              ) : (
                <div className={styles.noData}>Nenhum candidato encontrado.</div>
              )}
            </div>
          </>
        )}
      </main>

      {empresa && (
        <nav className={styles.bottomNav}>
            <button className={styles.navBtn} onClick={() => setShowVagasModal(true)}>
            <div className={styles.navIcon}>
                <BiInfoCircle size={36} color="#fff" />
            </div>
            <span>Vagas</span>
            </button>
            <button className={styles.navBtn} onClick={() => setShowCriarVagaModal(true)}>
            <div className={styles.navIcon}>
                <BiPlus size={36} color="#fff" />
            </div>
            <span>Add Vagas</span>
            </button>
            <button className={styles.navBtn} onClick={() => setShowPerfilModal(true)}>
            <div className={styles.navIcon}>
                <BiUser size={36} color="#fff" />
            </div>
            <span>Perfil</span>
            </button>
        </nav>
      )}

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
          onClose={() => setShowPerfilModal(false)}
        />
      )}
    </div>
  )
}

export default EmpresaDashboard