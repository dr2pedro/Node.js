const express = require('express')
const monk = require('monk')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const db = monk(process.env.MONGO_URI)
const user = db.get('users')

const router = express.Router()
const {secret} = require('../auth.json')


router.post('/signin', async (req, res, next) => {
  try {
    // início do controller_1: findUser.js
    const { email, password } = req.body
    const payload = await user.findOne({ email })
    if (!payload) { return res.status(404).json({ error: 'User not found' }) }
    // final do controller_1.
    // início do controller_2: checkPassword.js
    if (!await bcrypt.compare(password, payload.password)) { return res.status(400).send({ error: 'Invalid password' }) }
    payload.password = undefined
    // final do controller_2.
    // início do controller_3: createToken.js
    const token = jwt.sign({ _id: payload._id, username: payload.username, email: payload.email }, secret, { expiresIn: 14400 })
    // final do controller_3.
    res.json({ payload, token })
  } catch (error) {
    next(error)
  }
  return null
})

module.exports = router