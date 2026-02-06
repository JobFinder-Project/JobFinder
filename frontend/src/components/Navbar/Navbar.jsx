import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BiListCheck,
  BiUserCircle,
  BiLeftArrowAlt,
  BiLogOut,
} from 'react-icons/bi';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar({ inDashboard = false, onOpenCandidaturas, onOpenPerfil }) {
const { logout } = useAuth(); 
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/candidato/vagas?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await logout(); 
  };
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <h1>JobFinder</h1>
      </div>

      <div className={styles.navbarCenter}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type='text'
            name='q'
            className={styles.searchInput}
            placeholder='Buscar Vagas'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type='submit' className={styles.searchButton}>
            Buscar
          </button>
        </form>
      </div>

      <ul className={styles.navbarMenu}>
        {inDashboard ? (
          <>
            <li>
              <button
                className={styles.navbarButton}
                onClick={onOpenCandidaturas}
                title='Minhas Candidaturas'
              >
                <BiListCheck size={20} />
                <span className={styles.navbarLabel}>Candidaturas</span>
              </button>
            </li>
            <li>
              <button
                className={styles.navbarButton}
                onClick={onOpenPerfil}
                title='Perfil'
              >
                <BiUserCircle size={20} />
                <span className={styles.navbarLabel}>Perfil</span>
              </button>
            </li>
          </>
        ) : (
          <li>
            <Link
              to='/candidato/dashboard'
              className={styles.navbarButton}
              title='Voltar'
            >
              <BiLeftArrowAlt size={20} />
              <span className={styles.navbarLabel}>Voltar</span>
            </Link>
          </li>
        )}
        <li>
          <button
            onClick={handleLogout}
            className={styles.navbarButton}
            title='Sair'
          >
            <BiLogOut size={20} />
            <span className={styles.navbarLabel}>Sair</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
