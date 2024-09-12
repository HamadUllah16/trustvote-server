const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const constants = require('../config/constants');

async function userLogout(req, res, next) {
    const token = req.headers[constants.tokenHeaderKey];
    try {
        res.status(200).json({ message: 'Logout successful' });
    } catch (err) {
        res.status(500).json({
            message: 'Error logging out'
        });
    }
}

const updateUserProfile = async (req, res) => {
    const { firstName, lastName, email, cnic, dateOfBirth, phone, cnicFront, cnicBack } = req.body;
    const { id } = req.user;

    try {
        if (id) {
            const user = await User.findById(id);
            if (!user) {
                return res.status(401).json({ msgCode: '1001' })
            }
            user.firstName = firstName;
            user.lastName = lastName;
            user.cnic = cnic;
            user.dateOfBirth = dateOfBirth;
            user.phone = phone;
            user.cnicFront = cnicFront;
            user.cnicBack = cnicBack;

            await user.save();

            return res.status(200).json({ message: 'User updated successfully', user })

        }

        return res.status(400).json({ message: 'invalid user id' });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ msgCode: '1003', message: 'An error occurred while updating the profile' });

    }

}

const getUserProfile = async (req, res) => {
    console.log('/getUserProfile')
    const { id } = req.user

    try {
        if (id) {
            const user = await User.findById(id, { password: 0 })
            if (!user) {
                res.status(401);
                return next({ msgCode: '1001' });
            }

            res.status(200).json({
                success: 1,
                message: 'User profile fetched successfully.',
                data: user
            });

        }
        return res.status(401).json({ error: 'user not found' })
    } catch (error) {
        res.status(500);
    }
}

module.exports = { updateUserProfile, getUserProfile, userLogout };