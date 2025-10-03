const express = require('express');
const router = express.Router();
const authenticateUser = require('../Middleware/auth');
const LoanApplication = require('../models/LoanApplication'); // ✅ import loan model
const bcrypt = require('bcryptjs');
const User = require('../models/User');

router.get('/userprofile', authenticateUser, async (req, res) => {
  try {
    const user = req.user;

    // Find the latest loan for the logged-in user
    const loan = await LoanApplication.findOne({ userId: user._id })
      .sort({ createdAt: -1 }); // requires timestamps in schema

    // If loan exists, attach full URLs to file fields
    let loanWithUrls = null;
    if (loan) {
      const baseUrl = `${req.protocol}://${req.get('host')}/uploads/`;
      loanWithUrls = {
        ...loan.toObject(),
        idProof: loan.idProof ? baseUrl + loan.idProof : null,
        addressProof: loan.addressProof ? baseUrl + loan.addressProof : null,
        incomeProof: loan.incomeProof ? baseUrl + loan.incomeProof : null,
        photo: loan.photo ? baseUrl + loan.photo : null,
      };
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      loan: loanWithUrls,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



  


module.exports = router;

