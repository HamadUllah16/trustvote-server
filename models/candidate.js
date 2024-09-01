// models/candidate.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Candidate Schema
const candidateSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false, // Not required at initial registration
    },
    lastName: {
        type: String,
        required: false, // Not required at initial registration
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/.+@.+\..+/, "Please enter a valid email address"]
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
        unique: true,
        default: null 
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
    manifesto: {
        type: String,
        required: false
    },
    partyAffiliation: {
        type: String,
        required: false
    },
    voteCount: {
        type: Number,
        default: 0
    },
    approved: {
        type: Boolean,
        default: false
    },
    profileCompletion: {
        type: Boolean,
        default: false
    },
    publicKey: {
        type: String,
        required: false,
        unique: false
    }
},{
  timestamps: true
});

// Pre-save middleware to hash the password before saving
candidateSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


module.exports = mongoose.model('Candidate', candidateSchema);
