# Especificação de Requisitos e Regras de Negócio - JobFinder

Este documento detalha os requisitos técnicos, qualidades de sistema e normas operacionais, servindo como guia para o desenvolvimento e validação das funcionalidades baseadas nas Histórias de Usuário.

---

## 1. Requisitos Funcionais (RF)

Os requisitos funcionais descrevem as funções e ações que o sistema deve executar.

| Identificação | Descrição                                                                                                                                             | Prioridade | Escopo |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------ |
| RF01          | O sistema deve permitir que usuários realizem login na aplicação.                                                                                     | Essencial  | Geral  |
| RF02          | O sistema deve permitir que candidatos cadastrem, visualizem e editem seu perfil profissional, incluindo dados pessoais, experiências, cursos e foto. | Essencial  | Geral  |
| RF03          | O sistema deve permitir que empregadores realizem o cadastro da empresa com dados oficiais e gerenciem seu perfil institucional.                      | Essencial  | Geral  |
| RF04          | O sistema deve permitir que candidatos autenticados pesquisem vagas, visualizem seus detalhes e se candidatem a oportunidades disponíveis.            | Essencial  | Geral  |
| RF05          | O sistema deve permitir que empregadores publiquem vagas, visualizem candidatos inscritos e gerenciem o status das candidaturas.                      | Essencial  | Geral  |
| RF06          | O sistema deve permitir que candidatos filtrem vagas por área de atuação ou palavras-chave.                                                           | Importante | Geral  |
| RF07          | O sistema deve permitir que empregadores filtrem e visualizem candidatos com base em qualificações e experiências específicas.                        | Importante | Geral  |
| RF08          | O sistema deve disponibilizar um painel centralizado para que empregadores gerenciem suas vagas e candidatos inscritos.                               | Importante | Geral  |
| RF09          | O sistema deve permitir que candidatos visualizem a página pública das empresas com informações institucionais e vagas ativas.                        | Desejável  | Futuro |
| RF10          | O sistema deve disponibilizar um canal de suporte para que usuários relatem problemas ou tirem dúvidas técnicas.                                      | Desejável  | Futuro |
| RF11          | O sistema deve permitir a interação entre candidatos para troca de experiências e informações profissionais.                                          | Desejável  | Futuro |

## 2. Requisitos Não Funcionais (RNF)

Os requisitos não funcionais definem os critérios de operação, qualidade e restrições técnicas (derivados dos critérios de aceitação).

| Identificação | Descrição                                                                                                           | Categoria        |
| ------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------- |
| RNF01         | O sistema deve garantir autenticação segura utilizando credenciais únicas e protegidas.                             | Segurança        |
| RNF02         | O link de recuperação de senha deve possuir tempo de validade máximo de 15 minutos.                                 | Segurança        |
| RNF03         | O sistema deve validar automaticamente o formato e a autenticidade do CNPJ informado no cadastro da empresa.        | Segurança        |
| RNF04         | O sistema deve permitir upload e exibição de fotos de perfil com tempo de resposta adequado.                        | Desempenho       |
| RNF05         | O sistema deve garantir consistência e integridade dos dados de vagas e candidaturas.                               | Confiabilidade   |
| RNF06         | O dashboard do empregador deve carregar corretamente imagens e dados das vagas e candidatos.                        | Confiabilidade   |
| RNF07         | O sistema deve permitir manutenção e evolução das funcionalidades sem impacto nas operações existentes.             | Manutenibilidade |
| RNF08         | O sistema deve ser acessível a partir dos principais navegadores modernos.                                          | Portabilidade    |
| RNF09         | O sistema deve proteger as interações entre candidatos contra conteúdos inadequados ou abusivos.                    | Segurança        |
| RNF10         | O sistema deve garantir a privacidade dos dados pessoais dos usuários, conforme as regulamentações aplicáveis.      | Segurança        |
| RNF11         | O sistema deve ser responsivo, garantindo uma experiência de usuário consistente em dispositivos móveis e desktops. | Usabilidade      |

## 3. Regras de Negócio (RN)

As regras de negócio definem as restrições e normas lógicas que regem o comportamento da aplicação.

| Identificação | Descrição                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------ |
| RN01          | Apenas usuários autenticados podem acessar as funcionalidades internas do sistema.                           |
| RN02          | O sistema deve identificar automaticamente o tipo de usuário (candidato ou empregador) após o login.         |
| RN03          | Um usuário não pode se candidatar mais de uma vez à mesma vaga.                                              |
| RN04          | Apenas empresas com cadastro validado podem publicar vagas na plataforma.                                    |
| RN05          | Apenas candidatos podem realizar candidaturas a vagas.                                                       |
| RN06          | Apenas empregadores podem alterar o status de candidatos para “Aceito” ou “Rejeitado”.                       |
| RN07          | O candidato pode desistir de uma candidatura a qualquer momento, desde que o processo não esteja finalizado. |
