import Navbar from '../../Navbar/Navbar'
import Footer from '../../Footer/Footer'
import PageLayout from '../PageLayout/PageLayout'
import styles from './DashboardLayout.module.css'

/**
 * Layout específico para dashboards de candidato
 * @param {Object} props
 * @param {React.ReactNode} props.children - Conteúdo do dashboard
 * @param {Function} props.onOpenCandidaturas - Callback para abrir modal de candidaturas
 * @param {Function} props.onOpenPerfil - Callback para abrir modal de perfil
 * @param {string} props.className - Classes CSS adicionais
 */
function DashboardLayout({ 
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

export default DashboardLayout
