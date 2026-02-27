import { useState, useEffect } from 'react';
import { BiBuilding, BiMap, BiMoney, BiBriefcase } from 'react-icons/bi';
import Modal from '../../../components/ui/Modal/Modal';
import { candidatoService } from '../../../services/candidatoService';
import styles from './VagaDetalhesModal.module.css';

export default function VagaDetalhesModal({ vaga, onClose, candidatura, onCancelRequest }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [localCandidatura, setLocalCandidatura] = useState(candidatura || null);
  const [checkingStatus, setCheckingStatus] = useState(!candidatura);

  if (!vaga) return null;

  useEffect(() => {
    if (candidatura) {
      setCheckingStatus(false);
      return;
    }

    const fetchStatus = async () => {
      try {
        const data = await candidatoService.getCandidaturas();
        const found = data.candidaturas?.find(c => c.vaga?._id === vaga._id);
        if (found) {
          setLocalCandidatura(found);
        }
      } catch (err) {
        console.error('Erro ao verificar status da vaga:', err);
      } finally {
        setCheckingStatus(false);
      }
    };

    fetchStatus();
  }, [vaga._id, candidatura]);

  const handleApply = async () => {
    setLoading(true);
    setError('');
    try {
      await candidatoService.candidatarVaga(vaga._id);
      setLocalCandidatura({ status: 'Pendente', vaga });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || err.message || 'Erro ao se candidatar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelLocal = async () => {
    if (onCancelRequest) {
      onCancelRequest(localCandidatura);
    } else {
      if (window.confirm('Tem certeza que deseja cancelar sua candidatura para esta vaga?')) {
        setLoading(true);
        try {
          await candidatoService.cancelarCandidatura(localCandidatura._id);
          setLocalCandidatura(null); // O botão volta a ser "Candidatar-se"
        } catch (err) {
          setError('Erro ao cancelar candidatura.');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const getImagemSrc = (imagem) => {
    if (!imagem) return null;
    if (typeof imagem === 'string') return imagem;
    if (imagem.data && imagem.contentType) {
      return `data:${imagem.contentType};base64,${imagem.data}`;
    }
    return null;
  };

  const imageSrc = getImagemSrc(vaga.imagem);
  const isPending = localCandidatura?.status?.toLowerCase().includes('pendente');

  return (
      <Modal title="Detalhes da Vaga" onClose={onClose} size="lg">
        <Modal.Body>
          <div className={styles.container}>

            <div className={styles.header}>
              <div className={styles.headerMain}>
                <div className={styles.imageContainer}>
                  {imageSrc ? (
                      <img src={imageSrc} alt={vaga.nome} className={styles.jobImage} />
                  ) : (
                      <div className={styles.placeholderImage}>
                        <BiBuilding size={40} />
                      </div>
                  )}
                </div>

                <div className={styles.titleContent}>
                  <h1 className={styles.jobTitle}>{vaga.nome}</h1>
                  <p className={styles.companyName}>{vaga.empresa?.nome || 'Empresa confidencial'}</p>
                  <div className={styles.badges}>
                    {vaga.area && <span className={`${styles.badge} ${styles.badgeBlue}`}>{vaga.area}</span>}
                    {vaga.tipo && <span className={`${styles.badge} ${styles.badgeGreen}`}>{vaga.tipo}</span>}
                  </div>
                </div>
              </div>

              <div className={styles.actionContainer}>
                {error && <p className={styles.errorText}>{error}</p>}

                {checkingStatus ? (
                    <button className={styles.btnApply} disabled>
                      Verificando status...
                    </button>
                ) : localCandidatura ? (
                    isPending ? (
                        <button
                            className={styles.btnDanger}
                            onClick={handleCancelLocal}
                            disabled={loading}
                        >
                          {loading ? 'Processando...' : 'Cancelar Candidatura'}
                        </button>
                    ) : (
                        <div className={styles.statusBadgeGlobal}>
                          Status atual: <strong>{localCandidatura.status}</strong>
                        </div>
                    )
                ) : (
                    <button className={styles.btnApply} onClick={handleApply} disabled={loading}>
                      {loading ? 'Processando...' : 'Candidatar-se'}
                    </button>
                )}
              </div>
            </div>

            <hr className={styles.divider} />

            <div className={styles.quickInfoGrid}>
              <div className={styles.infoItem}>
                <div className={styles.infoIconWrapper}><BiBriefcase size={22} /></div>
                <div>
                  <span className={styles.infoLabel}>Área de Atuação</span>
                  <span className={styles.infoValue}>{vaga.area || 'Não informada'}</span>
                </div>
              </div>

              {vaga.localizacao && (
                  <div className={styles.infoItem}>
                    <div className={styles.infoIconWrapper}><BiMap size={22} /></div>
                    <div>
                      <span className={styles.infoLabel}>Localização</span>
                      <span className={styles.infoValue}>{vaga.localizacao}</span>
                    </div>
                  </div>
              )}

              {vaga.salario && (
                  <div className={styles.infoItem}>
                    <div className={styles.infoIconWrapper}><BiMoney size={22} /></div>
                    <div>
                      <span className={styles.infoLabel}>Salário</span>
                      <span className={styles.infoValue}>{vaga.salario}</span>
                    </div>
                  </div>
              )}
            </div>

            <div className={styles.contentSection}>
              <h2 className={styles.sectionTitle}>Sobre a Vaga</h2>
              <div className={styles.textContent}>
                {vaga.descricao ? (
                    <p>{vaga.descricao}</p>
                ) : (
                    <p className={styles.emptyText}>O recrutador não forneceu uma descrição detalhada para esta vaga.</p>
                )}
              </div>
            </div>

            {vaga.requisitos && (
                <div className={styles.contentSection}>
                  <h2 className={styles.sectionTitle}>Requisitos</h2>
                  <div className={styles.textContent}>
                    <p>{vaga.requisitos}</p>
                  </div>
                </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
  );
}