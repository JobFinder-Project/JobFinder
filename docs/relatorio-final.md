# Relatório Final da Manutenção Corretiva

## 1. Breve descrição do sistema

O JobFinder é uma plataforma de recrutamento e seleção voltada para conectar candidatos e empregadores. O sistema permite que candidatos cadastrem e atualizem seus perfis, enviem informações profissionais e participem do processo de candidatura, enquanto empresas podem publicar vagas, gerenciar candidaturas e acompanhar o estado dos processos seletivos.

A manutenção corretiva descrita neste relatório focou em defeitos de funcionalidade, integração entre frontend e backend, segurança de dependências e validação de entradas do usuário, com objetivo de preservar a integridade, a usabilidade e a confiabilidade da aplicação em produção.

---

## 2. Lista dos bugs identificados e suas classificações

| Issue | Título | Tipo | Severidade | Status no GitHub |
| --- | --- | --- | --- | --- |
| [#189](https://github.com/JobFinder-Project/JobFinder/issues/189) | Upload de imagem da vaga aceita tipos e tamanhos inválidos | Lógica / validação de entrada | Alta | Reprovada; movida para status de refazer (redo) |
| [#190](https://github.com/JobFinder-Project/JobFinder/issues/190) | Dependências vulneráveis apontadas pelo Dependabot | Segurança / dependências | Crítica | Fechada com merge do PR |
| [#191](https://github.com/JobFinder-Project/JobFinder/issues/191) | Falha ao atualizar qualificação do candidato | Lógica / persistência de dados | Alta | Fechada com merge do PR |
| [#192](https://github.com/JobFinder-Project/JobFinder/issues/192) | Vagas ativas do dashboard não abrem detalhes ao clicar | Interface / usabilidade | Média-Alta | Fechada com merge do PR |

### 2.1 Issue #190 — Dependências vulneráveis apontadas pelo Dependabot

- Tipo: Segurança / dependência vulnerável
- Severidade: Crítica
- Descrição: o repositório apresentava vulnerabilidades em dependências do frontend, backend e do pacote raiz, com alertas apontados pelo Dependabot e pelo `npm audit`.
- Impacto: risco de exploração, falhas de segurança em produção e regressão de bibliotecas críticas.
- Link da issue: [#190](https://github.com/JobFinder-Project/JobFinder/issues/190)
- Link de correção: [PR #195](https://github.com/JobFinder-Project/JobFinder/pull/195)

### 2.2 Issue #191 — Falha ao atualizar qualificação do candidato

- Tipo: Lógica / integração frontend-backend
- Severidade: Alta
- Descrição: o frontend enviava o campo `qualificacoes`, mas o backend esperava `qualificacao`; assim, a alteração parecia ser salva, mas não era persistida no banco.
- Impacto: inconsistência no perfil do candidato, mensagem de sucesso enganosa e perda de dados de qualificação.
- Link da issue: [#191](https://github.com/JobFinder-Project/JobFinder/issues/191)
- Link de correção: [PR #197](https://github.com/JobFinder-Project/JobFinder/pull/197)

### 2.3 Issue #192 — Vagas ativas do dashboard não abrem detalhes ao clicar

- Tipo: Interface / usabilidade
- Severidade: Média-Alta
- Descrição: os cards de vagas ativas no dashboard eram meramente visuais, sem ação de clique e sem indicação clara de que havia mais vagas disponíveis além das três exibidas.
- Impacto: dificuldade de navegação e perda de acessibilidade de detalhes da vaga diretamente do dashboard.
- Link da issue: [#192](https://github.com/JobFinder-Project/JobFinder/issues/192)
- Link de correção: [PR #196](https://github.com/JobFinder-Project/JobFinder/pull/196)

### 2.4 Issue #189 — Upload de imagem da vaga aceita tipos e tamanhos inválidos

- Tipo: Lógica / validação de entrada
- Severidade: Alta
- Descrição: a criação de vagas aceitava arquivos fora do padrão esperado, como tipos não permitidos e arquivos acima do limite estabelecido, além de permitir GIF e não refletir a regra correta na interface.
- Impacto: dados inconsistentes, publicações com imagens inválidas e risco de comportamento não conforme à regra de negócio.
- Link da issue: [#189](https://github.com/JobFinder-Project/JobFinder/issues/189)
- Link de correção: [PR #199](https://github.com/JobFinder-Project/JobFinder/pull/199)
- Observação: a correção foi reprovada na revisão técnica e a issue foi movida para o status de refazer (redo), conforme evidência do fluxo do GitHub.

---

## 3. Links para as issues e PRs correspondentes

| Issue | PR |
| --- | --- |
| [#189](https://github.com/JobFinder-Project/JobFinder/issues/189) | [PR #199](https://github.com/JobFinder-Project/JobFinder/pull/199) |
| [#190](https://github.com/JobFinder-Project/JobFinder/issues/190) | [PR #195](https://github.com/JobFinder-Project/JobFinder/pull/195) |
| [#191](https://github.com/JobFinder-Project/JobFinder/issues/191) | [PR #197](https://github.com/JobFinder-Project/JobFinder/pull/197) |
| [#192](https://github.com/JobFinder-Project/JobFinder/issues/192) | [PR #196](https://github.com/JobFinder-Project/JobFinder/pull/196) |

---

## 4. Evidências dos testes de validação

### 4.1 Issue #190 — Dependências vulneráveis

**Antes**

[bug-audit.webm](https://github.com/user-attachments/assets/e21ad1c3-9aa2-40e0-b477-44263eb8298a)

**Depois**

[fix-audit.webm](https://github.com/user-attachments/assets/1650d4db-e9c6-4481-8d59-013814817e8a)

Evidências da validação:

- Auditoria do projeto com `npm audit` concluída sem vulnerabilidades de nível alto/crítico após a correção.
- CI/workflow de auditoria de dependências adicionado ao repositório.
- Testes do backend e frontend passaram após a atualização.
- Resultado reportado na revisão técnica: backend e frontend sem vulnerabilidades altas/críticas e pipeline validado.

### 4.2 Issue #191 — Qualificação do candidato

**Antes**

https://private-user-images.githubusercontent.com/68167990/643037183-d94d93c3-8d4d-476f-95cd-4266465a1d54.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODgxOTU4MTMsIm5iZiI6MTc4ODE5NTUxMywicGF0aCI6Ii82ODE2Nzk5MC82NDMwMzcxODMtZDk0ZDkzYzMtOGQ0ZC00NzZmLTk1Y2QtNDI2NjQ2NWExZDU0LndlYm0_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwODMxJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDgzMVQxNjU4MzNaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT05YmJhZmNhNDFiMDBhYTY2NmMzMDljMmNhMzgwZGMyZjJhYzE3YWE1ZmQwMTRkMGNkOTJlZWE2NWJiNjE2YTUyJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZ3ZWJtIn0.XeB-vssQdOVeJMiZ2fWV1MZSb-DxbTG0ZXnCnL8A0Yw

**Depois**

https://private-user-images.githubusercontent.com/68167990/643601972-8725a300-b191-4228-bc18-a11b37e3da20.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODgxOTU4MTMsIm5iZiI6MTc4ODE5NTUxMywicGF0aCI6Ii82ODE2Nzk5MC82NDM2MDE5NzItODcyNWEzMDAtYjE5MS00MjI4LWJjMTgtYTExYjM3ZTNkYTIwLndlYm0_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwODMxJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDgzMVQxNjU4MzNaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0zMzkyNjdlNjYzZWMxMGU0MjQzM2E3NjhlNTk4YTU2MjY5NDdlZDNlMmQ4MmYwM2FmZDJiOGM5M2EzMDI2ZDg0JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZ3ZWJtIn0.e4CkJdAImGbDPFvlgvgd8y1MlT3Rk1auGMM5oo6ymsA

Evidências da validação:

- Regressão coberta por teste de integração de perfil do candidato.
- Verificação de persistência após salvar o perfil e ao consultar novamente o dashboard.
- Validação de persistência após logout e login.
- Resultado reportado na revisão técnica: backend 59/59 e frontend 34/34 testes aprovados; build concluído com sucesso.

### 4.3 Issue #192 — Dashboard da empresa

**Antes**

https://private-user-images.githubusercontent.com/68167990/643158383-91faf843-37d1-4a12-b728-33765a364910.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODgxOTU4ODgsIm5iZiI6MTc4ODE5NTU4OCwicGF0aCI6Ii82ODE2Nzk5MC82NDMxNTgzODMtOTFmYWY4NDMtMzdkMS00YTEyLWI3MjgtMzM3NjVhMzY0OTEwLndlYm0_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwODMxJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDgzMVQxNjU5NDhaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT01MjZlOTUyMWJkZWY2YjllN2M4MDFlZjNjMTc2ZWRlZTYxZmI4NThiZGM3Mzk1NjIzMjRiZjhiNmFlMWU3OTQ5JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZ3ZWJtIn0.kZfSlDwD1HC7ODzZFMbUFpD3OvO6Rq_AY1pWl9_u1M4

**Depois**

https://private-user-images.githubusercontent.com/68167990/643593334-4a335bb1-cde0-4690-ae50-e905d4e91e50.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODgxOTU4ODgsIm5iZiI6MTc4ODE5NTU4OCwicGF0aCI6Ii82ODE2Nzk5MC82NDM1OTMzMzQtNGEzMzViYjEtY2RlMC00NjkwLWFlNTAtZTkwNWQ0ZTkxZTUwLndlYm0_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwODMxJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDgzMVQxNjU5NDhaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1jN2M5MGExNzFjN2QzMzZhNzMzZGUyMWYyZDgyMWJkNzQ3ZTEzN2Y0OTNhZTU2OGVmN2IzMTM1MzIxOGUwZDhjJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZ3ZWJtIn0.E4sJQp3lLzfpH-7HnVn7jFPFCR-gsgEdU6n3JAaTHus

Evidências da validação:

- Teste automatizado específico para o comportamento do dashboard da empresa.
- Verificação de que apenas uma prévia limitada de 3 vagas é exibida e que o clique abre os detalhes.
- Verificação de indicador de vagas extras (`+ X vagas ativas`).
- Resultado reportado na revisão técnica: backend 58/58 e frontend 39/39 testes aprovados; build concluído com sucesso.

### 4.4 Issue #189 — Upload de imagem da vaga (reprovada)

**Antes**

https://private-user-images.githubusercontent.com/68167990/643007927-56a28357-fc31-490d-811e-f2fa70b4c0c3.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODgxOTU5MjUsIm5iZiI6MTc4ODE5NTYyNSwicGF0aCI6Ii82ODE2Nzk5MC82NDMwMDc5MjctNTZhMjgzNTctZmMzMS00OTBkLTgxMWUtZjJmYTcwYjRjMGMzLndlYm0_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwODMxJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDgzMVQxNzAwMjVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0zZTUzOWM3YzQ1ZGY0N2ZiZDJhNmFkYjQzMzgyZGFlYzdlMTVjNGNmOGEyNmEzNGVmYTM5ZTA3M2M1ODZiZWYwJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZ3ZWJtIn0.SgeYAFS_sPD0cyDw1A40OfoZKkgtZr-58yUwW3lLqwk

**Depois**

<img width="1822" height="1060" alt="image" src="https://github.com/user-attachments/assets/14429d73-2481-4cd2-b8d1-cad3f60675e2" />

Evidências da validação da revisão técnica:

- `npm --prefix backend test` → falhou com 1 suíte quebrada e 8 passadas.
- `npm --prefix frontend test` → falhou com 1 suíte quebrada e 8 passadas.
- `npm --prefix frontend run build` → build concluído com sucesso.
- `git diff --check origin/develop..HEAD` → apontou trailing whitespaces, o que reforçou a necessidade de ajustes antes da aprovação.
- Conclusão: a correção funcional estava próxima do esperado, mas os testes adicionados para a issue quebraram a suíte e a tarefa foi reprovada.

> Status final da issue #189: reprovada no processo de revisão e movida para refazer (redo) no fluxo do GitHub. A correção não foi aceita na etapa de validação e necessita de nova rodada de correção e revisão.

---

## 5. Retrabalho e reabertura de fluxo

O projeto demonstrou uma rotina saudável de manutenção em GitHub, incluindo retrabalho quando necessário. No caso da issue #189, a correção foi submetida por meio do PR [#199](https://github.com/JobFinder-Project/JobFinder/pull/199), mas a revisão técnica identificou falhas na execução dos testes automatizados: import inválido no backend, caminho incorreto do teste no frontend e problemas de formatação no diff. Em seguida, a issue foi movida para o status de refazer (redo), que é o comportamento esperado dentro do fluxo de desenvolvimento: a tarefa voltou para a etapa de correção e nova validação, sem prejuízo ao processo de garantia de qualidade. Esse tipo de retrabalho é normal e indica que o grupo reconheceu o problema, ajustou a implementação e seguiu o fluxo do GitHub para reavaliar a correção antes da aprovação final.

---

## 6. Conclusão

As issues #190, #191 e #192 foram resolvidas com sucesso, validadas por testes e integradas ao repositório por meio de PRs aprovados. A issue #189, por sua vez, representa um exemplo claro de manutenção corretiva em andamento: a correção foi encaminhada, mas não passou pela validação final e foi reprovada, retornando ao status de refazer. Esse cenário reforça o rigor do processo de controle de qualidade do projeto, evidenciando que a aprovação depende não apenas da correção funcional, mas também da estabilidade das suítes automatizadas e da conformidade com o fluxo de revisão do GitHub.
