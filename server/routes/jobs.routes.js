const express = require('express');
const router = express.Router();
const { createJob, getJobs, getJob, getAllJobs, updateJobStatus } = require('../controllers/jobs.controller');
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.post('/', protect, createJob);
router.get('/', protect, getJobs);
router.get('/admin/all', protect, adminOnly, getAllJobs);
router.get('/:id', protect, getJob);
router.put('/:id/status', protect, adminOnly, updateJobStatus);

module.exports = router;
