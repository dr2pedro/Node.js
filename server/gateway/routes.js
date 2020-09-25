const express = require('express')

const router = express.Router()
const signInPort = process.env.PORT_SIGNIN
const signUpPort = process.env.PORT_SIGNUP

router.get('/', (req, res) => {
    res.send('The gateway app is healthy...')
})

router.post('/signin', async (req, res, next) =>{
    try {
        res.redirect(307, "signin:2221/signin")
    } catch (error) {
        next(error)  
    }
    return null
})

router.post('/signup', async (req, res, next) =>{
    try {
        res.redirect(307, "signup:2222/signup")  
    } catch (error) {
        next(error)
    }
    return null
})

module.exports = router