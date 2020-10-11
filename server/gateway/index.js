var proxy = require('express-http-proxy');
const express = require('express')
const app = express()
const helmet = require('helmet')
const cors = require('cors')
const morgan = require('morgan')

require('dotenv').config()

const port = process.env.PORT_GATEWAY || 5080
 
app.use(morgan('dev'))
app.use(helmet())
app.use(express.json())
app.use(cors())

app.use('/signin', proxy('http://signin:2221/'))
app.use('/signup', proxy('http://signup:2222/'))


app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Gateway endpoints listening on: http://localhost:${port}`)
  /* eslint-enable no-console */
})
