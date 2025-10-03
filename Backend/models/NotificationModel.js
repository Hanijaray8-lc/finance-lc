// backend/models/NotificationModel.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
  },
  user: {
    type: String, // Assuming user stores username
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
isRead: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);

