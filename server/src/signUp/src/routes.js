const 
    express = require('express'),
    { validateRequest, findUser, createUser } = require('./controllers'),
    router = express.Router()

router
    .get('/', (req, res) => {res.send('The signup app is healthy...')})
    .post('/', [validateRequest, findUser, createUser])

    
module.exports = router
