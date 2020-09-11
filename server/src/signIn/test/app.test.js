const request = require('supertest')
const bodyParser = require('body-parser')
const app = require('../app')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

let token = {}

// erro de signin, usuário não encontrado.
describe('app', () => {
  it('Test signin error user not found', (done) => {
    request(app)
      .post('/signin')
      .send({ email: 'euerrado@meuemail.com', password: '02222868' })
      .expect(404)
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

var user = { email: 'eu@meuemail.com', password: 'meupassword' }

// signin método.
describe('app', () => {
  it('Test signin method', (done) => {
    request(app)
      .post('/signin')
      .send(user)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err)
        }
        user = res.body
        console.log(user)
        return ({ token }, done())
      })
  })
})
