const mongoose = require('mongoose')
const userSchema = mongoose.Schema({

    sUsername: {
        type: String,
        required: [true, 'Please add a username'],
        unique: true
    },

    sPassword: {
        type: String,
        required: [true, 'Please add a password'],
    },
    dCreatedAt: {
        type: Date,
        default:Date.now
    },
    dUpdatedAt: {
        type: Date,
        default:Date.now
    }


})
const Users = mongoose.model('User', userSchema)
module.exports = Users