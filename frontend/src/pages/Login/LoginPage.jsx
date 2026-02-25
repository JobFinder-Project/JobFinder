import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { BiBriefcase, BiShow, BiHide, BiErrorCircle } from 'react-icons/bi'; // Importamos o ícone de erro
import { useAuth } from '../../contexts/AuthContext';
import styles from './Login.module.css';

export default function Login() {
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); // Novo estado para controlar a mensagem de erro

  useEffect(() => {
    if (searchParams.get('cadastro') === 'sucesso') {
      // Aqui ainda mantemos o alert pois é um redirecionamento de sucesso externo, mas pode ser trocado por um Toast futuramente
      alert('Cadastro realizado com sucesso! Faça login para acessar sua conta.');
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate]);

  if (isAuthenticated && user) {
    return (
        <div className={styles.alreadyLogged}>
          <div className={styles.card}>
            <h2>Você já está logado como {user.nome || 'Usuário'}</h2>
            <Link
                to={user.role === 'empresa' ? '/empresa/dashboard' : '/candidato/dashboard'}
                className={styles.btnPrimary}
            >
              Ir para o Painel
            </Link>
          </div>
        </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(''); // Limpa os erros anteriores ao tentar novamente

    try {
      const result = await login({ email, senha });

      if (result.success) {
        navigate(result.data.redirectUrl || '/');
      } else {
        // Em vez de alert, setamos o erro no estado
        setErrorMsg('Email ou senha incorretos.');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      // Em vez de alert, setamos o erro no estado
      setErrorMsg(err.message || 'Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className={styles.pageWrapper}>
        <header className={styles.header}>
          <div className={styles.headerContainer}>
            <Link to="/" className={styles.logoGroup}>
              <BiBriefcase className={styles.logoIcon} />
              <span className={styles.logoText}>JobFinder</span>
            </Link>
          </div>
        </header>

        <div className={styles.contentWrapper}>
          <div className={styles.formContainer}>
            <div className={styles.textCenter}>
              <h1 className={styles.pageTitle}>Bem-vindo de volta</h1>
              <p className={styles.pageSubtitle}>Entre na sua conta JobFinder</p>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Login</h2>
                <p className={styles.cardDescription}>Entre com seu e-mail e senha</p>
              </div>

              <div className={styles.cardContent}>

                {/* ALERTA DE ERRO RENDERIZADO AQUI */}
                {errorMsg && (
                    <div className={styles.errorAlert}>
                      <BiErrorCircle size={20} className={styles.errorIcon} />
                      <span>{errorMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>

                  <div className={styles.inputGroup}>
                    <label htmlFor="email" className={styles.label}>E-mail</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setErrorMsg(''); // Limpa o erro quando o usuário começa a digitar de novo
                        }}
                        required
                        className={styles.input}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="senha" className={styles.label}>Senha</label>
                    <div className={styles.passwordWrapper}>
                      <input
                          id="senha"
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha"
                          value={senha}
                          onChange={(e) => {
                            setSenha(e.target.value);
                            setErrorMsg(''); // Limpa o erro quando o usuário começa a digitar de novo
                          }}
                          required
                          className={`${styles.input} ${styles.inputPassword}`}
                      />
                      <button
                          type="button"
                          className={styles.eyeButton}
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      >
                        {showPassword ? <BiHide size={20} /> : <BiShow size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className={styles.optionsGroup}>
                    <label className={styles.rememberMe}>
                      <input type="checkbox" className={styles.checkbox} />
                      <span>Lembrar-me</span>
                    </label>
                    <Link to='/recuperar_senha' className={styles.forgotPassword}>
                      Esqueceu a senha?
                    </Link>
                  </div>

                  <button
                      type="submit"
                      className={styles.btnPrimary}
                      disabled={loading}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </button>
                </form>

                <div className={styles.footerLink}>
                  Não tem uma conta? <Link to="/#cadastro">Criar uma conta</Link>
                </div>
              </div>
            </div>

            <p className={styles.legalText}>
              Ao entrar, você concorda com nossos <a href="#">Termos de Serviço</a> e <a href="#">Política de Privacidade</a>
            </p>
          </div>
        </div>
      </div>
  );
}