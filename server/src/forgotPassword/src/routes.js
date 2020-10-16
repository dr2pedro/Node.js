const express = require('express')
const { generateCode , findUser, validateCode, updatePassword, sendByMail } = require('./controllers')

const router = express.Router()

router.get('/', (req, res) => {
    res.send('The Forgot password app is healthy...')
})

router.post('/', [findUser , generateCode, sendByMail])

router.post('/reset', [validateCode, updatePassword])


module.exports = router