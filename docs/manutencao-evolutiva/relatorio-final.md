# Relatório Final de Manutenção Evolutiva — JobFinder

## 1. Identificação do projeto

| Item | Informação |
|---|---|
| **Projeto** | JobFinder |
| **Tipo de manutenção** | Manutenção evolutiva |
| **Issues contempladas** | #242, #243, #244, #245 |

---

## 2. Objetivo

Este relatório apresenta as atividades realizadas durante a etapa de manutenção evolutiva do sistema JobFinder.

Conforme definido no planejamento, foram implementadas novas funcionalidades, melhorias de usabilidade e recursos de acessibilidade, ampliando o escopo original da aplicação e proporcionando uma experiência mais eficiente, inclusiva e consistente para candidatos e empresas.

As implementações descritas neste documento estão disponíveis na branch `develop`.

---

## 3. Escopo da manutenção evolutiva

A manutenção contemplou os seguintes objetivos:

- Criar uma página pública para apresentação das empresas;
- Implementar uma lista persistente de candidatos favoritos;
- Melhorar a acessibilidade geral da aplicação;
- Criar um painel de acessibilidade personalizável;
- Corrigir problemas de usabilidade identificados na interface;
- Padronizar componentes, mensagens, carregamentos e interações;
- Melhorar a navegação por teclado e o suporte a leitores de tela;
- Atualizar a documentação do projeto;
- Registrar as mudanças no histórico de evolução do sistema.

---

# 4. Funcionalidades implementadas

## 4.1. Página pública da empresa — Issue https://github.com/JobFinder-Project/JobFinder/issues/242

Foi implementada uma página pública para visualização das informações institucionais das empresas cadastradas no JobFinder.

Essa funcionalidade permite que candidatos conheçam melhor uma empresa antes de se candidatarem a uma vaga, sem a necessidade de realizar login na plataforma.

### Principais implementações

- Criação de rota pública para visualização da empresa;
- Disponibilização de informações institucionais ampliadas;
- Possibilidade de atualização do perfil pela própria empresa;
- Separação entre informações públicas e dados sensíveis;
- Proteção contra exposição de senha, CNPJ, e-mail interno e telefone privado;
- Integração da página pública com o fluxo de visualização de vagas;
- Adequação da interface para dispositivos móveis e desktops;
- Atualização dos contratos e da documentação da API;
- Inclusão ou atualização de testes relacionados ao fluxo público.

### Benefícios

A funcionalidade aumenta a transparência da plataforma e permite que os candidatos avaliem melhor as empresas, seus objetivos e sua atuação antes de iniciar um processo seletivo.

Para as empresas, a funcionalidade possibilita uma apresentação institucional mais completa e confiável.

### Evidências

https://private-user-images.githubusercontent.com/160617063/665787259-317f1614-309e-4228-bb15-a67d517cbb9c.mp4?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3OTEyMTY4ODUsIm5iZiI6MTc5MTIxNjU4NSwicGF0aCI6Ii8xNjA2MTcwNjMvNjY1Nzg3MjU5LTMxN2YxNjE0LTMwOWUtNDIyOC1iYjE1LWE2N2Q1MTdjYmI5Yy5tcDQ_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYxMDA1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MTAwNVQxNjA5NDVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1kZTI4Mjk4NzNkODk0NWM3OGQ1ZDM4ZWI1MzgzNDUzMTMzMDRiYjlhYjA4MTQ0NWQ4OGM4ZTQwZTA1NDhhMjAxJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZtcDQifQ.p-Xq-680tVOxkEamToNCDOa-iqlHlxQeMW9YT29VcHM

---

## 4.2. Lista de candidatos favoritos — Issue https://github.com/JobFinder-Project/JobFinder/issues/243

Foi implementado um mecanismo de favoritos para que empresas possam selecionar, organizar e acompanhar candidatos de interesse.

A funcionalidade possui persistência no backend e permite gerenciar os candidatos favoritos entre diferentes sessões de uso.

