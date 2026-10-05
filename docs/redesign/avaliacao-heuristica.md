# Avaliação Heurística — JobFinder

## 1. Introdução

Esta avaliação heurística foi conduzida como etapa inicial do redesign do JobFinder. O objetivo foi identificar problemas de usabilidade presentes na interface atual antes de qualquer intervenção corretiva, permitindo priorização e rastreabilidade das melhorias realizadas.

O JobFinder é uma plataforma de recrutamento e seleção que conecta candidatos e empresas. Candidatos cadastram perfis, enviam candidaturas e acompanham processos seletivos; empresas publicam vagas, buscam candidatos e gerenciam candidaturas.

---

## 2. Metodologia

### 2.1 Técnica utilizada

A avaliação foi conduzida por meio de **análise estática visual do sistema**: percurso sistemático pelas páginas e fluxos da aplicação em estado estático (sem usuários reais), com registro de inconsistências e falhas de usabilidade visíveis.

Cada problema identificado foi classificado de acordo com as **10 Heurísticas de Nielsen**, que fornecem um conjunto consolidado de princípios para avaliação de interfaces:

| # | Heurística |
|---|---|
| H1 | Visibilidade do status do sistema |
| H2 | Correspondência entre o sistema e o mundo real |
| H3 | Controle e liberdade do usuário |
| H4 | Consistência e padrões |
| H5 | Prevenção de erros |
| H6 | Reconhecimento em vez de memorização |
| H7 | Flexibilidade e eficiência de uso |
| H8 | Design estético e minimalista |
| H9 | Ajuda ao usuário no reconhecimento, diagnóstico e recuperação de erros |
| H10 | Ajuda e documentação |

### 2.2 Escala de severidade

Cada problema foi classificado pela escala de severidade de Nielsen:

| Nível | Classificação | Descrição |
|---|---|---|
| 0 | Falso positivo | Não é um problema de usabilidade |
| 1 | Cosmético | Não precisa ser corrigido imediatamente |
| 2 | Simples | Baixa prioridade; correção desejável |
| 3 | Grave | Alta prioridade; deve ser corrigido |
| 4 | Catástrofe | Imperativo corrigir antes do lançamento |

### 2.3 Escopo da avaliação

Páginas e componentes inspecionados:

- `Signup` — cadastro de candidato e empresa
- `Login` — autenticação
- `PerfilCandidato` — visualização e edição do perfil do candidato
- `MinhasCandidaturas` — histórico de candidaturas do candidato
- `GestaoCandidaturas` — gerenciamento de candidaturas pela empresa
- `BuscaCandidatos` — busca de candidatos pela empresa
- `EscolherCargoModal` — seleção de cargo no cadastro
- `RedefinirSenha` — fluxo de redefinição de senha

---

## 3. Resumo dos problemas encontrados

Foram identificados **10 problemas de usabilidade** distribuídos em 4 heurísticas de Nielsen:

| ID | Descrição resumida | Heurística | Severidade | Status |
|---|---|---|---|---|
| P01 | Padrões de carregamento inconsistentes na aplicação | H1 | 2 — Simples | Corrigido |
| P02 | Campo "data da candidatura" comentado no código | H1 | 3 — Grave | Corrigido |
| P03 | Ausência de botão de retorno na página de perfil | H3 | 3 — Grave | Corrigido |
| P04 | Campo "escolaridade" inconsistente entre cadastro e perfil | H4 | 3 — Grave | Corrigido |
| P05 | Uso de `alert()` nativo para feedback ao usuário | H4 | 2 — Simples | Corrigido |
| P06 | Layout da redefinição de senha diverge do login/cadastro | H4 | 2 — Simples | Corrigido |
| P07 | Checkbox "Lembrar-me" não persiste sessão | H5 | 3 — Grave | Corrigido |
| P08 | Botão "Filtros" na busca de candidatos não executa nenhuma ação | H5 | 3 — Grave | Corrigido |
| P09 | Ausência de indicador de força da senha no cadastro | H5 | 2 — Simples | Corrigido |
| P10 | Habilidades, idiomas e cursos como campo de texto livre | H6 | 2 — Simples | Corrigido |

---

## 4. Descrição detalhada dos problemas

### P01 — Padrões de carregamento inconsistentes

**Heurística violada:** H1 — Visibilidade do status do sistema

**Severidade:** 2 — Simples

**Descrição:**
A aplicação utilizava três mecanismos distintos de indicação de carregamento sem consistência entre si:

1. Componente `LoadingScreen` com spinner dedicado
2. Spinner CSS local definido por folha de estilo isolada
3. Texto simples (ex: "Carregando…") exibido diretamente na tela

Essa inconsistência impede que o usuário reconheça o padrão de carregamento da aplicação e pode gerar confusão sobre o estado atual do sistema.

#### **Evidências — antes da correção:**

