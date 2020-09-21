const monk = require('monk')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const db = monk(process.env.MONGO_URI)
const user = db.get('users')
const { secret } = require('../auth.json')
const schema = require('./schema.js')

exports.validateRequest = ( async ( req, res, next ) => {
    try {
        await schema.validateAsync(req.body)
        next()
    } catch (error) {
        res.status(400).send(error.message)
    }     
})

exports.findUser = ( async ( req, res, next ) => {
    try {  
        const { email } = req.body
        const payload = await user.findOne({ email })
        if (payload) { return res.status(409).send({ error: 'User already exists!' }) }
        next()
    } catch (error) {
        return res.status(400).send(error.message)
    } 
})

exports.createUser = ( async (req, res) => {
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