### Principais implementações

- Inclusão da ação de favoritar candidatos;
- Inclusão da ação de desfavoritar candidatos;
- Persistência dos favoritos no backend;
- Atualização visual do estado do botão de favorito;
- Criação de área dedicada para consulta dos favoritos;
- Listagem dos candidatos favoritos da empresa autenticada;
- Controle de autorização entre empresas;
- Tratamento de duplicidade de registros;
- Comportamento idempotente para favoritar e desfavoritar;
- Atualização das rotas, serviços e contratos da API;
- Inclusão ou atualização de testes automatizados.

### Benefícios

A funcionalidade melhora a produtividade dos recrutadores, reduz a necessidade de repetir pesquisas e permite a criação de uma lista de candidatos prioritários para futuras etapas do processo seletivo.

### Evidências

https://private-user-images.githubusercontent.com/68167990/665750360-db55a162-c845-42a8-b50e-a0fdb000aae8.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3OTEyMTY5MTgsIm5iZiI6MTc5MTIxNjYxOCwicGF0aCI6Ii82ODE2Nzk5MC82NjU3NTAzNjAtZGI1NWExNjItYzg0NS00MmE4LWI1MGUtYTBmZGIwMDBhYWU4LndlYm0_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYxMDA1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MTAwNVQxNjEwMThaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1hNDJlOWMxYjkyODMzMDcyNjc4NzFmN2I2OGZlMDdmNzJlMzIxMDg5YmQwM2NhMDQ0MTA0N2E0NTJlNDg3OWEzJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZ3ZWJtIn0.TtzbwdJbO-SAIa2iKRILYTnpbnXPZdN3shoVmt3cJYI

---

# 5. Melhorias de acessibilidade

## 5.1. Melhorias de acessibilidade WCAG — Issue https://github.com/JobFinder-Project/JobFinder/issues/244

Foi realizada uma revisão dos principais componentes da interface com o objetivo de eliminar barreiras enfrentadas por pessoas com deficiência visual, limitações motoras e usuários de tecnologias assistivas.

### Principais implementações

- Associação correta entre elementos `<label>` e campos de formulário;
- Inclusão de identificadores nos campos de entrada;
- Melhoria da navegação utilizando teclado;
- Tornar cards e elementos interativos operáveis por `Enter` e `Espaço`;
- Implementação de gerenciamento de foco em modais;
- Retorno do foco ao elemento responsável pela abertura do modal;
- Inclusão do elemento semântico `<main>`;
- Inclusão de skip link para acesso direto ao conteúdo principal;
- Inclusão de atributos ARIA em menus, botões e componentes expansíveis;
- Inclusão de `aria-expanded` e `aria-current`;
- Inclusão de `role="status"` em estados de carregamento;
- Associação de mensagens de erro aos campos correspondentes;
- Utilização de `aria-invalid` em campos inválidos;
- Substituição de `alert()` por notificações acessíveis;
- Substituição de `window.confirm()` por modal de confirmação interno;
- Melhoria dos indicadores visuais de foco;
- Ajuste do contraste de textos secundários;
- Inclusão de suporte à preferência `prefers-reduced-motion`;
- Melhoria da acessibilidade dos filtros e componentes de navegação;
- Inclusão ou atualização de testes de acessibilidade.

### Problemas corrigidos

As alterações corrigiram problemas como:

- Elementos inacessíveis pelo teclado;
- Campos sem rótulos corretamente associados;
- Falta de foco adequado em modais;
- Mensagens de erro não vinculadas aos campos;
- Contraste insuficiente;
- Falta de indicação de foco;
- Uso de diálogos nativos não acessíveis;
- Falta de estrutura semântica para leitores de tela.

---

## 5.2. Painel de acessibilidade personalizável — Issue https://github.com/JobFinder-Project/JobFinder/issues/245

Foi implementado um painel de acessibilidade flutuante e persistente, disponível nas páginas públicas e autenticadas do JobFinder.

