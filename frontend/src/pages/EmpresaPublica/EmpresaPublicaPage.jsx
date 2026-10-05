import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  BiArrowBack,
  BiBriefcase,
  BiBuildings,
  BiCalendar,
  BiGlobe,
  BiMap,
  BiRightArrowAlt,
} from 'react-icons/bi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import LoadingScreen from '../../components/ui/LoadingScreen/LoadingScreen';
import empresaService from '../../services/empresaService';
import styles from './EmpresaPublica.module.css';

export default function EmpresaPublicaPage() {
  const { slug } = useParams();
  const [perfil, setPerfil] = useState(null);
  const [vagas, setVagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let isMounted = true;

    const carregarPerfil = async () => {
      try {
        setLoading(true);
        setErrorMsg('');
        const response = await empresaService.getPerfilPublico(slug);

        if (!isMounted) return;
        setPerfil(response.empresa);
        setVagas(response.vagas || []);
      } catch (error) {
        if (!isMounted) return;
        setErrorMsg(error.data?.message || error.message || 'Não foi possível carregar a empresa.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    carregarPerfil();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const formatarSite = (site) => {
    if (!site) return null;
    return site.startsWith('http://') || site.startsWith('https://') ? site : `https://${site}`;
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <LoadingScreen message="Carregando perfil da empresa..." />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className={styles.page}>
        <Navbar />
        <main className={styles.errorState}>
          <div className={styles.errorCard}>
            <h1>Empresa não encontrada</h1>
            <p>{errorMsg}</p>
            <Link to="/empresas" className={styles.primaryLink}>
              Ver empresas
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const siteUrl = formatarSite(perfil?.site);

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <div className={styles.container}>
          <Link to="/empresas" className={styles.backLink}>
            <BiArrowBack size={18} />
            Voltar para empresas
          </Link>

          <section className={styles.hero}>
            <div className={styles.avatar} aria-hidden="true">
              {perfil?.nome?.charAt(0)?.toUpperCase() || 'E'}
            </div>
            <div className={styles.heroContent}>
              <p className={styles.eyebrow}>Perfil público da empresa</p>
              <h1>{perfil?.nome}</h1>
              <p className={styles.bio}>
                {perfil?.bio || 'Esta empresa ainda não adicionou uma descrição institucional.'}
              </p>

              <div className={styles.metaGrid}>
                {perfil?.segmento && (
                  <span>
                    <BiBriefcase size={18} />
                    {perfil.segmento}
                  </span>
                )}
                {perfil?.localizacao && (
                  <span>
                    <BiMap size={18} />
                    {perfil.localizacao}
                  </span>
                )}
                {perfil?.tamanhoEmpresa && (
                  <span>
                    <BiBuildings size={18} />
                    {perfil.tamanhoEmpresa}
                  </span>
                )}
                {perfil?.anoFundacao && (
                  <span>
                    <BiCalendar size={18} />
                    Desde {perfil.anoFundacao}
                  </span>
                )}
              </div>

              {siteUrl && (
                <a href={siteUrl} className={styles.siteLink} target="_blank" rel="noopener noreferrer">
                  <BiGlobe size={18} />
                  Site institucional
                </a>
              )}
            </div>
          </section>

          <div className={styles.contentGrid}>
            <section className={styles.section}>
              <h2>Missão</h2>
              <p>{perfil?.missao || 'A missão ainda não foi preenchida pela empresa.'}</p>
            </section>

            <section className={styles.section}>
              <h2>Valores</h2>
              {perfil?.valores?.length ? (
                <div className={styles.chipList}>
                  {perfil.valores.map((valor) => (
                    <span key={valor} className={styles.chip}>
                      {valor}
                    </span>
                  ))}
                </div>
              ) : (
                <p>Valores institucionais ainda não informados.</p>
              )}
            </section>

            <section className={styles.section}>
              <h2>Benefícios</h2>
              {perfil?.beneficios?.length ? (
                <div className={styles.chipList}>
                  {perfil.beneficios.map((beneficio) => (
                    <span key={beneficio} className={styles.chip}>
                      {beneficio}
                    </span>
                  ))}
                </div>
              ) : (
                <p>Benefícios ainda não informados.</p>
              )}
            </section>
          </div>

          <section className={styles.vagasSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h2>Vagas abertas</h2>
                <p>Oportunidades publicadas por esta empresa no JobFinder.</p>
              </div>
              <span className={styles.vagaCount}>{vagas.length}</span>
            </div>

            {vagas.length ? (
              <ul className={styles.vagasList}>
                {vagas.map((vaga) => (
                  <li key={vaga._id} className={styles.vagaItem}>
                    <div>
                      <h3>{vaga.nome}</h3>
                      <p>{vaga.area}</p>
                    </div>
                    <Link to="/candidato/vagas" className={styles.vagaLink}>
                      Ver vaga <BiRightArrowAlt size={18} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.emptyState}>
                <p>Esta empresa não possui vagas abertas no momento.</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
