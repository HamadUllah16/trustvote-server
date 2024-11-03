const mongoose = require('mongoose')

const electionSessionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    electionSessionPublicKey: {
        type: String,
        required: true,
    },
    scheduledTime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('ElectionSession', electionSessionSchema)