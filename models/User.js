const mongoose = require('mongoose')
const uuid = require('uuid')

const userSchema = mongoose.Schema({
    _id: {
        type: String,
        required: true,
        default: function getID() { return uuid.v4() }
    },
    username: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    masterPassword: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("User", userSchema)