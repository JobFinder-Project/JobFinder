import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    BiArrowBack,
    BiHeadphone,
    BiMailSend,
    BiTimeFive,
    BiErrorCircle,
    BiMessageSquareDetail,
    BiLogoGithub
} from 'react-icons/bi';
import DashboardLayout from '../../components/Layout/DashboardLayout/DashboardLayout';
import Navbar from '../../components/Navbar/Navbar';
import Modal from '../../components/ui/Modal/Modal';
import { useAuth } from '../../contexts/AuthContext';
import styles from './Suporte.module.css';

export default function SuportePage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const userType = user?.role === 'candidato' ? 'candidate' : 'employer';

    const pageContent = (
        <div className={styles.wrapper}>
            <div className={styles.container}>

                {/* Botão Voltar */}
                <button
                    className={styles.backButton}
                    onClick={() => navigate(-1)}
                >
                    <BiArrowBack size={18} />
                    <span>Voltar</span>
                </button>

                <div className={styles.pageHeader}>
                    <h1 className={styles.title}>Suporte Técnico</h1>
                    <p className={styles.subtitle}>
                        Estamos aqui para ajudar você com qualquer dúvida ou problema
                    </p>
                </div>

                <div className={styles.mainCard}>
                    <div className={styles.mainCardHeader}>
                        <div className={styles.mainIconWrapper}>
                            <BiHeadphone size={32} className={styles.mainIcon} />
                        </div>
                        <h2 className={styles.mainCardTitle}>Como podemos ajudar?</h2>
                        <p className={styles.mainCardDesc}>
                            Precisa de ajuda? Entre em contato com nossa equipe de suporte técnico e iremos atendê-lo o mais rápido possível.
                        </p>
                    </div>

                    <div className={styles.mainCardContent}>
                        <button
                            className={styles.btnPrimaryLg}
                            onClick={() => setIsModalOpen(true)}
                        >
                            <BiMessageSquareDetail size={20} />
                            Abrir Chamado de Suporte
                        </button>
                    </div>
                </div>

                <div className={styles.infoGrid}>
                    <div className={styles.infoCard}>
                        <div className={styles.infoCardContent}>
                            <div className={`${styles.infoIconWrapper} ${styles.bgGreen}`}>
                                <BiMailSend size={24} className={styles.textGreen} />
                            </div>
                            <h3 className={styles.infoCardTitle}>Email</h3>
                            <p className={styles.infoCardDesc}>suporte@jobfinder.com</p>
                        </div>
                    </div>

                    <div className={styles.infoCard}>
                        <div className={styles.infoCardContent}>
                            <div className={`${styles.infoIconWrapper} ${styles.bgAmber}`}>
                                <BiTimeFive size={24} className={styles.textAmber} />
                            </div>
                            <h3 className={styles.infoCardTitle}>Horário</h3>
                            <p className={styles.infoCardDesc}>Seg-Sex: 8h às 18h</p>
                        </div>
                    </div>

                    <div className={styles.infoCard}>
                        <div className={styles.infoCardContent}>
                            <div className={`${styles.infoIconWrapper} ${styles.bgPurple}`}>
                                <BiErrorCircle size={24} className={styles.textPurple} />
                            </div>
                            <h3 className={styles.infoCardTitle}>Resposta</h3>
                            <p className={styles.infoCardDesc}>Até 24 horas úteis</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );

    const modalComponent = isModalOpen && (
        <Modal title="Escolha o Canal de Suporte" onClose={() => setIsModalOpen(false)} size="md">
            <Modal.Body>
                <div className={styles.modalContent}>
                    <p className={styles.modalText}>
                        Selecione abaixo como deseja contatar nossa equipe.
                    </p>

                    <div className={styles.supportOptionsList}>
                        <a
                            href="https://github.com/JobFinder-Project/JobFinder/issues/new/choose"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.supportCard}
                            onClick={() => setIsModalOpen(false)}
                        >
                            <div className={`${styles.iconWrapper} ${styles.iconGithub}`}>
                                <BiLogoGithub size={32} />
                            </div>
                            <div className={styles.supportCardInfo}>
                                <h4>Relatar Bug ou Nova Feature</h4>
                                <p>Abra uma "Issue" detalhada diretamente no nosso repositório oficial do GitHub.</p>
                            </div>
                        </a>

                        <a
                            href="mailto:suporte@jobfinder.com?subject=Suporte%20JobFinder%20-%20Chamado"
                            className={styles.supportCard}
                            onClick={() => setIsModalOpen(false)}
                        >
                            <div className={`${styles.iconWrapper} ${styles.iconEmail}`}>
                                <BiMailSend size={32} />
                            </div>
                            <div className={styles.supportCardInfo}>
                                <h4>Enviar E-mail para a Equipe</h4>
                                <p>Use seu aplicativo de e-mail para falar com nossos atendentes (suporte@jobfinder.com).</p>
                            </div>
                        </a>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );

    if (user) {
        return (
            <DashboardLayout userType={userType}>
                {pageContent}
                {modalComponent}
            </DashboardLayout>
        );
    }

    return (
        <div className={styles.publicPageWrapper}>
            <Navbar />
            <div className={styles.publicContentWrapper}>
                {pageContent}
            </div>
            {modalComponent}
        </div>
    );
}