# Evidência 1 - Mudança de Dependências

## Escopo

Esta evidência reúne as tasks relacionadas à adaptação do JobFinder ao ecossistema mais recente de bibliotecas e ferramentas usadas no projeto.

## Comportamento Antes da Adaptação

Antes das intervenções, comandos como `npm outdated --long` apontavam dependências desatualizadas no backend, frontend e raiz do projeto. Essas versões antigas não impediam o sistema de funcionar, mas representavam defasagem tecnológica e risco de incompatibilidade futura.

## Tasks Relacionadas

| Issue | Task | Situação |
| :-- | :-- | :-- |
| [#217](https://github.com/JobFinder-Project/JobFinder/issues/217) | Express 5 | Aprovada |
| [#218](https://github.com/JobFinder-Project/JobFinder/issues/218) | Multer 2.3.0 | Aprovada |
| [#219](https://github.com/JobFinder-Project/JobFinder/issues/219) | Stack MongoDB | Aprovada |
| [#220](https://github.com/JobFinder-Project/JobFinder/issues/220) | Toolchain frontend | Aprovada |
| [#221](https://github.com/JobFinder-Project/JobFinder/issues/221) | React 19 | Aprovada |
| [#222](https://github.com/JobFinder-Project/JobFinder/issues/222) | Dependências auxiliares | Aprovada em revisão técnica |

## Vídeos de Evidência

### #217 - Atualizar e adaptar backend para Express 5

**Versão anterior / comportamento inicial:**

https://github.com/user-attachments/assets/baff1e93-8270-42ea-892d-0d94d0374445

**Versão atualizada / comportamento após manutenção:**

https://github.com/user-attachments/assets/4db95e24-df38-4328-bd20-8823f1c46cc4

### #218 - Atualizar e adaptar upload de arquivos para Multer 2.3.0

**Versão anterior / comportamento inicial:**

https://github.com/user-attachments/assets/0ca39915-5ed8-4d5f-ad52-9a46fbac249d

**Versão atualizada / comportamento após manutenção:**

https://github.com/user-attachments/assets/d98f2d46-d5ff-40f1-949b-9e32de6fd778

### #219 - Atualizar stack MongoDB do backend

**Versão anterior / comportamento inicial:**

https://private-user-images.githubusercontent.com/68167990/650836526-6189e87c-7500-4e54-a255-a40c1b180d33.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODk1ODQ5NTQsIm5iZiI6MTc4OTU4NDY1NCwicGF0aCI6Ii82ODE2Nzk5MC82NTA4MzY1MjYtNjE4OWU4N2MtNzUwMC00ZTU0LWEyNTUtYTQwYzFiMTgwZDMzLndlYm0_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwOTE2JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDkxNlQxODUwNTRaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1lZjNlNTdiOTNmYjcyMjJlM2QxYTNmMzU2NjY1NDM2NTU1MzdkNjZkMzUxNDMyZTA2NGYzMGJlZDJkMmQ0ZTczJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZ3ZWJtIn0.Uic4fi5CUp-Km6RZmPkREl7VzwSRVTTwM145-DQ83gc

**Versão atualizada / comportamento após manutenção:**

https://github.com/user-attachments/assets/c746bd0b-f309-4a5f-9bb3-bd85b3886997

### #220 - Atualizar toolchain de build e testes do frontend

**Versão anterior / comportamento inicial:**

https://github.com/user-attachments/assets/c4b30cfc-dd70-4069-92be-8491841095db

**Versão atualizada / comportamento após manutenção:**

https://github.com/user-attachments/assets/ec9bf714-564b-4b5a-9d3e-66fe90fd7dc2

### #221 - Atualizar frontend para React 19

**Versão anterior / comportamento inicial:**

https://private-user-images.githubusercontent.com/68167990/650837855-bd3f5b77-c1ed-454e-8955-63a17b33c3f2.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODk2NjY1MTUsIm5iZiI6MTc4OTY2NjIxNSwicGF0aCI6Ii82ODE2Nzk5MC82NTA4Mzc4NTUtYmQzZjViNzctYzFlZC00NTRlLTg5NTUtNjNhMTdiMzNjM2YyLndlYm0_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwOTE3JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDkxN1QxNzMwMTVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1hNWU0N2JmMTM3OGMzZjU5NjVmNWVmNDJlM2FmZmUxMjc0MGZkM2NjN2IzNzdmM2E2MDk5ZjQyNTlkZWNjNTYzJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZ3ZWJtIn0.2Te3vkmpsbwSTxQuv_v3ipWs1lgdJjNYT-HBmtXRcnM

**Versão atualizada / comportamento após manutenção:**

https://github.com/user-attachments/assets/e67a7ca7-42f8-464b-bb27-bfa3fadcb0e5

### #222 - Atualizar dependências auxiliares do projeto

**Versão anterior / comportamento inicial:**

https://private-user-images.githubusercontent.com/68167990/650839596-d06a67f9-ce8f-411b-ac02-d4d049862233.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3OTAwMDUwNDQsIm5iZiI6MTc5MDAwNDc0NCwicGF0aCI6Ii82ODE2Nzk5MC82NTA4Mzk1OTYtZDA2YTY3ZjktY2U4Zi00MTFiLWFjMDItZDRkMDQ5ODYyMjMzLndlYm0_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwOTIxJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDkyMVQxNTMyMjRaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT05ZWYxZDQwMTI4M2NiMWU0YzAzMzE2MzU4NzFhMzE0NjQxMWMwNTRhMGE0ODk2MDQzMWY0YzcwMDRiZWZlYjE3JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZ3ZWJtIn0.iSglIA9Iu_2WPthiVylaa3hA1drgFKpentoA0Ur4_rI

**Versão atualizada / comportamento após manutenção:**

https://github.com/user-attachments/assets/3bc9114e-0964-4b87-9b42-f17fbdcc70a6

## Comandos de Evidência

### Express e parsers HTTP

```bash
cd backend
npm outdated --long express body-parser
```

### Upload de arquivos

```bash
cd backend
npm outdated --long multer
```

### Stack MongoDB

```bash
cd backend
npm outdated --long mongodb mongoose connect-mongo mongodb-memory-server
```

### Toolchain frontend

```bash
cd frontend
npm outdated --long vite vitest @vitest/coverage-v8 @vitejs/plugin-react jsdom @testing-library/jest-dom
```

### React

```bash
cd frontend
npm outdated --long react react-dom
```

### Dependências auxiliares

```bash
npm outdated --long concurrently
cd backend && npm outdated --long dotenv eslint eslint-plugin-prettier globals jest jsonwebtoken nodemon prettier supertest swagger-jsdoc
cd frontend && npm outdated --long @tanstack/react-query @testing-library/react @testing-library/user-event react-icons
```

## Validações Realizadas

As validações variaram por task, mas seguiram este conjunto principal:

- atualização dos manifests e lockfiles;
- execução dos testes backend;
- execução dos testes frontend;
- build do frontend;
- validação do Swagger;
- validação de fluxos impactados, como upload, sessão, MongoDB e fallback SPA;
- auditoria de dependências quando aplicável.

## Resultado

A adaptação de dependências reduziu a defasagem tecnológica do JobFinder e preparou o sistema para versões mais recentes das bibliotecas centrais do projeto. As mudanças foram separadas em PRs menores para reduzir risco e facilitar rollback ou correção isolada.
