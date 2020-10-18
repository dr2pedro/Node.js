const 
  jwt = require('jsonwebtoken'),
  authConfig = require('../config/auth.json')

module.exports = {

  guard: (req, res, next) {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).send({ error: 'No token provided' })
    const parts = authHeader.split(' ')
    const [scheme, token] = parts
    if (!/^Bearer$/i.test(scheme)) return res.status(401).send({ error: 'This is not the kind of token expected' })
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) return res.status(401).send({ error: 'Token invalid' })
      /*eslint-disable */
      return { _id, username, email } = decoded
      /* eslint-enable */
    })
    return next()
  }

}

