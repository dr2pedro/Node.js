const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const user = db.get('users')

const router = express.Router()
const {secret} = require('../auth.json')

router.get('/', function (req, res) {
  res.send('Welcome')
})


module.exports = router
