const 
    express = require('express'),
    router = express.Router(),
    URI = process.env.MONGO_READ_URI,
    name = 'users',
    joi = require('joi'),
    signup = require('./controllers')

const schema = joi.object({ email: joi.string().trim().email().required(),
                            password: joi.string().trim().required() })

router
    .get('/', (req, res) => {res.send('The signup app is healthy...')})
    .post('/', signup.validateRequest(schema), signup.findUserByEmail(URI, name))

    
module.exports = router
