const request = require('supertest')
const bodyParser = require('body-parser')
const app = require('../app')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const user = { email: 'eu@meuemail.com', password: 'meupassword' }

// signup método, tem que estar com o database limpo.
describe('app', () => {
  it('Test signup method', (done) => {
    request(app)
      .post('/signup')
      .send(user)
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        console.log(res.body)
        return done()
      })
  })
})

// erro de signup, usuário já existe.
describe('app', () => {
  it('Test signup error user already exist', (done) => {
    request(app)
      .post('/signup')
      .send(user)
      .expect(400)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        console.log(res.body)
        return done()
      })
  })
})
