// backend/routes/adminNotification.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/NotificationModel');

// POST - create new notification
router.post('/', async (req, res) => {
  try {
    const { company, user, dueDate, description } = req.body;
    // Set isRead to false by default when a new notification is created
    const newNotification = new Notification({ company, user, dueDate, description, isRead: false });
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ message: 'Error creating notification', error });
  }
});

// GET - get all notifications (for admin panel)
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error });
  }
});

// GET only unread notifications count for a user
router.get('/unread-count/:username', async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.params.username,
      isRead: false
    });
    res.json({ unreadCount: count });
  } catch (err) {
    res.status(500).json({ error: 'Error fetching unread count' });
  }
});




// POST - Mark ALL notifications as read for a user
router.post('/mark-as-read/:username', async (req, res) => {
  try {
    await Notification.updateMany({ user: req.params.username }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    res.status(500).json({ error: 'Error marking as read' });
  }
});

// POST - Mark notifications as read for a specific user
router.post('/Notification/mark-as-read-id/:id', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json(notification);
  } catch (err) {
    res.status(500).json({ error: 'Error updating status' });
  }
});

// GET - get notifications for a specific user
router.get('/:username', async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.params.username }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching user notifications' });
  }
});



module.exports = router;

