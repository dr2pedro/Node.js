# APIs em _Node_

## Sobre
<br>

Esse é um repositório derivado de exercícios de aprendizado em _Node.js_ e _Docker_, eventualmente usando o Swarm ou _Kubernetes_. 

_Quem for utilizar, por favor, relevem as gafes e sintam-se a vontade para me ajudar a melhorar._

A intenção é que o repositório contenha a base para múltiplos _services_, como autenticação de cadastro de usuários, envio de e-mails, recuperação de informações, etc...

<br>

## Opções do autor
### Banco de Dados / Database
<br>

Considerando a versatilidade em se adaptar à outras databases possivelmente já implementadas em outros negócios a que esse repo venha a ser utilizado, optou-se pelo uso de **MongoDB** para persistência dos dados. 
 
As requisições para as _databases_ serão dividas em dois tipos:
* **Comandos** - Requisições que geram escrita; <br>

* **Querys** - Requisições de leitura;

Os _Comandos_ estão passíveis à maiores latências enquanto as _Querys_ devem ser feitas à databases _read-only_ de rápida resposta. <br>

Nos _services_ nos quais a database de leitura é derivada da de escrita existirá **_Consistência Eventual_** dos dados. 

<br>

### Implementação dos containers
<br>

* Todos os containers estão em um único `Dockerfile` de _multistage build_; <br>

* Visando a menor granularidade possível, cada estágio é responsável por uma _'regra de negócio'_; <br>

* **`1 estágio = 1 container`** <br>

* Para um conjunto de estágios teremos `Gateways` reponsáveis por compor e caracterizar um microserviço;<br>

* **`1 Gateway = N containers`**

<br>

### Implementação dos _services_
<br>


* No `docker-compose.yml` estão as especificações tanto para deploy pelo **docker-compose** quanto para deploy no **cluster Swarm**;<br>

* Por questões de segurança a _layer_ de **_HEALTHCHECK_** existe apenas no `docker-compose.yml` e não no `Dockerfile`;<br>

* `Middlewares` que não envolvem segurança estão presentes apenas nesses `Gateways`;<br>

* `Middlewares` de segurança estão implementados em **TODOS OS ESTÁGIOS**, ainda que soe redundante; <br>

* Considerando que os `middlewares` não são 'regras de negócio' por si só, eles estão separados em uma diretório que não está incluso no processo de build. Caso seja necessário utilizar alguns deles, acidione na _layer_ **_COPY_** do Dockerfile:

<br>


```Dockerfile
FROM node:lts-alpine3.9 AS base
WORKDIR /app
COPY server/configs/auth.json src/middleware package.json package-lock.json .env ./
```

<br>

e no código de modo global, ou...

<br>

```javascript
const express = require('express')
const middlewares = require('./middlewares')
const router = express.Router()


router.use(middlewares.guard)
```


de modo local.
```javascript
const express = require('express')
const { guard } = require('./middlewares')
const router = express.Router()

router.get('/', guard( ), async (req, res, next) => {
    // TO DO
})
```
<br>

### Configurações

<br>

Após o clone, na raiz desse projeto crie duas pastas: `configs` e `template`.

Na pasta `configs` insira 3 arquivos (caso venha a utilizar os três microserviços dessa _stack_):

-  **`auth.json`**: que irá armazenar o `secret` da API que gera os jsonWebTokens:

```json
{
    "secret": "seu_secret"
}
```

- **`smtp.json`**: que irá armazenar as configurações do seu servidor SMTP para envio do e-mail de recuperação de senha:

```json
{
    "host": "smtp.seuservidor.io",
    "port": 2222,
    "auth": {       // caso exista autenticação no seu servidor
        "user": "seu usuário",
        "pass": "seu pass"
    }
}
```
- **`viewEngineOptions.json`**: que armazena as configuraçções da _engine_ de compilação do corpo do e-mail de recuperação de senha (via _nodemailer express handlebars_):

```json
{
"viewEngine": {
    "extName": ".hbs",
    "partialsDir": "template",
    "layoutsDir": "template",
    "defaultLayout": ""
    },
"viewPath": "template",
"extName": ".hbs"
  }

// caso prefira outro compilador de template basta trocar aqui

```

<br>

E na pasta `template` insira:
- **`main.hbs`**: que é o template do seu e-mail seguindo a estrutura a seguir (ou qualquer outra que julgar adequada):

```handlebars
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recovery Password</title>
</head>
<body>
    <h1>Code for recovery password</h1>
<p>This mail was send due to the recovery password request in the API. Use the follow code in 
    the body of update password request:</p>
{{ code }}
<footer> Pedro dos Santos: CTO - CodePlayData©</footer>
</body>
</html>
```
<br>



## _Case_
<br>

Essa _branch_ simula o seguinte cenário: 

<br>

"Foi solicitado o desenvolvimento de uma API para SignIn e SignUp de usuários, com geração de token de autenticação e encriptação de _password_ no banco de dados."

<br>

### Features utilizadas

<br>

As seguintes features _Javascript_ foram utilizadas para implementação desse _service_:

| **Pacote**   |   **Função**                                     |
|:------------:|:------------------------------------------------:|
|   Express    |   Gerenciador de rotas                           |
|   Monk       |  Interação com o MongoDB                         |
|   Bcrypt     | Encriptar o password                             |
| JsonWebToken | Gerar e validar token de autenticação do usuário |
| Joi          |  Validação de campos da requisição               |
| Supertest    | Testes end to end (E2E)                          |
| Body-paser   | Manipulação de JSON                              |
| Nomailer     | Envio de emails                                  |
| Handlebars   | Template de emails                               |
<br>

### Diagrama conceitual

<br>

Abaixo está o diagrama de como a estrutura deve funcionar:

![](diagram.svg)


<br>

___

<br>
