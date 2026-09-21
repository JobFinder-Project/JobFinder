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

https://github.com/user-attachments/assets/59d96d10-194d-487f-8938-e5ba836622b9

Local da definição do endpoint no código fonte:
 
<img width="685" height="240" alt="Image" src="https://github.com/user-attachments/assets/66cd7eab-2bb5-43f7-adb0-748f7e173673" />

### Depois

**Sessão do candidato:**  

https://github.com/user-attachments/assets/677aab06-24c9-4cad-a7f7-2c4140bbbce1

**Sessão da empresa:**  

https://github.com/user-attachments/assets/3625d0da-4695-4211-8e09-ebb505944ffc

## Evidência Esperada - Autenticação em `/auth`

### Antes

https://github.com/user-attachments/assets/daf5e3ca-ba08-4359-bd9b-f224f4f0cff9

Captura de tela das rotas no Swagger UI:

<img width="1382" height="440" alt="Image" src="https://github.com/user-attachments/assets/6b8c120d-ade3-49bb-a9d8-958907cdc481" />


### Depois

**Sessão do candidato:**  

https://github.com/user-attachments/assets/677aab06-24c9-4cad-a7f7-2c4140bbbce1

**Sessão da empresa:**  

https://github.com/user-attachments/assets/3625d0da-4695-4211-8e09-ebb505944ffc


## Observação

As issues #228 e #229 ainda estavam em validação no momento de criação deste documento. Os links finais de evidência devem ser adicionados após aprovação da revisão técnica.
