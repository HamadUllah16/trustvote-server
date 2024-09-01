// controllers/CandidateController/profileCompletion.js

const Candidate = require('../../models/candidate');

exports.completeProfile = async (req, res) => {
    console.log('completeProfile controller invoked');
    const candidateId = req.params.id;
    const { firstName, lastName, phone, cnic, dateOfBirth, cnicFront, cnicBack, manifesto, partyAffiliation, publicKey } = req.body;

    console.log('Request params:', req.params);
    console.log('Request body:', req.body);

    try {
        console.log(`Finding candidate with ID: ${candidateId}`);
        const candidate = await Candidate.findById(candidateId);

        if (!candidate) {
            console.log(`Candidate with ID: ${candidateId} not found`);
            return res.status(404).json({ message: "Candidate not found." });
        }

        // Update candidate details
        candidate.firstName = firstName;
        candidate.lastName = lastName;
        candidate.phone = phone;
        candidate.cnic = cnic;
        candidate.dateOfBirth = dateOfBirth;
        candidate.cnicFront = cnicFront;
        candidate.cnicBack = cnicBack;
        candidate.manifesto = manifesto;
        candidate.partyAffiliation = partyAffiliation;
        candidate.publicKey = publicKey;

        // Check if profile is complete and update profileCompletion
        candidate.profileCompletion = (
            candidate.firstName && candidate.lastName && candidate.email &&
            candidate.manifesto && candidate.partyAffiliation &&
            candidate.publicKey && candidate.cnic && candidate.cnicFront && candidate.cnicBack
        ) ? true : false;

        console.log('Attempting to save the candidate...');
        await candidate.save();
        console.log(`Candidate with ID: ${candidateId} updated successfully`);

        res.status(200).json({ message: "Profile updated successfully.", candidate });
    } catch (error) {
        console.error("Error updating candidate profile:", error);
        res.status(500).json({ message: "Internal server error." });
    }
};
