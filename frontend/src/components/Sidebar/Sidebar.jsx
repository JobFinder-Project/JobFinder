import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    BiBriefcase, BiHomeAlt, BiSearch, BiFile, BiLogOut,
    BiPlus, BiGroup, BiMenu, BiChevronRight,
} from 'react-icons/bi';
import { BsHeadphones } from "react-icons/bs";
import { useAuth } from '../../contexts/AuthContext';
import styles from './Sidebar.module.css';

export default function Sidebar({
                                    userType = 'employer',
                                    onOpenCriarVaga,
                                }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const [isExpanded, setIsExpanded] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Erro ao fazer logout', error);
        }
    };

    const candidateLinks = [
        { path: '/candidato/dashboard', label: 'Dashboard', icon: BiHomeAlt },
        { path: '/candidato/vagas', label: 'Buscar Vagas', icon: BiSearch },
        { path: '/candidato/candidaturas', label: 'Candidaturas', icon: BiFile },
        { path: '/suporte', label: 'Suporte', icon: BsHeadphones },
    ];

    const employerLinks = [
        { path: '/empresa/dashboard', label: 'Painel', icon: BiHomeAlt },
        { action: onOpenCriarVaga, modalQuery: 'criarVaga', label: 'Publicar Vaga', icon: BiPlus },
        { path: '/empresa/vagas', label: 'Minhas Vagas', icon: BiBriefcase },
        { path: '/empresa/candidatos/buscar', label: 'Candidatos', icon: BiGroup },
        { path: '/suporte', label: 'Suporte', icon: BsHeadphones },
    ];

    const links = userType === 'candidate' ? candidateLinks : employerLinks;

    const handleActionClick = (link) => {
        if (link.action) {
            link.action();
        } else if (link.modalQuery) {
            navigate(`/empresa/dashboard?open=${link.modalQuery}`);
        }
    };

    return (
        <>
            <button
                className={`${styles.mobileOpenBtn} ${isExpanded ? styles.hidden : ''}`}
                onClick={() => setIsExpanded(true)}
            >
                <BiMenu size={28} />
            </button>

            <div
                className={`${styles.overlay} ${isExpanded ? styles.overlayVisible : ''}`}
                onClick={() => setIsExpanded(false)}
            />

            <div className={styles.sidebarSpacer}></div>

            <aside className={`${styles.sidebar} ${isExpanded ? styles.expanded : styles.collapsed}`}>

                <div className={styles.toggleBar}>
                    <button
                        className={`${styles.desktopToggleBtn} ${isExpanded ? styles.rotated : ''}`}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <BiChevronRight size={24} />
                    </button>
                </div>

                <Link to="/" className={styles.logoContainer}>
                    <BiBriefcase className={styles.logoIcon} size={24} />
                    <span className={styles.logoText}>JobFinder</span>
                </Link>

                <nav className={styles.nav}>
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isLinkActive = isActive(link.path);

                        if (link.modalQuery) {
                            return (
                                <button
                                    key={link.label}
                                    onClick={() => handleActionClick(link)}
                                    className={`${styles.navItem} ${isLinkActive ? styles.active : ''}`}
                                    title={!isExpanded ? link.label : undefined}
                                >
                                    <Icon size={24} className={styles.navIcon} />
                                    <span className={styles.navLabel}>{link.label}</span>
                                </button>
                            )
                        }

                        return (
                            <Link
                                key={link.label}
                                to={link.path}
                                className={`${styles.navItem} ${isLinkActive ? styles.active : ''}`}
                                title={!isExpanded ? link.label : undefined}
                            >
                                <Icon size={24} className={styles.navIcon} />
                                <span className={styles.navLabel}>{link.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className={styles.footer}>
                    <button
                        onClick={handleLogout}
                        className={`${styles.navItem} ${styles.logoutBtn}`}
                        title={!isExpanded ? "Sair" : undefined}
                    >
                        <BiLogOut size={24} className={styles.navIcon} />
                        <span className={styles.navLabel}>Sair</span>
                    </button>
                </div>

            </aside>
        </>
    );
}