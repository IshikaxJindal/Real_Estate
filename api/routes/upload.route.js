// backend/routes/uploadRoute.js
import express from 'express';
import upload from '../utils/cloudinaryStorage.js';

const router = express.Router();

// POST /api/upload/image
router.post('/image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  res.status(200).json({
    url: req.file.path,
    public_id: req.file.filename,
  });
});

export default router;
