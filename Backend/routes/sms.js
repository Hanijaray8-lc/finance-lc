// routes/sms.js
const express = require('express');
const router = express.Router();
const SmsReply = require('../models/SmsReply'); // Create this model

router.post('/reply', async (req, res) => {
  const { Body, From } = req.body;

  try {
    const newReply = new SmsReply({
      from: From,
      message: Body,
      receivedAt: new Date(),
    });
    await newReply.save();

    res.status(200).send('<Response></Response>'); // Twilio expects a valid XML response
  } catch (error) {
    console.error('Error saving SMS reply:', error);
    res.status(500).send('Error');
  }
});

// Add to routes/sms.js
router.get('/replies', async (req, res) => {
  try {
    const replies = await SmsReply.find().sort({ receivedAt: -1 });
    res.json(replies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// routes/sms.js
router.get('/replies', async (req, res) => {
  try {
    const replies = await SmsReply.find().sort({ receivedAt: -1 });
    res.json(replies);
  } catch (error) {
    console.error('Error fetching replies:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to get unread message count
router.get('/replies/unread/count', async (req, res) => {
  try {
    const count = await SmsReply.countDocuments({ read: false });
    res.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Route to mark all messages as read
router.put('/replies/mark-read', async (req, res) => {
  try {
    await SmsReply.updateMany({ read: false }, { $set: { read: true } });
    res.json({ message: 'All messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});



module.exports = router;
