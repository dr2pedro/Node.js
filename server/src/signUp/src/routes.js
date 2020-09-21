const express = require('express')

const { validateRequest, findUser, createUser } = require('./controllers')

const router = express.Router()


router.post('/signup', [validateRequest, findUser, createUser])



module.exports = router
