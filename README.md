# JobFinder - Branch de Documentação

Esta branch centraliza a documentação técnica e de apoio do JobFinder. Ela reúne a apresentação do sistema, requisitos, histórias de usuário, personas, relatórios de manutenção e artefatos UML usados para representar a estrutura e os fluxos principais da aplicação.

O objetivo é manter a documentação do projeto separada das branches de desenvolvimento de código, facilitando consulta, revisão e evolução dos documentos sem misturar alterações documentais com mudanças de implementação.

## Mapa Geral

```text
.
├── README.md
├── requisitos.md
├── user_stories.md
├── personas.md
├── docs/
│   ├── apresentacao-sistema.md
│   ├── manutencao-corretiva/
│   │   ├── bugs-e-classificacao.md
│   │   └── relatorio-final.md
│   └── manutencao-preventiva/
│       ├── diagnostico-manutencao-preventiva.md
│       └── relatorio-final.md
└── UML/
    ├── activity/
    ├── class/
    ├── component/
    ├── comunication/
    ├── deployment/
    ├── images/
    ├── object/
    ├── package/
    ├── sequence/
    ├── state/
    └── user_case/
```

## Documentos Principais

| Arquivo | Conteúdo |
| :-- | :-- |
| `docs/apresentacao-sistema.md` | Apresentação geral do JobFinder, contexto do produto, público-alvo e visão da aplicação. |
| `requisitos.md` | Requisitos funcionais, requisitos não funcionais e regras de negócio documentadas para o sistema. |
| `user_stories.md` | Histórias de usuário que descrevem os principais fluxos esperados para candidatos e empresas. |
| `personas.md` | Personas utilizadas para representar perfis de usuários e orientar decisões funcionais. |

## Manutenção

A documentação de manutenção fica separada por tipo para evitar conflito de nomes e para deixar claro o objetivo de cada conjunto de documentos.

### Manutenção Corretiva

| Arquivo | Conteúdo |
| :-- | :-- |
| `docs/manutencao-corretiva/bugs-e-classificacao.md` | Registro dos bugs analisados, sua classificação e o contexto dos problemas corrigidos. |
| `docs/manutencao-corretiva/relatorio-final.md` | Relatório final das correções realizadas, com comparação entre comportamento anterior e comportamento ajustado. |

Use esta pasta para documentos relacionados a correções de defeitos já observáveis no sistema, quando o comportamento atual não atende ao funcionamento esperado.

### Manutenção Preventiva

| Arquivo | Conteúdo |
| :-- | :-- |
| `docs/manutencao-preventiva/diagnostico-manutencao-preventiva.md` | Diagnóstico das oportunidades de manutenção preventiva relacionadas a segurança, privacidade e autenticação. |
| `docs/manutencao-preventiva/relatorio-final.md` | Relatório final das intervenções preventivas realizadas, incluindo situação anterior, situação atual, componentes impactados e evidências. |

Use esta pasta para documentos relacionados a mudanças feitas para reduzir riscos futuros, preparar o sistema para evolução e diminuir o impacto de possíveis mudanças em requisitos de segurança ou privacidade.

## Artefatos UML

A pasta `UML/` contém os documentos Markdown que apresentam os diagramas e os arquivos de imagem usados por esses documentos.

| Pasta / Arquivo | Conteúdo |
| :-- | :-- |
| `UML/activity/index.md` | Diagramas de atividade dos principais fluxos do sistema. |
| `UML/class/diagram_class.md` | Diagrama de classes e visão estrutural das entidades principais. |
| `UML/component/diagram_components.md` | Diagrama de componentes da aplicação. |
| `UML/comunication/diagram_comunication.md` | Diagrama de comunicação entre partes do sistema. |
| `UML/deployment/diagram_deployment.md` | Diagrama de implantação. |
| `UML/object/diagram_object.md` | Diagrama de objetos. |
| `UML/package/diagram_package.md` | Diagrama de pacotes. |
| `UML/sequence/index.md` | Diagramas de sequência dos fluxos documentados. |
| `UML/state/diagram_states.md` | Diagramas de estado relacionados aos processos da aplicação. |
| `UML/user_case/diagrama_user_case.md` | Diagramas de casos de uso gerais e por tipo de usuário. |

## Imagens e Fontes dos Diagramas

Os arquivos visuais usados pelos documentos UML ficam em `UML/images/`.

| Pasta / Arquivo | Finalidade |
| :-- | :-- |
| `UML/images/` | Imagens gerais exportadas dos diagramas. |
| `UML/images/atividade/` | Imagens auxiliares dos diagramas de atividade. |
| `UML/images/sequence/` | Imagens dos diagramas de sequência. |
| `UML/images/diagramaDeEstado/` | Imagens dos diagramas de estado. |
| `UML/images/Component/` | Imagens relacionadas ao diagrama de componentes. |
| `UML/images/use-case-image/` | Imagens dos casos de uso, separadas por candidato, empregador e suporte. |
| `UML/images/*.asta` | Arquivos-fonte de diagramas editáveis no Astah. |

As imagens são mantidas junto dos documentos porque fazem parte do material versionado desta branch. Ao atualizar um diagrama, o ideal é atualizar tanto o arquivo Markdown correspondente quanto a imagem exportada usada por ele.

## Leitura Sugerida

1. `docs/apresentacao-sistema.md`
2. `requisitos.md`
3. `user_stories.md`
4. `personas.md`
5. `UML/user_case/diagrama_user_case.md`
6. `UML/class/diagram_class.md`
7. Demais diagramas em `UML/`, conforme o fluxo analisado.
8. Documentos de manutenção em `docs/manutencao-corretiva/` ou `docs/manutencao-preventiva/`, conforme o tipo de análise.

## Convenções de Organização

- Documentos gerais do produto devem ficar em `docs/` ou na raiz, quando forem artefatos centrais já existentes da branch.
- Documentos de manutenção corretiva devem ficar em `docs/manutencao-corretiva/`.
- Documentos de manutenção preventiva devem ficar em `docs/manutencao-preventiva/`.
- Novos diagramas devem ter um arquivo Markdown de referência dentro da pasta UML correspondente.
- Imagens exportadas de diagramas devem ficar em `UML/images/` ou em uma subpasta coerente com o tipo do diagrama.
- Materiais temporários, rascunhos locais, PDFs de apoio e arquivos que não fazem parte da documentação final não devem ser adicionados à branch.
- Alterações de código-fonte da aplicação devem ser feitas em branches de desenvolvimento, não nesta branch de documentação.

## Escopo da Branch

Esta branch deve conter apenas documentação, diagramas e materiais de apoio versionáveis. Ela não deve alterar backend, frontend, configurações de execução da aplicação ou dependências do projeto.
