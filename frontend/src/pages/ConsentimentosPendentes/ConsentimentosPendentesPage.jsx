import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BiBriefcase, BiShieldQuarter } from 'react-icons/bi';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import styles from './ConsentimentosPendentes.module.css';

export default function ConsentimentosPendentesPage() {
  const { user, checkAuth, logout } = useAuth();
  const navigate = useNavigate();
  const pendentes = useMemo(() => user?.consentimentosPendentes || [], [user]);
  const precisaTermos = pendentes.includes('termosUso');
  const precisaPrivacidade = pendentes.includes('politicaPrivacidade');
  const [aceiteTermosUso, setAceiteTermosUso] = useState(!precisaTermos);
  const [aceitePoliticaPrivacidade, setAceitePoliticaPrivacidade] = useState(!precisaPrivacidade);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const aceitar = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.aceitarConsentimentos({
        aceiteTermosUso,
        aceitePoliticaPrivacidade,
      });
      await checkAuth();
      navigate(user?.role === 'empresa' ? '/empresa/dashboard' : '/candidato/dashboard', {
        replace: true,
      });
    } catch (erro) {
      setError(erro.data?.error || erro.message || 'Não foi possível registrar os consentimentos.');
    } finally {
      setLoading(false);
    }
  };

  const recusar = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/" className={styles.brand}>
          <BiBriefcase /> JobFinder
        </Link>
      </header>
      <main className={styles.main}>
        <form className={styles.card} onSubmit={aceitar}>
          <div className={styles.icon}><BiShieldQuarter /></div>
          <h1>Consentimentos pendentes</h1>
          <p className={styles.description}>Antes de continuar, leia e aceite as versões vigentes dos documentos abaixo.</p>

          {error && <div className={styles.error}>{error}</div>}

          {precisaTermos && (
            <label className={styles.option}>
              <input type="checkbox" checked={aceiteTermosUso} onChange={(event) => setAceiteTermosUso(event.target.checked)} />
              <span>Li e aceito os <Link to="/termos-de-uso" target="_blank" rel="noopener noreferrer">Termos de Uso</Link>.</span>
            </label>
          )}
          {precisaPrivacidade && (
            <label className={styles.option}>
              <input type="checkbox" checked={aceitePoliticaPrivacidade} onChange={(event) => setAceitePoliticaPrivacidade(event.target.checked)} />
              <span>Li e aceito a <Link to="/politica-de-privacidade" target="_blank" rel="noopener noreferrer">Política de Privacidade</Link>.</span>
            </label>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.secondary} onClick={recusar} disabled={loading}>Não concordo e sair</button>
            <button type="submit" className={styles.primary} disabled={loading || !aceiteTermosUso || !aceitePoliticaPrivacidade}>
              {loading ? 'Registrando...' : 'Aceitar e continuar'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
