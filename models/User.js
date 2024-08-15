const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
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

// Pre-save middleware to check profile completion
UserSchema.pre('save', function (next) {
    const user = this;

    // Check if all required fields for profile completion are present
    if (
        user.firstName &&
        user.lastName &&
        user.email &&
        // user.password &&
        user.phone &&
        user.cnic &&
        user.dateOfBirth &&
        user.cnicFront &&
        user.cnicBack
    ) {
        user.profileCompletion = true;
    } else {
        user.profileCompletion = false;
    }

    next();
});

module.exports = mongoose.model('User', UserSchema);