O painel permite que cada usuário adapte a interface conforme suas necessidades individuais.

### Recursos disponibilizados

- Redução do tamanho do texto;
- Aumento do tamanho do texto;
- Restauração do tamanho padrão;
- Modo de alto contraste;
- Modo para deuteranopia;
- Modo para protanopia;
- Modo para tritanopia;
- Aumento do espaçamento entre letras;
- Aumento do espaçamento entre palavras;
- Aumento do espaçamento entre linhas;
- Fonte específica para usuários com dislexia;
- Redução de animações;
- Destaque ampliado para elementos em foco;
- Cursor ampliado;
- Persistência das preferências no `localStorage`;
- Botão para restaurar todas as configurações;
- Operação por mouse e teclado;
- Fechamento com a tecla `Escape`;
- Gerenciamento de foco;
- Uso de `aria-label` e `aria-expanded`;
- Respeito à configuração `prefers-reduced-motion`.

### Público beneficiado

O recurso beneficia principalmente:

- Pessoas com baixa visão;
- Pessoas com daltonismo;
- Pessoas com dislexia;
- Pessoas com sensibilidade à luz;
- Pessoas com sensibilidade a movimentos;
- Pessoas com limitações motoras;
- Usuários que navegam pelo teclado;
- Usuários que utilizam leitores de tela.

### Justificativa

A implementação foi necessária porque a versão anterior utilizava configurações visuais fixas, sem oferecer alternativas para usuários com diferentes necessidades de acessibilidade.

O painel permite que o usuário personalize a interface sem depender exclusivamente das configurações do navegador ou do sistema operacional. Dessa forma, o recurso melhora a autonomia, a compreensão das informações e a interação com as funcionalidades do JobFinder.

### Evidências

**Evidência do painel fechado:**

https://private-user-images.githubusercontent.com/68167990/665443199-3fa7ccb2-5983-4889-a009-cc092cff5388.webm?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3OTEyMTY5OTgsIm5iZiI6MTc5MTIxNjY5OCwicGF0aCI6Ii82ODE2Nzk5MC82NjU0NDMxOTktM2ZhN2NjYjItNTk4My00ODg5LWEwMDktY2MwOTJjZmY1Mzg4LndlYm0_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYxMDA1JTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MTAwNVQxNjExMzhaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1mNjA4NGI1YjE1YjE0NTcyZWQ1MTcyZTkyZTIwOTJjMWQ4YjhiNjRkOThjODJiMGNkOTM2MGU5MmIyNjg2ZmRjJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCZyZXNwb25zZS1jb250ZW50LXR5cGU9dmlkZW8lMkZ3ZWJtIn0.21b_zbhUsPmy8gfoDBuNsVng4mZ_-U3N4Y_O6L1-7Jg

---

# 7. Impactos técnicos

As alterações realizadas impactaram as seguintes áreas do sistema:

## 7.1. Frontend

- Páginas públicas e autenticadas;
- Componentes de layout;
- Modais;
- Formulários;
- Cards de candidatos e vagas;
- Sidebar e navegação;
- Serviços de comunicação com a API;
- Contextos de acessibilidade;
- Estilos globais;
- CSS Modules;
- Testes de componentes;
- Testes de acessibilidade.

## 7.2. Backend

- Modelos de empresa e candidatos;
- Controllers;
- Rotas públicas e protegidas;
- DTOs;
- Regras de autorização;
- Persistência de favoritos;
- Contratos públicos de empresas;
- Documentação Swagger;
- Testes de integração.

## 7.3. Documentação

- `README.md`;
- `CHANGELOG`;
- Documentação da API;
- Documentação dos recursos de acessibilidade;
- Orientações de execução e demonstração;
- Registro das alterações evolutivas.

---

# 8. Estratégia de validação

As funcionalidades foram integradas à branch `develop` e devem ser validadas considerando os seguintes aspectos:

