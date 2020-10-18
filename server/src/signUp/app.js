const 
    express = require('express'),
    morgan = require('morgan'),
    helmet = require('helmet'),
    cors = require('cors'),
    signUp = require('./src/routes'),
    app = express()

require('dotenv').config()

app.use(morgan('dev'))
    .use(helmet())
    .use(express.json())
    .use(cors())
    .use('/', signUp)

module.exports = app
