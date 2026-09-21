import { BiLogoFacebook, BiLogoInstagram, BiLogoLinkedin } from 'react-icons/bi'
import styles from './Footer.module.css'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <hr className={styles.footerDivider} />
        <div className={styles.footerRow}>
          <div className={styles.footerCopy}>
            &copy; {new Date().getFullYear()} JobFinder. Todos os direitos reservados.
          </div>
          <nav className={styles.footerLinks}>
            <Link to='/termos-de-uso'>Termos de Uso</Link>
            <Link to='/politica-de-privacidade'>Privacidade</Link>
            <a href='#' target='_blank' rel='noopener noreferrer' aria-label='Facebook'>
              <BiLogoFacebook size={20} />
            </a>
            <a href='#' target='_blank' rel='noopener noreferrer' aria-label='Instagram'>
              <BiLogoInstagram size={20} />
            </a>
            <a href='#' target='_blank' rel='noopener noreferrer' aria-label='LinkedIn'>
              <BiLogoLinkedin size={20} />
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
