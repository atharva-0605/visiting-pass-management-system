const express = require('express');
const {getSummaryReport,getDailyVisits,getHostVisits,getVisitsExport,} = require('../controllers/reportController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth); 

router.get('/summary', getSummaryReport);
router.get('/daily-visits', getDailyVisits);
router.get('/host-visits', getHostVisits);
router.get('/visits-export', getVisitsExport);

module.exports = router;
