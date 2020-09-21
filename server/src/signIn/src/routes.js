const express = require('express')
const { findUser , createToken } = require('./controllers')

const router = express.Router()



router.post('/signin', [findUser , createToken])



module.exports = router