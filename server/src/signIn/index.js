const 
  app = require('./app'),
  port = process.env.PORT_SIGNIN || 5021

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`SignIn endpoints listening on: http://localhost:${port}`)
  /* eslint-enable no-console */
})
