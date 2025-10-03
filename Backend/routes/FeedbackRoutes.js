// routes/feedback.js

const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

router.post('/', async (req, res) => {
const { companyId, FinancecompanyName, name, rating, comment } = req.body;
  try {
const feedback = new Feedback({ companyId, FinancecompanyName, name, rating, comment });
    await feedback.save();
    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Get all feedback for a specific company
router.get('/:companyId', async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ companyId: req.params.companyId });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// feedback.js (routes)
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch feedbacks', error: err.message });
  }
});

// Also route to get unique finance company names
router.get('/companies', async (req, res) => {
  try {
    const companies = await Feedback.distinct('FinancecompanyName');
    res.json(companies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch companies', error: err.message });
  }
});

router.post('/like/:reviewId', async (req, res) => {
  try {
    const review = await Feedback.findById(req.params.reviewId);
    const { username } = req.body;

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Fix for wrong data type
    if (!Array.isArray(review.likes)) {
      review.likes = [];
    }

    if (!review.likes.includes(username)) {
      review.likes.push(username);
      await review.save();
      return res.status(200).json({ message: 'Liked' });
    } else {
      return res.status(400).json({ message: 'Already liked' });
    }
  } catch (err) {
    console.error('Error in /like route:', err);
    return res.status(500).json({ message: 'Server error in like route', error: err.message });
  }
});







router.post('/reply/:id', async (req, res) => {
  try {
    const review = await Feedback.findById(req.params.id);
    review.replies.push({
      text: req.body.reply,
      date: new Date(),
    });
    await review.save();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reply' });
  }
});

// routes/feedback.js
// routes/feedback.js

router.post('/comment/:id', async (req, res) => {
  try {
    const { text } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback.comments) {
      feedback.comments = [];
    }

    feedback.comments.push({ text, date: new Date() });
    await feedback.save();
    res.status(200).json({ message: 'Comment added' });
  } catch (err) {
    console.error("Error submitting comment:", err);
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

module.exports = router;

