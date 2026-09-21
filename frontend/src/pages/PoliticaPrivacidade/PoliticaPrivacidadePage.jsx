import { Link } from 'react-router-dom';
import LegalDocument from '../../components/LegalDocument/LegalDocument';

export default function PoliticaPrivacidadePage() {
  return (
    <LegalDocument
      title="Política de Privacidade"
      version="2026-09-21"
      intro="Esta Política explica quais dados o JobFinder trata, por que eles são necessários e como candidatos e empresas podem exercer seus direitos."
    >
      <section>
        <h2>1. Dados de candidatos</h2>
        <p>Tratamos nome, CPF, e-mail, telefone, senha protegida, escolaridade, qualificações, cursos, descrição profissional, habilidades, idiomas e foto opcional, além das candidaturas e seus status.</p>
      </section>
      <section>
        <h2>2. Dados de empresas</h2>
        <p>Tratamos nome empresarial, CNPJ, e-mail, telefone, biografia, site e informações das vagas, incluindo título, área, requisitos, imagem e status, bem como decisões registradas sobre candidaturas.</p>
      </section>
      <section>
        <h2>3. Dados gerados durante o uso</h2>
        <p>O sistema mantém dados necessários à autenticação por sessão, registros de aceite dos documentos legais e tokens temporários protegidos para recuperação de senha. Cookies de sessão são usados para manter o usuário autenticado e expiram conforme a configuração do serviço.</p>
      </section>
      <section>
        <h2>4. Finalidades</h2>
        <ul>
          <li>Criar e autenticar contas, recuperar senhas e manter perfis.</li>
          <li>Publicar e localizar vagas, realizar candidaturas e acompanhar seus status.</li>
          <li>Permitir que empresas pesquisem perfis e avaliem candidatos vinculados às suas vagas.</li>
          <li>Proteger a plataforma, cumprir obrigações e registrar consentimentos.</li>
        </ul>
      </section>
      <section>
        <h2>5. Visibilidade e compartilhamento</h2>
        <p>Empresas podem visualizar informações profissionais de candidatos nas buscas; dados de contato ficam disponíveis nos contextos de candidatura previstos pela plataforma. Candidatos visualizam informações públicas das empresas e de suas vagas. O JobFinder não autoriza o uso desses dados para fins incompatíveis com recrutamento.</p>
      </section>
      <section>
        <h2>6. Imagens e armazenamento</h2>
        <p>Fotos de perfil e imagens de vagas são armazenadas para exibição nas funcionalidades correspondentes. Aplicamos validações de formato e limites técnicos, mas o usuário deve evitar enviar conteúdo desnecessário ou dados sensíveis.</p>
      </section>
      <section>
        <h2>7. Segurança e recuperação de senha</h2>
        <p>Senhas são armazenadas de forma protegida. A recuperação utiliza um código temporário e de uso limitado enviado ao e-mail da conta. Adotamos controles técnicos de acesso, sessão e validação, embora nenhum sistema possa prometer segurança absoluta.</p>
      </section>
      <section>
        <h2>8. Retenção e exclusão</h2>
        <p>Os dados são mantidos enquanto a conta e suas funcionalidades precisarem deles ou pelo período necessário ao cumprimento de obrigações. Para solicitar exclusão da conta e remoção dos dados associados, entre em contato pela página de <Link to="/suporte">Suporte</Link>. A solicitação será analisada considerando vínculos e obrigações aplicáveis.</p>
      </section>
      <section>
        <h2>9. Direitos do titular</h2>
        <p>O usuário pode solicitar confirmação do tratamento, acesso, correção, informação sobre uso e compartilhamento, portabilidade quando aplicável, oposição, revogação do consentimento e exclusão nos limites legais. A identidade poderá ser verificada antes do atendimento.</p>
      </section>
      <section>
        <h2>10. Atualizações e contato</h2>
        <p>Esta Política pode mudar para refletir novas funcionalidades ou exigências. Alterações que demandem nova ciência serão apresentadas antes do acesso às áreas protegidas. Dúvidas ou solicitações podem ser encaminhadas pelo <Link to="/suporte">canal de suporte</Link>.</p>
      </section>
    </LegalDocument>
  );
}
