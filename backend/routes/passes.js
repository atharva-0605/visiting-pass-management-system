const express = require('express');
const {getPasses,getPass,createPass,updatePass,deletePass,getPassQr, getLiveVisitors} = require('../controllers/passController')
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', getPasses);
router.get('/:id', getPass);
router.post('/', createPass);
router.put('/:id', updatePass);
router.delete('/:id', deletePass);
router.get('/:id/qr', getPassQr);
router.get('/live', getLiveVisitors);

module.exports = router;