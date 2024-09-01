const Candidate = require('../../models/candidate');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        res.status(200).json({ token, candidate: { id: candidate._id, email: candidate.email } });
    } catch (error) {
        console.error("Error logging in candidate:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
