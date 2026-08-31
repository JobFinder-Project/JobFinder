# Classificação de Bugs Encontrados

## Visão Geral

Este documento reúne a classificação dos principais defeitos identificados no sistema, descrevendo sua natureza, severidade, local de ocorrência e impacto sobre o funcionamento da aplicação. A classificação foi elaborada a partir da análise dos relatos de uso, da investigação do comportamento observado e dos pontos do sistema envolvidos.

---

## 1. Bug: Upload de imagem da vaga aceita tipos e tamanhos inválidos

### Classificação
- Tipo: Lógica / Validação de entrada
- Severidade: Alta
- Prioridade: Crítica
- Impacto: Alta

### Descrição
O sistema permite que o usuário selecione e envie arquivos de imagem incompatíveis com a regra da aplicação durante a criação de uma vaga. A interface informa que devem ser aceitos apenas SVG, PNG, JPG ou GIF com limite de 2MB, mas a validação real não acompanha essa regra.

Como resultado, arquivos como PDF, MP4, MOV, ZIP e outros tipos não permitidos podem ser incluídos no processo de publicação. Também é possível enviar imagens maiores que o limite esperado. A regra de negócio que deveria restringir formatos e tamanho não está sendo aplicada de forma consistente.

### Local de ocorrência
- Frontend do fluxo de criação de vaga na área de imagem de destaque
- Componente de upload de imagem da empresa
- Rota `POST /vagas/criar` de criação de vaga no backend
- Processamento do arquivo no `empresaController.js` responsável por persistir a vaga

### Pontos afetados
- Validação do input de upload no frontend
- Mensagem e instruções exibidas ao usuário
- Filtro de arquivos no servidor
- Limites de tamanho e tipo de arquivo antes do armazenamento
- Persistência da imagem no banco de dados

### Causa provável
A interface usa uma regra permissiva de seleção de arquivos e a API de upload não aplica controle de tipo nem limite de tamanho. Além disso, texto e comportamento ficaram desalinhados: a mensagem da interface informa um padrão mais restritivo, enquanto a lógica de upload aceita valores que não deveriam ser aceitos.

### Impactos esperados
- Publicação de vagas com imagens inválidas
- Armazenamento de arquivos incompatíveis com a regra do sistema
- Problemas de consistência de dados e qualidade visual da vaga
- Falta de segurança e integridade no processamento de arquivos enviados pelo usuário
- Dificuldade de manutenção por causa da diferença entre regra exibida e regra executada

### Evidências

https://private-user-images.githubusercontent.com/68167990/643007927-56a28357-fc31-490d-811e-f2fa70b4c0c3.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODgwMzA0MTEsIm5iZiI6MTc4ODAzMDExMSwicGF0aCI6Ii82ODE2Nzk5MC82NDMwMDc5MjctNTZhMjgzNTctZmMzMS00OTBkLTgxMWUtZjJmYTcwYjRjMGMzLndlYm0_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwODI5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDgyOVQxOTAxNTFaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0yMDQ0ZjY5NDM1ZTU4NWNhZDM4MDc0YTBhNGQxMDQ4ODI2ZDFiYTA5MjkwNzM0MTI5NTMxODQ3M2Y3YjFhMDMwJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZ3ZWJtIn0.uK6gA8fFA3Mj_OKq_D1SLIaxBMPJE76jYNt4Z67tl_s

---

## 2. Bug: Dependências vulneráveis apontadas pelo sistema de segurança

### Classificação
- Tipo: Segurança / Dependência vulnerável
- Severidade: Crítica
- Prioridade: Crítica
- Impacto: Alta

### Descrição
O projeto possui dependências com vulnerabilidades conhecidas identificadas por ferramentas de auditoria e alertas de segurança. Essas bibliotecas podem expor a aplicação a riscos como execução indevida de código, negação de serviço, _bypass_ de validações e vazamento de informações, dependendo da falha específica da biblioteca impactada.

O problema está relacionado à utilização de versões antigas ou desatualizadas de pacotes no ecossistema npm, que não atendem ao nível mínimo de segurança recomendado.

### Local de ocorrência
- Arquivos de dependências do projeto em nível raiz (`package-lock.json`)
- Dependências do frontend (`frontend/package-lock.json`)
- Dependências do backend (`backend/package-lock.json`)

### Pontos afetados
- Infraestrutura de dependências do projeto
- Configuração de bibliotecas de runtime e build
- Segurança da aplicação em produção
- Processo de revisão e atualização contínua do repositório

