const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const { uploadFile } = require('../controllers/upload.controller');
const { protect } = require('../middleware/auth');

router.post('/', protect, upload.single('file'), uploadFile);

module.exports = router;