**Texto puro:**
<img width="1361" height="650" alt="Image" src="https://github.com/user-attachments/assets/b9977ca9-e00d-4a40-9a1d-d6990a282434" />

**Spinner:**
<img width="1361" height="650" alt="Image" src="https://github.com/user-attachments/assets/21bc2b91-07ec-4aaf-9f70-6ce3423561e7" />

#### **Correção aplicada:**
Padronização de todos os estados de carregamento para um único componente (`LoadingScreen`), eliminando o spinner CSS local e o texto simples.

<img width="2557" height="1394" alt="image" src="https://github.com/user-attachments/assets/e30d11a9-0e5a-4b76-90a4-26d4339ea384" />

<img width="2557" height="1394" alt="image" src="https://github.com/user-attachments/assets/967580aa-d0e2-443f-9356-9c2568a50f72" />

---

### P02 — Campo "data da candidatura" comentado no código

**Heurística violada:** H1 — Visibilidade do status do sistema

**Severidade:** 3 — Grave

**Descrição:**
Na página `MinhasCandidaturas`, o campo que deveria exibir a data em que o candidato realizou a candidatura estava comentado no código-fonte, tornando-o invisível para o usuário. Essa informação é essencial para que o candidato acompanhe o histórico e o andamento de seus processos seletivos.

#### **Evidências — antes da correção:**

<img width="1361" height="650" alt="Image" src="https://github.com/user-attachments/assets/d4786c42-3ae6-4b62-8054-b832059be311" />

#### **Correção aplicada:**
Remoção do comentário e exibição do campo de data da candidatura na listagem de candidaturas do candidato.

<img width="2557" height="1394" alt="image" src="https://github.com/user-attachments/assets/7e8c6148-e983-4f41-83c1-9892c702c783" />

---

### P03 — Ausência de botão de retorno na página de perfil

**Heurística violada:** H3 — Controle e liberdade do usuário

**Severidade:** 3 — Grave

**Descrição:**
A página de perfil do candidato (`PerfilCandidato`) não apresentava nenhum botão de retorno visível. O usuário ficava "preso" na página, dependendo exclusivamente do menu lateral ou dos controles do navegador para sair. A ausência de uma saída explícita viola o princípio de controle e liberdade, aumentando a carga cognitiva e a sensação de aprisionamento na interface.

#### **Evidências — antes da correção:**

https://github.com/user-attachments/assets/49cac3fb-447a-45cf-8e03-14923878cee6

#### **Correção aplicada:**
Adição de botão de retorno ao dashboard visível na página de perfil do candidato.

https://private-user-images.githubusercontent.com/68167990/665392916-f42c6c72-82c0-4fd5-a20c-7d1c03968aeb.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3OTEyMTUwNzgsIm5iZiI6MTc5MTIxNDc3OCwicGF0aCI6Ii82ODE2Nzk5MC82NjUzOTI5MTYtZjQyYzZjNzItODJjMC00ZmQ1LWEyMGMtN2QxYzAzOTY4YWViLndlYm0_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYxMDA1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MTAwNVQxNTM5MzhaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1jNDI5ZDgzNzYwNmMwOWUzODAxZmQxN2M5NGQ3NDdmNmU4YjhmNzRhYzBmNDNmY2VhMTliOWM0ZDk2NmU3NWMwJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZ3ZWJtIn0.1onNfPdgzelLceBhBUrbODGEDrJ0Hu703yLOe3fyCOQ

---

### P04 — Campo "escolaridade" inconsistente entre cadastro e perfil

**Heurística violada:** H4 — Consistência e padrões

**Severidade:** 3 — Grave

**Descrição:**
O campo "Escolaridade" era implementado como um `<select>` com opções predefinidas na página de cadastro (`Signup`), mas como um campo de texto livre (`<input type="text">`) na página de edição de perfil (`PerfilCandidato`). Essa inconsistência gerava:

- Divergência de dados armazenados no MongoDB (opção padronizada vs. texto arbitrário)
- Experiência diferente para o mesmo tipo de informação em dois momentos do fluxo do usuário

#### **Evidências — antes da correção:**

https://github.com/user-attachments/assets/52f5cd83-dab6-4e7c-8cae-630c24939a4b

#### **Correção aplicada:**
Substituição do campo de texto livre por `<select>` com as mesmas opções do formulário de cadastro, garantindo consistência e normalização dos dados armazenados.

---

### P05 — Uso de `alert()` nativo para feedback ao usuário

**Heurística violada:** H4 — Consistência e padrões

**Severidade:** 2 — Simples

**Descrição:**
As páginas `PerfilCandidato`, `MinhasCandidaturas` e `GestaoCandidaturas` utilizavam o `alert()` nativo do navegador para exibir mensagens de erro e confirmação. Esse comportamento divergia do padrão estabelecido pelo restante da aplicação, que utiliza banners de feedback inline. O `alert()` bloqueia completamente a interface, impede acesso ao contexto do erro e tem aparência que foge ao design da aplicação.

