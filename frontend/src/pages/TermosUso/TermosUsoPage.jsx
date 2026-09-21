import { Link } from 'react-router-dom';
import LegalDocument from '../../components/LegalDocument/LegalDocument';

export default function TermosUsoPage() {
  return (
    <LegalDocument
      title="Termos de Uso"
      version="2026-09-21"
      intro="Estes Termos definem as regras para uso do JobFinder por candidatos e empresas. Ao criar ou manter uma conta, você concorda em utilizar a plataforma com responsabilidade e de acordo com estas condições."
    >
      <section>
        <h2>1. Finalidade da plataforma</h2>
        <p>O JobFinder conecta candidatos a oportunidades profissionais e permite que empresas publiquem vagas, pesquisem perfis e administrem candidaturas. A plataforma não garante contratação, preenchimento de vaga ou veracidade de informações fornecidas por terceiros.</p>
      </section>
      <section>
        <h2>2. Conta e informações verdadeiras</h2>
        <p>Cada usuário é responsável por fornecer dados verdadeiros, manter suas informações atualizadas, proteger a senha e comunicar acessos indevidos. Contas não devem ser compartilhadas, criadas em nome de terceiros sem autorização ou usadas para simular identidade.</p>
      </section>
      <section>
        <h2>3. Responsabilidades do candidato</h2>
        <ul>
          <li>Manter corretos os dados pessoais, profissionais, cursos, habilidades e idiomas.</li>
          <li>Candidatar-se apenas a vagas de interesse legítimo e acompanhar o andamento das candidaturas.</li>
          <li>Usar contatos e informações de empresas somente para fins relacionados às oportunidades publicadas.</li>
        </ul>
      </section>
      <section>
        <h2>4. Responsabilidades da empresa</h2>
        <ul>
          <li>Publicar vagas reais, claras, lícitas e compatíveis com as atividades informadas.</li>
          <li>Usar os dados dos candidatos apenas para recrutamento e seleção relacionados à plataforma.</li>
          <li>Manter informações institucionais atualizadas e administrar as candidaturas de forma responsável.</li>
        </ul>
      </section>
      <section>
        <h2>5. Conteúdo, imagens e arquivos</h2>
        <p>O usuário declara ter autorização para enviar textos, fotos e imagens. O envio concede ao JobFinder permissão limitada para armazenar e exibir esse conteúdo nas funcionalidades da plataforma. O usuário continua responsável pelo material enviado e por direitos de terceiros.</p>
      </section>
      <section>
        <h2>6. Condutas proibidas e limites de uso</h2>
        <p>É proibido fraudar cadastros, publicar conteúdo ilegal ou discriminatório, assediar usuários, extrair dados em massa, testar vulnerabilidades sem autorização, interferir no serviço ou utilizar informações obtidas no JobFinder para spam, venda de dados ou finalidade alheia a recrutamento.</p>
      </section>
      <section>
        <h2>7. Moderação e encerramento</h2>
        <p>Conteúdo, vagas ou contas que violem estes Termos poderão ser restringidos ou removidos. Quando possível e adequado, o usuário será informado. O usuário também pode deixar de usar o serviço e solicitar a exclusão da conta pelos canais de suporte.</p>
      </section>
      <section>
        <h2>8. Privacidade</h2>
        <p>O tratamento de dados pessoais é explicado na <Link to="/politica-de-privacidade">Política de Privacidade</Link>, que integra estes Termos e deve ser lida separadamente.</p>
      </section>
      <section>
        <h2>9. Atualizações e contato</h2>
        <p>Estes Termos podem ser atualizados para refletir mudanças legais ou funcionais. Quando uma nova versão exigir novo aceite, o acesso às áreas protegidas ficará suspenso até a manifestação do usuário. Dúvidas e solicitações podem ser enviadas pela página de <Link to="/suporte">Suporte</Link>.</p>
      </section>
    </LegalDocument>
  );
}
