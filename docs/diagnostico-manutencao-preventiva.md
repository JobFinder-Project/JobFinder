# Diagnóstico de Manutenção Preventiva de Segurança

## 1. Objetivo

Este documento registra o diagnóstico técnico das oportunidades de manutenção preventiva de segurança identificadas no JobFinder.

A análise não parte de uma falha funcional imediata percebida pelo usuário, mas de características internas da implementação que poderiam dificultar mudanças futuras relacionadas a privacidade, controle de exposição de dados e proteção de tokens sensíveis.

Foram analisadas duas situações principais:

| ID | Problema identificado | Área principal | Intervenção relacionada |
| --- | --- | --- | --- |
| MP-01 | Exposição excessiva de dados pessoais e identificadores internos pela API | Backend / API / DTOs / Frontend | Issue #205 / PR #213 |
| MP-02 | Token de recuperação de senha armazenado em texto puro no banco de dados | Backend / Autenticação / Banco de dados | Issue #206 / PR #208 |

As duas situações foram tratadas como manutenção preventiva porque a aplicação continuava executando seus fluxos principais, mas a forma como esses fluxos estavam implementados criava risco e aumentava o esforço para evoluções futuras de segurança.

---

## 2. Por Que Esta Intervenção É Preventiva

Manutenção corretiva ocorre quando o objetivo principal é corrigir um defeito já manifestado no comportamento funcional esperado do sistema. Nesse caso, a aplicação falha para o usuário, quebra uma regra existente ou deixa de executar uma funcionalidade prevista.

As intervenções descritas neste documento têm outro foco. O sistema conseguia buscar candidatos, listar vagas, gerenciar candidaturas e redefinir senhas. A motivação da manutenção não foi restaurar um fluxo quebrado, mas reduzir riscos e preparar a estrutura para mudanças futuras.

No caso da exposição de dados, a aplicação funcionava, mas os contratos da API estavam permissivos demais. Essa estrutura dificultaria uma futura política de minimização de dados, consentimento ou auditoria, pois seria necessário descobrir manualmente quais rotas e telas dependiam de cada campo sensível.

No caso do token de recuperação, o fluxo de redefinição de senha também funcionava. O problema estava no desenho preventivo de segurança: o banco armazenava um segredo em formato diretamente reutilizável. A intervenção reduziu o impacto de uma possível exposição futura sem alterar a experiência esperada do usuário.

Portanto, o caráter preventivo está na antecipação de dificuldades futuras: a manutenção reorganiza contratos, oculta detalhes sensíveis e reduz dependências perigosas antes que uma mudança de privacidade ou segurança precise ser feita sob pressão.

---

## 3. MP-01 - Exposição Excessiva de Dados Pessoais e Identificadores Internos

### 3.1 Situação encontrada

O JobFinder possui fluxos em que empresas podem buscar candidatos, visualizar candidaturas e consultar vagas. Esses fluxos são esperados para a proposta do sistema, já que a plataforma conecta empresas e candidatos.

O problema identificado estava na quantidade de informação retornada pela API em alguns contextos. Algumas respostas continham dados pessoais e identificadores internos que não eram necessários para a tela ou para a ação em execução.

O caso mais representativo estava no endpoint:

```http
GET /api/empresa/candidatos/buscar
```

No estado anterior, uma conta de empresa conseguia consultar candidatos e receber dados como:

- identificador interno do candidato;
- nome;
- e-mail;
- telefone;
- educação;
- qualificação;
- cursos;
- descrição;
- habilidades técnicas;
- idiomas;
- imagem.

Além disso, a busca podia ser feita sem termo efetivo de pesquisa. Na prática, uma empresa autenticada poderia solicitar a rota sem um critério relevante e receber uma lista ampla de perfis de candidatos.

Essa situação não impedia o funcionamento da aplicação. Pelo contrário, a busca funcionava. O ponto de manutenção preventiva é que ela funcionava de uma forma que expunha mais dados do que o necessário e tornava mais difícil controlar futuramente quem pode ver cada tipo de informação.

### 3.2 Localização

Componentes relacionados ao problema:

