const Joi = require('joi')

const schema = Joi.object().keys({
    name: Joi.string().min(6).required(),
    username: Joi.string().min(10).required(),
    masterPassword: Joi.string().min(6).required()
})

module.exports = schema