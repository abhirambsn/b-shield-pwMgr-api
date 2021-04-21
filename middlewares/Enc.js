const jwt = require('jsonwebtoken')
const userModel = require('../models/User')

const base85 = require('base85')
const base64 = require('base-64')
const utf8 = require('utf8')

const getEncDetails = async (req, res, next) => {
    const authToken = req.header('auth-token')
    if (!authToken) return res.status(401).send({error: "Unauthorized, Please login"})

    try {
        const verify = jwt.verify(authToken, process.env.JWT_SECRET)
        const user = await userModel.findOne({_id: verify}).exec()
        if(!user) return res.status(404).send({error: "Unauthorized"})
        const hash = user.masterPassword
        req.user = verify
        req.key = Buffer.from(base64.encode(utf8.encode(hash))).toString('hex').slice(0, 32)
        req.iv =  Buffer.from(base85.encode(hash), 'utf-8').toString('hex').slice(0, 16)
        next()
    } catch (error) {
        console.log(error);
        res.status(400).send({error: "Invalid Token"})
    }
}

module.exports = getEncDetails