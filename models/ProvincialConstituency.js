const mongoose = require('mongoose');

const ProvincialConstituencySchema = new mongoose.Schema({
    province: {
        type: String
    },
    constituencies: [
        {
            constituency: String,
            area: String
        }
    ]
})

module.exports = mongoose.model('ProvincialConstituency', ProvincialConstituencySchema);