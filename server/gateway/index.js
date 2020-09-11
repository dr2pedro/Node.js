const app = require('./app')

const port = process.env.GATEWAY_PORT || 5000

app.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`Gateway endpoints listening on: http://localhost:${port}`)
  /* eslint-enable no-console */
})
