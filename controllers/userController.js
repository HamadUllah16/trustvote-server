const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const VoteAccount = require('../models/VoteAccount');
const constants = require('../config/constants');
const { program, provider } = require('../config/anchor-client');
const { Keypair } = require('@solana/web3.js');
const anchor = require('@project-serum/anchor');
const Candidate = require('../models/Candidate');
const ElectionSession = require('../models/ElectionSession');
const { castVote } = require('../utils/blockChainHelper');
const { fileUpload } = require('../utils/cloudinary');

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

const registeredUsersCount = async (req, res) => {
    console.log('registeredUsersCount invoked.')

    try {
        const users = await User.find({ profileCompletion: true });

        if (users) {
            console.log('User count: ', users.length);
            return res.status(200).json({ message: "User count fetched.", userCount: users.length });
        }
        return res.status(401).json({ message: 'No user found.' });
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error at RegisteredUsersCount: ', error });
    }
}

const updateUserProfile = async (req, res) => {
    console.log('/update-user-profile accessed');
    console.log(req.files);

    const { id } = req.user;

    try {
        if (id) {
            const user = await User.findById(id);
            if (!user) {
                return res.status(401).json({ msgCode: '1001' });
            }

            // Check if each field exists in the request body before updating
            if (req.body.firstName) user.firstName = req.body.firstName;
            if (req.body.lastName) user.lastName = req.body.lastName;
            if (req.body.cnic) user.cnic = req.body.cnic;
            if (req.body.date) user.dateOfBirth = req.body.date;
            if (req.body.phone) user.phone = req.body.phone;
            if (req.body.constituency) user.constituency = req.body.constituency;
            if (req.body.province) user.province = req.body.province;
            if (req.body.provincialConstituency) user.provincialConstituency = req.body.provincialConstituency;

            // Handle file uploads if present
            if (req.files?.cnicFront && req.files.cnicFront[0]) {
                const cnicFront = await fileUpload(req.files.cnicFront[0].buffer, 'image');
                user.cnicFront = cnicFront;
            }

            if (req.files?.cnicBack && req.files.cnicBack[0]) {
                const cnicBack = await fileUpload(req.files.cnicBack[0].buffer, 'image');
                user.cnicBack = cnicBack;
            }

            if (req.files?.profilePicture && req.files.profilePicture[0]) {
                const profilePicture = await fileUpload(req.files.profilePicture[0].buffer, 'image');
                user.profilePicture = profilePicture;
            }

            await user.save();

            return res.status(200).json({ message: 'User updated successfully', user });
        }

        return res.status(400).json({ message: 'Invalid user ID' });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ msgCode: '1003', message: 'An error occurred while updating the profile' });
    }
};


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

const castAVote = async (req, res) => {
    const { id } = req.user;
    const { candidateId, votingSessionPublicKey } = req.body;
    console.log(req.body)
    try {
        if (id) {
            const user = await User.findById(id);
            const candidate = await Candidate.findById(candidateId)
            const electionSession = await ElectionSession.findOne({ electionSessionPublicKey: votingSessionPublicKey })

            console.log("Candidate Public Key: ", candidate.publicKey);

            if (user && candidate && electionSession) {
                const voteAccountKeypair = Keypair.generate();
                let tx;
                if (candidate.constituencyType === 'national assembly' && user.naVote) {
                    tx = await castVote(user.userId, voteAccountKeypair, candidate, electionSession.electionSessionPublicKey);
                }
                else if (candidate.constituencyType === 'provincial assembly' && user.paVote) {
                    tx = await castVote(user.userId, candidateId, voteAccountKeypair, candidate, electionSession.electionSessionPublicKey);
                }
                else {
                    console.error('Voter does not have any remaining votes in this constituency type.');
                    return res.status(401).json({ message: "No votes remaining in this constituency." })
                }

                if (tx) {
                    console.log("Transaction: ", tx)

                    const voteAccount = await VoteAccount.create({ tx, candidatePublicKey: candidate.publicKey, voterId: id, voteAccountPublicKey: voteAccountKeypair.publicKey, votingSessionPublicKey, candidateId })

                    candidate.votes[0].voters.push(user._id);
                    if (candidate.constituencyType === 'national assembly') {
                        user.naVote = false;
                    }
                    if (candidate.constituencyType === 'provincial assembly') {
                        user.paVote = false;
                    }
                    await candidate.save();

                    user.voteAccountPublicKey = voteAccountKeypair.publicKey;
                    await user.save();

                    console.log(`Vote casted by ${id} to ${candidateId}`);
                    return res.status(200).json({ message: `Vote casted ${candidate.firstName} representing ${candidate.partyAffiliation}.`, tx, voteAccount })
                }
                return res.status(500).json({ 'Transaction failed: ': tx });
            }
            console.error('parameters missing: User id, candidate id or election session public key')
            return res.status(401).json({ message: 'Authorized User, Candidate or active Election Session Public Key missing.' })

        }

    } catch (error) {
        console.log('Error in vote casting', error);
        res.status(500).json({ message: "Internal Server Error: Vote Casting Failed." }, error)
    }
}
module.exports = { updateUserProfile, getUserProfile, userLogout, castAVote, registeredUsersCount };