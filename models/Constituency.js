const mongoose = require('mongoose');

const ConstituencySchema = new mongoose.Schema({
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

module.exports = mongoose.model('Constituency', ConstituencySchema)