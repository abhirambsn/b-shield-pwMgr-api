const express = require('express')
const { login, register, getProfile, changePassword } = require('../controllers/Authentication')
const verifyJWT = require('../middlewares/Auth')

const router = express.Router()

router.post("/login", login)
router.post("/register", register)
router.get("/profile", verifyJWT, getProfile)
router.put("/changePassword", verifyJWT, changePassword)

module.exports = router