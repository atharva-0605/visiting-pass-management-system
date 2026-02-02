const mongoose = require('mongoose');
const Visitor = require('../models/visitorModel');

// GET /api/visitors  
exports.getVisitors = async (req, res) => {
  try {
    const filter = {};
    if (req.user.role !== 'admin') {
      filter.createdBy = req.user._id;
    }
    const visitors = await Visitor.find(filter)
      .sort({ createdAt: -1 });

    res.status(200).json(visitors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/visitors/:id  
exports.getVisitor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such visitor' });
  }

  try {
    const visitor = await Visitor.findById(id).populate('createdBy', 'name email role');

    if (!visitor) {
      return res.status(404).json({ error: 'No such visitor' });
    }

    res.status(200).json(visitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/visitors  
exports.createVisitor = async (req, res) => {
  const { name, email, phone, company, idType, idNumber } = req.body;
  const photoUrl = req.file ? `uploads/${req.file.filename}` : undefined;

  let emptyFields = [];
  if (!name) emptyFields.push('name');
  if (!email) emptyFields.push('email');
  if (!phone) emptyFields.push('phone');
  if (!company) emptyFields.push('company');
  if (!idType) emptyFields.push('idType');
  if (!idNumber) emptyFields.push('idNumber');

  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: 'Please fill out all the fields!', emptyFields });
  }

  try {
    const visitor = await Visitor.create({
      name,
      email,
      phone,
      company,
      idType,
      idNumber,
      photoUrl,
      createdBy: req.user._id,
    });

    res.status(201).json(visitor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/visitors/:id  
exports.deleteVisitor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such visitor' });
  }

  try {
    const visitor = await Visitor.findByIdAndDelete(id);

    if (!visitor) {
      return res.status(404).json({ error: 'No such visitor' });
    }

    res.status(200).json(visitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PUT /api/visitors/:id  
exports.updateVisitor = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such visitor' });
  }
  
  if (req.file) {
    req.body.photoUrl = `uploads/${req.file.filename}`;
  }

  try {
    const visitor = await Visitor.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!visitor) {
      return res.status(404).json({ error: 'No such visitor' });
    }

    res.status(200).json(visitor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};