- `backend/src/controllers/empresaController.js`
  - `buscarCandidatos`
  - `buscarCandidaturas`
- `backend/src/controllers/vagasController.js`
  - `buscarVagas`
- `backend/src/controllers/candidatoController.js`
  - listagem de vagas e candidaturas no contexto do candidato
- `backend/src/dtos/candidatoDto.js`
- `backend/src/dtos/candidaturaDto.js`
- `backend/src/dtos/empresaDto.js`
- `backend/src/dtos/vagaDto.js`
- `frontend/src/pages/EmpresaDashboard/EmpresaDashboardPage.jsx`
- `frontend/src/pages/BuscaCandidatos/BuscaCandidatosPage.jsx`
- `frontend/src/features/candidato/CandidateCard.jsx`
- `frontend/src/pages/GestaoCandidaturas/GestaoCandidaturasPage.jsx`
- `frontend/src/services/empresaService.js`
- `backend/src/docs/swagger`

### 3.3 Funcionamento da implementação anterior

A implementação anterior reutilizava DTOs amplos em contextos diferentes. O mesmo tipo de objeto podia ser retornado em fluxos internos, em listagens, em buscas e em respostas que não precisavam conter todos os campos do modelo.

Isso criava uma aproximação perigosa entre o modelo do banco de dados e o contrato externo da API. Quando um DTO carregava campos como identificador interno, e-mail ou telefone, qualquer endpoint que reutilizasse esse DTO poderia acabar expondo esses dados.

No fluxo de busca de candidatos, por exemplo, uma empresa precisava encontrar perfis profissionais compatíveis com uma vaga. Para essa etapa, dados como nome, qualificação, formação e habilidades podem ser suficientes. O contato direto do candidato só faz sentido em um contexto mais restrito, como uma candidatura recebida ou uma regra explícita de autorização.

Também havia impacto no dashboard da empresa. A tela principal podia acionar uma busca ampla de candidatos para preencher candidatos recentes, em vez de trabalhar apenas com candidatos vinculados às vagas daquela empresa.

Outro ponto estava na listagem de vagas. Ao retornar a empresa associada à vaga, a API podia expor dados institucionais internos ou de contato que não eram necessários para uma visualização pública da vaga.

### 3.4 Mudança futura de referência

A mudança futura considerada é a adoção de uma política mais rígida de privacidade, consentimento e minimização de dados.

Um cenário plausível para o JobFinder seria estabelecer que:

- empresas só visualizam dados de contato de candidatos após candidatura, vínculo com vaga ou consentimento explícito;
- a busca global de candidatos retorna apenas dados profissionais mínimos;
- identificadores internos do banco não são expostos quando não são necessários para a próxima operação;
- cada endpoint possui um contrato claro sobre quais dados pode retornar;
- a documentação da API diferencia dados públicos, dados privados e dados liberados por contexto.

Essa mudança é coerente com a evolução natural de uma plataforma de recrutamento. À medida que o sistema cresce, torna-se necessário controlar melhor quais dados pessoais são exibidos, por quem, em qual momento e com qual justificativa.

### 3.5 Dificuldade causada pela estrutura anterior

Com DTOs amplos e reaproveitados, uma futura política de privacidade exigiria revisar manualmente várias rotas e telas para descobrir onde cada campo sensível estava sendo usado.

Essa estrutura aumentava o risco de três problemas:

1. Remover um campo sensível de um DTO e quebrar uma tela legítima que dependia dele.
2. Manter um dado sensível exposto em algum endpoint por esquecimento.
3. Criar novos endpoints reaproveitando DTOs permissivos, repetindo a exposição indevida.

O custo de manutenção também aumentaria porque a regra de exposição não estava centralizada em contratos específicos. A equipe precisaria raciocinar rota por rota, tela por tela, campo por campo.

### 3.6 Conceito técnico relacionado

A intervenção está relacionada principalmente a ocultamento de informação e redução do impacto de mudanças em interfaces.

Ao criar DTOs específicos por contexto, a API deixa de expor diretamente a estrutura do banco e passa a oferecer contratos mais claros. Assim, detalhes internos permanecem ocultos e mudanças futuras nas regras de visibilidade podem ser feitas em pontos mais controlados.

