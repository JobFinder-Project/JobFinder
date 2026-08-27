import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BiSearch, BiMap, BiBriefcase } from 'react-icons/bi';
import DashboardLayout from '../../components/Layout/DashboardLayout/DashboardLayout';
import JobCard from '../../features/vagas/JobCard';
import VagaDetalhesModal from '../../features/vagas/VagaDetalhesModal/VagaDetalhesModal';
import { useVagasQuery } from '../../features/vagas/useVagasQuery';
import LoadingScreen from '../../components/ui/LoadingScreen/LoadingScreen';
import styles from './BuscaVagas.module.css';

export default function BuscaVagasPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [location, setLocation] = useState(searchParams.get('loc') || '');
  const [selectedArea, setSelectedArea] = useState(searchParams.get('area') || '');

  const { data: vagas = [], isLoading } = useVagasQuery();

  const [showVagaDetalhes, setShowVagaDetalhes] = useState(false);
  const [selectedVaga, setSelectedVaga] = useState(null);

  const vagasFiltradas = vagas.filter((vaga) => {
    const term = searchTerm.toLowerCase();
    const matchTerm =
        vaga.nome?.toLowerCase().includes(term) ||
        vaga.empresa?.nome?.toLowerCase().includes(term);

    const matchLocation = location
        ? vaga.localizacao?.toLowerCase().includes(location.toLowerCase())
        : true;

    const matchArea = selectedArea ? vaga.area === selectedArea : true;

    return matchTerm && matchLocation && matchArea;
  });

  const areasDisponiveis = [...new Set(vagas.map(v => v.area).filter(Boolean))];

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (searchTerm) params.append('q', searchTerm);
    if (location) params.append('loc', location);
    if (selectedArea) params.append('area', selectedArea);
    setSearchParams(params);
  };

  const handleOpenDetalhes = (vaga) => {
    setSelectedVaga(vaga);
    setShowVagaDetalhes(true);
  };

  if (isLoading) return <LoadingScreen />;

  return (
      <DashboardLayout userType="candidate">
        <div className={styles.container}>

          <div className={styles.header}>
            <h1 className={styles.title}>Buscar Vagas</h1>
            <p className={styles.subtitle}>Encontre a oportunidade ideal para o seu perfil profissional.</p>
          </div>

          <div className={styles.searchCard}>
            <form onSubmit={handleSearch} className={styles.searchForm}>
              <div className={styles.searchGrid}>

                <div className={styles.inputGroup}>
                  <BiSearch className={styles.inputIcon} />
                  <input
                      type="text"
                      placeholder="Cargo, palavra-chave ou empresa"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <BiMap className={styles.inputIcon} />
                  <input
                      type="text"
                      placeholder="Localização (ex: Remoto)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={styles.input}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <BiBriefcase className={styles.inputIcon} />
                  <select
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                      className={styles.select}
                  >
                    <option value="">Todas as Áreas</option>
                    {areasDisponiveis.map(area => (
                        <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>

              </div>

              <div className={styles.actionsRow}>
                <button type="submit" className={styles.btnSearch}>
                  <BiSearch size={20} />
                  Pesquisar
                </button>
              </div>
            </form>
          </div>

          <div className={styles.resultsSection}>
            <div className={styles.resultsHeader}>
              <h2 className={styles.resultsTitle}>
                {vagasFiltradas.length} {vagasFiltradas.length === 1 ? 'vaga encontrada' : 'vagas encontradas'}
              </h2>
            </div>

            {vagasFiltradas.length > 0 ? (
                <ul className={styles.jobGrid}>
                  {vagasFiltradas.map((vaga) => (
                      <JobCard
                          key={vaga._id}
                          vaga={vaga}
                          onViewDetails={() => handleOpenDetalhes(vaga)}
                      />
                  ))}
                </ul>
            ) : (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIconWrapper}>
                    <BiSearch size={48} />
                  </div>
                  <h3>Nenhuma vaga encontrada</h3>
                  <p>Não encontramos vagas com esses critérios. Tente limpar os filtros ou usar outros termos.</p>
                  <button
                      className={styles.btnClear}
                      onClick={() => {
                        setSearchTerm('');
                        setLocation('');
                        setSelectedArea('');
                        setSearchParams(new URLSearchParams());
                      }}
                  >
                    Limpar Filtros
                  </button>
                </div>
            )}
          </div>

        </div>

        {showVagaDetalhes && selectedVaga && (
            <VagaDetalhesModal
                vaga={selectedVaga}
                onClose={() => setShowVagaDetalhes(false)}
            />
        )}
      </DashboardLayout>
  );
}