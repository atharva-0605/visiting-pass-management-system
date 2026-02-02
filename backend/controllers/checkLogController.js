const mongoose = require('mongoose');
const CheckLog = require('../models/checkLogModel');
const Pass = require('../models/passModel');

// GET /api/checklogs  
exports.getCheckLogs = async (req, res) => {
  const { pass, visitor, host, action } = req.query;

  try {
    const filter = {};

    if (pass) filter.pass = pass;
    if (action) filter.action = action;

    const logs = await CheckLog.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: 'pass',
        populate: [
          { path: 'visitor', select: 'name email phone' },
          { path: 'host', select: 'name email' },
        ],
      })
      .populate('securityUser', 'name email');
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/checklogs/:id  
exports.getCheckLog = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such check log' });
  }

  try {
    const log = await CheckLog.findById(id)
      .populate({
        path: 'pass',
        populate: [
          { path: 'visitor', select: 'name email phone' },
          { path: 'host', select: 'name email' },
        ],
      })
      .populate('securityUser', 'name email');

    if (!log) {
      return res.status(404).json({ error: 'No such check log' });
    }
    res.status(200).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/checklogs/scan  
exports.scanPass = async (req, res) => {
  const { passId, gate } = req.body; 

  if (!mongoose.Types.ObjectId.isValid(passId)) {
    return res.status(404).json({ error: 'Invalid pass id' });
  }

  try {
    const pass = await Pass.findById(passId).populate('visitor host');
    if (!pass) {
      return res.status(404).json({ error: 'Pass not found' });
    }

    const now = new Date();
    if (pass.validFrom && now < pass.validFrom) {
      return res.status(400).json({ error: 'Pass is not yet valid' });
    }
    if (pass.validTo && now > pass.validTo) {
      pass.status = 'expired';
      await pass.save();
      return res.status(400).json({ error: 'Pass has expired' });
    }

    const lastLog = await CheckLog.findOne({ pass: pass._id })
      .sort({ createdAt: -1 });

    let action;
    if (!lastLog || lastLog.action === 'OUT') {
      action = 'IN';
      pass.status = 'active';
    } else {
      action = 'OUT';
      pass.status = 'checkedOut';
    }

    const log = await CheckLog.create({
      pass: pass._id,
      action,
      gate,
      securityUser: req.user._id,
    });

    await pass.save();

    res.status(201).json({
      message: `Visitor ${action === 'IN' ? 'checked in' : 'checked out'} successfully`,
      action,
      pass,
      log,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/checklogs/:id  
exports.deleteCheckLog = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such check log' });
  }

  try {
    const log = await CheckLog.findByIdAndDelete(id);

    if (!log) {
      return res.status(404).json({ error: 'No such check log' });
    }

    res.status(200).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};