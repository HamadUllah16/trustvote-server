const Candidate = require('../models/Candidate');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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
            { expiresIn: '5d' } // Token expires in 1 hour
        );

        res.status(200).json({ token, candidate: { id: candidate._id, email: candidate.email } });
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
            const candidate = await Candidate.findById(id, { password: 0 })
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
    const completeData = req.body;

    console.log('Request params:', req.params);
    console.log('Request body:', req.body);

    try {
        console.log(`Finding candidate with ID: ${id}`);
        let candidate = await Candidate.findById(id);

        if (!candidate) {
            console.log(`Candidate with ID: ${id} not found`);
            return res.status(404).json({ message: "Candidate not found." });
        }

        Object.keys(completeData).forEach(key => {
            candidate[key] = completeData[key];
        })

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

        // Check if the candidate already exists
        const existingCandidate = await Candidate.findOne({ email });
        if (existingCandidate) {
            console.log('Candidate with this email already exists:', email);
            return res.status(400).json({ message: "Candidate with this email already exists." });
        }

        // Create a new candidate
        const newCandidate = new Candidate({
            role: 'candidate',
            email,
            password: await bcrypt.hash(password, await bcrypt.genSalt(10)),
            firstName: '',
            lastName: '',
            phone: '',
            cnicNumber: '',
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

            profileCompletion: false,
            status: 'pending'
        });

        // Save the candidate to the database
        await newCandidate.save();
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
        const allCandidates = await Candidate.find({}, { password: 0, cnicBack: 0, cnicFront: 0, cnicNumber: 0, educationalCertificates: 0, assetDeclaration: 0 })

        if (allCandidates.length === 0) {
            return res.status(400).json({ message: "No candidates found." })
        }

        res.status(200).json({ data: { allCandidates, message: 'All candidates fetched.' } })
    } catch (error) {
        console.error('Error getting all candidates ', error)
        res.status(500).json({ message: 'Internal server error' })
    }
}



