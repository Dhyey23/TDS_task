const mongoose = require('mongoose')

const passbookSchema = new mongoose.Schema({
    iUsername: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },

    nTotalBalance: {
        type: Number,
        default:0
        //required: [true, 'Please enter the Amount']
    },
    nAmount: {
        type: Number,
        required: [true, 'Please enter the Amount']
    },
    eStatus: {
        type: String,
        default:'S'
    },
    eTransactionType: {
        type: String,
        enum : ['win','withdraw','deposit','tds','start'],
        required: [true, 'Please enter the  Transaction Type']

    },
    nDepositBalanace: {
        type: Number,
        default:0
        //required: [true, 'Please enter the deposit Amount']
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

const passbook = mongoose.model('passbook', passbookSchema)
module.exports = passbook