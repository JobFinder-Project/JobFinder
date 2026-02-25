import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiBriefcase, BiSearch, BiFile, BiBarChartAlt2, BiUser, BiBuildings } from 'react-icons/bi';
import EscolherCargoModal from '../../features/auth/EscolherCargoModal/EscolherCargoModal';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Home.module.css';

export default function Home() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLoginClick = async (e) => {
    e.preventDefault();
    await logout();
    navigate('/login');
  };

  const handleCadastrarClick = async () => {
    await logout();
    setIsModalOpen(true);
  };

  const handleHeroCandidateClick = async () => {
    await logout();
    navigate('/candidato/cadastrar');
  };

  const handleHeroEmployerClick = async () => {
    await logout();
    navigate('/empresa/cadastrar');
  };

  return (
      <div className={styles.wrapper}>

        <nav className={styles.nav}>
          <div className={styles.navContainer}>
            <Link to="/" className={styles.logoGroup}>
              <BiBriefcase className={styles.logoIcon} />
              <span className={styles.logoText}>JobFinder</span>
            </Link>

            <div className={styles.navLinks}>
              <Link to="/" className={styles.navLink}>Início</Link>
              <a href="/login" onClick={handleLoginClick} className={styles.navLink}>Entrar</a>

              <button onClick={handleCadastrarClick} className={styles.navButtonPrimary}>
                Cadastrar
              </button>
            </div>
          </div>
        </nav>

        <section id="cadastro" className={styles.heroSection}>
          <div className={styles.heroContainer}>
            <h1 className={styles.heroTitle}>
              Encontre o emprego certo.<br />Encontre o talento certo.
            </h1>
            <p className={styles.heroSubtitle}>
              JobFinder conecta profissionais talentosos com empresas líderes.
              Seja você procurando sua próxima oportunidade de carreira ou construindo sua equipe dos sonhos,
              tornamos a contratação simples e eficaz.
            </p>

            <div className={styles.heroActionButtons}>
              <button
                  onClick={handleHeroCandidateClick}
                  className={`${styles.heroBtn} ${styles.btnBlue}`}
              >
                <BiUser size={20} />
                Quero uma vaga
              </button>
              <button
                  onClick={handleHeroEmployerClick}
                  className={`${styles.heroBtn} ${styles.btnWhite}`}
              >
                <BiBuildings size={20} />
                Quero contratar
              </button>
            </div>
          </div>
        </section>

        <section className={styles.featuresSection}>
          <div className={styles.featuresContainer}>

            <div className={styles.featuresHeader}>
              <h2 className={styles.sectionTitle}>
                Tudo que você precisa em uma plataforma
              </h2>
              <p className={styles.sectionSubtitle}>
                Simplifique sua busca por emprego ou processo de contratação com recursos poderosos projetados para o sucesso.
              </p>
            </div>

            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={`${styles.featureIconWrapper} ${styles.iconBlue}`}>
                  <BiSearch className={styles.featureIcon} />
                </div>
                <h3 className={styles.featureTitle}>Busca Inteligente de Vagas</h3>
                <p className={styles.featureText}>
                  Filtros avançados e correspondência inteligente ajudam você a descobrir as oportunidades perfeitas que se alinham com suas habilidades e objetivos de carreira.                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={`${styles.featureIconWrapper} ${styles.iconGreen}`}>
                  <BiFile className={styles.featureIcon} />
                </div>
                <h3 className={styles.featureTitle}>Candidaturas Fáceis</h3>
                <p className={styles.featureText}>
                  Candidate-se a várias vagas com um clique. Acompanhe todas as suas candidaturas em um só lugar e receba atualizações de status em tempo real.                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={`${styles.featureIconWrapper} ${styles.iconPurple}`}>
                  <BiBarChartAlt2 className={styles.featureIcon} />
                </div>
                <h3 className={styles.featureTitle}>Painéis para Empregadores</h3>
                <p className={styles.featureText}>
                  Análises poderosas e ferramentas de gerenciamento de candidatos ajudam empregadores a encontrar os melhores talentos e tomar decisões de contratação informadas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {isModalOpen && (
            <EscolherCargoModal onClose={() => setIsModalOpen(false)} />
        )}
      </div>
  );
}