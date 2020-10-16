const app = require('./app')

const port = process.env.PORT_FORGOTPASSWORD || 5023

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`ForgotPassword endpoints listening on: http://localhost:${port}`)
  /* eslint-enable no-console */
})
