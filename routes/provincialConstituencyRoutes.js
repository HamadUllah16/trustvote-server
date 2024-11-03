const { allProvincialConstituencies, kpkProvincialConstituencies, sindhProvincialConstituencies, punjabProvincialConstituencies, balochistanProvincialConstituencies } = require('../controllers/provincialConstituencyController');

const router = require('express').Router();


router.get('/all-provincial-constituencies', allProvincialConstituencies);
router.get('/kpk', kpkProvincialConstituencies);
router.get('/sindh', sindhProvincialConstituencies);
router.get('/punjab', punjabProvincialConstituencies);
router.get('/balochistan', balochistanProvincialConstituencies);

module.exports = router;