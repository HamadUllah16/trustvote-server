const { allConstituencies, punjabConstituency, sindhConstituency, kpkConstituency, balochistanConstituency, capitalConstituency, addConstituency } = require('../controllers/constituencyController');

const router = require('express').Router();

router.get('/all-constituencies', allConstituencies);
router.get('/punjab-constituencies', punjabConstituency);
router.get('/sindh-constituencies', sindhConstituency);
router.get('/kpk-constituencies', kpkConstituency);
router.get('/balochistan-constituencies', balochistanConstituency);
router.get('/capital-constituencies', capitalConstituency);

router.post('/add-constituency', addConstituency);


module.exports = router;