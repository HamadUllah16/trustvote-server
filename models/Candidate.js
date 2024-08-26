const { default: mongoose } = require("mongoose");

const CandidateSchema = new mongoose.Schema({
    firstName: {
        type: String,
        unique: false,
        required: false,
    },
    lastName: {
        type: String,
        unique: false,
        required: false,
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false,
    },
    cnic: {
        type: String,
        required: false,
    },
    dateOfBirth: {
        type: String,
        required: false
    },
    cnicFront: {
        type: String,
        required: false
    },
    cnicBack: {
        type: String,
        required: false
    },
    profileCompletion: {
        type: Boolean,
        required: false
    }
})