const 
    express = require('express'),
    { generateCode , findUser, validateCode, updatePassword, sendByMail } = require('./controllers'),
    router = express.Router()

router
    .get('/', (req, res) => { res.send('The Forgot password app is healthy...') })
    .post('/', [findUser , generateCode, sendByMail])
    .post('/reset', [validateCode, updatePassword])

    
module.exports = router