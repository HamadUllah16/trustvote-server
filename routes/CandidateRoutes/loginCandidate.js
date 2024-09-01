const express = require('express');
const router = express.Router();
const { loginCandidate } = require('../../controllers/CandidateController/loginCandidate');

// Candidate login route
router.post('/', loginCandidate);

module.exports = router;
