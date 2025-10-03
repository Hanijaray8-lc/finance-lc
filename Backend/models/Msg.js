// models/Message.js
const mongoose = require('mongoose');

const msgSchema = new mongoose.Schema({
     username: { type: String, required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  tenure: { type: Number, required: true },
  income: { type: Number, required: true },
  emi: { type: Number, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('msg', msgSchema); // was 'msg'

