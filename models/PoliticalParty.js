const mongoose = require('mongoose');

const PoliticalPartySchema = mongoose.Schema({
    name: {
        type: String
    },
    abbreviation: {
        type: String
    },
    symbol: {
        type: String
    }
})

module.exports = mongoose.model('PoliticalParty', PoliticalPartySchema);