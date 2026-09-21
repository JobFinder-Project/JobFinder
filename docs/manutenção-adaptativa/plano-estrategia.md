# Plano de Estratégia Adaptativa

## Objetivo

Este documento registra o plano de manutenção adaptativa aplicado ao JobFinder. A manutenção adaptativa tem como objetivo ajustar um sistema que já funciona a mudanças externas ao seu código original, como evolução de bibliotecas, novas regras de uso, exigências de privacidade, mudanças no contrato de APIs ou integração com outros sistemas.

No JobFinder, a estratégia foi organizada em três frentes:

1. Mudança de dependências e ambiente tecnológico.
2. Mudança de regulamentação e política de uso.
3. Migração do contrato HTTP exposto pela API.

Essas frentes não partem de um bug isolado. O sistema já funcionava antes das intervenções, mas precisava ser adaptado para continuar sustentável diante da evolução do ecossistema técnico, das expectativas de privacidade e do consumo da API por frontend, Swagger, Postman e futuras integrações.

## Critério de Seleção

As intervenções foram escolhidas quando atendiam a pelo menos um dos critérios abaixo:

- Responder a uma mudança em dependências, frameworks, bibliotecas ou ambiente de execução.
- Adaptar a aplicação a uma regra externa de privacidade, transparência ou controle de dados.
- Alterar um contrato HTTP consumido por clientes externos ao backend.
- Permitir evidência objetiva antes e depois da adaptação.
- Ter impacto real em backend, frontend, documentação, testes ou fluxo de uso.

Foram evitadas mudanças que fossem apenas refatoração interna sem efeito observável, correção de bug isolado ou expansão funcional sem relação com adaptação externa.

## Estratégia 1 - Mudança de Dependências

### Problema Adaptativo

O projeto possuía dependências desatualizadas em frontend, backend e scripts auxiliares. O uso contínuo de versões antigas aumenta o risco de incompatibilidade futura, dificulta atualizações posteriores e pode deixar a aplicação presa a comportamentos de versões anteriores.

### Adaptação Planejada

As dependências foram separadas por grupo de impacto para reduzir risco e facilitar revisão:

- Backend HTTP: Express 5.
- Upload de arquivos: Multer 2.3.0.
- Persistência: MongoDB, Mongoose, connect-mongo e mongodb-memory-server.
- Toolchain frontend: Vite, Vitest, plugin React, coverage e JSDOM.
- Biblioteca principal de interface: React 19.
- Dependências auxiliares de desenvolvimento, testes, documentação e utilitários.

### Justificativa Adaptativa

Essas tasks se caracterizam como manutenção adaptativa porque respondem à evolução do ambiente tecnológico do sistema. O JobFinder continuava funcionando com as versões antigas, mas precisava ser adaptado para operar com versões mais recentes das bibliotecas usadas na aplicação.

## Estratégia 2 - Mudança de Regulamentação e Política de Uso

### Problema Adaptativo

O JobFinder lida com dados pessoais e profissionais de candidatos e empresas, mas não possuía mecanismos completos para:

- exclusão segura da própria conta;
- aceite formal de Termos de Uso;
- disponibilização e aceite de Política de Privacidade;
- registro de versão e data de aceite no banco de dados;
- bloqueio de uso por usuários existentes que ainda não aceitaram documentos vigentes.

### Adaptação Planejada

Foram definidas intervenções para adequar a aplicação a práticas de transparência e controle de dados:

- criação de fluxo seguro para exclusão da própria conta;
- criação de Termos de Uso com aceite obrigatório;
- criação de Política de Privacidade com rota própria;
- persistência de aceite por usuário e versão do documento;
- bloqueio de acesso para usuários com consentimentos pendentes.

### Justificativa Adaptativa

Essas tasks se caracterizam como manutenção adaptativa porque respondem a uma mudança externa de política de uso e privacidade. A aplicação funcionava sem esses fluxos, mas precisava ser adaptada para uma realidade em que usuários devem conhecer regras da plataforma, entender o tratamento de dados e controlar a permanência da própria conta.

## Estratégia 3 - Migração do Contrato HTTP da API

### Problema Adaptativo

O backend expunha rotas com o prefixo técnico `/api` e mantinha endpoints de autenticação soltos na raiz do contrato. Exemplos:

- `/api/login`
- `/api/me`
- `/api/logout`
- `/api/candidato/dashboard`
- `/api/empresa/dashboard`
- `/api/vagas`

