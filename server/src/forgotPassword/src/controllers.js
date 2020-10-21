const 
    monk = require('monk'),
    crypto = require('crypto'),
    bcrypt = require('bcrypt'),
    user = monk(process.env.MONGO_URI).get('users'),
    updates = monk(process.env.MONGO_URI).get('updates'),
    nodemailer = require('nodemailer'),
    configs = require('../smtp.json'),
    hbs = require('nodemailer-express-handlebars'),
    options = require('../viewEngineOptions.json')

module.exports = {

    findUser: ( async ( req, res, next ) => {
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
    ,
    generateCode: ( async ( req, res, next ) => {    
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
    ,
    registerCode: ( async ( req, res, next ) => {    
        try {
            const { email } = req.body
            const older_request = await updates.findOne({ email }) 
            if (older_request) { await updates.remove({ email }) }
            await updates.insert(res.payload)
            next()
        } catch (error) {
            return res.status(400).send(error.message)
        }

    })
    ,
    recoveryPasswordEmail: (async ( req, res, next) => {
        try {
            const { email } = req.body
            const mail = {
                from: '"Pedro dos Santos: CTO-CodePlayData" <pedoidin@teste.com>', //put your credentials
                to: email,
                subject: "Code for Recovery Password", 
                template: 'main',
                context: res.payload.pending_code
              }
            res.mail = mail
            next()
        } catch (error) {
            return res.status(400).send(error.message)
        }
    })
    ,
    sendMail: (async ( req, res) => {
        try {
            nodemailer
                .createTransport(configs)
                .use("compile", hbs(options))
                .sendMail(res.mail)
            return res.status(201).send('Check your email for the code to update your password.')
        } catch (error) {
            return res.status(400).send(error.message)
        }
    })
    ,
    validateCode: ( async ( req, res, next ) => {
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
    ,
    updatePassword: ( async ( req, res ) => {
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

    }
