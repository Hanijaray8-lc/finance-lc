const express = require('express');
const router = express.Router();
const Msg = require('../models/Msg'); // make sure this path is correct

// POST: Save EMI Calculation
router.post('/save', async (req, res) => {
  try {
    const { username, name, amount, interestRate, tenure, income, emi } = req.body;
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    const newMsg = new Msg({
      username,
      name,
      amount,
      interestRate,
      tenure,
      income,
      emi,
      createdAt: new Date(),
    });

    await newMsg.save();
    res.status(201).json({ message: 'EMI saved successfully' });
  } catch (error) {
    console.error('Error saving EMI:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET: Fetch EMI messages for a specific user
router.get('/messages/:username', async (req, res) => {
  try {
    const messages = await Msg.find({ username: req.params.username }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error('Error fetching EMI messages:', err);
    res.status(500).send('Server Error');
  }
});

// POST: Mark messages as read
router.post('/messages/mark-as-read/:username', async (req, res) => {
  try {
    const result = await Msg.updateMany(
      { username: req.params.username, isRead: false },
      { $set: { isRead: true } }
    );
    res.json({ message: 'Messages marked as read', updatedCount: result.modifiedCount });
  } catch (err) {
    console.error('Error marking messages as read:', err);
    res.status(500).send('Server Error');
  }
});

// Optional: GET all EMI records (admin/debugging use)
router.get('/', async (req, res) => {
  try {
    const allEmis = await Msg.find().sort({ createdAt: -1 });
    res.json(allEmis);
  } catch (error) {
    console.error('Error fetching all EMI records:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

module.exports = router;

