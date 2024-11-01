const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const VoteAccount = require('../models/VoteAccount');
const constants = require('../config/constants');
const { fileUpload } = require('../utils/cloudinary');
const { program, provider } = require('../config/anchor-client');
const { Keypair } = require('@solana/web3.js');
const anchor = require('@project-serum/anchor');
const Candidate = require('../models/Candidate');

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
    console.log('/update-user-profile accessed');
    console.log(req.body);

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
            if (req.body.dateOfBirth) user.dateOfBirth = req.body.dateOfBirth;
            if (req.body.phone) user.phone = req.body.phone;
            if (req.body.constituency) user.constituency = req.body.constituency;
            if (req.body.province) user.province = req.body.province;
            if (req.body.provincialConstituency) user.provincialConstituency = req.body.provincialConstituency;

            // Handle file uploads if present
            if (req.files?.cnicFront && req.files.cnicFront[0]) {
                const cnicFront = await fileUpload(req.files.cnicFront[0].path, 'image');
                user.cnicFront = cnicFront;
            }

            if (req.files?.cnicBack && req.files.cnicBack[0]) {
                const cnicBack = await fileUpload(req.files.cnicBack[0].path, 'image');
                user.cnicBack = cnicBack;
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

    try {
        if (id) {
            const user = await User.findById(id);
            const candidate = await Candidate.findById(candidateId)

            if (user && candidate) {
                const voteAccountKeypair = Keypair.generate();
                const tx = await program.rpc.vote(id, candidate.id, {
                    accounts: {
                        voteData: voteAccount.publicKey,
                        candidate: candidate.id,
                        voting_session: votingSessionPublicKey
                    },
                    signers: [provider.wallet.payer, voterAccountKeypair]
                })

                const voteAccount = await VoteAccount.create({ candidatePublicKey: candidatePublicKey, voterId: id, voteAccountPublicKey: voteAccountKeypair.publicKey })
                user.voteAccountPublicKey = voteAccountKeypair.publicKey;

                console.log(`Vote casted by ${id} to ${candidateId}`);
                res.status(200).json({ message: 'Vote casted.', tx })
            }

        }

    } catch (error) {
        console.log('Error in vote casting', error);
        res.status(500).json({ message: "Internal Server Error: Vote Casting Failed." }, error)
    }
}
module.exports = { updateUserProfile, getUserProfile, userLogout, castAVote };