const express = require('express');
const {getCheckLogs,getCheckLog,scanPass,deleteCheckLog,} = require('../controllers/checkLogController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', getCheckLogs);
router.get('/:id', getCheckLog);
router.post('/scan', scanPass);
router.delete('/:id', deleteCheckLog);

module.exports = router;
