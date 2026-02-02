const express = require('express');
const {getAppointments,getAppointment,createAppointment,updateAppointment,updateAppointmentStatus,deleteAppointment,} = require('../controllers/appointmentController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', getAppointments);
router.get('/:id', getAppointment);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.put('/:id/status', updateAppointmentStatus);
router.delete('/:id', deleteAppointment);

module.exports = router;
