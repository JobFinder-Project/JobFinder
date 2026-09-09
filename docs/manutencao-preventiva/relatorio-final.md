# Relatório Final da Manutenção Preventiva de Segurança

## 1. Visão Geral

Este relatório consolida as manutenções preventivas de segurança realizadas no JobFinder para reduzir riscos e facilitar mudanças futuras relacionadas a privacidade, exposição de dados e recuperação de conta.

As intervenções foram realizadas em duas frentes:

| ID | Tema | Issue | Pull Request | Status |
| --- | --- | --- | --- | --- |
| MP-01 | Minimização de dados sensíveis expostos pela API | [#205](https://github.com/JobFinder-Project/JobFinder/issues/205) | [#213](https://github.com/JobFinder-Project/JobFinder/pull/213) | Aprovada e integrada |
| MP-02 | Proteção de tokens de recuperação de senha | [#206](https://github.com/JobFinder-Project/JobFinder/issues/206) | [#208](https://github.com/JobFinder-Project/JobFinder/pull/208) | Aprovada e integrada |

Documento de diagnóstico relacionado:

- `docs/manutencao-preventiva/diagnostico-manutencao-preventiva.md`

Documentação desta manutenção:

- Issue: [#207](https://github.com/JobFinder-Project/JobFinder/issues/207)
- Branch: `207-feature-documentar-manutencao-preventiva-de-seguranca`

---

## 2. Situação Encontrada

### 2.1 Exposição excessiva de dados pela API

O JobFinder permite que empresas encontrem candidatos e gerenciem candidaturas. Esse comportamento faz parte da proposta do sistema e, no estado anterior, essas funcionalidades estavam operacionais.

A situação identificada não era uma falha direta no uso da aplicação, mas uma fragilidade estrutural no modo como a API organizava e retornava dados. Alguns endpoints retornavam informações pessoais e identificadores internos além do necessário para o contexto da tela.

O principal caso estava em:

```http
GET /api/empresa/candidatos/buscar
```

Antes da manutenção, uma conta de empresa podia consultar candidatos e receber informações como identificador interno, e-mail, telefone e demais dados do perfil profissional. A busca também podia ser feita sem termo efetivo, permitindo coleta ampla de candidatos.

Esse desenho dificultava uma evolução futura para regras mais rígidas de privacidade. Caso o projeto precisasse implementar consentimento de contato, limitar visibilidade de dados ou auditar acesso a informações pessoais, a equipe teria que revisar manualmente vários DTOs, endpoints e telas para descobrir onde cada campo era usado.

### 2.2 Token de recuperação em texto puro

O JobFinder também possui recuperação de senha por e-mail. Antes da manutenção, esse fluxo funcionava corretamente do ponto de vista do usuário: era possível solicitar o e-mail de recuperação, acessar o link e redefinir a senha.

Mesmo assim, havia uma característica de implementação que aumentava o risco futuro. O token temporário enviado no link era salvo em texto puro no banco de dados, no campo `resetToken`.

Isso significava que o mesmo valor capaz de redefinir a senha da conta ficava armazenado diretamente na base. Em um cenário futuro de auditoria, exposição de backup, acesso indevido ao banco ou inspeção por ferramenta interna, esse token poderia ser reutilizado enquanto estivesse válido.

---

## 3. Mudanças Futuras Consideradas

### 3.1 Política de privacidade e minimização de dados

A primeira mudança futura considerada foi a adoção de uma política mais clara de privacidade, consentimento e minimização de dados.

Essa evolução exigiria que a aplicação diferenciasse:

- dados visíveis ao próprio usuário;
- dados públicos de perfil profissional;
- dados de contato liberados apenas em contexto autorizado;
- dados internos usados somente pelo backend;
- identificadores necessários para operações específicas.

Com a implementação anterior, essa separação não estava clara. O risco era cada nova tela ou endpoint reaproveitar um DTO amplo e acabar expondo dados sensíveis sem necessidade.

### 3.2 Política segura de recuperação de conta

A segunda mudança futura considerada foi a evolução do fluxo de recuperação de senha para uma política em que tokens temporários não fiquem armazenados em formato reutilizável.

Essa evolução reduz o risco operacional caso dados de banco, backup ou ferramenta interna sejam expostos. Também deixa o sistema mais preparado para auditorias e para futuras regras de segurança sobre tokens temporários.

---

## 4. Por Que A Intervenção É Manutenção Preventiva

As alterações realizadas têm caráter preventivo porque não partiram de um fluxo quebrado para o usuário final.

Na exposição de dados, a busca de candidatos, a listagem de vagas e a gestão de candidaturas funcionavam. O problema era que a estrutura dos contratos da API era permissiva e pouco segmentada. Isso criava dificuldade para uma mudança futura de privacidade, pois qualquer tentativa de reduzir dados expostos poderia quebrar telas existentes ou deixar vazamentos residuais em endpoints não revisados.

Na recuperação de senha, o envio do link e a redefinição também funcionavam. O problema era o armazenamento do token bruto, que aumentava o impacto de um possível incidente futuro. A intervenção não corrigiu uma falha perceptível de funcionamento; ela reduziu antecipadamente o risco associado ao desenho interno do fluxo.

Por isso, as mudanças não se caracterizam como manutenção corretiva. Elas preservam o comportamento esperado e reorganizam a implementação para que futuras mudanças de segurança possam ser feitas com menor esforço, menor risco e contratos mais claros.

---

## 5. Soluções Implementadas

### 5.1 Minimização de dados sensíveis pela API

Foram aplicadas as seguintes alterações:

- Criação e ajuste de DTOs específicos por contexto;
- Separação entre dados de perfil próprio, dados públicos e dados de contato;
- Remoção de identificadores internos e dados sensíveis de respostas públicas;
- Bloqueio de busca global de candidatos sem critério mínimo;
- Validação de `vagaId` para limitar a busca a candidatos vinculados à vaga da empresa;
- Ajuste do dashboard da empresa para não buscar todos os candidatos automaticamente;
- Retorno de candidatos recentes apenas quando vinculados às vagas da empresa;
- Uso de DTO público de empresa na listagem de vagas;
- Ajuste do frontend para consumir os novos contratos;
- Atualização da documentação Swagger;
- Inclusão e ajuste de testes automatizados.

Principais componentes impactados:

- `backend/src/controllers/empresaController.js`
- `backend/src/controllers/vagasController.js`
- `backend/src/controllers/candidatoController.js`
- `backend/src/dtos/candidatoDto.js`
- `backend/src/dtos/candidaturaDto.js`
- `backend/src/dtos/empresaDto.js`
- `backend/src/dtos/vagaDto.js`
- `backend/src/docs/swagger`
- `frontend/src/pages/EmpresaDashboard/EmpresaDashboardPage.jsx`
- `frontend/src/pages/BuscaCandidatos/BuscaCandidatosPage.jsx`
- `frontend/src/features/candidato/CandidateCard.jsx`
- `frontend/src/pages/GestaoCandidaturas/GestaoCandidaturasPage.jsx`
- `frontend/src/services/empresaService.js`

### 5.2 Hash do token de recuperação de senha

Foram aplicadas as seguintes alterações:

- Geração do token bruto para envio no link de recuperação;
- Cálculo do hash SHA-256 do token bruto;
- Armazenamento apenas do hash no campo `resetToken`;
- Comparação por hash no momento da redefinição;
- Manutenção da expiração do token;
- Rejeição de tokens inexistentes, alterados ou expirados;
- Limpeza dos campos temporários após redefinição;
- Preservação do hash da nova senha com `bcrypt`;
- Ajuste dos testes de integração do fluxo de recuperação;
- Atualização da documentação Swagger.

Principais componentes impactados:

- `backend/src/controllers/authController.js`
- `backend/src/models/candidatoModel.js`
- `backend/src/models/empresaModel.js`
- `backend/tests/password-recovery.integration.test.js`
- `backend/src/docs/swagger/paths/authPaths.js`
- `frontend/src/pages/EsqueciSenha`
- `frontend/src/pages/RedefinirSenha/RedefinirSenhaPage.jsx`
- `frontend/src/services/authService.js`

---

## 6. Comparação Antes e Depois

| Área | Antes | Depois |
| --- | --- | --- |
| Busca de candidatos | Permitida sem critério efetivo e com retorno de dados de contato | Exige critério mínimo ou vínculo com vaga; retorna dados profissionais sem contato |
| DTO de candidato | DTO público continha identificador interno, e-mail e telefone | DTO público remove dados de contato e identificadores internos |
| Dashboard da empresa | Podia acionar busca ampla de candidatos | Usa candidatos recentes vinculados às vagas da empresa |
| Candidaturas da empresa | Candidato podia ser retornado com dados além do necessário | Resposta usa DTO específico para gestão de candidaturas |
| Listagem de vagas | Empresa podia ser retornada com dados internos e contato | Vaga usa DTO público de empresa |
| Token de recuperação | Token bruto salvo no banco | Apenas hash do token salvo no banco |
| Redefinição de senha | Busca feita pelo token bruto | Busca feita pelo hash do token recebido |
| Documentação da API | Contratos não detalhavam os níveis de exposição | Swagger registra respostas específicas e mais restritas |

---

## 7. Evidências

### 7.1 MP-01 - Minimização de dados sensíveis pela API

**Estado anterior**

https://github.com/user-attachments/assets/48650309-bda7-49f8-afc0-436284978fbd

https://github.com/user-attachments/assets/1b9d6652-84eb-4d80-85f9-c061ff8923ba

**Estado após a manutenção**

https://github.com/user-attachments/assets/d2273451-7e47-4206-ae8f-c7fc00a8926e

https://github.com/user-attachments/assets/7c3e1af2-e2ab-438a-8a7f-ff205a9c1c19

**Rastreabilidade**

- Issue: [#205](https://github.com/JobFinder-Project/JobFinder/issues/205)
- Branch: `205-upgrade-minimizar-dados-sensiveis-expostos-pela-api`
- Pull Request: [#213](https://github.com/JobFinder-Project/JobFinder/pull/213)

### 7.2 MP-02 - Proteção de tokens de recuperação de senha

**Estado anterior**

- https://github.com/user-attachments/assets/380e1b31-4eab-4d43-832f-26925717abb6

**Estado após a manutenção**

- https://github.com/user-attachments/assets/2a95d385-93ff-4169-bcf2-92a26941ec20

**Rastreabilidade**

- Issue: [#206](https://github.com/JobFinder-Project/JobFinder/issues/206)
- Branch: `206-upgrade-tokens-recuperacao-de-senha`
- Pull Request: [#208](https://github.com/JobFinder-Project/JobFinder/pull/208)

---

## 8. Validações Realizadas

### 8.1 MP-01

A revisão técnica da manutenção de minimização de dados validou:

- Bloqueio de busca global de candidatos sem critério;
- Ausência de identificador interno, CPF, e-mail e telefone na busca pública de candidatos;
- Validação de vínculo entre vaga e empresa ao usar `vagaId`;
- Redução dos dados retornados no dashboard da empresa;
- Uso de DTO público de empresa em vagas;
- Atualização das telas afetadas para os novos contratos;
- Atualização da documentação Swagger;
- Cobertura automatizada para evitar regressão.

### 8.2 MP-02

A revisão técnica da manutenção do token de recuperação validou:

- Envio do token bruto apenas no link de recuperação;
- Armazenamento apenas do hash SHA-256 no banco;
- Diferença entre token enviado e valor persistido;
- Redefinição de senha com token válido;
- Rejeição de token expirado;
- Rejeição de token inexistente ou alterado;
- Limpeza de `resetToken` e `resetTokenExpiration` após uso;
- Preservação do hash da nova senha;
- Cobertura automatizada para o fluxo atualizado.

---

## 9. Resultados Obtidos

As manutenções reduziram a exposição de detalhes internos da aplicação e criaram contratos mais explícitos entre backend e frontend.

No fluxo de dados pessoais, a aplicação passou a diferenciar respostas por contexto. Isso diminui a chance de novos endpoints reaproveitarem acidentalmente DTOs com dados sensíveis e facilita a evolução para regras futuras de privacidade, consentimento ou auditoria.

No fluxo de recuperação de senha, o banco deixou de armazenar um segredo diretamente reutilizável. Mesmo que o campo `resetToken` seja exposto em algum contexto futuro, o valor armazenado não corresponde mais ao token bruto enviado ao usuário.

Além disso, as duas intervenções preservaram a experiência funcional esperada. Usuários continuam buscando vagas, empresas continuam buscando perfis profissionais e gerenciando candidaturas, e o fluxo de recuperação de senha continua permitindo redefinição com token válido.

---

## 10. Conclusão

As intervenções realizadas caracterizam manutenção preventiva porque anteciparam dificuldades futuras de evolução do sistema.

A primeira intervenção preparou a API para mudanças de privacidade e minimização de dados ao separar DTOs por contexto e reduzir a exposição de campos sensíveis. A segunda preparou o fluxo de recuperação de conta para uma política mais segura de tratamento de tokens, reduzindo o risco associado ao armazenamento de segredos em texto puro.

Em ambos os casos, o comportamento funcional esperado foi preservado, enquanto a estrutura interna ficou mais segura, mais rastreável e mais preparada para mudanças futuras. A manutenção realizada reduziu riscos antes que eles se transformassem em falhas funcionais ou exigências urgentes de correção, o que sustenta seu caráter preventivo.
