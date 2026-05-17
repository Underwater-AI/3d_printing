const PrintJob = require('../models/PrintJob');
const { calculateCost } = require('../utils/pricing');

exports.createJob = async (req, res, next) => {
  try {
    const jobData = req.body;

    if (req.user) {
      jobData.customerId = req.user._id;
    }

    const pricing = calculateCost({
      material: jobData.material,
      quantity: jobData.quantity,
      deliveryMethod: jobData.deliveryMethod,
      multicolor: jobData.multicolor,
      estimatedWeight: jobData.estimatedWeight || 50,
    });

    Object.assign(jobData, pricing);

    const job = await PrintJob.create(jobData);
    res.status(201).json({ job });
  } catch (err) {
    next(err);
  }
};

exports.getJobs = async (req, res, next) => {
  try {
    const jobs = await PrintJob.find({ customerId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ jobs });
  } catch (err) {
    next(err);
  }
};

exports.getJob = async (req, res, next) => {
  try {
    const job = await PrintJob.findById(req.params.id).lean();
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Allow owner or admin
    const isOwner = job.customerId && job.customerId.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    res.json({ job });
  } catch (err) {
    next(err);
  }
};

exports.getAllJobs = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
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
