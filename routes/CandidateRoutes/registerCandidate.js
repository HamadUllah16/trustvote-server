const express = require('express');
const router = express.Router();
const { registerCandidate } = require('../../controllers/CandidateController/registerCandidate');


// POST /api/candidates/register
router.post('/', (req, res, next) => {
    console.log('POST /api/candidates/register - request received');
    next();
}, registerCandidate);

module.exports = router;
