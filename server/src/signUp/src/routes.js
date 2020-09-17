const express = require('express')
const monk = require('monk')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const db = monk(process.env.MONGO_URI)
const user = db.get('users')
const schema = require('./schema.js')

const router = express.Router()
const authConfig = require('../auth.json')

router.post('/signup', async (req, res, next) => {
  try {
    // início do controller_1: validateRequest.js
    const load = await schema.validateAsync(req.body)
    const { email } = req.body
    // final do controller_1.
    // início do controller_2: findUser.js (só que invertido!)
    if (await user.findOne({ email })) { return res.status(400).json({ error: 'User already exists' }) }
    //final do controller_2.
    // início do controller_3: hidePassword.js
    const hash = await bcrypt.hash(load.password, 10)
    load.password = hash
    // final do controller_3.
    // inicío do controller_4: createUser.js
    const payload = await user.insert(load)
    payload.password = undefined
    // final do controller_4.
    // início do controller_5: createToken.js
    const token = jwt.sign({ _id: payload._id, username: payload.username, email: payload.email }, authConfig.secret, { expiresIn: 14400 })
    //final do controller_5.
    res.json({ payload, token })
  } catch (error) {
    next(error)
  }
  return null
})

module.exports = router
