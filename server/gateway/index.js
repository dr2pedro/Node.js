var proxy = require('express-http-proxy');
const express = require('express')
const app = express()
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')

require('dotenv').config()

const gateway_port = process.env.PORT_GATEWAY || 5080
const signin_port = process.env.PORT_SIGNIN
const signup_port = process.env.PORT_SIGNUP

app.use(morgan('dev'))
app.use(helmet())
app.use(express.json())
app.use(cors())

app.use('/signin', proxy('http://signin:'+ signin_port + '/'))
app.use('/signup', proxy('http://signup' + signup_port + '/'))


app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Gateway endpoints listening on: http://localhost:${gateway_port}`)
  /* eslint-enable no-console */
})
