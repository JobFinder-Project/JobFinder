# Evidência 2 - Mudança de Regulamentação e Política de Uso

## Escopo

Esta evidência reúne as tasks relacionadas à adaptação do JobFinder a uma política mais clara de privacidade, transparência, aceite de documentos e controle de conta pelo usuário.

## Comportamento Antes da Adaptação

Antes das intervenções, o sistema apresentava três lacunas principais:

- não havia fluxo claro para exclusão da própria conta;
- os links de Termos de Uso e Política de Privacidade não levavam a documentos reais;
- o cadastro não registrava aceite, data e versão dos documentos legais no banco de dados.

Esses pontos não impediam o uso básico da aplicação, mas dificultavam a adaptação do sistema a regras externas de privacidade e política de uso.

## Tasks Relacionadas

| Issue | Task | Situação |
| :-- | :-- | :-- |
| [#223](https://github.com/JobFinder-Project/JobFinder/issues/223) | Exclusão segura de conta | Aprovada |
| [#224](https://github.com/JobFinder-Project/JobFinder/issues/224) | Termos de Uso e aceite obrigatório | Aprovada |
| [#227](https://github.com/JobFinder-Project/JobFinder/issues/227) | Política de Privacidade | Aprovada |

## Vídeos de Evidência

### #223 - Atualizar regra para exclusão segura de conta

**Versão anterior / comportamento inicial:**

https://github.com/user-attachments/assets/33009fba-9dbe-4652-9eb3-8fbacec9e499

**Versão atualizada / comportamento após manutenção:**

https://github.com/user-attachments/assets/2d26b362-e3f8-45f2-9005-1b081d83e09f

### #224 - Atualizar Termos de Uso e aceite obrigatório no cadastro de usuários

**Versão anterior / comportamento inicial:**

https://private-user-images.githubusercontent.com/68167990/650851953-cd1a4237-f0a1-404e-ab7c-35d17920e57d.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3OTAwMDcwNjEsIm5iZiI6MTc5MDAwNjc2MSwicGF0aCI6Ii82ODE2Nzk5MC82NTA4NTE5NTMtY2QxYTQyMzctZjBhMS00MDRlLWFiN2MtMzVkMTc5MjBlNTdkLndlYm0_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwOTIxJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDkyMVQxNjA2MDFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT05NGI0NjNhN2I0ZTIyYjVlOGQwNGRjZGUxZTdlZmZiZjJjN2Q2ZTQyM2VmYTk2YTFmZTk4Yzk3ZTE0NGU0OGQyJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZ3ZWJtIn0.kyLsN50VoSojAyNAKf51PeKHDHwnQVredqlKep6fcrg

**Versão atualizada / cadastro de candidato:**

https://github.com/user-attachments/assets/35a539ee-d59f-46c7-b97a-5da773fc624b

**Versão atualizada / cadastro de empresa:**

https://github.com/user-attachments/assets/6c85bd13-96bf-4227-8b05-32a7ce790351

**Versão atualizada / login:**

https://github.com/user-attachments/assets/11975c27-7926-4162-8706-4b7f67c3f9fe

### #227 - Atualizar rota de Política de Privacidade

**Tela de Termos de Uso e Política de Privacidade no login:**

https://github.com/user-attachments/assets/05f51823-f90d-44f3-b9a5-00037bd18f58

**Testes automatizados:**

https://github.com/user-attachments/assets/2e530f20-0941-4f9e-b4f3-e9cbb4a25aa3

## Validações Esperadas

- Usuário autenticado só exclui a própria conta.
- Exclusão exige senha atual.
- Sessão é encerrada após exclusão.
- Candidato não exclui empresa.
- Empresa não exclui candidato.
- Termos de Uso possuem rota pública.
- Política de Privacidade possui rota pública.
- Cadastro exige aceite explícito dos documentos obrigatórios.
- Banco registra data e versão do aceite.
- Usuários antigos com pendência são bloqueados até aceitar os documentos vigentes.
- Usuário que recusa os documentos é desconectado e enviado para área pública.

## Resultado Esperado

Ao final da adaptação, o JobFinder passa a oferecer maior transparência e controle ao usuário, além de registrar formalmente os consentimentos necessários para uso da plataforma.
