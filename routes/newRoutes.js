const express = require('express');
const multer = require('multer');
const News = require('../models/News');

const router = express.Router();

// === Multer config for image upload ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const isImage = ['image/png', 'image/jpeg'].includes(file.mimetype);
    cb(null, isImage);
  },
});

// === GET all news ===
router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

// === POST create news ===
router.post('/', upload.single('thumbnail'), async (req, res) => {
  const { title, content } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: 'Thumbnail is required' });
  }

  try {
    const news = new News({
      title,
      content,
      thumbnail: req.file.path,
    });

    await news.save();
    res.status(201).json(news);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create news' });
  }
});

// === DELETE all news (optional: for testing/resetting) ===
router.delete('/reset', async (req, res) => {
  try {
    await News.deleteMany({});
    res.json({ message: 'All news deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete news' });
  }
});

module.exports = router;