- Funcionamento da página pública da empresa;
- Proteção de dados sensíveis;
- Favoritamento e desfavoritamento de candidatos;
- Persistência dos favoritos;
- Controle de acesso entre empresas;
- Navegação por teclado;
- Funcionamento do focus trap;
- Acessibilidade dos formulários;
- Funcionamento do painel de acessibilidade;
- Persistência das preferências;
- Funcionamento do botão de restauração;
- Padronização dos carregamentos;
- Exibição de mensagens internas;
- Responsividade das telas;
- Execução dos testes automatizados;
- Execução do lint;
- Execução do build;
- Verificação do pipeline de integração contínua.

## Evidências de validação

| Item validado | Status | Evidência |
|---|---|---|
| Página pública da empresa | Concluído | *Inserir evidência* |
| Lista de candidatos favoritos | Concluído | *Inserir evidência* |
| Melhorias de acessibilidade WCAG | Concluído | *Inserir evidência* |
| Painel de acessibilidade | Concluído | *Inserir evidência* |
| Redesign da interface | Concluído | *Inserir evidência* |
| Navegação por teclado | Concluído | *Inserir evidência* |
| Testes automatizados | Concluído | *Inserir evidência* |
| Lint | Concluído | *Inserir evidência* |
| Build do projeto | Concluído | *Inserir evidência* |
| Pipeline de CI | Concluído | *Inserir evidência* |

---

# 9. Documentação e versionamento

As funcionalidades foram integradas à branch `develop`, que representa a linha ativa de desenvolvimento do projeto.

A documentação do projeto foi atualizada para contemplar:

- O escopo atual da aplicação;
- As funcionalidades disponíveis para candidatos;
- As funcionalidades disponíveis para empresas;
- A arquitetura do sistema;
- Os scripts de execução e testes;
- A documentação da API;
- Os recursos de acessibilidade;
- O fluxo de trabalho do projeto;
- As orientações para demonstração das novas funcionalidades.

---

# 10. Resultados alcançados

Com a conclusão da manutenção evolutiva, foram alcançados os seguintes resultados:

1. Criação de uma página pública e ampliada para empresas;
2. Implementação de uma lista persistente de candidatos favoritos;
3. Melhoria da organização do processo seletivo;
4. Maior transparência das informações institucionais;
5. Correção de problemas de usabilidade identificados na interface;
6. Padronização de carregamentos, mensagens e componentes;
7. Melhoria da navegação por teclado;
8. Maior compatibilidade com leitores de tela;
9. Inclusão de recursos de personalização da interface;
10. Melhoria do contraste e dos indicadores de foco;
11. Redução de barreiras para pessoas com deficiência;
12. Melhoria da prevenção de erros em formulários;
13. Atualização da documentação do projeto;
14. Integração das alterações à branch `develop`;
15. Maior maturidade funcional, visual e técnica da aplicação.

---

# 11. Conclusão

A etapa de manutenção evolutiva do JobFinder foi concluída com a implementação das funcionalidades e melhorias previstas nas Issues **#242, #243, #244 e #245**.

As novas funcionalidades ampliaram o escopo da aplicação ao oferecer uma página pública para empresas e uma lista persistente de candidatos favoritos. Essas entregas agregam valor direto para candidatos e empresas, melhorando a transparência, a produtividade e a organização dos processos seletivos.

As melhorias de acessibilidade tornaram o sistema mais inclusivo, permitindo que usuários com diferentes necessidades possam interagir com a plataforma de maneira mais autônoma. O painel de acessibilidade também oferece personalização da interface conforme as preferências individuais de cada usuário.

Além disso, o redesign da interface corrigiu problemas de usabilidade, padronizou comportamentos e melhorou a clareza dos fluxos de interação.

Portanto, as alterações realizadas atendem aos objetivos da manutenção evolutiva, preservam a finalidade original do JobFinder e estabelecem uma base mais acessível, consistente e preparada para futuras evoluções.
