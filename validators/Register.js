const Joi = require('joi')

const schema = Joi.object().keys({
    name: Joi.string().min(12).required(),
    username: Joi.string().min(20).required(),
    masterPassword: Joi.string().min(12).required()
})

module.exports = schema
