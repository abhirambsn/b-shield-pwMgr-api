const userModel = require('../models/User')
const passwordModel = require('../models/Passwords')

const crypto = require('crypto')

const aesEncrypt = async (password, key, iv) => {
    let cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
    let encrypted = cipher.update(password, 'utf-8', 'base64')
    encrypted += cipher.final('base64')
    return encrypted
}

const aesDecrypt = async (cipher, key, iv) => {
    try {
        let decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
        let decrypted = decipher.update(cipher, 'base64', 'utf-8')
        decrypted += decipher.final('utf-8')
        return decrypted
    } catch (error) {
        return cipher
    }
}

const addPassword = async (req, res) => {
    const password = req.body.password
    const encrypted = await aesEncrypt(password, req.key, req.iv)
    const data = {
        label: req.body.label,
        url: req.body.url,
        password: encrypted,
        user: req.user
    }

    const passwordRec = new passwordModel(data)
    try {
        const passwords = await passwordRec.save()
        return res.status(201).send({ status: "Password Saved", data: passwords })
    } catch (error) {
        console.error(error);
        return res.status(400).send({ error: error })
    }
}

const viewPasswordData = async (req, res) => {
    const passwordID = req.params.password_id

    const password = await passwordModel.findOne({ _id: passwordID }).exec()
    if (!password) return res.status(404).send({ error: "Password Not Found" })

    const pwd = await aesDecrypt(password.password, req.key, req.iv)

    const data = {
        _id: password._id,
        label: password.label,
        url: password.url,
        password: pwd
    }

    return res.status(200).send(data)
}

const allPasswords = async (req, res) => {
    const passwords = await passwordModel.find({ user: req.user }).exec()
    if (!passwords) return res.status(404).send({ error: "No passwords for this user" })

    return res.status(200).send(passwords)
}

const modifyPassword = async (req, res) => {
    const newPassword = req.body.password
    const passwordID = req.params.password_id

    const password = await passwordModel.findOne({ _id: passwordID, user: req.user }).exec()
    if (!password) return res.status(404).send({ error: "Password Not Found" })

    try {
        password.password = await aesEncrypt(newPassword, req.key, req.iv)
        const updatedPassword = await password.save({ isNew: false })
        return res.status(204).send(updatedPassword)
    } catch (error) {
        console.error(error);
        return res.status(400).send({ error: error })
    }
}

const deletePassword = async (req, res) => {
    const passwordID = req.params.password_id
    const password = await passwordModel.findOneAndDelete({ _id: passwordID }).exec()
    if (!password) return res.status(404).send({ error: "Password Not Found" })

    return res.status(204).send({ status: "Deleted", password: password })
}

module.exports = {
    addPassword: addPassword,
    viewPasswordData: viewPasswordData,
    allPasswords: allPasswords,
    modifyPassword: modifyPassword,
    deletePassword: deletePassword
}