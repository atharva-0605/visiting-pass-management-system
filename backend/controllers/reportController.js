const Pass = require('../models/passModel');
const CheckLog = require('../models/checkLogModel');

const buildDateFilter = (from, to) => {
  const filter = {};
  if (from || to) {
    filter.$and = [];
    if (from) filter.$and.push({ createdAt: { $gte: new Date(from) } });
    if (to) filter.$and.push({ createdAt: { $lte: new Date(to) } });
  }
  return filter;
};

// GET /api/reports/summary
exports.getSummaryReport = async (req, res) => {
  const { from, to } = req.query;
  const dateFilter = buildDateFilter(from, to);

  try {
    const [totalPasses, activePasses, totalCheckIns, totalCheckOuts] =
      await Promise.all([
        Pass.countDocuments(dateFilter),
        Pass.countDocuments({ ...dateFilter, status: 'active' }),
        CheckLog.countDocuments({ ...dateFilter, action: 'IN' }),
        CheckLog.countDocuments({ ...dateFilter, action: 'OUT' }),
      ]);

    res.status(200).json({
      totalPasses,
      activePasses,
      totalCheckIns,
      totalCheckOuts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/reports/daily-visits
exports.getDailyVisits = async (req, res) => {
  const { from, to } = req.query;

  const matchStage = {};
  if (from || to) {
    matchStage.createdAt = {};
    if (from) matchStage.createdAt.$gte = new Date(from);
    if (to) matchStage.createdAt.$lte = new Date(to);
  }

  try {
    const pipeline = [
      { $match: { action: 'IN', ...matchStage } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const result = await CheckLog.aggregate(pipeline);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/reports/host-visits
exports.getHostVisits = async (req, res) => {
  const { from, to, host } = req.query;

  const matchStage = {};
  if (from || to) {
    matchStage.createdAt = {};
    if (from) matchStage.createdAt.$gte = new Date(from);
    if (to) matchStage.createdAt.$lte = new Date(to);
  }
  if (host) {
    matchStage.host = host;
  }

  try {
    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$host',
          visits: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'hostInfo',
        },
      },
      { $unwind: '$hostInfo' },
      {
        $project: {
          _id: 0,
          hostId: '$hostInfo._id',
          hostName: '$hostInfo.name',
          hostEmail: '$hostInfo.email',
          visits: 1,
        },
      },
      { $sort: { visits: -1 } },
    ];

    const result = await Pass.aggregate(pipeline);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/reports/visits-export
exports.getVisitsExport = async (req, res) => {
  const { from, to } = req.query;

  const matchStage = {};
  if (from || to) {
    matchStage.createdAt = {};
    if (from) matchStage.createdAt.$gte = new Date(from);
    if (to) matchStage.createdAt.$lte = new Date(to);
  }

  try {
    const logs = await CheckLog.find(matchStage)
      .sort({ createdAt: -1 })
      .populate({
        path: 'pass',
        populate: [
          { path: 'visitor', select: 'name email phone company' },
          { path: 'host', select: 'name email department' },
        ],
      })
      .populate('securityUser', 'name email');

    res.status(200).json(logs); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
