const { configureElectionSession, scheduleElectionSession, recentElectionSession, allElectionSessions, performElectionSessionInit } = require('../controllers/electionSessionController');
const { verifyAdmin } = require('../middlewares/authMiddleware');

const router = require('express').Router();

router.get('/recent-election-session', recentElectionSession);


// stops the election session on the blockchain
router.post('/configure-election-session', configureElectionSession);

router.post('/schedule-election-session', scheduleElectionSession)

router.get('/all', allElectionSessions);

router.post('/try-election-session-transaction', performElectionSessionInit)

module.exports = router;