const mongoose = require('mongoose');
const Pass = require('../models/passModel');
const QRCode = require('qrcode');
const { generateQrDataUrl} = require('../utils/qrGenerator');

const generatePassNumber = () => {
  return `PASS-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};

// GET /api/passes  
exports.getPasses = async (req, res) => {
  const { host, visitor, status } = req.query;

  try {
    const filter = {};

    if (host) filter.host = host;
    if (visitor) filter.visitor = visitor;
    if (status) filter.status = status;
    if (req.user.role !== 'admin') {
      filter.createdBy = req.user._id;
    }

    const passes = await Pass.find(filter)
      .sort({ createdAt: -1 })
      .populate('visitor', 'name email phone')
      .populate('host', 'name email')
      .populate('appointment');

    res.status(200).json(passes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/passes/:id  
exports.getPass = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such pass' });
  }

  try {
    const pass = await Pass.findById(id)
      .populate('visitor', 'name email phone company')
      .populate('host', 'name email')
      .populate('appointment');

    if (!pass) {
      return res.status(404).json({ error: 'No such pass' });
    }

    res.status(200).json(pass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/passes  
exports.createPass = async (req, res) => {
  const { visitor, host, appointment, validFrom, validTo } = req.body;

  let emptyFields = [];
  if (!visitor) emptyFields.push('visitor');
  if (!host) emptyFields.push('host');
  if (!validFrom) emptyFields.push('validFrom');
  if (!validTo) emptyFields.push('validTo');

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: 'Please fill out all the fields!', emptyFields });
  }

  try {
    const passNumber = generatePassNumber();

    const qrPayload = { passNumber };
    const qrData = JSON.stringify(qrPayload);

    const pass = await Pass.create({
      visitor,
      host,
      appointment,
      passNumber,
      qrData,
      validFrom,
      validTo,
      status: 'active',
      createdBy: req.user._id,
    });

    const qrImage = await generateQrDataUrl(qrData); 

    pass.qrImage = qrImage; 

    await pass.save();

    res.status(201).json(pass);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /api/passes/:id  
exports.updatePass = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such pass' });
  }

  try {
    const pass = await Pass.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!pass) {
      return res.status(404).json({ error: 'No such pass' });
    }

    res.status(200).json(pass);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/passes/:id  -> delete pass
exports.deletePass = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such pass' });
  }

  try {
    const pass = await Pass.findByIdAndDelete(id);

    if (!pass) {
      return res.status(404).json({ error: 'No such pass' });
    }

    res.status(200).json(pass);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/passes/:id/qr  
exports.getPassQr = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such pass' });
  }

  try {
    const pass = await Pass.findById(id);
    if (!pass) {
      return res.status(404).json({ error: 'No such pass' });
    }

    res.status(200).json({ qrImage: pass.qrImage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

