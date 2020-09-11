const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')

require('dotenv').config()

const signIn = require('./src/routes')
const whitelist = ["http://localhost:2000"]

const app = express()

app.use(morgan('dev'))
app.use(helmet())
app.use(express.json())
app.use(cors({origin:whitelist}))
        
app.use('/', signIn)

module.exports = app
