const 
  proxy = require('express-http-proxy'),
  express = require('express'),
  app = express(),
  helmet = require('helmet'),
  cors = require('cors'),
  morgan = require('morgan')

require('dotenv').config()

const 
  gateway_port = process.env.PORT_GATEWAY || 5080,
  signin_port = process.env.PORT_SIGNIN,
  signup_port = process.env.PORT_SIGNUP,
  forgot_password_port = process.env.PORT_FORGOTPASSWORD

app
  .use(morgan('dev'))
  .use(helmet())
  .use(express.json())
  .use(cors())
  
  .use('/signin', proxy('http://signin:'+ signin_port + '/'))
  .use('/signup', proxy('http://signup:' + signup_port + '/'))
  .use('/forgotpassword', proxy('http://forgotpassword:' + forgot_password_port + '/'))

  .listen(gateway_port, () => { console.log(`Gateway endpoints listening on: http://localhost:${gateway_port}`) })
