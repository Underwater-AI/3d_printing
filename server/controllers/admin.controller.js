const PrintJob = require('../models/PrintJob');
const Material = require('../models/Material');

exports.getStats = async (req, res, next) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - 7);

    const [ordersToday, ordersWeek, totalOrders, revenueToday, revenueMonth] = await Promise.all([
      PrintJob.countDocuments({ createdAt: { $gte: todayStart } }),
      PrintJob.countDocuments({ createdAt: { $gte: weekStart } }),
      PrintJob.countDocuments(),
      PrintJob.aggregate([
        { $match: { createdAt: { $gte: todayStart }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalCost' } } },
      ]),
      PrintJob.aggregate([
        { $match: { createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalCost' } } },
      ]),
    ]);

    res.json({
      ordersToday,
      ordersWeek,
      totalOrders,
      revenueToday: revenueToday[0]?.total || 0,
      revenueMonth: revenueMonth[0]?.total || 0,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllJobs = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const jobs = await PrintJob.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await PrintJob.countDocuments(filter);
    res.json({ jobs, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

exports.updateJobStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const update = { status };

    if (status === 'printing') update.printedAt = new Date();
    if (status === 'delivered') update.deliveredAt = new Date();

    const job = await PrintJob.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!job) return res.status(404).json({ error: 'Job not found' });

    res.json({ job });
  } catch (err) {
    next(err);
  }
};

exports.getMaterials = async (req, res, next) => {
  try {
    const materials = await Material.find().lean();
    res.json({ materials });
  } catch (err) {
    next(err);
  }
};

exports.updateMaterial = async (req, res, next) => {
  try {
    const material = await Material.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!material) return res.status(404).json({ error: 'Material not found' });
    res.json({ material });
  } catch (err) {
    next(err);
  }
};
