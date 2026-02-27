import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiBriefcase, BiBookmark, BiSearch, BiMap, BiUser, BiRightArrowAlt } from 'react-icons/bi';
import DashboardLayout from '../../components/Layout/DashboardLayout/DashboardLayout';
import JobCard from '../../features/vagas/JobCard';
import CategoryFilter from '../../features/vagas/CategoryFilter/CategoryFilter';
import CandidaturasModal from '../../features/candidato/CandidaturasModal/CandidaturasModal';
import VagaDetalhesModal from '../../features/vagas/VagaDetalhesModal/VagaDetalhesModal';
import { candidatoService } from '../../services/candidatoService';
import { useVagasQuery } from '../../features/vagas/useVagasQuery';
import LoadingScreen from '../../components/ui/LoadingScreen/LoadingScreen';
import { useAuth } from '../../contexts/AuthContext';
import styles from './CandidatoDashboard.module.css';

export default function CandidatoDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [candidatoId, setCandidatoId] = useState(null);
  const [candidato, setCandidato] = useState(null);
  const [areas, setAreas] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  const { data: vagas = [], isLoading: isLoadingVagas } = useVagasQuery(
      selectedCategory ? { area: selectedCategory } : {}
  );

  const [showCandidaturasModal, setShowCandidaturasModal] = useState(false);
  const [showVagaDetalhesModal, setShowVagaDetalhesModal] = useState(false);
  const [selectedVaga, setSelectedVaga] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await candidatoService.getDashboard();
      setCandidatoId(data.candidatoId);
      setCandidato(data.candidato);
      setAreas(data.areas || []);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category === selectedCategory ? null : category);
  };

  const handleOpenVagaDetalhes = (vaga) => {
    setSelectedVaga(vaga);
    setShowVagaDetalhesModal(true);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('q', searchTerm);
    if (location) params.append('loc', location);
    navigate(`/candidato/vagas?${params.toString()}`);
  };

  const filteredVagas = vagas;

  if (loading || isLoadingVagas) {
    return <LoadingScreen />;
  }

  return (
      <DashboardLayout userType="candidate">
        <div className={styles.container}>

          <div className={styles.welcomeSection}>
            <h1 className={styles.title}>Bem-vindo, {user?.nome?.split(' ')[0] || 'Candidato'}!</h1>
            <p className={styles.subtitle}>Aqui está um resumo da sua busca por emprego.</p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard} onClick={() => setShowCandidaturasModal(true)} role="button">
              <div className={styles.statContent}>
                <div>
                  <p className={styles.statLabel}>Acompanhar Processos</p>
                  <p className={styles.statValue}>Candidaturas</p>
                </div>
                <div className={`${styles.iconWrapper} ${styles.bgBlue}`}>
                  <BiBriefcase className={styles.iconBlue} />
                </div>
              </div>
            </div>

            <div className={styles.statCard} onClick={() => navigate('/candidato/perfil')} role="button">
              <div className={styles.statContent}>
                <div>
                  <p className={styles.statLabel}>Atualizar Currículo</p>
                  <p className={styles.statValue}>Meu Perfil</p>
                </div>
                <div className={`${styles.iconWrapper} ${styles.bgGreen}`}>
                  <BiUser className={styles.iconGreen} />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.searchCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Encontre Sua Próxima Vaga</h2>
            </div>
            <div className={styles.cardContent}>
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <div className={styles.searchGrid}>

                  <div className={`${styles.inputGroup} ${styles.colSpan2}`}>
                    <BiSearch className={styles.inputIcon} />
                    <input
                        type="text"
                        placeholder="Cargo, palavras-chave ou empresa"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <BiMap className={styles.inputIcon} />
                    <input
                        type="text"
                        placeholder="Localização"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <select
                        value={selectedCategory || ''}
                        onChange={(e) => handleCategoryClick(e.target.value)}
                        className={styles.select}
                    >
                      <option value="">Todas as Áreas</option>
                      {areas.map(area => (
                          <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>

                </div>

                <button type="submit" className={styles.btnSearch}>
                  <BiSearch size={20} />
                  Buscar Vagas
                </button>
              </form>
            </div>
          </div>

          <CategoryFilter
              areas={areas}
              selectedCategory={selectedCategory}
              onCategoryClick={handleCategoryClick}
          />

          <div className={styles.jobsCard}>
            <div className={styles.cardHeaderFlex}>
              <h2 className={styles.cardTitle}>Vagas Recomendadas</h2>
              <button className={styles.btnGhost} onClick={() => navigate('/candidato/vagas')}>
                Ver Todas <BiRightArrowAlt size={20} />
              </button>
            </div>

            <div className={styles.cardContent}>
              {filteredVagas.length > 0 ? (
                  <div className={styles.jobGrid}>
                    {filteredVagas.map((vaga) => (
                        <JobCard
                            key={vaga._id}
                            vaga={vaga}
                            onViewDetails={() => handleOpenVagaDetalhes(vaga)}
                        />
                    ))}
                  </div>
              ) : (
                  <p className={styles.emptyText}>Não encontramos vagas para esta área no momento.</p>
              )}
            </div>
          </div>

        </div>

        {showCandidaturasModal && (
            <CandidaturasModal candidatoId={candidatoId} onClose={() => setShowCandidaturasModal(false)} />
        )}
        {showVagaDetalhesModal && selectedVaga && (
            <VagaDetalhesModal vaga={selectedVaga} candidatoId={candidatoId} onClose={() => setShowVagaDetalhesModal(false)} />
        )}
      </DashboardLayout>
  );
}