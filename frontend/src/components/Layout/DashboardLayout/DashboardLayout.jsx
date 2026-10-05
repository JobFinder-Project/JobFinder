import Sidebar from '../../Sidebar/Sidebar'
import styles from './DashboardLayout.module.css'

export default function DashboardLayout({
                                            children,
                                            userType = 'employer',
                                            onOpenCriarVaga,
                                            onOpenVagas,
                                            className = ''
                                        }) {
    return (
        <div className={`${styles.dashboardWrapper} ${className}`}>
            <Sidebar
                userType={userType}
                onOpenCriarVaga={onOpenCriarVaga}
                onOpenVagas={onOpenVagas}
            />

            <main id="main-content" tabIndex={-1} className={styles.mainContent}>
                {children}
            </main>
        </div>
    )
}
