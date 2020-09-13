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
    const load = await schema.validateAsync(req.body)
    const { email } = req.body
    if (await user.findOne({ email })) { return res.status(400).json({ error: 'User already exists' }) }
    const hash = await bcrypt.hash(load.password, 10)
    load.password = hash
    const payload = await user.insert(load)
    const token = jwt.sign({ _id: payload._id, username: payload.username, email: payload.email }, authConfig.secret, { expiresIn: 14400 })
    payload.password = undefined
    res.json({ payload, token })
  } catch (error) {
    next(error)
  }
  return null
})

module.exports = router
