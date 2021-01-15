const 
    express = require('express'),
    { validateRequest, selectCollection ,findUserByEmail, createUser } = require('./controllers'),
    router = express.Router(),
    URI = monk(process.env.MONGO_READ_URI),
    name = 'users',
    joi = require('joi')


const schema = joi.object({ email: joi.string().trim().email().required(),
                            password: joi.string().trim().required() })

router
    .get('/', (req, res) => {res.send('The signup app is healthy...')})
    .post('/', [validateRequest, selectCollection, findUserByEmail, createUser])

    
module.exports = router
