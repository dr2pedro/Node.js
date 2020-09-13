const express = require('express')

const router = express.Router()
const signInPort = process.env.PORT_SIGNIN
const signUpPort = process.env.PORT_SIGNUP

router.post('/signin', async (req, res, next) =>{
    try {
        res.redirect(307, "http://localhost:" + signInPort + "/signin")
    } catch (error) {
        next(error)  
    }
    return null
})

router.post('/signup', async (req, res, next) =>{
    try {
        res.redirect(307, "http://localhost:" + signUpPort + "/signup")  
    } catch (error) {
        next(error)
    }
    return null
})

module.exports = router