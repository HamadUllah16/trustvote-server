const mongoose = require('mongoose');
const voteCastSchema = new mongoose.Schema({
    voterId: {
        type: String,
        require: true
    },
    candidatePublicKey: {
        type: String,
        required: true
    },
    candidateId: {
        type: String,
        required: true
    },
    voteAccountPublicKey: {
        type: String,
        required: true
    },
    votingSessionPublicKey: {
        type: String,
        required: true
    },
    tx: {
        type: String,
        default: '',
        required: true
    }
})

module.exports = mongoose.model('VoteAccount', voteCastSchema)