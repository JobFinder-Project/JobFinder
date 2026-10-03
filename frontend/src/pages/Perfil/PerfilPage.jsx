import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiUser, BiCamera, BiSave, BiCheckCircle, BiTrash, BiArrowBack, BiErrorCircle } from 'react-icons/bi';
import DashboardLayout from '../../components/Layout/DashboardLayout/DashboardLayout';
import ExcluirContaModal from '../../features/conta/ExcluirContaModal/ExcluirContaModal';
import TagInput from '../../components/ui/TagInput/TagInput';
import { useAuth } from '../../contexts/AuthContext';
import { candidatoService } from '../../services/candidatoService';
import LoadingScreen from '../../components/ui/LoadingScreen/LoadingScreen';
import styles from './Perfil.module.css';

export default function PerfilPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [showExcluirConta, setShowExcluirConta] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    educacao: '',
    qualificacoes: '',
    cursos: '',
    descricao: '',
    habilidadesTecnicas: '',
    idiomas: '',
    imagem: null
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [dbImage, setDbImage] = useState(null); // Imagem vinda do banco

  useEffect(() => {
    fetchCandidatoData();
  }, []);

  const fetchCandidatoData = async () => {
    try {
      const data = await candidatoService.getDashboard();
      const candidato = data.candidato;

      if (candidato) {
        setFormData({
          nome: candidato.nome || '',
          cpf: candidato.cpf || '',
          email: candidato.email || '',
          telefone: candidato.telefone || '',
          educacao: candidato.educacao || '',
          qualificacoes: candidato.qualificacoes || '',
          cursos: Array.isArray(candidato.cursos) ? candidato.cursos.join(', ') : candidato.cursos || '',
          descricao: candidato.descricao || '',
          habilidadesTecnicas: candidato.habilidadesTecnicas || '',
          idiomas: Array.isArray(candidato.idiomas) ? candidato.idiomas.join(', ') : candidato.idiomas || '',
          imagem: null // A imagem original não vai pro formData a menos que mude
        });

        if (candidato.imagem && candidato.imagem.data) {
          setDbImage(`data:${candidato.imagem.contentType};base64,${candidato.imagem.data}`);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, imagem: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const dataToSend = new FormData();

      Object.keys(formData).forEach(key => {
        if (key !== 'imagem' && formData[key] !== null && formData[key] !== undefined) {
          dataToSend.append(key, formData[key]);
        }
      });

      if (formData.imagem instanceof File) {
        dataToSend.append('imagem', formData.imagem);
      }

      await candidatoService.atualizarPerfil(dataToSend);

      setSuccessMsg('Perfil atualizado com sucesso!');
      setErrorMsg('');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setErrorMsg('Erro ao atualizar o perfil. Verifique os dados e tente novamente.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setErrorMsg(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const handleExcluirConta = async (senha) => {
    await candidatoService.excluirConta(senha);
    await logout();
    navigate('/', { replace: true });
  };

  if (loading) return <LoadingScreen />;

  return (
      <DashboardLayout userType="candidate">
        <div className={styles.container}>

          <div className={styles.header}>
            <button
                type="button"
                className={styles.backButton}
                onClick={() => navigate('/candidato/dashboard')}
            >
              <BiArrowBack size={18} /> Voltar ao Dashboard
            </button>
            <h1 className={styles.title}>Meu Perfil</h1>
            <p className={styles.subtitle}>Gerencie suas informações pessoais e profissionais.</p>
          </div>

          {successMsg && (
              <div className={styles.successAlert}>
                <BiCheckCircle size={24} />
                {successMsg}
              </div>
          )}

          {errorMsg && (
              <div className={styles.errorAlert}>
                <BiErrorCircle size={24} />
                {errorMsg}
              </div>
          )}

          <form onSubmit={handleSubmit} className={styles.formLayout}>

            <div className={styles.profileSidebar}>
              <div className={styles.card}>
                <div className={styles.cardContent}>
                  <div className={styles.avatarWrapper}>
                    <div className={styles.avatarContainer}>
                      {previewImage || dbImage ? (
                          <img src={previewImage || dbImage} alt="Foto de Perfil" className={styles.avatarImg} />
                      ) : (
                          <BiUser size={64} className={styles.avatarPlaceholder} />
                      )}
                      <button
                          type="button"
                          className={styles.avatarEditBtn}
                          onClick={() => fileInputRef.current?.click()}
                          title="Alterar foto"
                      >
                        <BiCamera size={20} />
                      </button>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className={styles.hiddenInput}
                    />
                  </div>
                  <h3 className={styles.sidebarName}>{formData.nome || 'Seu Nome'}</h3>
                  <p className={styles.sidebarRole}>{formData.qualificacoes || 'Sua Profissão'}</p>
                </div>
              </div>
            </div>

            <div className={styles.mainContent}>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Dados Pessoais</h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.inputGrid}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Nome Completo</label>
                      <input type="text" name="nome" value={formData.nome} onChange={handleChange} className={styles.input} required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>CPF</label>
                      <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} className={styles.input} disabled title="O CPF não pode ser alterado" />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>E-mail</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} className={styles.input} required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Telefone</label>
                      <input type="text" name="telefone" value={formData.telefone} onChange={handleChange} className={styles.input} placeholder="(11) 99999-9999" />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Resumo Profissional</h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Descrição (Sobre você)</label>
                    <textarea
                        name="descricao"
                        value={formData.descricao}
                        onChange={handleChange}
                        className={styles.textarea}
                        rows="4"
                        placeholder="Fale um pouco sobre sua trajetória profissional..."
                    />
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Formação e Habilidades</h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.inputGrid}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Educação (Grau de Escolaridade)</label>
                      <select name="educacao" value={formData.educacao} onChange={handleChange} className={styles.input}>
                        <option value="">Selecione seu grau de instrução</option>
                        <option value="Ensino Médio Incompleto">Ensino Médio Incompleto</option>
                        <option value="Ensino Médio Completo">Ensino Médio Completo</option>
                        <option value="Ensino Superior Incompleto">Ensino Superior Incompleto</option>
                        <option value="Ensino Superior Completo">Ensino Superior Completo</option>
                        <option value="Pós-graduação/Mestrado">Pós-graduação / Mestrado</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Cargo / Qualificação Principal</label>
                      <input type="text" name="qualificacoes" value={formData.qualificacoes} onChange={handleChange} className={styles.input} placeholder="Ex: Desenvolvedor Front-end" />
                    </div>
                    <div className={`${styles.inputGroup} ${styles.colSpan2}`}>
                      <label className={styles.label} htmlFor="cursos">Cursos Extracurriculares</label>
                      <TagInput
                        id="cursos"
                        value={formData.cursos}
                        onChange={(v) => setFormData(prev => ({ ...prev, cursos: v }))}
                        placeholder="Ex: React Avançado... (Enter para adicionar)"
                      />
                    </div>
                    <div className={`${styles.inputGroup} ${styles.colSpan2}`}>
                      <label className={styles.label} htmlFor="habilidadesTecnicas">Habilidades Técnicas</label>
                      <TagInput
                        id="habilidadesTecnicas"
                        value={formData.habilidadesTecnicas}
                        onChange={(v) => setFormData(prev => ({ ...prev, habilidadesTecnicas: v }))}
                        placeholder="Ex: JavaScript, Node.js... (Enter para adicionar)"
                      />
                    </div>
                    <div className={`${styles.inputGroup} ${styles.colSpan2}`}>
                      <label className={styles.label} htmlFor="idiomas">Idiomas</label>
                      <TagInput
                        id="idiomas"
                        value={formData.idiomas}
                        onChange={(v) => setFormData(prev => ({ ...prev, idiomas: v }))}
                        placeholder="Ex: Inglês Intermediário... (Enter para adicionar)"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.actionsContainer}>
                <button type="submit" className={styles.btnPrimary} disabled={saving}>
                  <BiSave size={20} />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>

              <div className={`${styles.card} ${styles.dangerCard}`}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.dangerTitle}>Zona de Perigo</h2>
                </div>
                <div className={`${styles.cardContent} ${styles.dangerContent}`}>
                  <p className={styles.dangerText}>
                    Excluir sua conta remove seu perfil e todas as suas candidaturas de forma permanente.
                    Essa ação não pode ser desfeita.
                  </p>
                  <button
                      type="button"
                      className={styles.btnDanger}
                      onClick={() => setShowExcluirConta(true)}
                  >
                    <BiTrash size={20} />
                    Excluir minha conta
                  </button>
                </div>
              </div>

            </div>
          </form>

          {showExcluirConta && (
              <ExcluirContaModal
                  tipo="candidato"
                  onConfirm={handleExcluirConta}
                  onClose={() => setShowExcluirConta(false)}
              />
          )}

        </div>
      </DashboardLayout>
  );
}