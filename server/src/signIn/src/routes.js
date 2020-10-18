const 
    express = require('express'),
    { findUser , createToken } = require('./controllers'),
    router = express.Router()


router
    .get('/', (req, res) => { res.send('The signin app is healthy...') })
    .post('/', [findUser , createToken])


module.exports = router