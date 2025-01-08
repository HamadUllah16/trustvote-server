const mongoose = require("mongoose");
const autoIncrement = require('mongoose-sequence')(mongoose)

const CandidateSchema = new mongoose.Schema({
    role: {
        type: String,
        required: false
    },
    profilePicture: {
        type: String,
        required: false,
        default: ''
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
    },
    status: {
        type: String,
        enum: ['verified', 'pending', 'unverified'],
        required: false,
        default: ''
    },
    publicKey: {
        type: String,
        default: '',
    },
    votes: [
        {
            electionSessionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ElectionSession',
            },
            name: { type: String },
            voters: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }
            ]
        }
    ]
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
        candidate.status = candidate.status === 'verified' ? 'verified' : 'pending';
    } else {
        candidate.profileCompletion = false;
        candidate.status = 'unverified'
    }

    next();
});

CandidateSchema.plugin(autoIncrement, { inc_field: 'candidateId' });

module.exports = mongoose.model('Candidate', CandidateSchema)
