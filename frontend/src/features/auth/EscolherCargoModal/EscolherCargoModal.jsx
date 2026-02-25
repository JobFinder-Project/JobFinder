import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BiUser, BiBuildings } from 'react-icons/bi'
import Modal from '../../../components/ui/Modal/Modal'
import styles from './EscolherCargoModal.module.css'

export default function EscolherCargoModal({ onClose }) {
    const navigate = useNavigate()
    const [selected, setSelected] = useState('')

    const handleContinue = () => {
        if (selected === 'candidate') {
            navigate('/candidato/cadastrar')
        } else if (selected === 'employer') {
            navigate('/empresa/cadastrar')
        }
    }

    return (
        <Modal title="Crie sua conta no JobFinder" onClose={onClose} size="md">
            <Modal.Body>
                <div className={styles.container}>
                    <p className={styles.description}>
                        Como você deseja utilizar a plataforma? Escolha a opção que melhor descreve seu objetivo.
                    </p>

                    <div className={styles.optionsGrid}>

                        {/* Opção: Candidato */}
                        <div
                            className={`${styles.optionCard} ${selected === 'candidate' ? styles.selected : ''}`}
                            onClick={() => setSelected('candidate')}
                        >
                            <div className={styles.radioWrapper}>
                                <div className={`${styles.radioOuter} ${selected === 'candidate' ? styles.radioOuterSelected : ''}`}>
                                    {selected === 'candidate' && <div className={styles.radioInner}></div>}
                                </div>
                            </div>
                            <div className={styles.iconWrapper}>
                                <BiUser size={32} />
                            </div>
                            <div className={styles.optionInfo}>
                                <h3>Sou Candidato</h3>
                                <p>Quero encontrar vagas e me candidatar a oportunidades.</p>
                            </div>
                        </div>

                        <div
                            className={`${styles.optionCard} ${selected === 'employer' ? styles.selected : ''}`}
                            onClick={() => setSelected('employer')}
                        >
                            <div className={styles.radioWrapper}>
                                <div className={`${styles.radioOuter} ${selected === 'employer' ? styles.radioOuterSelected : ''}`}>
                                    {selected === 'employer' && <div className={styles.radioInner}></div>}
                                </div>
                            </div>
                            <div className={styles.iconWrapper}>
                                <BiBuildings size={32} />
                            </div>
                            <div className={styles.optionInfo}>
                                <h3>Sou Empresa</h3>
                                <p>Quero publicar vagas e encontrar os melhores talentos.</p>
                            </div>
                        </div>

                    </div>

                    <div className={styles.footerActions}>
                        <button className={styles.btnCancel} onClick={onClose}>
                            Cancelar
                        </button>
                        <button
                            className={styles.btnPrimary}
                            onClick={handleContinue}
                            disabled={!selected}
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}