#### **Evidências — antes da correção:**

https://github.com/user-attachments/assets/51def59c-1001-4812-83a7-5bd6002e015a

#### **Correção aplicada:**
Substituição de todas as chamadas `alert()` por banners de feedback inline, seguindo o padrão já adotado nas demais páginas da aplicação.

https://private-user-images.githubusercontent.com/68167990/665393900-fe18ddfa-d4fa-4e2b-861c-601235d2b636.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3OTEyMTUzMzQsIm5iZiI6MTc5MTIxNTAzNCwicGF0aCI6Ii82ODE2Nzk5MC82NjUzOTM5MDAtZmUxOGRkZmEtZDRmYS00ZTJiLTg2MWMtNjAxMjM1ZDJiNjM2LndlYm0_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYxMDA1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MTAwNVQxNTQzNTRaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1hMDkwMWY2YmFjMzRiYTVkNWU2Y2RiN2Q1NjMyMDNhOTNiYTRjYWE0M2I3Nzc0NTk4N2ZjZjlkODUwZTA3MmI1JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZ3ZWJtIn0.qzzNcdE0-NemoP-KceEI0Bqm6HFmMnqFgHJ6B2vZwHM

---

### P06 — Layout da redefinição de senha diverge do login e cadastro

**Heurística violada:** H4 — Consistência e padrões

**Severidade:** 2 — Simples

**Descrição:**
O fluxo de redefinição de senha (`RedefinirSenha`) utilizava um layout visual diferente dos formulários de `Login` e `Signup`. Isso quebrava a expectativa de consistência visual entre páginas do mesmo fluxo de autenticação, causando estranhamento no usuário que percorre o fluxo de recuperação de acesso.

#### **Evidências — antes da correção:**

https://github.com/user-attachments/assets/342181d9-3217-48ad-b1af-d690df31ab0f

#### **Correção aplicada:**

Alinhamento do layout da redefinição de senha ao padrão visual dos formulários de login e cadastro.

https://private-user-images.githubusercontent.com/68167990/665394173-6f139234-f557-46d8-8214-32c7c630cca8.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3OTEyMTU1ODEsIm5iZiI6MTc5MTIxNTI4MSwicGF0aCI6Ii82ODE2Nzk5MC82NjUzOTQxNzMtNmYxMzkyMzQtZjU1Ny00NmQ4LTgyMTQtMzJjN2M2MzBjY2E4LndlYm0_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYxMDA1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MTAwNVQxNTQ4MDFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0zOGExZTgyMDA4MGQ5ZGZkMzgzOTA2ZGI1NWVlOTk2NGEzODZjYTBhMTYxOTc1Yzc0YTg4NjA5NzBlZWM5NmViJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZ3ZWJtIn0.UHXQh84FnGvAXarmdAajNMRffqZHfHADiFc_9bJVKgU

---

### P07 — Checkbox "Lembrar-me" não persiste sessão

**Heurística violada:** H5 — Prevenção de erros

**Severidade:** 3 — Grave

**Descrição:**
O formulário de login exibia um checkbox "Lembrar-me" que, ao ser marcado, não produzia nenhum efeito funcional: a sessão não era persistida entre acessos. A presença de um controle visível e aparentemente funcional que não executa nenhuma ação constitui uma falsa affordance — o usuário é induzido a acreditar que sua preferência foi registrada quando não foi.

#### **Evidências — antes da correção:**

https://github.com/user-attachments/assets/a7cf7c40-2509-4a9a-a350-b2d94c8602e8

#### **Correção aplicada:**
Remoção do checkbox "Lembrar-me" até que a funcionalidade de persistência de sessão seja implementada no backend, eliminando a falsa affordance.

---

### P08 — Botão "Filtros" na busca de candidatos não executa nenhuma ação

**Heurística violada:** H5 — Prevenção de erros

**Severidade:** 3 — Grave

**Descrição:**
A página `BuscaCandidatos` exibia um botão "Filtros" que, ao ser clicado, não abria nenhum painel, não aplicava nenhum filtro e não fornecia qualquer feedback. Assim como o checkbox "Lembrar-me", trata-se de uma falsa affordance que gera frustração e desconfiança na interface.

#### **Evidências — antes da correção:**

https://github.com/user-attachments/assets/3452b7d8-87e0-4bf4-ad2d-8c1687d0a84b

#### **Correção aplicada:**

Remoção do botão "Filtros" da interface até que a funcionalidade de filtragem seja implementada.

<img width="2557" height="1410" alt="image" src="https://github.com/user-attachments/assets/f9ff87cd-9c4b-40d8-be21-ef77ed1569f9" />

---

