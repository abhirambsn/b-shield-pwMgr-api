const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userModel = require('../models/User')
const newUserValidator = require('../validators/Register')
const loginUserValidator = require('../validators/Login')
// const changePasswordValidator = require('../validators/UpdatePassword')


const register = async (req, res) => {

    // Validating Data

    const { error } = newUserValidator.validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Checking if the New user exists
    const check = await userModel.findOne({ username: req.body.username }).exec()
    if (check) return res.status(400).send("Username Exists")

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hasher = await bcrypt.hash(req.body.masterPassword, salt)

    const User = new userModel({
        name: req.body.name,
        username: req.body.username,
        masterPassword: hasher
    })

    try {
        const saveUser = await User.save()
        res.send(saveUser)
    } catch (err) {
        res.status(400).send(err)
    }
}

const login = async (req, res) => {
    // Validating Data
    const { error } = loginUserValidator.validate(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    // Check if username is invalid
    const user = await userModel.findOne({ username: req.body.username }).exec()
    if (!user) return res.status(400).send("username Does not Exist")

    // Check password

    const passwd = await bcrypt.compare(req.body.masterPassword, user.masterPassword)
    if (!passwd) return res.status(400).send("Invalid Password")

    const authToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
    res.header('auth-token', authToken).send({status: "Login Successful", token: authToken})

}

const getProfile = async (req, res) => {
    const user = await userModel.findOne({ _id: req.user }, { masterPassword: 0 }).exec()
    if (!user) return res.status(404).send({ error: "User not found" })
    res.status(200).send(user.toJSON())
}

const changePassword = async (req, res) => {
    const user = await userModel.findOne({ _id: req.user._id }).exec()
    if (!user) return res.status(404).send({ error: "User not found" })

    const currentPassword = req.body.currentPassword
    const compare = await bcrypt.compare(currentPassword, user.masterPassword)
    if (!compare) return res.status(401).send({ error: "Current Password does not match" })

    try {
        const newPass1 = req.body.password1
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(newPass1, salt)
        await userModel.findOneAndUpdate({ _id: req.user }, { masterPassword: hash }).exec()
        res.status(200).send({ message: "Password Changed" })
    } catch (error) {
        console.log(error);
        res.status(400).send({ error: error })
    }

}

module.exports = {
    login: login,
    register: register,
    getProfile: getProfile,
    changePassword: changePassword
}