### Causa provável
As versões instaladas do projeto ainda incluem pacotes com falhas públicas conhecidas, e a atualização ou correção das bibliotecas não foi aplicada de forma completa. Existem alertas em diferentes manifestos do projeto, indicando que a exposição é ampla e não isolada a um único módulo.

### Impactos esperados
- Aumento do risco de exploração por vulnerabilidades conhecidas
- Possível comprometimento da aplicação em ambiente de produção
- Falhas de segurança em bibliotecas críticas do frontend e backend
- Necessidade de revisão manual de dependências e atualização de versões compatíveis
- Diminuição da confiança do sistema em termos de segurança e manutenção

### Evidências

1) Dependências vulneráveis alertadas pelo Dependabot no GitHub:
<img width="1333" height="644" alt="image" src="https://github.com/user-attachments/assets/7becd0c0-833e-4072-8c74-6113773d495c" />


2) Auditoria realizada com `npm audit` apontando falhas em pacotes do projeto:

**package-lock.json**
```js
2 vulnerabilities (1 high, 1 critical)
```

**frontend/package-lock.json**
```js
14 vulnerabilities (1 low, 6 moderate, 5 high, 2 critical)
```
**backend/package-lock.json**
```js
17 vulnerabilities (1 low, 7 moderate, 9 high)
```

## 3. Bug: Falha ao atualizar qualificação do candidato

### Classificação
- Tipo: Lógica / Integridade de dados
- Severidade: Alta
- Prioridade: Alta
- Impacto: Alta

### Descrição
Ao editar o perfil do candidato, o usuário consegue alterar o campo de qualificação principal, receber uma mensagem de sucesso e sair da operação sem que a informação seja realmente persistida. Quando o perfil é revisitado ou o usuário faz login novamente, o valor anterior volta a aparecer.

O problema indica que existe um desalinhamento entre os dados enviados pelo frontend e os campos esperados pelo backend, fazendo com que a alteração seja ignorada mesmo sem apresentar erro explícito ao usuário.

### Local de ocorrência
- Fluxo de edição de perfil do candidato no frontend
- Tela de Meu Perfil
- Formulário de atualização de dados do usuário (`frontend/src/pages/Perfil/PerfilPage.jsx`)
- Endpoint de atualização de perfil no backend (`backend/src/controllers/candidatoController.js`)
- Camada de persistência do candidato no banco de dados (`backend/src/models/candidatoModel.js` e `backend/src/dtos/candidatoDto.js`)

### Pontos afetados
- Campo de qualificação principal no perfil
- Nome do atributo enviado pela interface
- Mapeamento de dados entre frontend e backend
- Persistência da informação no registro do candidato
- Mensagem de confirmação exibida após a operação

### Causa provável
A interface envia um campo com um nome diferente do esperado pelo backend. Como o backend ignora o valor recebido em um atributo não correspondente, a alteração não é salva, mas o sistema ainda responde como se a atualização tivesse ocorrido com sucesso.

### Impactos esperados
- Dados do perfil do candidato ficam inconsistentes
- Usuário recebe feedback falso de sucesso
- Informação profissional não reflete a atualização efetiva
- Regressão de dados ao retornar à tela de perfil ou reiniciar sessão
- Perda de confiança no mecanismo de edição do perfil

### Evidências

https://private-user-images.githubusercontent.com/68167990/643037183-d94d93c3-8d4d-476f-95cd-4266465a1d54.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODgwMzA1MzksIm5iZiI6MTc4ODAzMDIzOSwicGF0aCI6Ii82ODE2Nzk5MC82NDMwMzcxODMtZDk0ZDkzYzMtOGQ0ZC00NzZmLTk1Y2QtNDI2NjQ2NWExZDU0LndlYm0_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwODI5JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDgyOVQxOTAzNTlaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT00ZmVkYjA3Zjc5NTk3Yzc5ODExMmQ4MTQ1Y2IzYjNhYWVhYTIxNjhhNTA1MmU4YjgzOWVlNjBjZGVjY2FiNTYyJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZ3ZWJtIn0.DydccdzeS-2piVf0rxoS0q7NrM38AwejsIawhIiw3FY


## 4. Bug: Vagas ativas do dashboard não abrem detalhes ao clicar

### Classificação
- Tipo: Interface / Usabilidade / Acessibilidade
- Severidade: Média
- Prioridade: Alta
- Impacto: Média

### Descrição

