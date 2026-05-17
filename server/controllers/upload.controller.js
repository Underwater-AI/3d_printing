const path = require('path');

exports.uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.json({
    fileId: req.file.filename,
    originalName: req.file.originalname,
    fileSize: req.file.size,
    filePath: `/uploads/${req.file.filename}`,
  });
};
