# Relatório Final de Manutenção Adaptativa

## Resumo

Este relatório consolida as intervenções de manutenção adaptativa realizadas no JobFinder. O objetivo foi adaptar o sistema a mudanças externas de tecnologia, política de uso e contrato de API, mantendo rastreabilidade entre problemas identificados, tasks, responsáveis, arquivos impactados, validações e evidências.

As adaptações foram distribuídas em três estratégias:

1. Atualização de dependências e ambiente tecnológico.
2. Adequação a regulamentação e políticas de privacidade/uso.
3. Migração do contrato HTTP da API.

## Síntese das Intervenções

| Estratégia | Problema antes | Adaptação aplicada | Resultado esperado |
| :-- | :-- | :-- | :-- |
| Dependências | Bibliotecas e ferramentas desatualizadas em backend, frontend e raiz | Atualização gradual por grupo de impacto | Stack mais atual, menor defasagem tecnológica e compatibilidade validada |
| Regulamentação | Ausência de exclusão de conta, termos reais, política real e registro de aceite | Fluxos de exclusão segura, Termos de Uso, Política de Privacidade e consentimentos | Maior transparência, controle do usuário e rastreabilidade de aceite |
| Contrato HTTP | Rotas com `/api` e autenticação fora de grupo específico | Migração para endpoints sem prefixo redundante e autenticação em `/auth` | Contrato mais claro para frontend, Swagger, Postman e integrações |

## Rastreabilidade

| Issue | Task | Estratégia | Responsável | Estado na documentação |
| :-- | :-- | :-- | :-- | :-- |
| [#217](https://github.com/JobFinder-Project/JobFinder/issues/217) | Atualizar e adaptar backend para Express 5 | Dependências | Luis Rauber (@luisrauber) | Aprovada |
| [#218](https://github.com/JobFinder-Project/JobFinder/issues/218) | Atualizar e adaptar upload de arquivos para Multer 2.3.0 | Dependências | Mayro Sá (@mayro5a) | Aprovada |
| [#219](https://github.com/JobFinder-Project/JobFinder/issues/219) | Atualizar stack MongoDB do backend | Dependências | Felipe William (@FelipeWilliam-dev) | Aprovada |
| [#220](https://github.com/JobFinder-Project/JobFinder/issues/220) | Atualizar toolchain de build e testes do frontend | Dependências | João Carlos (@JoaoCarlos22) | Aprovada |
| [#221](https://github.com/JobFinder-Project/JobFinder/issues/221) | Atualizar frontend para React 19 | Dependências | Reyner Alegria (@reyneralegria13) | Aprovada |
| [#222](https://github.com/JobFinder-Project/JobFinder/issues/222) | Atualizar dependências auxiliares do projeto | Dependências | Felipe William (@FelipeWilliam-dev) | Aprovada |
| [#223](https://github.com/JobFinder-Project/JobFinder/issues/223) | Atualizar regra para exclusão segura de conta | Regulamentação | Mayro Sá (@mayro5a) | Implementada / em validação |
| [#224](https://github.com/JobFinder-Project/JobFinder/issues/224) | Atualizar Termos de Uso e aceite obrigatório no cadastro de usuários | Regulamentação | Reyner Alegria (@reyneralegria13) | Implementada / em validação |
| [#227](https://github.com/JobFinder-Project/JobFinder/issues/227) | Atualizar rota de Política de Privacidade | Regulamentação | Reyner Alegria (@reyneralegria13) | Implementada / em validação |
| [#228](https://github.com/JobFinder-Project/JobFinder/issues/228) | Atualizar prefixo redundante `/api` das rotas | Contrato HTTP | Luis Rauber (@luisrauber) | Implementada / em validação |
| [#229](https://github.com/JobFinder-Project/JobFinder/issues/229) | Atualizar endpoints de autenticação para `/auth` | Contrato HTTP | Felipe William (@FelipeWilliam-dev) | Implementada / em validação |

## Componentes Impactados

### Backend

- `backend/package.json`
- `backend/package-lock.json`
- `backend/src/app.js`
- `backend/src/routes`
- `backend/src/controllers`
- `backend/src/models`
- `backend/src/dtos`
- `backend/src/docs/swagger`
- `backend/tests`

### Frontend

- `frontend/package.json`
- `frontend/package-lock.json`
- `frontend/vite.config.js`
- `frontend/src/services`
- `frontend/src/contexts/AuthContext.jsx`
- `frontend/src/pages`
- `frontend/src/components`
- `frontend/src/features`
- `frontend/src/services/__tests__`

### Documentação

- Swagger backend.
- Relatórios de revisão técnica por task.
- Evidências antes/depois em issues e PRs.
- Documentação de manutenção adaptativa nesta pasta.

## Comparação Antes e Depois

### Dependências

Antes:

- Express, MongoDB/Mongoose, Multer, Vite/Vitest, React e dependências auxiliares apareciam como desatualizadas.
- Algumas atualizações exigiam adaptação de compatibilidade, como fallback SPA no Express 5 e execução de testes com stack MongoDB atualizada.

Depois:

- Dependências centrais foram atualizadas por grupo de impacto.
- Testes e builds foram executados para validar compatibilidade.
- Alterações de maior risco foram isoladas em PRs próprios.

### Regulamentação

Antes:

- Usuário não tinha fluxo claro para excluir a própria conta.
- Termos e Política de Privacidade não tinham rotas reais e aceite persistido.
- Usuários existentes não tinham fluxo para aceitar documentos vigentes.

Depois:

- Foram planejados e implementados fluxos de exclusão segura, Termos de Uso, Política de Privacidade e registro de aceite.
- A documentação prevê bloqueio para consentimentos pendentes e armazenamento de data/versão de aceite.
- As evidências finais das tasks em validação devem ser adicionadas após aprovação.

### Contrato HTTP

Antes:

- Endpoints eram consumidos com prefixo `/api`.
- Autenticação ficava espalhada na raiz do contrato.
- Swagger e frontend dependiam da base antiga.

Depois:

- O contrato foi migrado para rotas sem prefixo redundante.
- Endpoints de autenticação foram planejados para `/auth`.
- Frontend, Swagger, Postman e testes foram considerados como consumidores do contrato.

## Evidências

As evidências foram separadas por estratégia:

- [Evidência 1 - Mudança de Dependências](./evidencia-1.md)
- [Evidência 2 - Mudança de Regulamentação](./evidencia-2.md)
- [Evidência 3 - Migração do Contrato HTTP da API](./evidencia-3.md)

Algumas tasks ainda estavam em revisão no momento da criação desta documentação. Por isso, os campos de evidência final permanecem como espaço reservado para os vídeos que serão anexados após validação.

## Validação Geral

Foram usados os seguintes tipos de validação:

- inspeção estática do diff;
- testes automatizados backend;
- testes automatizados frontend;
- build do frontend;
- auditoria de dependências quando aplicável;
- validação por Postman;
- validação visual da interface;
- conferência do Swagger;
- revisão técnica por task.

## Conclusão

A manutenção adaptativa realizada preparou o JobFinder para mudanças externas importantes: evolução de dependências, adequação a políticas de privacidade/uso e reorganização do contrato HTTP. A divisão em tasks menores ajudou a controlar riscos, facilitar revisão e manter rastreabilidade.

As tasks de dependências já possuem validações e evidências de comportamento anterior e posterior. As tasks de regulamentação e contrato HTTP que ainda estão em validação devem receber seus vídeos finais assim que forem aprovadas. Mesmo assim, o conjunto documentado já apresenta o plano, a estratégia, os componentes afetados e a comparação entre comportamento anterior e comportamento esperado após as adaptações.