### P09 — Ausência de indicador de força da senha no cadastro

**Heurística violada:** H5 — Prevenção de erros

**Severidade:** 2 — Simples

**Descrição:**
O formulário de cadastro (`Signup`) não fornecia nenhum indicador visual em tempo real sobre a força da senha digitada. O usuário não recebia orientação sobre os requisitos mínimos (comprimento, caracteres especiais, etc.), aumentando a probabilidade de criação de senhas fracas e falhas de cadastro descobertas apenas após o envio do formulário.

#### **Evidências — antes da correção:**

https://github.com/user-attachments/assets/329cc389-e331-4917-a968-fa50c756114b

#### **Correção aplicada:**

Adição de indicador de força de senha em tempo real no formulário de cadastro, com exibição das regras de validação conforme o usuário digita.

https://private-user-images.githubusercontent.com/68167990/665394626-50b3ead9-146b-422b-9103-69c31f7d0de3.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3OTEyMTU1ODEsIm5iZiI6MTc5MTIxNTI4MSwicGF0aCI6Ii82ODE2Nzk5MC82NjUzOTQ2MjYtNTBiM2VhZDktMTQ2Yi00MjJiLTkxMDMtNjljMzFmN2QwZGUzLndlYm0_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYxMDA1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MTAwNVQxNTQ4MDFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT02OWRmMDJjNzBiMDcxMjAzODY5MGQyNDYyZGYxNDZhZGI1Mzk0ZDNmNjhiMTdlMDkwN2IyMjQyOWRlY2ZjMGEwJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZ3ZWJtIn0.HC6kpi5GtpUJXPTkxMgRYz0PHhQrZFviS2szPO7J02E

---

### P10 — Habilidades, idiomas e cursos como campo de texto livre

**Heurística violada:** H6 — Reconhecimento em vez de memorização
**Severidade:** 2 — Simples

**Descrição:**
Os campos "Habilidades", "Idiomas" e "Cursos" no perfil do candidato eram implementados como campos de texto livre, onde o usuário precisava digitar os itens separados por vírgula sem nenhuma orientação visual sobre o formato esperado. Essa abordagem exige que o usuário memorize uma convenção de formatação arbitrária e não oferece sugestões ou confirmação de entrada, aumentando a carga cognitiva e a probabilidade de erros de formatação.

#### **Evidências — antes da correção:**

https://github.com/user-attachments/assets/8ed77ce4-58ba-4653-8659-8b0bae544569

#### **Correção aplicada:**

Substituição dos campos de texto livre por componentes de entrada em formato de tags (*tag input*), onde cada item é inserido individualmente, visualizado como uma etiqueta e pode ser removido de forma independente, eliminando a dependência de memorização de formato.

https://private-user-images.githubusercontent.com/68167990/665394945-09819cfd-9d55-4a4d-b0a0-46cdc0302c46.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3OTEyMTU1ODEsIm5iZiI6MTc5MTIxNTI4MSwicGF0aCI6Ii82ODE2Nzk5MC82NjUzOTQ5NDUtMDk4MTljZmQtOWQ1NS00YTRkLWIwYTAtNDZjZGMwMzAyYzQ2LndlYm0_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYxMDA1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MTAwNVQxNTQ4MDFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0zNzhhYzZkZGNlNjMzZmQ2MzMwZWUyNDUwYzJhMDIyNTVkNWVhOWRlYjM2NzNiODZhZjg3NTIwZDgzNDhkYTA4JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZ3ZWJtIn0.3Z4wcwqem4eaSjnGo_J13snto0F04r5UNZjIuxJBRoA

---

## 5. Distribuição dos problemas por heurística

| Heurística | Problemas identificados | Severidade máxima |
|---|---|---|
| H1 — Visibilidade do status do sistema | P01, P02 | 3 — Grave |
| H3 — Controle e liberdade do usuário | P03 | 3 — Grave |
| H4 — Consistência e padrões | P04, P05, P06 | 3 — Grave |
| H5 — Prevenção de erros | P07, P08, P09 | 3 — Grave |
| H6 — Reconhecimento em vez de memorização | P10 | 2 — Simples |

---

## 6. Resultado

Todos os 10 problemas identificados foram corrigidos no [PR #247](https://github.com/JobFinder-Project/JobFinder/pull/247). A avaliação heurística permitiu identificar e priorizar falhas de usabilidade de forma sistemática antes da implementação, garantindo rastreabilidade entre o problema diagnosticado e a solução aplicada.

As principais categorias de falha encontradas foram:
- **Falsas affordances** (P07, P08): controles visíveis que não executam nenhuma ação
- **Inconsistências de padrão** (P01, P04, P05, P06): comportamentos divergentes para situações equivalentes
- **Informação oculta ou ausente** (P02, P03, P09, P10): dados e controles necessários que não estavam disponíveis para o usuário
