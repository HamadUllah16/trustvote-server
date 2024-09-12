// controllers/AdminController/admin.js
const Admin = require('../../models/admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Candidate = require('../../models/Candidate');

// Admin login function
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '5d' }
    );

    res.status(200).json({ token, admin: { id: admin._id, email: admin.email } });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Function to get all candidates who have completed their profiles but are not yet approved
exports.getPendingCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ profileCompletion: true, approved: false });
    res.status(200).json({ candidates });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Function to approve or reject a candidate
exports.approveOrRejectCandidate = async (req, res) => {
  const { candidateId } = req.params;
  const { approved } = req.body; // `approved` should be true for approval, false for rejection

  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found." });
    }

    candidate.approved = approved;
    await candidate.save();

    res.status(200).json({ message: approved ? "Candidate approved." : "Candidate rejected.", candidate });
  } catch (error) {
    console.error("Error updating candidate approval status:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
