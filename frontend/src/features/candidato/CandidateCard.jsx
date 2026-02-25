import { useState } from 'react'
import {
    BiUser, BiBriefcase, BiEnvelope, BiPhone,
    BiBookOpen, BiCertification, BiCodeAlt, BiGlobe
} from 'react-icons/bi'
import Modal from '../../components/ui/Modal/Modal.jsx'
import styles from './CandidateCard.module.css'

export default function CandidateCard({ candidato }) {
    const [showModal, setShowModal] = useState(false)

    const getImagemSrc = (imagem) => {
        if (!imagem) return null;
        if (typeof imagem === 'string') return imagem;
        if (imagem.data && imagem.contentType) {
            return `data:${imagem.contentType};base64,${imagem.data}`;
        }
        return null;
    }

    const imgSrc = getImagemSrc(candidato.imagem);

    const parseList = (data) => {
        if (!data) return [];
        if (Array.isArray(data)) return data.filter(item => item && typeof item === 'string' && item.trim() !== '');
        if (typeof data === 'string') return data.split(',').map(i => i.trim()).filter(i => i !== '');
        return [];
    }

    const habilidadesArray = parseList(candidato.habilidadesTecnicas || candidato.habilidades);
    const topHabilidades = habilidadesArray.slice(0, 3);
    const hasMoreHabilidades = habilidadesArray.length > 3;

    let qualificacao = candidato.qualificacoes || candidato.qualificacao;
    if (!qualificacao || qualificacao === 'undefined' || String(qualificacao).trim() === '') {
        qualificacao = 'Profissional';
    }

    const cursos = parseList(candidato.cursos);
    const idiomas = parseList(candidato.idiomas);
    const descricao = parseList(candidato.descricao).join('\n'); // Junta caso seja um array com vários parágrafos válidos

    return (
        <>
            <div className={styles.card}>
                <div className={styles.header}>
                    <div className={styles.avatarWrapper}>
                        {imgSrc ? (
                            <img src={imgSrc} alt={candidato.nome} className={styles.avatar} />
                        ) : (
                            <div className={styles.avatarPlaceholder}>
                                {candidato.nome ? candidato.nome.charAt(0).toUpperCase() : 'C'}
                            </div>
                        )}
                    </div>

                    <div className={styles.info}>
                        <h3 className={styles.name} title={candidato.nome}>{candidato.nome}</h3>
                        <div className={styles.roleWrapper} title={qualificacao}>
                            <BiBriefcase className={styles.icon} size={16} />
                            <span className={styles.roleText}>{qualificacao}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.body}>
                    {topHabilidades.length > 0 ? (
                        <div className={styles.skills}>
                            {topHabilidades.map((hab, index) => (
                                <span key={index} className={styles.skillTag} title={hab}>{hab}</span>
                            ))}
                            {hasMoreHabilidades && (
                                <span className={styles.skillTagExtra}>+{habilidadesArray.length - 3}</span>
                            )}
                        </div>
                    ) : (
                        <div className={styles.skillsEmpty}>
                            Sem habilidades listadas
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <button className={styles.btnProfile} onClick={() => setShowModal(true)}>
                        <BiUser size={18} /> Ver Perfil Completo
                    </button>
                </div>
            </div>

            {showModal && (
                <Modal title="Perfil do Candidato" onClose={() => setShowModal(false)} size="lg">
                    <Modal.Body>
                        <div className={styles.modalContent}>

                            <div className={styles.modalHeader}>
                                {imgSrc ? (
                                    <img src={imgSrc} alt={candidato.nome} className={styles.modalAvatar} />
                                ) : (
                                    <div className={styles.modalAvatarPlaceholder}>
                                        {candidato.nome ? candidato.nome.charAt(0).toUpperCase() : 'C'}
                                    </div>
                                )}
                                <div className={styles.modalHeaderInfo}>
                                    <h2>{candidato.nome}</h2>
                                    <p className={styles.modalRole}>{qualificacao}</p>
                                </div>
                            </div>

                            <div className={styles.modalGrid}>
                                <div className={styles.contactItem}>
                                    <BiEnvelope size={20} className={styles.sectionIcon} />
                                    <span>{candidato.email || 'Email não informado'}</span>
                                </div>
                                <div className={styles.contactItem}>
                                    <BiPhone size={20} className={styles.sectionIcon} />
                                    <span>{candidato.telefone || 'Telefone não informado'}</span>
                                </div>
                            </div>

                            <hr className={styles.divider} />

                            <div className={styles.modalSection}>
                                <h3 className={styles.sectionTitle}><BiUser className={styles.sectionIcon} /> Sobre</h3>
                                {descricao ? (
                                    <p className={styles.modalText}>{descricao}</p>
                                ) : (
                                    <p className={styles.emptyText}>O candidato não adicionou uma descrição.</p>
                                )}
                            </div>

                            <div className={styles.modalSection}>
                                <h3 className={styles.sectionTitle}><BiBookOpen className={styles.sectionIcon} /> Nível de Escolaridade</h3>
                                <p className={styles.modalText} style={{ textTransform: 'capitalize' }}>
                                    {candidato.educacao || 'Não informado'}
                                </p>
                            </div>

                            <hr className={styles.divider} />

                            <div className={styles.modalGrid}>

                                <div className={styles.modalSection}>
                                    <h3 className={styles.sectionTitle}><BiCodeAlt className={styles.sectionIcon} /> Habilidades Técnicas</h3>
                                    {habilidadesArray.length > 0 ? (
                                        <div className={styles.modalTags}>
                                            {habilidadesArray.map((hab, idx) => (
                                                <span key={idx} className={styles.tagBlue}>{hab}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className={styles.emptyText}>Nenhuma habilidade cadastrada.</p>
                                    )}
                                </div>

                                <div className={styles.modalSection}>
                                    <h3 className={styles.sectionTitle}><BiGlobe className={styles.sectionIcon} /> Idiomas</h3>
                                    {idiomas.length > 0 ? (
                                        <div className={styles.modalTags}>
                                            {idiomas.map((idm, idx) => (
                                                <span key={idx} className={styles.tagGreen}>{idm}</span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className={styles.emptyText}>Nenhum idioma cadastrado.</p>
                                    )}
                                </div>

                                <div className={styles.modalSection} style={{ gridColumn: '1 / -1' }}>
                                    <h3 className={styles.sectionTitle}><BiCertification className={styles.sectionIcon} /> Cursos / Certificações</h3>
                                    {cursos.length > 0 ? (
                                        <ul className={styles.modalList}>
                                            {cursos.map((curso, idx) => (
                                                <li key={idx}>{curso}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className={styles.emptyText}>Nenhum curso extra cadastrado.</p>
                                    )}
                                </div>

                            </div>

                        </div>
                    </Modal.Body>
                </Modal>
            )}
        </>
    )
}