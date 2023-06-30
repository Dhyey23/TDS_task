const mongoose = require('mongoose')

const tdsSchema = new mongoose.Schema({
    iUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    nAmount: {
        type: Number,
        default:0
        //required: [true, 'Please enter the Amount']
    },
    nOriginalAmount: {
        type: Number,
        default:0
        //required: [true, 'Please enter the Amount']
    },
    nPercentage: {
        type: Number,
        default: 30
        //required: [true, 'Please enter the percentage']
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

const tds = mongoose.model('tds', tdsSchema)
module.exports = tds