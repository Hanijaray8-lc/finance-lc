const express = require('express');
const router = express.Router();
const LoanApplication = require('../models/LoanApplication');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Ensure uploads folder exists
const fs = require('fs');
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// @route POST /api/loan/apply
router.post('/apply', upload.fields([
  { name: 'idProof' },
  { name: 'addressProof' },
  { name: 'incomeProof' },
  { name: 'photo' },
]), async (req, res) => {
  try {
    
    const {
      name, fatherOrHusbandName, dob, maritalStatus, address, phone, email,
      employmentType, companyName, companyAddress, monthlyIncome, loanAmount,
      loanType, loanTenure, existingLoans, cibilScore, emiNmiRatio,FinancecompanyName,companyId,
    } = req.body;

    const idProof = req.files['idProof'] ? req.files['idProof'][0].filename : null;
    const addressProof = req.files['addressProof'] ? req.files['addressProof'][0].filename : null;
    const incomeProof = req.files['incomeProof'] ? req.files['incomeProof'][0].filename : null;
    const photo = req.files['photo'] ? req.files['photo'][0].filename : null;

    const application = new LoanApplication({
name, fatherOrHusbandName, dob, maritalStatus, address, phone, email,
      employmentType, companyName, companyAddress, monthlyIncome, loanAmount,
      loanType, loanTenure, existingLoans, cibilScore, emiNmiRatio,FinancecompanyName,companyId,
      idProof, addressProof, incomeProof, photo
    });

    await application.save();

    res.json({ message: 'Loan application submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Submission failed', error: err.message });
  }
});
router.get('/company/:companyId', async (req, res) => {
  try {
    const { companyId } = req.params;
    const apps = await LoanApplication.find({ companyId });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch applications', error: err.message });
  }
});

// Application count for a company
router.get('/company/:companyId/application-count', async (req, res) => {
  try {
    const { companyId } = req.params;
    const count = await LoanApplication.countDocuments({ companyId });
    res.json({ companyId, applicationCount: count });
  } catch (error) {
    console.error('Error fetching application count:', error);
    res.status(500).json({ message: 'Failed to fetch application count' });
  }
});




// Get all applicant names
router.get('/applicants', async (req, res) => {
  try {
    const applicants = await LoanApplication.find({}, 'name'); // Only fetch the 'name' field
    res.json(applicants);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ message: 'Error fetching applicants' });
  }
});

// Enhanced route to get loan data by user name and companyId
router.get('/applicant-loan/:companyId/:name', async (req, res) => {
  const { companyId, name } = req.params;

  try {
    // Case-insensitive search and exact match for name
    const latestLoan = await LoanApplication.findOne({ 
      companyId,
      name: { $regex: new RegExp(`^${name}$`, 'i') }
    })
    .sort({ createdAt: -1 })
    .select('loanType loanAmount loanTenure'); // Only return necessary fields

    if (!latestLoan) {
      return res.status(404).json({ 
        success: false,
        message: 'No loan application found for this user' 
      });
    }

    res.json({
      success: true,
      data: {
        loanType: latestLoan.loanType,
        loanAmount: latestLoan.loanAmount,
        loanTenure: latestLoan.loanTenure
      }
    });
  } catch (err) {
    console.error('Error fetching loan info:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching loan info',
      error: err.message 
    });
  }
});

// ✅ Route: Get loan data by user name and companyId
router.get('/applicant-loan/:companyId/:name', async (req, res) => {
  const { companyId, name } = req.params;

  try {
    const latestLoan = await LoanApplication.findOne({ companyId, name })
      .sort({ createdAt: -1 }); // Get latest if multiple

    if (!latestLoan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    res.json({
      loanType: latestLoan.loanType,
      loanAmount: latestLoan.loanAmount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching loan info' });
  }
});







// @route GET /api/loan/all
// @desc Get all loan applications for admin
router.get('/all', async (req, res) => {
  try {
    const applications = await LoanApplication.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch loan applications', error: err.message });
  }
});

// @route GET /api/loan/finance-companies
// @desc Get unique finance company names
router.get('/finance-companies', async (req, res) => {
  try {
    const companies = await LoanApplication.distinct('FinancecompanyName');
    res.json(companies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch finance companies', error: err.message });
  }
});

// @route GET /api/loan/loan-types
// @desc Get unique loan types
router.get('/loan-types', async (req, res) => {
  try {
    const types = await LoanApplication.distinct('loanType');
    res.json(types);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch loan types', error: err.message });
  }
});

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// @route PUT /api/loan/updateStatus/:id
// @desc Update status (approve/reject) of a loan application with email notification
router.put('/updateStatus/:id', async (req, res) => {
  try {
    const { status, message } = req.body;
    const application = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { status, statusMessage: message },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: application.email,
      subject: `Your Loan Application Status - ${status}`,
      html: `
        <h2>Dear ${application.name},</h2>
        <p>Your loan application with reference ID ${application._id} has been <strong>${status}</strong>.</p>
        ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
        <p>Thank you for using our services.</p>
        <p>Best regards,<br>${application.FinancecompanyName || 'Loan Team'}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: `Application ${status} and notification sent`, updated: application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update status', error: err.message });
  }
});

router.post('/update', upload.fields([
  { name: 'idProof' },
  { name: 'addressProof' },
  { name: 'incomeProof' },
  { name: 'photo' },
]), async (req, res) => {
  try {
    const {
      name, fatherOrHusbandName, dob, maritalStatus, address, phone, email,
      employmentType, companyName, companyAddress, monthlyIncome, loanAmount,
      loanType, loanTenure, existingLoans, cibilScore, emiNmiRatio, FinancecompanyName, companyId,
    } = req.body;

    // Find the existing application by email
    let application = await LoanApplication.findOne({ email });
    
    if (!application) {
      return res.status(404).json({ message: 'Loan application not found for this email' });
    }

    // Update fields
    application.name = name || application.name;
    application.fatherOrHusbandName = fatherOrHusbandName || application.fatherOrHusbandName;
    application.dob = dob || application.dob;
    application.maritalStatus = maritalStatus || application.maritalStatus;
    application.address = address || application.address;
    application.phone = phone || application.phone;
    application.email = email || application.email;
    application.employmentType = employmentType || application.employmentType;
    application.companyName = companyName || application.companyName;
    application.companyAddress = companyAddress || application.companyAddress;
    application.monthlyIncome = monthlyIncome || application.monthlyIncome;
    application.loanAmount = loanAmount || application.loanAmount;
    application.loanType = loanType || application.loanType;
    application.loanTenure = loanTenure || application.loanTenure;
    application.existingLoans = existingLoans || application.existingLoans;
    application.cibilScore = cibilScore || application.cibilScore;
    application.emiNmiRatio = emiNmiRatio || application.emiNmiRatio;
    application.FinancecompanyName = FinancecompanyName || application.FinancecompanyName;
    application.companyId = companyId || application.companyId;

    // Update files only if new ones are uploaded
    if (req.files['idProof']) {
      application.idProof = req.files['idProof'][0].filename;
    }
    if (req.files['addressProof']) {
      application.addressProof = req.files['addressProof'][0].filename;
    }
    if (req.files['incomeProof']) {
      application.incomeProof = req.files['incomeProof'][0].filename;
    }
    if (req.files['photo']) {
      application.photo = req.files['photo'][0].filename;
    }

    application.updatedAt = Date.now();

    await application.save();

    res.json({ message: 'Loan application updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
});




module.exports = router;
