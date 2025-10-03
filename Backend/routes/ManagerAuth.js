const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Manager = require('../models/Manager');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

// Register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await Manager.findOne({ email });
    if (exists) return res.status(400).json({ msg: 'Email already registered' });

    const hashedPwd = await bcrypt.hash(password, 10);
    const manager = new Manager({ name, email, password: hashedPwd });
    await manager.save();

    res.status(201).json({ msg: 'Manager registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const manager = await Manager.findOne({ email });
    if (!manager) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, manager.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: manager._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: manager._id, name: manager.name, email: manager.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


router.get('/manager-dashboard', async (req, res) => {
  try {
    const companiesWithCounts = await FinanceCompany.aggregate([
      {
        $lookup: {
          from: 'loanapplications', // collection name in MongoDB
          localField: '_id',
          foreignField: 'companyId', // match field in LoanApplication
          as: 'applications'
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          appliedUsers: {
            $size: { $setUnion: ['$applications.userId', []] } // count unique user IDs
          }
        }
      },
      { $sort: { appliedUsers: -1 } }
    ]);

    // total applied users across all companies
    const totalUsers = companiesWithCounts.reduce((sum, c) => sum + c.appliedUsers, 0);

    res.json({
      totalUsers,
      companies: companiesWithCounts.map(c => ({
        id: c._id,
        name: c.name,
        users: c.appliedUsers
      }))
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
});

// Add these routes to your existing backend code

// Get total users count
router.get('/users/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get total finance companies count
router.get('/companies/count', async (req, res) => {
  try {
    const count = await FinanceCompany.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