Na tela principal do dashboard da empresa, existe um card de Vagas Ativas que exibe apenas três sub-cards de vagas. Porém, esses sub-cards não são clicáveis e não possuem botão de detalhes, impedindo que a empresa acesse os detalhes das vagas diretamente a partir do dashboard.

Além disso, quando existem mais de três vagas ativas, a interface não deixa claro que a lista exibida é apenas um resumo. Não há uma indicação visual próxima ao fim da lista informando que existem mais vagas, como `Ver outras vagas`, `Ver todas as vagas` ou uma contagem do tipo `+ X vagas ativas`.

### Local de ocorrência

- Tela principal do dashboard da empresa
- Card de **Vagas Ativas** no dashboard
- Componente de renderização de vagas ativas (`frontend/src/pages/EmpresaDashboard/EmpresaDashboardPage.jsx`)
- Modal de detalhes da vaga em **Gerenciar Vagas** (`frontend/src/pages/GerenciarVagas/GerenciarVagasPage.jsx`)

### Pontos afetados

- Interatividade dos sub-cards de vagas ativas
- Falta de botão ou link para abrir detalhes da vaga
- Indicação de que existe uma lista completa de vagas além das três exibidas
- Consistência de experiência entre o dashboard e a tela de gerenciamento
- Fluxo de navegação para acesso às vagas

### Causa provável

Os sub-cards de vagas no dashboard usam elementos `div` sem manipulador `onClick` e sem botões de ação. A lista está limitada a três itens com `vagasAtivas.slice(0, 3)`, mas não há indicação visual dessa limitação. O modal de detalhes já existe em **Gerenciar Vagas**, mas não é reutilizado no dashboard.

### Impactos esperados

- Experiência de usuário prejudicada, dificultando o acesso às vagas
- Falta de clareza sobre a disponibilidade de mais vagas além das três exibidas
- Necessidade de navegar para outra tela para visualizar detalhes de uma vaga
- Inconsistência entre o comportamento esperado (clicar para abrir detalhes) e o comportamento real (nada acontece)
= Redução de eficiência no gerenciamento de vagas pelo usuário empresa
- Pequeno erro textual em "Suas vagas tualmente abertas" (falta de "a" em "atualmente")

### Evidências

https://private-user-images.githubusercontent.com/68167990/643158383-91faf843-37d1-4a12-b728-33765a364910.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3ODgxNzk1NzgsIm5iZiI6MTc4ODE3OTI3OCwicGF0aCI6Ii82ODE2Nzk5MC82NDMxNTgzODMtOTFmYWY4NDMtMzdkMS00YTEyLWI3MjgtMzM3NjVhMzY0OTEwLndlYm0_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwODMxJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDgzMVQxMjI3NThaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1mYzM3NzYzMDYzOTUwYjE0ODRhNzM0Yjc3ZDdiNzZmMjk0ODg4ZDBjNzAyN2Y3OGM5OGFiYjdjOThkMmMwMDA5JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZ3ZWJtIn0.14iBFFKMtP1LDjwiL1zAx73QcGrnMMWYDblVVSN35BI

---

## 4. Resumo da classificação

| Bug | Tipo | Severidade | Área principal | Situação principal |
| --- | --- | --- | --- | --- |
| Upload de imagem da vaga | Lógica / validação | Alta | Cadastro de vagas e upload de arquivos | Arquivos inválidos são aceitos |
| Dependências vulneráveis | Segurança | Crítica | Dependências do projeto | Pacotes com falhas conhecidas continuam em uso |
| Falha ao atualizar qualificação do candidato | Lógica / persistência | Alta | Perfil do candidato | Alteração é ignorada e mensagem de sucesso é falsa |
| Vagas ativas do dashboard não abrem detalhes ao clicar | Interface / usabilidade | Média | Dashboard da empresa | Sub-cards não são clicáveis e sem indicação de mais vagas |

---

## 5. Conclusão

Os quatro defeitos possuem natureza distinta, mas todos afetam diretamente a confiabilidade e usabilidade do sistema. O primeiro compromete a regra de negócio e a qualidade dos dados de vagas; o segundo representa um risco crítico de segurança; o terceiro afeta a integridade dos dados do candidato; e o quarto prejudica a experiência do usuário no dashboard.

A classificação indica que os itens exigem atenção imediata, com prioridade para correção de segurança, validação de entrada, sincronização de contratos entre frontend e backend, e melhorias de usabilidade e acessibilidade na interface.
