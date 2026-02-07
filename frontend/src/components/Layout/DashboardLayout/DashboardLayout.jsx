import Navbar from '../../Navbar/Navbar'
import Footer from '../../Footer/Footer'
import PageLayout from '../PageLayout/PageLayout'
import styles from './DashboardLayout.module.css'

export default function DashboardLayout({
    children,
    onOpenCandidaturas,
    onOpenPerfil,
    className = ''
}) {
    return (
        <PageLayout
            header={
                <Navbar
                    inDashboard={true}
                    onOpenCandidaturas={onOpenCandidaturas}
                    onOpenPerfil={onOpenPerfil}
                />
            }
            footer={<Footer />}
            className={`${styles.dashboardLayout} ${className}`}
        >
            {children}
        </PageLayout>
    )
}
