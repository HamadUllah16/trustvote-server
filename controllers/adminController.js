// controllers/AdminController/admin.js
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Candidate = require('../models/Candidate');

exports.createAdmin = async () => {
  console.log('checking admin profile');
  const password = 'admin'
  const email = 'admin@trustvote.com'
  const exists = await Admin.findOne({ email });

  if (!exists) {
    console.log('Admin profile do not exists, creating automatically.');
    const encryptedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ email, username: 'admin', password, role: 'admin' });

    console.log(`Admin created, Email: ${email}, Password: ${password}`, admin)
  } else {
    console.log('Admin profile exists')
  }
}


// Admin login function
exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

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

    res.status(200).json({
      token,
      id: admin._id,
      email: admin.email,
      role: 'admin'
    });
  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

exports.adminProfile = async (req, res) => {
  console.log('/get-admin-profile accessed.');
  const { id } = req.user;
  try {
    if (id) {
      const admin = await Admin.findById(id, { password: 0, createdAt: 0, updatedAt: 0 });
      if (!admin) {
        return res.status(401).json({ message: 'Admin not found.' });
      }
      return res.status(200).json({
        data: admin,
        message: 'Admin profile fetched.'
      });
    }
    return res.status(401).json({ error: 'Invalid id, user not found.' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the admin profile.' });
  }
};
exports.getApprovedCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ status: 'verified' }, { password: 0, createdAt: 0, updatedAt: 0, votes: 0 })
    res.status(200).json({ candidates, message: 'Approved candidates fetched.' })
  } catch (error) {
    console.error('Error getting approved candidates.', error)
    res.status(500).json({ message: 'Internal server error', error })
  }
}

// Function to get all candidates who have completed their profiles but are not yet approved
exports.getPendingCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ profileCompletion: true, status: 'pending' }, { password: 0, createdAt: 0, updatedAt: 0 });
    res.status(200).json({ message: 'Pending Candidates fetched', data: candidates });
  } catch (error) {
    console.error("Error fetching candidates:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Function to approve or reject a candidate
exports.approveOrRejectCandidate = async (req, res) => {
  const { candidateId } = req.params;
  const { status } = req.body;

  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found." });
    }

    candidate.status = status;
    await candidate.save();

    res.status(200).json({ message: status, candidate });
  } catch (error) {
    console.error("Error updating candidate approval status:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
