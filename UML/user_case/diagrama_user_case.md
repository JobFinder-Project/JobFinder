# DIAGRAMAS DE CASOS DE USO

A apresentação dos diagramas de caso de uso a seguir é dividida em dois subsistemas principais: **Empregador** e **Candidato**. Para algumas funcionalidades, há um diagrama de caso de uso simples, que foca na interação principal, e uma versão "Complexa", que detalha o fluxo completo, incluindo ações prévias necessárias, como o login.

## Subsistema Empregador
Esta seção detalha os casos de uso relacionados às ações que um empregador pode realizar no sistema.

### 1. Cadastro de Empregador
O diagrama abaixo ilustra o processo de cadastro de um novo empregador no sistema.
![alt text](../images/use-case-image/empregador/cadastroEmpregador-UseCase.png)

### 2. Login de Empregador
Este diagrama apresenta a funcionalidade de autenticação do empregador.
![alt text](../images/use-case-image/empregador/loginEmpregador-UseCase.png)

#### Visão Complexa
Este diagrama mais detalhado ilustra o fluxo completo, incluindo a etapa de cadastro como pré-condição para o login.
![alt text](../images/use-case-image/empregador/loginEmpregadorComplex-UseCase.png)

### 3. Alteração de Status do Empregador
Estes diagramas descrevem como um administrador ou o próprio sistema pode alterar o status de um empregador (e.g., de "pendente" para "aprovado").

#### Visão Simples
Apresenta a funcionalidade principal de alteração de status.
![alt text](../images/use-case-image/empregador/alterarStatusEmpregador-Use-Case.png)

#### Visão Complexa
Mostra o processo completo, que exige que o administrador esteja logado para poder realizar a alteração de status de um empregador.
![alt text](../images/use-case-image/empregador/mudarStatusEmpregadorComplex-UserCase.png)


### 4. Gestão de Vagas
O empregador pode visualizar as vagas que cadastrou no sistema.
![alt text](../images/use-case-image/empregador/visualizaVagasEmpregador-UserCase.png)


### 5. Visualização de Candidatos
Após publicar vagas, o empregador pode visualizar a lista dos candidatos que se aplicaram. Este caso de uso mostra o empregador visualizando a listagem de todos os candidatos de uma determinada vaga.
![alt text](../images/use-case-image/empregador/visualizaListaEmpregador-UseCase.png)


#### Perfil do Candidato
Aqui, o empregador seleciona um candidato da lista para visualizar seu perfil detalhado.											
![alt text](../images/use-case-image/empregador/visualizaCandidatoEmpregador-UseCase.png)


### 6. Perfil do Empregador
Este diagrama detalha o fluxo para o empregador visualizar e gerenciar seu próprio perfil, ação que requer autenticação prévia.
![alt text](../images/use-case-image/empregador/perfilEmpregadorComplex-UserCase.png)

Uma visão mais simplificada do fluxo.
![alt text](../images/use-case-image/empregador/perfilEmpregador-UserCase.png)

## Subsistema Candidato
Esta seção detalha os casos de uso relacionados às ações que um candidato pode realizar no sistema.


### 1. Cadastro de Candidato
Ilustra o processo de registro de um novo candidato na plataforma.
![alt text](../images/use-case-image/candidato/cadastroCandidato-UseCase.png)

### 2. Login de Candidato
Descreve a autenticação do candidato no sistema.

#### Visão Simples
Mostra a interação direta do candidato para efetuar o login.
![alt text](../images/use-case-image/candidato/loginCandidato-UseCase.png)

#### Visão Complexa
O diagrama expandido mostra que o cadastro é um passo necessário antes que o login possa ser realizado.
![alt text](../images/use-case-image/candidato/loginCandidatoComplex-UseCase.png)

### 3. Busca e Visualização de Vagas
O candidato pode procurar e visualizar as vagas de emprego disponíveis.

#### Visão Simples
Foca na ação de buscar e listar as vagas.
![alt text](../images/use-case-image/candidato/vagasCandidato-UseCase.png)

#### Visão Complexa
Ilustra o fluxo desde o login do candidato até a visualização das vagas.
![alt text](../images/use-case-image/candidato/vagasCandidatoComplex-UseCase.png)

### 4. Candidatura a uma Vaga
Detalha o processo de um candidato se aplicar para uma vaga de interesse.

#### Visão Simples
Mostra a ação principal de se candidatar a uma vaga.
![alt text](../images/use-case-image/candidato/candidataCandidato-UserCase.png)

#### Visão Complexa
Apresenta o fluxo completo: o candidato precisa estar logado e visualizar uma vaga para então poder se candidatar.
![alt text](../images/use-case-image/candidato/candidataCandidatoComplex-UserCase.png)


### 5. Perfil do Candidato
Este diagrama mostra o fluxo para o candidato visualizar e gerenciar seu próprio perfil, que requer que ele esteja logado no sistema.

#### Visão Simples
Mostra a interação direta do candidato para alterar  as informações perfil.
![alt text](../images/use-case-image/candidato/perfilCandidato-UserCase.png)

#### Visão Complexa
O diagrama expandido mostra como o usuário alterando as informações de perfil, considerando ações anteriores.
![alt text](../images/use-case-image/candidato/perfilCandidatoComplex-UserCase.png)
