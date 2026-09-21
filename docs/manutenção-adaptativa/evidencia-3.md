# Evidência 3 - Migração do Contrato HTTP da API

## Escopo

Esta evidência reúne as tasks relacionadas à migração do contrato HTTP exposto pelo backend e consumido por frontend, Swagger, Postman e integrações futuras.

## Comportamento Antes da Adaptação

Antes das intervenções, o JobFinder usava endpoints com o prefixo `/api` e mantinha endpoints de autenticação soltos na raiz da API:

- `POST /api/login`
- `GET /api/me`
- `GET /api/logout`
- `POST /api/recuperar_senha`
- `POST /api/redefinir_senha/:token`
- `GET /api/candidato/dashboard`
- `GET /api/empresa/dashboard`
- `GET /api/vagas`

Esse contrato funcionava, mas era mais verboso e menos organizado para consumo externo.

## Tasks Relacionadas

| Issue | Task | Situação |
| :-- | :-- | :-- |
| [#228](https://github.com/JobFinder-Project/JobFinder/issues/228) | Remover prefixo redundante `/api` | Em validação |
| [#229](https://github.com/JobFinder-Project/JobFinder/issues/229) | Agrupar autenticação em `/auth` | Em validação |

## Vídeos de Evidência

### #228 - Atualizar prefixo redundante `/api` das rotas

**Versão anterior / comportamento inicial:**

https://github.com/user-attachments/assets/59d96d10-194d-487f-8938-e5ba836622b9

**Versão atualizada / comportamento após manutenção:**

Adicionar aqui o link da evidência final após validação.

### #229 - Atualizar endpoints de autenticação para `/auth`

**Versão anterior / comportamento inicial:**

https://github.com/user-attachments/assets/daf5e3ca-ba08-4359-bd9b-f224f4f0cff9

**Captura complementar do Swagger antes da adaptação:**

https://github.com/user-attachments/assets/6b8c120d-ade3-49bb-a9d8-958907cdc481

**Versão atualizada / comportamento após manutenção:**

Adicionar aqui o link da evidência final após validação.

## Evidência Esperada - Remoção do Prefixo `/api`

### Antes

Registrar no Postman:

1. `GET http://localhost:3000/api/me` respondendo no contrato antigo.
2. `GET http://localhost:3000/me` retornando rota inexistente.
3. `GET http://localhost:3000/api/vagas` respondendo no contrato antigo com sessão autenticada.
4. `GET http://localhost:3000/vagas` retornando rota inexistente.
5. Swagger apontando para base com `/api`.

### Depois

Registrar no Postman:

1. `GET http://localhost:3000/me` respondendo no contrato novo.
2. `GET http://localhost:3000/vagas` respondendo no contrato novo com sessão autenticada.
3. `GET http://localhost:3000/docs` carregando o Swagger.
4. `GET http://localhost:3000/docs.json` retornando o documento OpenAPI.
5. Rotas antigas com `/api` retornando `404`, caso a política escolhida seja remoção sem alias.

## Evidência Esperada - Autenticação em `/auth`

### Antes

Registrar no Postman:

1. `POST /login` ou `POST /api/login` funcionando no contrato antigo.
2. `GET /me` ou `GET /api/me` funcionando no contrato antigo.
3. `GET /logout` ou `GET /api/logout` funcionando no contrato antigo.
4. `POST /auth/login` retornando rota inexistente.
5. Swagger exibindo endpoints de autenticação fora do grupo `/auth`.

### Depois

Registrar no Postman:

1. `POST /auth/login` autenticando usuário.
2. `GET /auth/me` retornando a sessão autenticada.
3. `POST /auth/logout` encerrando a sessão.
4. `POST /auth/recuperar-senha` disparando o fluxo de recuperação.
5. `POST /auth/redefinir-senha/:token` redefinindo a senha com token válido.
6. Swagger exibindo endpoints de autenticação agrupados em `/auth`.

## Validações Esperadas

- Frontend não depende mais de `API_BASE_URL = '/api'`.
- Serviços frontend usam o novo contrato.
- Swagger documenta a nova base.
- Testes backend chamam as rotas novas.
- Testes frontend validam URLs novas.
- Sessão continua funcionando após login.
- Logout realmente encerra a sessão.
- Rotas protegidas continuam bloqueando usuários sem sessão.
- Upload de vaga continua funcionando após a mudança de base.

## Observação

As issues #228 e #229 ainda estavam em validação no momento de criação deste documento. Os links finais de evidência devem ser adicionados após aprovação da revisão técnica.
