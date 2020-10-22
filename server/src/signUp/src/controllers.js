const 
    monk = require('monk'),
    bcrypt = require('bcrypt'),
    jwt = require('jsonwebtoken'),
    user = monk(process.env.MONGO_WRITE_URI).get('users'),
    { secret } = require('../auth.json'),{ user_schema } = require('./schemas.js')


module.exports = {

    validateRequest: ( async ( req, res, next ) => {
        try {
            await user_schema.validateAsync(req.body)
            next()
        } catch (error) {
            res.status(400).send(error.message)
        }     
    })
    ,
    findUser: ( async ( req, res, next ) => {
        try {  
            const { email } = req.body
            const payload = await user.findOne({ email })
            if (payload) { return res.status(409).send({ error: 'User already exists!' }) }
            next()
        } catch (error) {
            return res.status(400).send(error.message)
        } 
    })
    ,
    createUser: ( async (req, res) => {
        try {       
            password = await bcrypt.hash(req.body.password, 10)
            req.body.password = password
            const payload = await user.insert(req.body)
            payload.password = undefined
            const token = jwt.sign({ _id: payload._id, email: payload.email }, secret, { expiresIn: 14400 })
            return res.status(201).json({ payload, token })
        } catch (error) {
            return res.status(400).send(error.message) 
        }
    })
    
}







