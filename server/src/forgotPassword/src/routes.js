const 
    express = require('express'),
    { generateCode , findUser, validateCode, updatePassword, registerCode, recoveryPasswordEmail, sendMail } = require('./controllers'),
    router = express.Router()

router
    .get('/', (req, res) => { res.send('The Forgot password app is healthy...') })
    .post('/', [findUser , generateCode, registerCode, recoveryPasswordEmail, sendMail])
    .post('/reset', [validateCode, updatePassword])

    
module.exports = router