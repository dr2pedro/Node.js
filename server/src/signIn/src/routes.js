const express = require('express')
const { findUser , createToken } = require('./controllers')

const router = express.Router()


router.get('/', (req, res) => {
    res.send('The signin app is healthy...')
})

router.post('/signin', [findUser , createToken])



module.exports = router