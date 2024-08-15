const mongoose = require('mongoose');

const UserDataSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    CNIC: {
        type: String,
        required: true
    },
    verified: Boolean,
})

module.exports = mongoose.model('UserData', UserDataSchema);