import styles from './PageLayout.module.css'

/**
 * Layout base para páginas com estrutura padrão
 * @param {Object} props
 * @param {React.ReactNode} props.children - Conteúdo da página
 * @param {React.ReactNode} props.header - Componente de header/navbar (opcional)
 * @param {React.ReactNode} props.footer - Componente de footer (opcional)
 * @param {string} props.className - Classes CSS adicionais
 */
function PageLayout({ children, header, footer, className = '' }) {
  return (
    <div className={`${styles.pageWrapper} ${className}`}>
      {header && <div className={styles.headerContainer}>{header}</div>}
      <main className={styles.mainContent}>
        {children}
      </main>
      {footer && <div className={styles.footerContainer}>{footer}</div>}
    </div>
  )
}

export default PageLayout
