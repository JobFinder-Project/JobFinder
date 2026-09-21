import { Link } from 'react-router-dom';
import { BiArrowBack, BiBriefcase } from 'react-icons/bi';
import Footer from '../Footer/Footer';
import styles from './LegalDocument.module.css';

export default function LegalDocument({ title, version, intro, children }) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.brand}>
            <BiBriefcase />
            <span>JobFinder</span>
          </Link>
          <Link to="/" className={styles.backLink}>
            <BiArrowBack /> Voltar ao início
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <article className={styles.document}>
          <div className={styles.heading}>
            <p className={styles.eyebrow}>Documento legal</p>
            <h1>{title}</h1>
            <p className={styles.version}>Versão {version} · Vigente desde 21 de setembro de 2026</p>
            <p className={styles.intro}>{intro}</p>
          </div>
          <div className={styles.content}>{children}</div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
