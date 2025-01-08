const Candidate = require('../models/Candidate');
const User = require('../models/User')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { fileUpload } = require('../utils/cloudinary');
const { program, provider } = require('../config/anchor-client');
const { Keypair } = require('@solana/web3.js');
const anchor = require('@project-serum/anchor');
const { pushCandidateToBlockchain } = require('../utils/blockChainHelper');
const ElectionSession = require('../models/ElectionSession');

// Login Candidate
exports.loginCandidate = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find candidate by email
        const candidate = await Candidate.findOne({ email });
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found." });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, candidate.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials." });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: candidate._id, email: candidate.email },
            process.env.JWT_SECRET,
            { expiresIn: '5d' }
        );

        res.status(200).json({ token, candidate: { id: candidate._id, email: candidate.email }, role: candidate.role });
    } catch (error) {
        console.error("Error logging in candidate:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.getCandidateProfile = async (req, res) => {
    console.log('/getCandidateProfile')
    const { id } = req.user

    try {
        if (id) {
            const candidate = await Candidate.findById(id, { password: 0, codeOfConduct: 0 })
            if (!candidate) {
                res.status(401);
                return next({ msgCode: '1001' });
            }

            res.status(200).json({
                success: 1,
                message: 'Candidate profile fetched successfully.',
                data: candidate
            });

        }
        return res.status(401).json({ error: 'user not found' })
    } catch (error) {
        res.status(500);
    }

}


exports.completeCandidateProfile = async (req, res) => {
    const { id } = req.user;
    console.log('completeCandidateProfile controller invoked');
    const allowedFields = [
        'firstName', 'lastName', 'phone', 'dateOfBirth', 'gender', 'cnicNumber',
        'constituencyType', 'constituency', 'partyAffiliation', 'codeOfConduct'
    ];

    console.log('Request params:', req.params);
    console.dir('Request body:', req.body);

    try {
        console.log(`Finding candidate with ID: ${id}`);
        let candidate = await Candidate.findById(id);

        if (!candidate) {
            console.log(`Candidate with ID: ${id} not found`);
            return res.status(404).json({ message: "Candidate not found." });
        }

        // Update only the fields sent in the request body
        allowedFields.forEach(field => {
            if (req.body[field]) {
                candidate[field] = req.body[field];
            }
        });

        if (candidate.profileCompletion && candidate.status === 'unverified') {
            candidate.status === 'pending'
        }

        // Upload files if they exist in the request
        if (req.files) {
            if (req.files.cnicFront) {
                candidate.cnicFront = await fileUpload(req.files.cnicFront[0]?.buffer, 'image');
            }
            if (req.files.cnicBack) {
                candidate.cnicBack = await fileUpload(req.files.cnicBack[0]?.buffer, 'image');
            }
            if (req.files.manifesto) {
                candidate.manifesto = await fileUpload(req.files.manifesto[0]?.buffer, 'raw');
            }
            if (req.files.educationalCertificates) {
                candidate.educationalCertificates = await fileUpload(req.files.educationalCertificates[0]?.buffer, 'raw');
            }
            if (req.files.assetDeclaration) {
                candidate.assetDeclaration = await fileUpload(req.files.assetDeclaration[0]?.buffer, 'raw');
            }
            if (req.files.profilePicture) {
                candidate.profilePicture = await fileUpload(req.files.profilePicture[0]?.buffer, 'image');
            }
        }

        console.log('Attempting to save the candidate...');
        await candidate.save();
        console.log(`Candidate with ID: ${id} updated successfully`);

        res.status(200).json({ message: "Profile updated successfully.", candidate });
    } catch (error) {
        console.error("Error updating candidate profile:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.registerCandidate = async (req, res) => {
    console.log('registerCandidate controller invoked');
    console.log('Request body:', req.body);

    try {
        const { email, password } = req.body;
        const electionSession = await ElectionSession.findOne().sort({ _id: -1 });

        if (electionSession && (electionSession.status === 'active' || electionSession.status === 'paused')) {
            console.error('Election session active, no new candidates can be registered at this time.');
            return res.status(401).json({ message: "Election Session is Active, no registeration can be processed at this moment." });
        }

        const existingCandidate = await Candidate.findOne({ email });
        if (existingCandidate) {
            console.log('Candidate with this email already exists:', email);
            return res.status(400).json({ message: "Candidate with this email already exists." });
        }

        // Create a new candidate
        const newCandidate = await Candidate.create({
            role: 'candidate',
            email,
            password: await bcrypt.hash(password, await bcrypt.genSalt(10)),
            firstName: '',
            lastName: '',
            phone: '',
            cnicNumber: null,
            dateOfBirth: '',
            gender: '',
            constituencyType: '',
            constituency: '',
            partyAffiliation: '',
            manifesto: null,
            cnicFront: null,
            cnicBack: null,
            educationalCertificates: null,
            assetDeclaration: null,
            codeOfConduct: false,
            publicKey: '',
            votes: [],
            profileCompletion: false,
            status: 'unverified'
        });

        console.log('New candidate registered:', newCandidate);

        res.status(201).json({ message: "Candidate registered successfully. Please complete your profile.", candidate: newCandidate });
    } catch (error) {
        console.error("Error registering candidate:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};

exports.getAllCandidates = async (req, res) => {
    console.log('/getAllCandidates invoked')
    try {
        const allCandidates = await Candidate.find({}, { password: 0, cnicBack: 0, cnicFront: 0, cnicNumber: 0, assetDeclaration: 0 })

        if (allCandidates.length === 0) {
            return res.status(400).json({ message: "No candidates found." })
        }

        res.status(200).json({ data: { allCandidates, message: 'All candidates fetched.' } })
    } catch (error) {
        console.error('Error getting all candidates ', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}

exports.myCandidates = async (req, res) => {
    console.log('/myCandidates accessed.');

    const { id } = req.user;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        console.log(user.constituency)

        const candidates = await Candidate.find({ constituency: user.constituency, status: 'verified' });
        console.log(candidates);

        return res.status(200).json({ message: 'Relevant candidates fetched.', candidates });

    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.myProvincialCandidates = async (req, res) => {
    console.log('/myProvincialCandidates accessed.');

    const { id } = req.user;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' })
        }

        const candidates = await Candidate.find({ constituency: user.provincialConstituency, status: 'verified' });

        if (candidates) {
            return res.status(200).json({ message: 'Provincial Candidates fetched', candidates })
        }
        return res.status(401).json({ message: 'No candidates found' });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: 'Internal Server Error: \n' + error })
    }
}

exports.candidatesOfConstituency = async (req, res) => {
    const { constituency, electionSessionId } = req.body;
    console.log(req.body)

    try {
        const electionSession = await ElectionSession.findById(electionSessionId);
        if (electionSession) {
            if (constituency) {
                const candidates = await Candidate.find({ constituency, status: 'verified' });

                if (candidates) {
                    console.log('Candidates based off constituency fetched.', candidates);
                    return res.status(200).json({ message: 'Candidates fetched.', candidates })
                }
                console.error('No candidates found.')
                return res.status(401).json({ message: "No candidates found in this constituency." });
            }
        }
        console.error('No election session found.')
        return res.status(401).json({ message: 'No election session found.' })
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Interal Server Error", error })
    }
}

exports.approvedCandidatesForResults = async (req, res) => {
    const { electionSessionId } = req.body;

    try {
        // Fetching candidates with only relevant voting data and including other necessary fields
        const candidates = await Candidate.find(
            {
                votes: { $elemMatch: { electionSessionId } }
            },
            {
                firstName: 1, // Include the fields you need (e.g., name, party, constituency)
                lastName: 1,
                partyAffiliation: 1,
                constituency: 1,
                constituencyType: 1,
                votes: { $elemMatch: { electionSessionId } }
            }
        );

        if (candidates.length > 0) {
            console.log('Candidates found: ', candidates)
            return res.status(200).json({
                message: 'Approved Candidates For Results fetched.',
                candidates,
            });
        }

        console.log('No candidates found: ', candidates)
        return res.status(404).json({ message: "No candidates found.", candidates });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error', error });
    }
};
