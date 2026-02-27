import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiBriefcase } from 'react-icons/bi';
import EscolherCargoModal from '../../features/auth/EscolherCargoModal/EscolherCargoModal';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
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

  return (
      <>
        <nav className={styles.nav}>
          <div className={styles.navContainer}>
            <Link to="/" className={styles.logoGroup}>
              <BiBriefcase className={styles.logoIcon} />
              <span className={styles.logoText}>JobFinder</span>
            </Link>

            <div className={styles.navLinks}>
              <Link to="/" className={styles.navLink}>Início</Link>
              <Link to="/suporte" className={styles.navLink}>Suporte</Link>

              <a href="/login" onClick={handleLoginClick} className={styles.navLink}>
                Login
              </a>
              <button onClick={handleCadastrarClick} className={styles.btnPrimary}>
                Cadastrar
              </button>
            </div>
          </div>
        </nav>

        {isModalOpen && (
            <EscolherCargoModal onClose={() => setIsModalOpen(false)} />
        )}
      </>
  );
}