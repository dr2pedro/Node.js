const monk = require('monk')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const db = monk(process.env.MONGO_URI)
const user = db.get('users')
const { secret } = require('../auth.json')

exports.findUser = ( async ( req, res, next ) => {
    try {  
        const { email } = req.body
        const payload = await user.findOne({ email })
        if (!payload) { return res.status(404).send({ error: 'User not found' }) }
        res.payload = await payload
        next()
    } catch (error) {
        return res.status(400).send(error.message) 
    } 
})

exports.createToken = (async (req, res) => {
    try {
        const { password } = req.body
        const { payload } = res
        if (!await bcrypt.compare(password, payload.password)) { return res.status(400).send({ error: 'Invalid password' }) }
        payload.password = undefined
        const token = jwt.sign({ _id: payload._id, email: payload.email }, secret, { expiresIn: 14400 })
        return res.status(200).json({ payload, token })
    } catch (error) {
        return res.status(400).send(error.message) 
    }
})

