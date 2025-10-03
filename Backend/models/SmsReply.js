// models/SmsReply.js
const mongoose = require('mongoose');

const smsReplySchema = new mongoose.Schema({
  from: String,
  message: String,
  receivedAt: Date,
  read: { type: Boolean, default: false }, // <-- add this
});

module.exports = mongoose.model('SmsReply', smsReplySchema);

