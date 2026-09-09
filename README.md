# JobFinder - Documentação

Esta branch reúne os documentos de apoio, diagnóstico, relatórios e artefatos de modelagem do JobFinder.

O objetivo é manter a documentação do projeto separada do desenvolvimento ativo da aplicação, facilitando consulta, revisão e atualização dos materiais sem misturar alterações documentais com mudanças de código-fonte.

## Estrutura Principal

```text
docs/
├── apresentacao-sistema.md
├── manutencao-corretiva/
│   ├── bugs-e-classificacao.md
│   └── relatorio-final.md
└── manutencao-preventiva/
    ├── diagnostico-manutencao-preventiva.md
    └── relatorio-final.md
```

## Documentos Gerais

- `docs/apresentacao-sistema.md`: visão geral do sistema, contexto do produto e descrição da aplicação.

## Manutenção Corretiva

Os documentos de manutenção corretiva registram defeitos identificados, classificação dos bugs, evidências e resultados das correções realizadas.

- `docs/manutencao-corretiva/bugs-e-classificacao.md`
- `docs/manutencao-corretiva/relatorio-final.md`

## Manutenção Preventiva

Os documentos de manutenção preventiva registram intervenções realizadas para reduzir riscos e facilitar mudanças futuras, especialmente relacionadas a segurança, privacidade e autenticação.

- `docs/manutencao-preventiva/diagnostico-manutencao-preventiva.md`
- `docs/manutencao-preventiva/relatorio-final.md`

## Artefatos UML

A pasta `UML/` contém os diagramas e artefatos de modelagem do sistema, organizados por tipo:

- atividades;
- casos de uso;
- classes;
- componentes;
- comunicação;
- implantação;
- objetos;
- pacotes;
- sequência;
- estados.

## Documentos de Requisitos

Também fazem parte desta branch os documentos de requisitos e modelagem textual:

- `requisitos.md`
- `user_stories.md`
- `personas.md`

## Observação

Alterações nesta branch devem priorizar documentação, diagramas, relatórios e materiais de apoio. Mudanças de código-fonte da aplicação devem ser realizadas nas branches apropriadas de desenvolvimento.
