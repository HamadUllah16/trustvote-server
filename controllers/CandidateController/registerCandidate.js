const Candidate = require('../../models/candidate');

console.log('registerCandidate controller loaded');

// Register a new candidate
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
            email,
            password
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
