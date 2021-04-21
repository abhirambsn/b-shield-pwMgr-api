const mongoose = require('mongoose')
const uuid = require('uuid')

const passwordSchema = mongoose.Schema({
    _id : {
        type: String,
        required: true,
        default: function getID() { return uuid.v4() }
    },
    label: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true,
        ref: "User"
    }
})

module.exports = mongoose.model("Password", passwordSchema)