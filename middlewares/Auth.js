const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const authToken = req.header('auth-token')
    if (!authToken) return res.status(401).send("Unauthorized, Please login")

    try {
        const verify = jwt.verify(authToken, process.env.JWT_SECRET)
        req.user = verify
        next()
    } catch (error) {
        console.log(error);
        res.status(400).send("Invalid Token")
    }
}

module.exports = verifyJWT