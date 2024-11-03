const anchor = require('@project-serum/anchor');
const { Connection, PublicKey, clusterApiUrl, Keypair, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const fs = require('fs');
const path = require('path');

let idlPath;
try {
    idlPath = path.join(__dirname, 'idl.json');
    console.log('IDL Path Loaded', idlPath)
} catch (error) {
    console.error('Failed to load IDL Path', error)
}

// idl
const idl = JSON.parse(fs.readFileSync(idlPath, 'utf8'));

// programId
const programID = new PublicKey('3oWPRMbutojB8VSp5ApfVyNqiZg69Eti51aJ8uJ7Xw6q');

const network = 'devnet'; // cluster
const connection = new Connection(clusterApiUrl(network), 'confirmed');

// Load the wallet keypair for the account that will manage candidate creation
const walletKeypairPath = path.join(__dirname, 'main-wallet.json');
let mainWallet;

// check if keypair exists for main wallet
if (fs.existsSync(walletKeypairPath)) {
    console.log('Keypair exits...')
    const secretKey = Uint8Array.from(JSON.parse(fs.readFileSync(walletKeypairPath, 'utf-8')));
    mainWallet = Keypair.fromSecretKey(secretKey);
}
// create wallet and load balance
else {
    console.log('Creating wallet...')
    mainWallet = Keypair.generate();
    const secretKey = Array.from(mainWallet.secretKey)

    fs.writeFileSync(walletKeypairPath, JSON.stringify(secretKey), 'utf-8');
    const walletBalance = connection.getBalance(mainWallet.publicKey);
    console.log('Current Main Wallet Balance: ', walletBalance);
    if (walletBalance < 2) {
        for (let i = 0; i < 2; i++) {
            connection.requestAirdrop(mainWallet.publicKey, 2 * LAMPORTS_PER_SOL)
                .then(signature => {
                    console.log('Airdrop signature: ', signature);
                })
                .then(result => {
                    console.log('Airdrop Successful: ', result);
                })
                .catch(error => {
                    console.error('Airdrop failed: ', error)
                })
        }
    }
}

// Set up the provider using the wallet and connection
const provider = new anchor.AnchorProvider(connection, new anchor.Wallet(mainWallet), {
    preflightCommitment: 'processed',
});

// Initialize the program using the IDL and program ID
const program = new anchor.Program(idl, programID, provider);

module.exports = {
    connection,
    provider,
    program,
};


