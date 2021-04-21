const express = require('express')
const { allPasswords, viewPasswordData, addPassword, modifyPassword, deletePassword } = require('../controllers/PasswordManager')
const verifyJWT = require('../middlewares/Auth')
const getEncDetails = require('../middlewares/Enc')
const router = express.Router()

router.get("/", verifyJWT, getEncDetails, allPasswords)
router.get("/:password_id", verifyJWT, getEncDetails, viewPasswordData)
router.post("/", verifyJWT, getEncDetails, addPassword)
router.delete("/:password_id", verifyJWT, getEncDetails, deletePassword)
router.put("/:password_id", verifyJWT, getEncDetails, modifyPassword)

module.exports = router