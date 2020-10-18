const joi = require('joi')

module.exports = {
    user_schema: 
        joi.object({
            email: joi.string().trim().email().required(),
            password: joi.string().trim().required()
        })
    }


