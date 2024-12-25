const { connection, program, provider } = require('../config/anchor-client');
const { Keypair } = require('@solana/web3.js');
const anchor = require('@project-serum/anchor');

async function pushCandidateToBlockchain(candidate) {
    try {
        const candidateKeypair = Keypair.generate();
        const tx = await program.rpc.initializeCandidate(candidate.candidateId, candidate.firstName + ' ' + candidate.lastName, candidate.partyAffiliation, {
            accounts: {
                data: candidateKeypair.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [provider.wallet.payer, candidateKeypair]
        })
        candidate.publicKey = candidateKeypair.publicKey;
        candidate.votes.voters = [];
        await candidate.save();

        console.log('Candidate pushed to blockchain: ', candidate, tx);
    } catch (error) {
        console.error('Error occurred while pushing candidate to blockchain.', error);
    }
}

async function castVote(voterId, voteAccountKeypair, candidate, votingSessionPublicKey) {
    const tx = await program.rpc.castVote(voterId, candidate.candidateId, {
        accounts: {
            voteData: voteAccountKeypair.publicKey,
            candidate: candidate.publicKey,
            voteSession: votingSessionPublicKey,
            user: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId
        },
        signers: [provider.wallet.payer, voteAccountKeypair]
    })
    return tx;
}

module.exports = { castVote, pushCandidateToBlockchain }