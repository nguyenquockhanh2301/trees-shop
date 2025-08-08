const express = require('express');
const multer = require('multer');
const path = require('path');
const Tree = require('../models/Tree');

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// GET all trees
router.get('/', async (req, res) => {
  try {
    const trees = await Tree.find();
    res.json(trees);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch trees' });
  }
});

// POST create new tree
router.post('/', upload.single('image'), async (req, res) => {
  const { name, description } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !description) {
    return res.status(400).json({ error: 'Name and description are required.' });
  }

  try {
    const tree = new Tree({ name, description, image });
    await tree.save();
    res.status(201).json(tree);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create tree' });
  }
});

// DELETE all trees
router.delete('/reset', async (req, res) => {
  try {
    await Tree.deleteMany({});
    res.json({ message: 'All trees deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete trees' });
  }
});

module.exports = router;
