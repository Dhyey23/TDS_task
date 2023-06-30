const mongoose = require('mongoose')

const withdrawSchema = new mongoose.Schema({
    iUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    nAmount: {
        type: Number,
        required: [true, 'Please enter the Amount']
    },
    eStatus: {
        type: String,
        default:'S'
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

const withdraw = mongoose.model('withdraw', withdrawSchema)
module.exports = withdraw