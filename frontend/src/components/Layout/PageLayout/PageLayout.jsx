import styles from './PageLayout.module.css'

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
