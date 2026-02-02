const mongoose = require('mongoose');
const Appointment = require('../models/appointmentModel');

// GET /api/appointments  
exports.getAppointments = async (req, res) => {
  const { status, host, visitor, from, to } = req.query;

  try {
    const filter = {};

    if (status) filter.status = status;
    if (host) filter.host = host;
    if (visitor) filter.visitor = visitor;
    if (from || to) {
      filter.dateTime = {};
      if (from) filter.dateTime.$gte = new Date(from);
      if (to) filter.dateTime.$lte = new Date(to);
    }
    if (req.user.role !== 'admin') {
      filter.createdBy = req.user._id;
    }

    const appointments = await Appointment.find(filter)
      .sort({ dateTime: 1 })
      .populate('visitor', 'name email phone company')
      .populate('host', 'name email')
      .populate('createdBy', 'name email role');

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/appointments/:id 
exports.getAppointment = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such appointment' });
  }

  try {
    const appointment = await Appointment.findById(id)
      .populate('visitor', 'name email phone company')
      .populate('host', 'name email')
      .populate('createdBy', 'name email role');

    if (!appointment) {
      return res.status(404).json({ error: 'No such appointment' });
    }

    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/appointments  
exports.createAppointment = async (req, res) => {
  const { visitor, host, purpose, dateTime, notes } = req.body;

  let emptyFields = [];
  if (!visitor) emptyFields.push('visitor');
  if (!host) emptyFields.push('host');
  if (!purpose) emptyFields.push('purpose');
  if (!dateTime) emptyFields.push('dateTime');

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: 'Please fill out all the fields!', emptyFields });
  }

  try {
    const appointment = await Appointment.create({
      visitor,
      host,
      purpose,
      dateTime,
      notes,
      status: 'pending',
      createdBy: req.user._id, 
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/appointments/:id  
exports.updateAppointment = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such appointment' });
  }

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'No such appointment' });
    }

    res.status(200).json(appointment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/appointments/:id/status  
exports.updateAppointmentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'approved', 'rejected', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: 'No such appointment' });
    }

    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// DELETE /api/appointments/:id
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such appointment' });
  }

  try {
    const appointment = await Appointment.findByIdAndDelete(id);

    if (!appointment) {
      return res.status(404).json({ error: 'No such appointment' });
    }

    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
