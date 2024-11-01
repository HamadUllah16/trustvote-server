const { connection, program, provider } = require('../config/anchor-client');
const anchor = require('@project-serum/anchor');
const fs = require('fs')
const path = require('path');
const ElectionSession = require('../models/ElectionSession');
const { Keypair } = require('@solana/web3.js');
const schedule = require('node-schedule');


exports.recentElectionSession = async (req, res) => {
    console.log('/recentElectionSession invoked.')
    try {
        // Find the most recent session by sorting in descending order of `_id`
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

            // Schedule the transaction to commence at the specified time
            const scheduleDate = new Date(dateTime);

            // Use the job ID as a unique identifier
            schedule.scheduleJob(electionSession._id.toString(), scheduleDate, async () => {
                try {
                    // Commence the transaction
                    const tx = await program.rpc.initializeVotingSession(electionSession.name, {
                        accounts: {
                            votingSession: electionSession.electionSessionPublicKey,
                            signer: provider.wallet.publicKey,
                            systemProgram: anchor.web3.SystemProgram.programId
                        },
                        signers: [provider.wallet.payer, electionSessionKeypair],
                    });

                    // Update election session status
                    electionSession.status = 'active';
                    await electionSession.save();

                    console.log(`Election Session Initialization transaction successful`, tx);
                } catch (error) {
                    console.error(`Error performing transaction of election session initialization: ${error.message}`);
                }
            });

            // Send response indicating that the session was scheduled successfully
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


exports.initializeElectionSession = async (req, res) => {
    const { name } = req.body
    try {
        const votingSessionKeypair = Keypair.generate();
        const tx = await program.rpc.initializeVotingSession(name, {
            accounts: {
                votingSession: votingSessionKeypair.publicKey,
                signer: provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId
            },
            signers: [provider.wallet.payer, votingSessionKeypair],
        });

        fs.writeFileSync(path.join(__dirname, name),) //continue

        const electionSession = await ElectionSession.create({ name, active: false, electionSessionPublicKey: votingSessionKeypair.publicKey }).then((doc) => console.log(doc)).catch(e => console.error(e));

        res.status(200).json({
            message: `Voting session initialized successfully`,
            transactionSignature: tx,
            electionSession
        });
    } catch (error) {
        console.error("Error managing voting session:", error);
        res.status(500).json({ message: 'Failed to manage voting session', error });
    }
}

exports.configureElectionSession = async (req, res) => {
    console.log('/configure-election-session accessed', req.body);
    const { status, electionSessionPublicKey } = req.body;

    try {
        // Check that active and end are booleans and electionSessionPublicKey is defined
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