### 3.7 Manutenção preventiva proposta

A manutenção preventiva proposta foi:

- separar DTOs por contexto de exposição;
- diferenciar perfil próprio, perfil público, resumo profissional e dados de contato;
- impedir busca global de candidatos sem critério mínimo;
- permitir busca sem termo apenas quando vinculada a uma vaga da empresa;
- validar se a vaga consultada pertence à empresa autenticada;
- remover identificadores internos e dados de contato de respostas públicas;
- ajustar o dashboard da empresa para trabalhar com candidatos vinculados às suas vagas;
- ajustar o frontend para não depender de identificadores removidos;
- atualizar a documentação Swagger com os novos contratos;
- adicionar testes para evitar regressão da política de exposição.

### 3.8 Critérios de verificação

A manutenção é considerada bem-sucedida quando:

- `GET /api/empresa/candidatos/buscar` rejeita buscas globais vazias ou com termo muito curto;
- a busca pública de candidatos não retorna `_id`, CPF, e-mail ou telefone;
- a busca por `vagaId` valida se a vaga pertence à empresa autenticada;
- o dashboard da empresa não busca todos os candidatos automaticamente;
- candidatos recentes do dashboard são limitados a candidatos vinculados às vagas da empresa;
- a gestão de candidaturas retorna apenas os dados necessários ao contexto;
- a listagem de vagas usa dados públicos de empresa;
- as telas afetadas continuam funcionando com os novos contratos;
- a documentação Swagger reflete os DTOs específicos;
- os testes automatizados cobrem a nova política de exposição.

### 3.9 Evidências

**Estado anterior**

- https://github.com/user-attachments/assets/48650309-bda7-49f8-afc0-436284978fbd
- https://github.com/user-attachments/assets/1b9d6652-84eb-4d80-85f9-c061ff8923ba

**Estado após a manutenção**

- https://github.com/user-attachments/assets/d2273451-7e47-4206-ae8f-c7fc00a8926e
- https://github.com/user-attachments/assets/7c3e1af2-e2ab-438a-8a7f-ff205a9c1c19

---

## 4. MP-02 - Token de Recuperação de Senha Armazenado em Texto Puro

### 4.1 Situação encontrada

O JobFinder possui um fluxo de recuperação de senha por e-mail. Esse fluxo permite que usuários solicitem um link temporário para redefinir a senha da conta.

No estado anterior, o fluxo funcionava, mas o token de recuperação era salvo em texto puro no banco de dados, no campo `resetToken`.

O mesmo valor enviado ao usuário no link de recuperação também ficava persistido no banco. Enquanto esse token estivesse válido, ele poderia ser usado diretamente para redefinir a senha da conta.

Essa situação não representava uma falha visível no uso comum da aplicação. O usuário conseguia solicitar recuperação, receber o link e alterar a senha. O problema estava no risco futuro associado ao armazenamento de um segredo sensível em formato reutilizável.

### 4.2 Localização

Componentes relacionados ao problema:

- `backend/src/controllers/authController.js`
  - `enviarRecuperarSenha`
  - `redefinirSenha`
- `backend/src/models/candidatoModel.js`
  - `resetToken`
  - `resetTokenExpiration`
- `backend/src/models/empresaModel.js`
  - `resetToken`
  - `resetTokenExpiration`
- `backend/tests/password-recovery.integration.test.js`
- `frontend/src/pages/EsqueciSenha`
- `frontend/src/pages/RedefinirSenha/RedefinirSenhaPage.jsx`
- `frontend/src/services/authService.js`
- `backend/src/docs/swagger/paths/authPaths.js`

### 4.3 Funcionamento da implementação anterior

Antes da manutenção, o fluxo seguia estes passos:

1. O usuário informava o e-mail para recuperação de senha.
2. O backend gerava um token aleatório.
3. O token bruto era salvo diretamente no banco de dados.
4. O link com o mesmo token era enviado por e-mail.
5. Ao redefinir a senha, o backend procurava um usuário cujo `resetToken` fosse igual ao token recebido pela URL.
6. Se o token ainda estivesse dentro do prazo, a senha era alterada.

