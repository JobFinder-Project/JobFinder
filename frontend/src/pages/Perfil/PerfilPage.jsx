import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiUser, BiCamera, BiSave, BiCheckCircle } from 'react-icons/bi';
import DashboardLayout from '../../components/Layout/DashboardLayout/DashboardLayout';
import { candidatoService } from '../../services/candidatoService';
import LoadingScreen from '../../components/ui/LoadingScreen/LoadingScreen';
import styles from './Perfil.module.css';

export default function PerfilPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

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
      await candidatoService.atualizarPerfil(formData);
      setSuccessMsg('Perfil atualizado com sucesso!');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Esconde a mensagem de sucesso após 3 segundos
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      alert('Erro ao atualizar o perfil. Verifique os dados e tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
      <DashboardLayout userType="candidate">
        <div className={styles.container}>

          <div className={styles.header}>
            <h1 className={styles.title}>Meu Perfil</h1>
            <p className={styles.subtitle}>Gerencie suas informações pessoais e profissionais.</p>
          </div>

          {successMsg && (
              <div className={styles.successAlert}>
                <BiCheckCircle size={24} />
                {successMsg}
              </div>
          )}

          <form onSubmit={handleSubmit} className={styles.formLayout}>

            {/* COLUNA ESQUERDA: FOTO DE PERFIL */}
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

            {/* COLUNA DIREITA: FORMULÁRIOS */}
            <div className={styles.mainContent}>

              {/* SEÇÃO: DADOS PESSOAIS */}
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

              {/* SEÇÃO: RESUMO PROFISSIONAL */}
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

              {/* SEÇÃO: FORMAÇÃO E HABILIDADES */}
              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>Formação e Habilidades</h2>
                </div>
                <div className={styles.cardContent}>
                  <div className={styles.inputGrid}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Educação (Grau de Escolaridade)</label>
                      <input type="text" name="educacao" value={formData.educacao} onChange={handleChange} className={styles.input} placeholder="Ex: Ensino Superior Completo" />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Cargo / Qualificação Principal</label>
                      <input type="text" name="qualificacoes" value={formData.qualificacoes} onChange={handleChange} className={styles.input} placeholder="Ex: Desenvolvedor Front-end" />
                    </div>
                    <div className={`${styles.inputGroup} ${styles.colSpan2}`}>
                      <label className={styles.label}>Cursos Extracurriculares (Separados por vírgula)</label>
                      <input type="text" name="cursos" value={formData.cursos} onChange={handleChange} className={styles.input} placeholder="Ex: React Avançado, UI/UX Design" />
                    </div>
                    <div className={`${styles.inputGroup} ${styles.colSpan2}`}>
                      <label className={styles.label}>Habilidades Técnicas</label>
                      <input type="text" name="habilidadesTecnicas" value={formData.habilidadesTecnicas} onChange={handleChange} className={styles.input} placeholder="Ex: JavaScript, Node.js, Figma" />
                    </div>
                    <div className={`${styles.inputGroup} ${styles.colSpan2}`}>
                      <label className={styles.label}>Idiomas</label>
                      <input type="text" name="idiomas" value={formData.idiomas} onChange={handleChange} className={styles.input} placeholder="Ex: Inglês Intermediário, Espanhol Básico" />
                    </div>
                  </div>
                </div>
              </div>

              {/* BOTÃO SALVAR */}
              <div className={styles.actionsContainer}>
                <button type="submit" className={styles.btnPrimary} disabled={saving}>
                  <BiSave size={20} />
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>

            </div>
          </form>

        </div>
      </DashboardLayout>
  );
}