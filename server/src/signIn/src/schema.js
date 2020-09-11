const joi = require('@hapi/joi')

const manifest_schema = joi.object({
  email: joi.string().trim().email().required(),
  password: joi.string().trim().required()
})

module.exports = manifest_schema
