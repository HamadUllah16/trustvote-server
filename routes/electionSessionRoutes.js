const { initializeElectionSession, configureElectionSession, scheduleElectionSession, recentElectionSession } = require('../controllers/electionSessionController');
const { verifyAdmin } = require('../middlewares/authMiddleware');

const router = require('express').Router();

router.get('/recent-election-session', recentElectionSession);

// starts an election session on the blockchain
router.post('/initialize-election-session', verifyAdmin, initializeElectionSession);

// stops the election session on the blockchain
router.post('/configure-election-session', configureElectionSession);

router.post('/schedule-election-session', scheduleElectionSession)

module.exports = router;