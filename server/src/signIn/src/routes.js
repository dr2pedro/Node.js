const express = require('express')
const monk = require('monk')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const db = monk(process.env.MONGO_URI)
const user = db.get('users')

const router = express.Router()
const {secret} = require('../auth.json')

router.get('/', function (req, res) {
  console.log(router.mountpath) // /admin
  res.send('Welcome')
})

router.post('/signin', async (req, res, next) => {
  try {
    const { email, password } = req.body
    const payload = await user.findOne({ email })
    if (!payload) { return res.status(404).json({ error: 'User not found' }) }
    if (!await bcrypt.compare(password, payload.password)) { return res.status(400).send({ error: 'Invalid password' }) }
    payload.password = undefined
    const token = jwt.sign({ _id: payload._id, username: payload.username, email: payload.email }, secret, { expiresIn: 14400 })
    res.json({ payload, token })
  } catch (error) {
    next(error)
  }
  return null
})

module.exports = router
