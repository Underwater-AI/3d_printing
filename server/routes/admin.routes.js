const express = require('express');
const router = express.Router();
const { getStats, getAllJobs, updateJobStatus, getMaterials, updateMaterial } = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/jobs', getAllJobs);
router.put('/jobs/:id/status', updateJobStatus);
router.get('/materials', getMaterials);
router.put('/materials/:id', updateMaterial);

module.exports = router;
