const { connection, program, provider } = require('../config/anchor-client');
const anchor = require('@project-serum/anchor');
const fs = require('fs')
const path = require('path');
const ElectionSession = require('../models/ElectionSession');
const { Keypair } = require('@solana/web3.js');
const schedule = require('node-schedule');
const Candidate = require('../models/Candidate');
const { pushCandidateToBlockchain } = require('../utils/blockChainHelper');
const User = require('../models/User');


exports.recentElectionSession = async (req, res) => {
    console.log('/recentElectionSession invoked.')
    try {
        const electionSession = await ElectionSession.findOne().sort({ _id: -1 });

        if (electionSession) {
            res.status(200).json({ message: 'Recent Election Session fetched.', electionSession });
        } else {
            res.status(404).json({ message: 'No election session found.' });
        }
    } catch (error) {
        console.error('Error fetching recent election session:', error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};

exports.allElectionSessions = async (req, res) => {
    console.log('/allElectionSessions invoked.');

    try {
        const allElectionSessions = await ElectionSession.find({}, {}).sort({ createdAt: -1 });

        if (allElectionSessions.length > 0) {
            return res.status(200).json({ message: "Election Sessions fetched.", allElectionSessions });
        }
        console.log('No election sessions found.');
        return res.status(401).json({ message: "No election sessions found." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error.', error })
    }
}

exports.scheduleElectionSession = async (req, res) => {
    const { sessionName, dateTime } = req.body;
    console.log(req.body);

    if (sessionName && dateTime) {
        try {
            const electionSessionKeypair = await Keypair.generate();
            const electionSession = await ElectionSession.create({
                name: sessionName,
                status: 'scheduled',
                electionSessionPublicKey: electionSessionKeypair.publicKey.toString(),
                scheduledTime: dateTime,
            });
            console.log(electionSession);

            // schedule time
            const scheduleDate = new Date(dateTime);

            const allUsers = await User.find({});

            for (const user of allUsers) {
                user.paVote = true;
                user.naVote = true;

                await user.save()
            }

            // create a new election session object for all candidates
            const allCandidates = await Candidate.find({ status: 'approved' });
            for (const candidate of allCandidates) {
                candidate.votes.unshift({ electionSessionId: electionSession._id, voters: [] });
                await candidate.save();
            }


            // scheduling the transaction
            schedule.scheduleJob(electionSession._id.toString(), scheduleDate, async () => {
                try {
                    // transaction
                    const tx = await program.rpc.initializeVotingSession(electionSession.name, {
                        accounts: {
                            votingSession: electionSession.electionSessionPublicKey,
                            signer: provider.wallet.publicKey,
                            systemProgram: anchor.web3.SystemProgram.programId
                        },
                        signers: [provider.wallet.payer, electionSessionKeypair],
                    });

                    // updating election session status
                    electionSession.status = 'active';
                    await electionSession.save();


                    // push all verified candidates to blockchain
                    const allCandidates = await Candidate.find({ status: 'approved' });
                    allCandidates.map((candidate) => {
                        pushCandidateToBlockchain(candidate)
                    })

                    console.log(`Election Session Initialization transaction successful`, tx);
                } catch (error) {
                    console.error(`Error performing transaction of election session initialization: ${error.message}`);
                }
            });

            res.status(200).json({ message: 'Election session scheduled successfully', electionSession });
        } catch (error) {
            console.error('Error scheduling election session:', error);
            res.status(500).json({ message: 'Internal Server Error', error });
        }
    } else {
        console.error('Session Name and Scheduled Time are required!');
        res.status(400).json({ message: 'Session Name and Scheduled Time are required.' });
    }
};

exports.performElectionSessionInit = async (req, res) => {
    console.log('/performElectionSessionInit invoked')
    const { electionSessionId } = req.body;
    if (electionSessionId) {
        try {
            const electionSession = await ElectionSession.findById(electionSessionId);
            if (electionSession) {
                try {
                    // 1. Attempt to fetch existing session from blockchain
                    const accountData = await program.account.votingSession.fetch(electionSession.electionSessionPublicKey);

                    // 2. If successful, return the existing session
                    electionSession.name = accountData.name;
                    electionSession.status = accountData.status;

                    await electionSession.save();

                    console.log('Election Session exists on the blockchain, synchronized.')

                    return res.status(200).json({
                        message: 'Election Session Synchronized.'
                    });
                } catch (fetchError) {
                    console.warn("Session not found on blockchain, initializing...");

                    // 3. Initialize the session if fetch fails
                    try {
                        const electionSessionKeypair = Keypair.generate();

                        const tx = await program.rpc.initializeVotingSession(
                            electionSession.name,
                            {
                                accounts: {
                                    votingSession: electionSessionKeypair.publicKey,
                                    signer: provider.wallet.publicKey,
                                    systemProgram: anchor.web3.SystemProgram.programId,
                                },
                                signers: [provider.wallet.payer, electionSessionKeypair],
                            }
                        );

                        // 4. Update MongoDB with new public key
                        electionSession.electionSessionPublicKey = electionSessionKeypair.publicKey.toString();
                        await electionSession.save();

                        return res.status(201).json({
                            message: "Election session initialized successfully",
                            transaction: tx,
                            publicKey: electionSessionKeypair.publicKey.toString(),
                        });
                    } catch (txError) {
                        console.error("Failed to initialize session:", txError.message);
                        res.status(500).json({ message: "Transaction failed", error: txError });
                    }
                }
            } else {
                return res.status(404).json({ message: "Election session not found in database" });
            }
        } catch (dbError) {
            console.error("MongoDB Error:", dbError.message);
            return res.status(500).json({ message: "Internal Server Error", error: dbError });
        }
    } else {
        return res.status(400).json({ message: "Election Session ID is required" });
    }
};



exports.configureElectionSession = async (req, res) => {
    console.log('/configure-election-session accessed', req.body);
    const { status, electionSessionPublicKey } = req.body;

    try {
        if (status && electionSessionPublicKey) {
            const electionSession = await ElectionSession.findOne({ electionSessionPublicKey });

            if (electionSession) {
                console.log('Election session found: ', electionSession);

                try {
                    const tx = await program.rpc.configureVotingSession(status, {
                        accounts: {
                            votingSession: electionSessionPublicKey
                        },
                        signers: [provider.wallet.payer]
                    });

                    electionSession.status = status;
                    await electionSession.save();

                    console.log('Configure Election Session Transaction Successful: ', tx);
                    return res.status(200).json({ message: "Election session configured: ", status, tx });
                } catch (error) {
                    console.error('Transaction Failed');
                    return res.status(500).json({ message: 'Configuration Election Transaction failed.' })
                }
            } else {
                console.error('Election session not found');
                return res.status(404).json({ message: 'Election session not found' });
            }
        } else {
            console.error('Invalid arguments from client; status and electionSessionPublicKey are required to configure an election session.');
            return res.status(400).json({ message: 'Invalid arguments from client; active, end, and electionSessionPublicKey are required.' });
        }
    } catch (error) {
        console.error('Error configuring election session: ', error);
        res.status(500).json({ message: 'Failed to configure election session.', error });
    }
};
