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

| Issue | Task | Evidência anterior | Evidência depois da adaptação | Situação |
| :-- | :-- | :-- | :-- | :-- |
| [#223](https://github.com/JobFinder-Project/JobFinder/issues/223) | Exclusão segura de conta | Adicionar link da evidência inicial | Adicionar link da evidência final após validação | Em validação |
| [#224](https://github.com/JobFinder-Project/JobFinder/issues/224) | Termos de Uso e aceite obrigatório | Adicionar link da evidência inicial | Adicionar link da evidência final após validação | Em validação |
| [#227](https://github.com/JobFinder-Project/JobFinder/issues/227) | Política de Privacidade | Adicionar link da evidência inicial | Adicionar link da evidência final após validação | Em validação |

## Evidência Esperada - Exclusão Segura de Conta

### Antes

Registrar em vídeo:

1. Acessar o perfil do candidato.
2. Mostrar que não existe opção para excluir a própria conta.
3. Acessar o perfil da empresa.
4. Mostrar que não existe opção para excluir a própria conta.
5. No Postman, demonstrar que não havia endpoint próprio para exclusão segura da conta autenticada.

### Depois

Registrar em vídeo:

1. Candidato autenticado acessando a área de perfil.
2. Candidato acionando exclusão de conta com confirmação de senha.
3. Backend encerrando a sessão após exclusão.
4. Tentativa de acessar dashboard após exclusão retornando bloqueio.
5. Empresa repetindo o mesmo fluxo.
6. Tentativa indevida de informar ID de outro usuário sendo rejeitada ou não existindo no contrato.

## Evidência Esperada - Termos de Uso

### Antes

Registrar em vídeo:

1. Tela de login exibindo link sem destino real ou nomenclatura antiga.
2. Cadastro de candidato sem aceite explícito de Termos de Uso.
3. Cadastro de empresa sem aceite explícito de Termos de Uso.
4. Banco sem campos de versão e data de aceite.

### Depois

Registrar em vídeo:

1. Página pública de Termos de Uso acessível.
2. Cadastro exigindo aceite explícito.
3. Registro de `termosAceitosEm` e `termosVersao` no candidato.
4. Registro de `termosAceitosEm` e `termosVersao` na empresa.
5. Usuário existente sendo bloqueado até aceitar a versão vigente.

## Evidência Esperada - Política de Privacidade

### Antes

Registrar em vídeo:

1. Link de Política de Privacidade sem página real.
2. Cadastro sem aceite explícito da política.
3. Ausência de registro de aceite no banco.

### Depois

Registrar em vídeo:

1. Página pública de Política de Privacidade acessível.
2. Cadastro exibindo link para a política.
3. Registro de `politicaPrivacidadeAceitaEm` e `politicaPrivacidadeVersao` no candidato.
4. Registro de `politicaPrivacidadeAceitaEm` e `politicaPrivacidadeVersao` na empresa.
5. Usuário existente sendo bloqueado até aceitar a política vigente.

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
