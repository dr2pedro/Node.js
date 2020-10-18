const joi = require('@hapi/joi')

exports.manifest_schema = joi.object({
  email: joi.string().trim().email().required(),
  password: joi.string().trim().required()
})