const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  tree: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tree',
    required: true,
  },
  note: {
    type: String,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema);