Essa abordagem é simples e funcional, mas deixa o banco com um valor sensível diretamente utilizável.

### 4.4 Mudança futura de referência

A mudança futura considerada é preparar o sistema para uma política mais segura de recuperação de conta, em que tokens temporários sejam tratados como segredos e não fiquem armazenados em formato reutilizável.

Essa política facilita evoluções como:

- auditoria de segurança do fluxo de recuperação;
- redução de impacto em caso de exposição de banco ou backup;
- rotação ou troca do formato de token sem alterar o comportamento externo;
- endurecimento das regras de expiração;
- padronização do tratamento de tokens temporários.

### 4.5 Dificuldade causada pela estrutura anterior

A estrutura anterior dificultava essa evolução porque a persistência dependia do token em sua forma original.

Caso a equipe precisasse adotar uma política mais segura no futuro, seria necessário alterar geração, armazenamento, consulta, testes e documentação do fluxo de recuperação. Além disso, enquanto a mudança não fosse feita, qualquer exposição do banco poderia revelar tokens temporários diretamente utilizáveis.

A dificuldade, portanto, não estava em o fluxo "não funcionar", mas no fato de ele funcionar com um desenho que aumentava o risco operacional e deixava a aplicação menos preparada para exigências futuras de segurança.

### 4.6 Conceito técnico relacionado

A intervenção está relacionada ao ocultamento de informação e à proteção de detalhes sensíveis de implementação.

O token bruto passa a existir apenas no canal em que é necessário: o link enviado ao usuário. O banco armazena somente uma representação derivada, o hash, que não pode ser usado diretamente como token de redefinição.

### 4.7 Manutenção preventiva proposta

A manutenção preventiva proposta foi:

- gerar o token bruto para envio ao usuário;
- calcular o hash SHA-256 do token;
- salvar apenas o hash no campo `resetToken`;
- manter a expiração em `resetTokenExpiration`;
- ao receber o token pela URL, calcular novamente seu hash;
- consultar o usuário pelo hash e pela expiração;
- rejeitar tokens expirados, inexistentes ou alterados;
- limpar os campos temporários após redefinir a senha;
- manter a nova senha protegida por hash com `bcrypt`;
- ajustar testes para validar que o token bruto não fica armazenado.

### 4.8 Critérios de verificação

A manutenção é considerada bem-sucedida quando:

- o link de recuperação continua sendo enviado ao e-mail informado;
- o banco não armazena o token bruto em texto puro;
- o valor persistido em `resetToken` corresponde ao hash do token;
- a redefinição com token válido continua funcionando;
- token expirado continua sendo rejeitado;
- token inexistente ou alterado continua sendo rejeitado;
- após redefinir a senha, `resetToken` e `resetTokenExpiration` são limpos;
- a nova senha continua sendo armazenada com hash;
- a documentação Swagger reflete o comportamento seguro;
- os testes automatizados cobrem o fluxo atualizado.

### 4.9 Evidências

**Estado anterior**

- https://github.com/user-attachments/assets/380e1b31-4eab-4d43-832f-26925717abb6

**Estado após a manutenção**

- https://github.com/user-attachments/assets/2a95d385-93ff-4169-bcf2-92a26941ec20

---

## 5. Síntese do Diagnóstico

| ID | Característica anterior | Mudança futura dificultada | Intervenção preventiva |
| --- | --- | --- | --- |
| MP-01 | DTOs e endpoints retornavam dados além do necessário por contexto | Política de privacidade, consentimento e minimização de dados | Separar DTOs por contexto e restringir respostas da API |
| MP-02 | Token de recuperação salvo em texto puro | Política mais segura para recuperação de conta e redução de impacto em exposição de banco | Armazenar apenas hash do token e comparar hash na redefinição |

As duas intervenções reduzem o acoplamento entre detalhes internos da implementação e os consumidores externos da API. Também tornam a aplicação mais preparada para evoluções futuras de segurança sem alterar o comportamento funcional esperado para usuários finais.
