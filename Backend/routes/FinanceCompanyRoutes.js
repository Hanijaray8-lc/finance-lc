const express = require('express');
const router = express.Router();
const multer = require('multer');
const FinanceCompany = require('../models/FinanceCompany');
const path = require('path');

const User = require('../models/User');
const LoanApplication = require('../models/LoanApplication');
const Emi = require('../models/Emi');
const Announcement = require('../models/Announcement');
require('dotenv').config();
const twilio = require('twilio');

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN,process.env);



// Multer storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // ensure 'uploads' folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique file name
  }
});

const upload = multer({ storage: storage });

// POST route to register a company
router.post('/', upload.single('logo'), async (req, res) => {
  try {
    const {
      firstName,password,name,   companyId,description, details, contactNumber,
      email,financeCompany, website, branch, products
    } = req.body;

    const newCompany = new FinanceCompany({
      firstName,
      password,
      name,
        companyId,
      description,
      logo: req.file ? req.file.filename : '',
      details,
      contactNumber,
      email,
      financeCompany,
      website,
      branch,
    });

    await newCompany.save();
    res.status(201).json({ message: 'Request send to ManagerPanel' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to register company' });
  }
});


// Example: POST /api/financeCompanies/login
router.post('/login', async (req, res) => {
  const { name, companyId, password } = req.body;

  try {
    const company = await FinanceCompany.findOne({ name, companyId });

    if (!company) return res.status(404).json({ message: 'Company not found' });

    if (company.status !== 'approved') {
      return res.status(403).json({ message: 'Your account is not approved yet.' });
    }

    if (company.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({
      message: 'Login successful',
      companyId: company.companyId, // ✅ Add this line
      company: {
        id: company._id,
        name: company.name,
        email: company.email,
        status: company.status,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/:id', upload.single('logo'), async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.logo = req.file.filename;
    }
    await FinanceCompany.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({ message: 'Company updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Update failed' });
  }
});

// GET all companies (optional for your dashboard)
router.get('/', async (req, res) => {
  try {
    const companies = await FinanceCompany.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch companies' });
  }
});

router.get('/approved', async (req, res) => {
  try {
    const approved = await FinanceCompany.find({ status: 'approved' });
    res.json(approved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch approved companies' });
  }
});
// Approve company
router.put('/:id/approve', async (req, res) => {
  try {
    const company = await FinanceCompany.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Send SMS
    if (company.contactNumber) {
      await client.messages.create({
        body: `Hi ${company.firstName}, your company "${company.name}" has been approved.`,
from: process.env.TWILIO_PHONE,
        to: `+91${company.contactNumber}`
      });
    }

    res.json({ message: 'Company approved successfully', company });
  } catch (err) {
    console.error('Approve route error:', err);
    res.status(500).json({ error: 'Failed to approve company' });
  }
});
// Reject company
router.put('/:id/reject', async (req, res) => {
  try {
    const company = await FinanceCompany.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    // Send SMS
    if (company.contactNumber) {
      await client.messages.create({
        body: `Hi ${company.firstName}, your company "${company.name}" has been rejected.`,
        from: process.env.TWILIO_PHONE,
        to: `+91${company.contactNumber}`
      });
    }

    res.json({ message: 'Company rejected successfully', company });
  } catch (err) {
    console.error('Reject route error:', err);
    res.status(500).json({ error: 'Failed to reject company' });
  }
});

// Get approved & rejected company counts
router.get('/status-counts', async (req, res) => {
  try {
    const approvedCount = await FinanceCompany.countDocuments({ status: 'approved' });
    const rejectedCount = await FinanceCompany.countDocuments({ status: 'rejected' });

    res.json({ approvedCount, rejectedCount });
  } catch (error) {
    console.error('Error fetching company status counts:', error);
    res.status(500).json({ message: 'Failed to fetch company status counts' });
  }
});




// Get approved companies only
router.get('/approved', async (req, res) => {
  try {
    const approved = await FinanceCompany.find({ status: 'approved' });
    res.json(approved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch approved companies' });
  }
});

// GET company by companyId
router.get('/profile/:companyId', async (req, res) => {
  try {
    const company = await FinanceCompany.findOne({ companyId: req.params.companyId });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/count', async (req, res) => {
  try {
    const totalCompanies = await FinanceCompany.countDocuments();
    res.json({ totalCompanies });
  } catch (error) {
    console.error('Error fetching finance company count:', error);
    res.status(500).json({ message: 'Failed to fetch finance company count' });
  }
});




router.get('/dashboard', async (req, res) => {
  try {
    const totalApplications = await LoanApplication.countDocuments();
    const approved = await LoanApplication.countDocuments({ status: 'Approved' });
    const pending = await LoanApplication.countDocuments({ status: 'Pending' });
    const rejected = await LoanApplication.countDocuments({ status: 'Rejected' });
    const totalDisbursedAgg = await LoanApplication.aggregate([
      { $match: { status: 'Approved' } },
      { $group: { _id: null, total: { $sum: "$loanAmount" } } }
    ]);
    const totalDisbursed = totalDisbursedAgg[0]?.total || 0;

    const upcomingEmis = await Emi.countDocuments({ dueDate: { $gte: new Date() } });

    const recentActivities = await LoanApplication.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('userName loanAmount status createdAt')
      .lean();

    const activityList = recentActivities.map(a =>
      `${a.userName} applied for ₹${a.loanAmount} (${a.status}) on ${new Date(a.createdAt).toLocaleDateString()}`
    );

    res.json({
      stats: { totalApplications, approved, pending, rejected, totalDisbursed, upcomingEmis },
      recentActivities: activityList
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Update user name
router.put('/users/:id', async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { name }, { new: true });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Activate / Deactivate user
router.put('/users/:id/status', async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isActive }, { new: true });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});


// Get all loan applications
router.get('/applications', async (req, res) => {
  try {
    const applications = await LoanApplication.find().lean();
    res.json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Update application status
router.put('/applications/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const app = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(app);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});




// Get all EMIs
router.get('/emis', async (req, res) => {
  try {
    const emis = await Emi.find().lean();
    res.json(emis);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Mark EMI as received
router.put('/emis/:id/received', async (req, res) => {
  try {
    const emi = await Emi.findByIdAndUpdate(
      req.params.id,
      { isPaid: true, paidDate: new Date() },
      { new: true }
    );
    res.json(emi);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// GET route to fetch products by company name
router.get('/:companyName', async (req, res) => {
  try {
    const { companyName } = req.params;
    const productData = await Product.findOne({ companyName });

    if (!productData) {
      return res.status(404).json({ error: 'No products found for this company.' });
    }

    res.status(200).json(productData);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all announcements
router.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 }).lean();
    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Post a new announcement
router.post('/announcements', async (req, res) => {
  try {
    const { text } = req.body;
    const newAnnouncement = new Announcement({ text });
    await newAnnouncement.save();
    res.json(newAnnouncement);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// GET company by ID
router.get('/profile/id/:id', async (req, res) => {
  try {
    const company = await FinanceCompany.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    console.error('Error fetching company by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;






