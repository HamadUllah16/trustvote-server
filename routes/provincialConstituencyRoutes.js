const { allProvincialConstituencies, kpkProvincialConstituencies, sindhProvincialConstituencies, punjabProvincialConstituencies, balochistanProvincialConstituencies, addProvincialConstituency } = require('../controllers/provincialConstituencyController');
const { verifyAdmin, verifyToken } = require('../middlewares/authMiddleware')
const router = require('express').Router();


router.get('/all', allProvincialConstituencies);
router.get('/kpk', kpkProvincialConstituencies);
router.get('/sindh', sindhProvincialConstituencies);
router.get('/punjab', punjabProvincialConstituencies);
router.get('/balochistan', balochistanProvincialConstituencies);

router.post('/add-provincial-constituency', verifyToken, verifyAdmin, addProvincialConstituency);

module.exports = router;