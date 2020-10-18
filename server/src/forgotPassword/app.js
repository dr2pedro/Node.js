const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

require('dotenv').config()

const forgotPassword = require('./src/routes')

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(express.json())
app.use(cors())
        
app.use('/', forgotPassword)

module.exports = app