const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
    role: {
        type: String,
        required: false
    },
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
    cnicNumber: {
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
    gender: {
        type: String,
        required: false
    },
    constituencyType: {
        type: String,
        required: false
    },
    constituency: {
        type: String,
        required: false
    },
    partyAffiliation: {
        type: String,
        required: false
    },
    manifesto: {
        type: String,
        required: false
    },
    educationalCertificates: {
        type: String,
        required: false
    },
    assetDeclaration: {
        type: String,
        required: false
    },
    codeOfConduct: {
        type: Boolean,
        required: false
    },

    profileCompletion: {
        type: Boolean,
        required: false
    }
})

CandidateSchema.pre('save', function (next) {
    const candidate = this;

    // Check if all required fields for profile completion are present
    if (
        candidate.role &&
        candidate.firstName &&
        candidate.lastName &&
        candidate.email &&
        candidate.phone &&
        candidate.password &&
        candidate.cnicNumber &&
        candidate.dateOfBirth &&
        candidate.gender &&
        candidate.constituencyType &&
        candidate.constituency &&
        candidate.partyAffiliation &&
        candidate.manifesto &&
        candidate.cnicFront &&
        candidate.cnicBack &&
        candidate.educationalCertificates &&
        candidate.assetDeclaration &&
        candidate.codeOfConduct
    ) {
        candidate.profileCompletion = true;
    } else {
        candidate.profileCompletion = false;
    }

    next();
});

module.exports = mongoose.model('Candidate', CandidateSchema)