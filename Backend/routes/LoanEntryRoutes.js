const express = require('express');
const router = express.Router();
const LoanEntry = require('../models/LoanEntry'); // You'll need to create this model

// @route   POST /api/loan/entries
// @desc    Create a new loan entry
// @access  Private
router.post('/entries', async (req, res) => {
  try {
    const {
      user,
      loanType,
      loanAmount,
      emiAmount,
      dueDate,
      paidDate,
      companyId
    } = req.body;

    // Validate required fields
    if (!user || !loanType || !loanAmount || !emiAmount || !dueDate || !companyId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Create new loan entry
    const newEntry = new LoanEntry({
      user,
      loanType,
      loanAmount: Number(loanAmount),
      emiAmount: Number(emiAmount),
      dueDate: new Date(dueDate),
      paidDate: paidDate ? new Date(paidDate) : null,
      companyId,
      entryDate: new Date()
    });

    // Save to database
    const savedEntry = await newEntry.save();

    res.status(201).json({
      success: true,
      message: 'Loan entry saved successfully',
      data: savedEntry
    });

  } catch (err) {
    console.error('Error saving loan entry:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to save loan entry',
      error: err.message
    });
  }
});

// Example Express Route (backend)
// @route   GET /api/loan-history
// @desc    Get all loan entries
// @access  Private
router.get('/', async (req, res) => {
  try {
    const loans = await LoanEntry.find();  // ✅ use the correct model
    res.json(loans);
  } catch (err) {
    console.error('Error fetching loan history:', err);
    res.status(500).json({ message: 'Error fetching loan history' });
  }
});

// backend/routes/loanRoutes.js
router.get('/name/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const entries = await LoanEntry.find({ user: name }); // ✅ 'user' is the correct field
    res.json(entries);
  } catch (error) {
    console.error('Error fetching loan entries by name:', error);
    res.status(500).json({ message: 'Server error' });
  }
});









module.exports = router;