const express = require('express');
const router = express.Router();
const EMI = require('../models/Emi');

// Get all EMIs
router.get('/emis', async (req, res) => {
  try {
    const emis = await EMI.find().sort({ dueDate: 1 });
    res.json(emis);
  } catch (error) {
    console.error('Error fetching EMIs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new EMI
   router.post('/emis', async (req, res) => {
  try {
    const { userName, loanType, amount, dueDate, companyName } = req.body;

    const newEmi = new EMI({
      userName,
      loanType,
      amount,
      dueDate,
      companyName, // Include companyName here
    });

    await newEmi.save();
    res.json({ message: 'EMI added successfully' });
  } catch (error) {
    console.error('Error adding EMI:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// Mark EMI as received
router.put('/emis/:id/received', async (req, res) => {
  try {
    const emi = await EMI.findById(req.params.id);
    if (!emi) {
      return res.status(404).json({ error: 'EMI not found' });
    }

    emi.isPaid = true;
    emi.paidDate = new Date();

    await emi.save();
    res.json({ message: 'EMI marked as received' });
  } catch (error) {
    console.error('Error updating EMI status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


// GET all companies (for dropdown)
router.get('/', async (req, res) => {
  try {
    const companies = await FinanceCompany.find({}, 'name'); // only fetch name field
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch companies' });
  }
});



module.exports = router;
