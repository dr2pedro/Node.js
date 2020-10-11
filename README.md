# _Node_ para APIs

## Sobre
<br>

Esse é um repositório derivado de exercícios de aprendizado em _Node.js_ e _Docker_, eventualmente usando o Swarm ou _Kubernetes_. 

_Quem for utilizar, por favor, relevem as gafes e sintam-se a vontade para me ajudar a melhorar._

A intenção é que o repositório contenha a base para múltiplos microserviços, como autenticação de cadastro de usuários, envio de e-mails, recuperação de informações, etc...

<br>

## Opções do autor
### Banco de Dados / Database
<br>

Considerando a versatilidade em se adaptar à outras databases possivelmente já implementadas em outros negócios a que esse repo venha a ser utilizado, optou-se pelo uso de **MongoDB** para persistência dos dados. 
 
As requisições para esse microserviço serão dividas em dois tipos:
* **Comandos** - Requisições que geram escrita;
* **Querys** - Requisições de leitura;

Os _Comandos_ estão passíveis à maiores latências enquanto as _Querys_ devem ser feitas à databases _read-only_ de rápida resposta. 
É possível que a database para leitura seja derivada da de escrita, nesse cenário existirá **_Consistência Eventual_** dos dados, isso ocorre porque hipoteticamente os dados precisam ser exportados da base de escrita e importados para a de leitura, o que pode levar a um tempo (conhecido ou não dependendo da metodologia adotada).

<br>

### Implementação dos containers
<br>

* Todos os containers estão em um único `Dockerfile` de _multistage build_; 
* Visando a menor granularidade possível, cada estágio é responsável por uma 'regra de negócio'. Consequentemente `1 estágio = 1 container`;
* Para um conjunto de estágios teremos `Gateways` reponsáveis por compor e caracterizar o microserviço;
* No `docker-compose.yml` estão as especificações para deploy em cluster;
* Por questões de segurança a _layer_ de **_HEALTHCHECK_** existe apenas no `docker-compose.yml`;
* Os `middlewares` que não envolvem segurança estão presentes apenas nesses `Gatewayes`;
* `Middlewares` de segurança estão implementados em **TODOS OS ESTÁGIOS**, ainda que soe redundante;
* Considerando que os `middlewares` não são 'regras de negócio' por si só, eles estão separados em uma diretório que não está incluso no processo de build. Caso seja necessário utilizar alguns deles, acidione na _layer_ **_COPY_** do Dockerfile:

<br>

```Dockerfile
FROM node:lts-alpine3.9 AS base
WORKDIR /app
COPY server/configs/auth.json src/middleware package.json package-lock.json .env ./
```
<br>

e implemente manualmente nos seus _endpoints_:

<br>

```javascript
const express = require('express')
const middlewares = require('./middlewares')
const router = express.Router()


router.use(middlewares.guard)
```

<br>

de modo global, ou...

<br>

```javascript
const express = require('express')
const { guard } = require('./middlewares')
const router = express.Router()

router.get('/', guard( ), async (req, res, next) => {
    // TO DO
})
```
<br>

de modo local.

<br>

___
<br>



## Case
<br>

Esse _branch_ simula o seguinte cenário: 

<br>

"Imaginem que foi solicitado o desenvolvimento de uma API para SignIn e SignUp de usuários, com geração de token de autenticação e encriptação de _password_ no banco de dados."

As seguintes features _Javascript_ podem ser utilizadas:

| **Pacote**   |   **Função**                                     |
|:------------:|:------------------------------------------------:|
|   Express    |   Gerenciador de rotas                           |
|   Monk       |  Interação com o MongoDB                         |
|   Bcrypt     | Encriptar o password                             |
| JsonWebToken | Gerar e validar token de autenticação do usuário |
| Joi          |  Validação de campos da requisição               |
| Supertest    | Testes end to end (E2E)                          |
| Body-paser   | Manipulação de JSON                              |

<br>

Abaixo está o diagrama de como a estrutura deve funcionar:

![](diagram.svg)


<br>

___

<br>

## Como usar
<br>

Para o uso da camada da aplicação fora da estrutura de container basta basta seguir as instruções a seguir. 

### Instalação

Após o fork (ou clone) instale: 
```
npm install
```
<br>

### Controle de qualidade de código
Verifique se não restaram inconsistências de código:

```
npm run lint
```

<br>

### Desenvolvimento
Inicie o servidor de desenvolvimento com:

```
npm run dev
```
<br>

### Teste
Teste os endpoints de _Sign Up_ e _Sign In_ com:

```
npm run test
```
 <br>