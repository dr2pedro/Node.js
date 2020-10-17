const monk = require('monk')
const crypto = require('crypto')
const bcrypt = require('bcrypt')

const db = monk(process.env.MONGO_URI)
const user = db.get('users')
const updates = db.get('updates')

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

exports.generateCode = ( async ( req, res, next ) => {    
   try {
    const code = crypto.randomBytes(9).toString('hex')
    const expire_time = new Date()
    expire_time.setHours( expire_time.getHours() + 1 )   
    res.payload.pending_code = { code, expire_time } 
    next()
   } catch (error) {
        return res.status(400).send(error.message)
   }
})

exports.sendByMail = ( async ( req, res ) => {
    try {
        const { email } = req.body
        const older_request = await updates.findOne({ email }) 
        if (older_request) { await updates.remove({ email }) }
        const new_request = await updates.insert(res.payload)
        return res.status(201).json(new_request)
    } catch (error) {
        return res.status(400).send(error.message)
    }
})

exports.validateCode = ( async ( req, res, next ) => {
    try {
        const { email, code } = req.body
        const payload = await updates.findOne({ email })
        if( payload.pending_code.code != code) { return res.status(401).send("This code does not exists in database.")}
        if( payload.pending_code.expire_time < Date.now()) { return res.status(406).send("That code already expired. Try generate another one in /forgotpassword route.")}
        next()
    } catch (error) {
        return res.status(400).send(error.message)
    }    
})

exports.updatePassword = ( async ( req, res ) => {
    try {
        const { email, new_password } = req.body
        const payload = await user.findOne({ email })
        if (await bcrypt.compare(new_password, payload.password)) { return res.status(401).send({ error: 'The same password is not allowed.' }) }
        const password = await bcrypt.hash(new_password, 10)
        const edited_user = await user.update({ email }, {$set: { password } })
        await updates.remove({ email })
        return res.status(200).send(edited_user)
    } catch (error) {
        return res.status(400).send(error.message)
    }
})