Essa estrutura funcionava, mas tornava o contrato mais verboso e menos organizado para clientes externos ao backend, como frontend, Swagger, Postman e futuras integrações.

### Adaptação Planejada

Foram definidas duas intervenções:

- remover o prefixo redundante `/api`;
- agrupar os endpoints de autenticação em `/auth`.

### Justificativa Adaptativa

Essas tasks se caracterizam como manutenção adaptativa porque migram o contrato HTTP consumido fora do backend. O comportamento anterior não era um defeito funcional, mas a aplicação precisava se adaptar a um contrato mais claro e organizado.

## Rastreabilidade das Tasks

| Issue | Task | Estratégia | Responsável | Complexidade / Prioridade | Status informado |
| :-- | :-- | :-- | :-- | :-- | :-- |
| [#217](https://github.com/JobFinder-Project/JobFinder/issues/217) | Atualizar e adaptar backend para Express 5 | Dependências | Luis Rauber (@luisrauber) | C1 / Urgent | Closed |
| [#218](https://github.com/JobFinder-Project/JobFinder/issues/218) | Atualizar e adaptar upload de arquivos para Multer 2.3.0 | Dependências | Mayro Sá (@mayro5a) | C2 / Medium | Closed |
| [#219](https://github.com/JobFinder-Project/JobFinder/issues/219) | Atualizar stack MongoDB do backend | Dependências | Felipe William (@FelipeWilliam-dev) | C1 / High | Closed |
| [#220](https://github.com/JobFinder-Project/JobFinder/issues/220) | Atualizar toolchain de build e testes do frontend | Dependências | João Carlos (@JoaoCarlos22) | C3 / Medium | Closed |
| [#221](https://github.com/JobFinder-Project/JobFinder/issues/221) | Atualizar frontend para React 19 | Dependências | Reyner Alegria (@reyneralegria13) | C3 / Medium | Closed |
| [#222](https://github.com/JobFinder-Project/JobFinder/issues/222) | Atualizar dependências auxiliares do projeto | Dependências | Felipe William (@FelipeWilliam-dev) | C1 / Medium | Open |
| [#223](https://github.com/JobFinder-Project/JobFinder/issues/223) | Atualizar regra para exclusão segura de conta | Regulamentação | Mayro Sá (@mayro5a) | C3 / High | Aprovada |
| [#224](https://github.com/JobFinder-Project/JobFinder/issues/224) | Atualizar Termos de Uso e aceite obrigatório no cadastro de usuários | Regulamentação | Reyner Alegria (@reyneralegria13) | C1 / High | Aprovada |
| [#227](https://github.com/JobFinder-Project/JobFinder/issues/227) | Atualizar rota de Política de Privacidade | Regulamentação | Reyner Alegria (@reyneralegria13) | Não informado | Aprovada |
| [#228](https://github.com/JobFinder-Project/JobFinder/issues/228) | Atualizar prefixo redundante `/api` das rotas | Contrato HTTP | Luis Rauber (@luisrauber) | Não informado / Urgent | Open / em validação |
| [#229](https://github.com/JobFinder-Project/JobFinder/issues/229) | Atualizar endpoints de autenticação para `/auth` | Contrato HTTP | Felipe William (@FelipeWilliam-dev) | C2 / Urgent | Open / em validação |

## Estratégia de Validação

As validações foram organizadas conforme o tipo de adaptação:

- Dependências: `npm outdated`, atualização de `package.json` e `package-lock.json`, instalação limpa, testes automatizados, build e auditoria quando aplicável.
- Regulamentação: verificação visual da interface, validação de rotas protegidas, persistência de aceite no banco, testes de segurança para impedir ações sobre dados de terceiros.
- Contrato HTTP: Postman, Swagger, serviços frontend, testes backend, testes frontend e validação de sessão.

## Evidências

As evidências estão separadas por estratégia:

- [Evidência 1 - Mudança de Dependências](./evidencia-1.md)
- [Evidência 2 - Mudança de Regulamentação](./evidencia-2.md)
- [Evidência 3 - Migração do Contrato HTTP da API](./evidencia-3.md)

## Plano de Evolução

As issues ainda abertas devem receber as evidências finais após validação completa. O objetivo da documentação é manter rastreável:

- qual era o comportamento antes;
- qual adaptação foi implementada;
- quais arquivos e componentes foram impactados;
- como a equipe validou a mudança;
- quais evidências comprovam o resultado.
