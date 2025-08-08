const express = require('express');
const Order = require('../models/Order');
const Tree = require('../models/Tree');

const router = express.Router();

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('tree');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// POST create a new order
router.post('/', async (req, res) => {
  const { fullName, phoneNumber, address, tree, note } = req.body;

  if (!fullName || !phoneNumber || !address || !tree) {
    return res.status(400).json({ error: 'All fields except note are required.' });
  }

  try {
    // Optionally validate tree ID
    const treeExists = await Tree.findById(tree);
    if (!treeExists) {
      return res.status(400).json({ error: 'Invalid tree ID' });
    }

    const order = new Order({
      fullName,
      phoneNumber,
      address,
      tree,
      note
    });

    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// DELETE all orders (for reset/testing)
router.delete('/reset', async (req, res) => {
  try {
    await Order.deleteMany({});
    res.json({ message: 'All orders deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete orders' });
  }
});

module.exports = router;
