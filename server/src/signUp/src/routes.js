const express = require('express')

const { validateRequest, findUser, createUser } = require('./controllers')

const router = express.Router()

router.get('/', (req, res) => {
    res.send('The signup app is healthy...')
})

router.post('/', [validateRequest, findUser, createUser])



module.exports = router
