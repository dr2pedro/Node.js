const 
  app = require('./app'), 
  port = process.env.PORT_SIGNUP || 5022

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`SignUp endpoints listening on: http://localhost:${port}`)
  /* eslint-enable no-console */
})
