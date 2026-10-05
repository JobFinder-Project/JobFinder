import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BiBriefcase, BiBuildings, BiMap, BiRightArrowAlt } from 'react-icons/bi';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import LoadingScreen from '../../components/ui/LoadingScreen/LoadingScreen';
import empresaService from '../../services/empresaService';
import styles from './EmpresasPublicas.module.css';

export default function EmpresasPublicasPage() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let isMounted = true;

    const carregarEmpresas = async () => {
      try {
        setLoading(true);
        setErrorMsg('');
        const response = await empresaService.listarPerfisPublicos();

        if (!isMounted) return;
        setEmpresas(response.empresas || []);
      } catch (error) {
        if (!isMounted) return;
        setErrorMsg(error.data?.message || error.message || 'Não foi possível carregar as empresas.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    carregarEmpresas();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <Navbar />
        <LoadingScreen />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroIcon} aria-hidden="true">
            <BiBuildings size={28} />
          </div>
          <h1>Empresas no JobFinder</h1>
          <p>
            Conheça empresas que publicam oportunidades na plataforma e veja perfis
            institucionais antes de se candidatar.
          </p>
        </section>

        {errorMsg ? (
          <div className={styles.messageBox} role="alert">
            {errorMsg}
          </div>
        ) : empresas.length ? (
          <ul className={styles.grid}>
            {empresas.map((empresa) => (
              <li key={empresa.slug} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.avatar} aria-hidden="true">
                    {empresa.nome?.charAt(0)?.toUpperCase() || 'E'}
                  </div>
                  <div>
                    <h2>{empresa.nome}</h2>
                    <p>{empresa.segmento || 'Segmento não informado'}</p>
                  </div>
                </div>

                <p className={styles.bio}>
                  {empresa.bio || 'Perfil institucional ainda em construção.'}
                </p>

                <div className={styles.metaList}>
                  {empresa.localizacao && (
                    <span>
                      <BiMap size={16} />
                      {empresa.localizacao}
                    </span>
                  )}
                  {empresa.tamanhoEmpresa && (
                    <span>
                      <BiBuildings size={16} />
                      {empresa.tamanhoEmpresa}
                    </span>
                  )}
                  {empresa.segmento && (
                    <span>
                      <BiBriefcase size={16} />
                      {empresa.segmento}
                    </span>
                  )}
                </div>

                <Link to={`/empresas/${empresa.slug}`} className={styles.cardLink}>
                  Ver perfil <BiRightArrowAlt size={18} />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className={styles.messageBox}>
            Nenhuma empresa pública disponível no momento.
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
