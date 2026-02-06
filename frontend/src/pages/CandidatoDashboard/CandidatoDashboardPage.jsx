import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import JobCard from '../../features/vagas/JobCard'
import CategoryFilter from '../../features/vagas/CategoryFilter/CategoryFilter'
import CandidaturasModal from '../../features/candidato/CandidaturasModal/CandidaturasModal'
import PerfilModal from '../../features/candidato/PerfilModal/PerfilModal'
import VagaDetalhesModal from '../../features/vagas/VagaDetalhesModal/VagaDetalhesModal'
import { candidatoService } from '../../services'
import { useVagasQuery } from '../../features/vagas/useVagasQuery'
import styles from './CandidatoDashboard.module.css'

function CandidatoDashboard() {
  const navigate = useNavigate()
  const [candidatoId, setCandidatoId] = useState(null)
  const [candidato, setCandidato] = useState(null)
  const [areas, setAreas] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  const { data: vagas = [], isLoading: isLoadingVagas } = useVagasQuery(
    selectedCategory ? { area: selectedCategory } : {}
  )

  const [showCandidaturasModal, setShowCandidaturasModal] = useState(false)
  const [showPerfilModal, setShowPerfilModal] = useState(false)
  const [showVagaDetalhesModal, setShowVagaDetalhesModal] = useState(false)
  const [selectedVaga, setSelectedVaga] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const data = await candidatoService.getDashboard()
      setCandidatoId(data.candidatoId)
      setCandidato(data.candidato)
      // setVagas(data.vagas || [])
      setAreas(data.areas || [])
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category)
  }

  const handleOpenVagaDetalhes = (vaga) => {
    setSelectedVaga(vaga)
    setShowVagaDetalhesModal(true)
  }

  const filteredVagas = vagas 

  if (loading || isLoadingVagas) {
    return (
      <div className={styles.loadingWrapper}>
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className={styles.dashboardWrapper}>
      <Navbar
        inDashboard={true}
        onOpenCandidaturas={() => setShowCandidaturasModal(true)}
        onOpenPerfil={() => setShowPerfilModal(true)}
      />

      <main className={styles.mainContent}>
        <CategoryFilter
          areas={areas}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
        />

        <div className={styles.jobsFeed}>
          {filteredVagas.length > 0 ? (
            <ul className={styles.cardGrid}>
              {filteredVagas.map((vaga) => (
                <JobCard
                  key={vaga._id}
                  vaga={vaga}
                  onViewDetails={() => handleOpenVagaDetalhes(vaga)}
                />
              ))}
            </ul>
          ) : (
            <div className={styles.noData}>
              <p>Não existem vagas cadastradas.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Modais */}
      {showCandidaturasModal && (
        <CandidaturasModal
          candidatoId={candidatoId}
          onClose={() => setShowCandidaturasModal(false)}
        />
      )}

      {showPerfilModal && (
        <PerfilModal
          candidato={candidato}
          candidatoId={candidatoId}
          onClose={() => setShowPerfilModal(false)}
        />
      )}

      {showVagaDetalhesModal && selectedVaga && (
        <VagaDetalhesModal
          vaga={selectedVaga}
          candidatoId={candidatoId}
          onClose={() => setShowVagaDetalhesModal(false)}
        />
      )}
    </div>
  )
}

export default CandidatoDashboard
