import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  BiListCheck,
  BiUserCircle,
  BiLeftArrowAlt,
  BiLogOut,
  BiSearch
} from 'react-icons/bi';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar({
  onOpenCandidaturas,
  onOpenPerfil,
  disableSearch = false,
  customSearchHandler = null
}) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const isEmpresa = user?.role === 'empresa';
  const isCandidato = user?.role === 'candidato';
  const searchPlaceholder = isEmpresa ? 'Buscar Candidatos' : 'Buscar Vagas';

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (customSearchHandler) {
      customSearchHandler(searchQuery);
      return;
    }

    if (isEmpresa) {
      navigate(`/empresa/candidatos/buscar?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate(`/candidato/vagas?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <h1 className={styles.logo}>JobFinder</h1>
      </div>

      {!disableSearch && isAuthenticated && (
        <div className={styles.navbarCenter}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type='text'
              name='q'
              className={styles.searchInput}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type='submit' className={styles.searchButton}>
              <BiSearch size={20} />
            </button>
          </form>
        </div>
      )}

      <ul className={styles.navbarMenu}>

        {isCandidato && (
          <>
            <li>
              <button
                className={styles.navbarButton}
                onClick={onOpenCandidaturas}
                title='Minhas Candidaturas'
              >
                <BiListCheck size={24} />
                <span className={styles.navbarLabel}>Candidaturas</span>
              </button>
            </li>
            <li>
              <button
                className={styles.navbarButton}
                onClick={onOpenPerfil}
                title='Meu Perfil'
              >
                <BiUserCircle size={24} />
                <span className={styles.navbarLabel}>Perfil</span>
              </button>
            </li>
          </>
        )}

        {!isAuthenticated && (
          <li>
            <Link to='/login' className={styles.navbarButton}>Entrar</Link>
          </li>
        )}

        {isAuthenticated && (
          <li>
            <button
              onClick={handleLogout}
              className={`${styles.navbarButton} ${styles.logoutBtn}`}
              title='Sair do sistema'
            >
              <BiLogOut size={30} />
              <span className={styles.navbarLabel}>Sair</span>
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
}