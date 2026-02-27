import React from 'react';
import { BiRightArrowAlt, BiMap, BiBuilding } from 'react-icons/bi';
import styles from './JobCard.module.css';

export default function JobCard({ vaga, onViewDetails }) {
    if (!vaga) return null;

    const getImagemSrc = (imagem) => {
        if (!imagem) return null;
        if (typeof imagem === 'string') return imagem;
        if (imagem.data && imagem.contentType) {
            return `data:${imagem.contentType};base64,${imagem.data}`;
        }
        return null;
    };

    const imageSrc = getImagemSrc(vaga.imagem);

    return (
        <li className={styles.card}>
            <div className={styles.cardBody}>

                <div className={styles.imageContainer}>
                    {imageSrc ? (
                        <img
                            src={imageSrc}
                            alt={vaga.nome}
                            className={styles.jobImage}
                        />
                    ) : (
                        <div className={styles.placeholderImage}>
                            <BiBuilding size={32} />
                        </div>
                    )}
                </div>

                <div className={styles.contentContainer}>

                    <div className={styles.header}>
                        <h3 className={styles.title} title={vaga.nome}>
                            {vaga.nome}
                        </h3>
                        <p className={styles.company}>{vaga.empresa?.nome || 'Empresa confidencial'}</p>
                    </div>

                    <div className={styles.badges}>
                        {vaga.area && (
                            <span className={`${styles.badge} ${styles.badgeBlue}`}>
                {vaga.area}
              </span>
                        )}
                    </div>

                    <div className={styles.footer}>
                        <div className={styles.metaInfo}>
                            {vaga.localizacao && (
                                <span className={styles.metaItem}>
                  <BiMap size={16} /> {vaga.localizacao}
                </span>
                            )}
                        </div>

                        <button
                            className={styles.detailsBtn}
                            onClick={onViewDetails}
                        >
                            Ver Vaga <BiRightArrowAlt size={18} />
                        </button>
                    </div>

                </div>
            </div>
        </li>
    );
}