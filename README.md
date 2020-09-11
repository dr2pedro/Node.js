# Rascunho de _Sign In | Sign Up_ para APIs

## Sobre o projeto
<br>

Esse é um projeto derivado de exercícios de aprendizado em _Node.js_. 

_Quem for utilizar, por favor, relevem as gafes e sintam-se a vontade para me ajudar a melhorar._

A intenção desse rascunho é que ele possa servir de base para um microserviço de **_autenticação_**, separado ou unido a outros microserviços, para implementação de uma API. 

<br>


As requisições para o microserviço serão dividas em dois tipos:
* **Comandos** - Requisições que geram escrita no banco de dados;
* **Querys** - Requisições de leitura no banco de dados;

<br>

Considerando que os registros de _Sign Up_ serão feitos apenas uma vez e os registros de _Sign In_ serão solicitados a todo momento, essa estrutura favorece com que o **banco de  escrita**, para comandos, sejá **ÚNICO**, enquanto o **banco de leitura** possa ser **REPLICADO** para  aguentar a demanda.

A estrutura do microserviço utiliza _containers_ do **_Docker_** para permitir a replicação da base de leitura, o isolamento das bases de dados, o balanceamento das requisições, além de outras vantagens inerentes desse ambiente. 

Considerando a versatilidade em se adaptar a outras databases já implementadas, foi escolhido como database _NoSQL_ o **MongoDB**.

<br>

As features _Javascript_ utilizadas na camada da aplicação são:

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

___

<br>

## Diagrama Conceitual

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

### Integração
Na pasta `src/middleware` existe uma função chamada `Guard` que deve ser utilizada em _endpoints_ de outros microserviços para acessos apenas de usuários logados. 

É possível utilizá-lo de modo global

```javascript
const express = require('express')
const middlewares = require('./middlewares')
const router = express.Router()


router.use(middlewares.guard)
```

Ou de modo local

```javascript
const express = require('express')
const { guard } = require('./middlewares')
const router = express.Router()

router.get('/', guard( ), async (req, res, next) => {
    // TO DO
})
```
<br>

___
<br>

## Observações importantes

<br>

* Deve-se atentar ao fato de que uma vez que a base de leitura é a réplica da base de escrita existirá **_Consistência Eventual_** dos dados;

<br>

