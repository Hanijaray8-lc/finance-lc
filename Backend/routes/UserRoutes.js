const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const authenticateUser = require('../Middleware/auth');
const LoanApplication = require('../models/LoanApplication');



// Set storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});
const upload = multer({ storage });

router.post('/register', upload.single('profilePhoto'), async (req, res) => {
  const { name, email, password } = req.body;
  const profilePhoto = req.file ? req.file.filename : null; // only save filename or path

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const newUser = new User({
      name,
      email,
      password,
      profilePhoto, // save the photo
    });

    await newUser.save();
    res.json({ message: 'Registration successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

{/*router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Find user by email or name
    const user = await User.findOne({
      $or: [{ email: identifier }, { name: identifier }]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password (plain text comparison here, ideally hash in production)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token if needed
    const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1d' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email,  profilePhoto: user.profilePhoto  }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});*/}

router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Find user by email or name
    const user = await User.findOne({
      $or: [{ email: identifier }, { name: identifier }]
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ 
        message: 'Your account is inactive. Please contact management.' 
      });
    }

    // Check password (plain text comparison here, ideally hash in production)
    if (user.password !== password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token if needed
    const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1d' });

    res.json({
      message: 'Login successful',
      token,
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,  
        profilePhoto: user.profilePhoto 
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin fetch users route
router.get('/admin/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fetching users failed' });
  }
});

// Update user name
router.put('/admin/users/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { name: req.body.name });
    res.json({ message: 'User updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Update failed' });
  }
});

// Activate/Deactivate user
router.put('/admin/users/:id/status', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: 'Status updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Status update failed' });
  }
});

router.delete('/admin/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error while deleting user' });
  }
});

// Get total users count
router.get('/admin/users/count', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    res.json({ totalUsers });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ message: 'Failed to fetch user count' });
  }
});


router.get('/userprofile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Try to find loan by userId first, then by name if not found
    let loan = await LoanApplication.findOne({ userId: req.user._id });
    
    if (!loan) {
      loan = await LoanApplication.findOne({ name: user.name });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePhoto: user.profilePhoto || null
      },
      loan: loan || null
    });
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/edituserprofile', authenticateUser, upload.single('profilePhoto'), async (req, res) => {
  try {
    const { name, email } = req.body;
    const updateData = { name, email };
    if (req.file) {
      updateData.profilePhoto = req.file.filename;
    }
    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select('-password');
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Store password AS-IS (DANGEROUS!)
    user.password = newPassword; // No hashing
    await user.save();

    res.status(200).json({ message: 'Password updated (stored as plain text)' });
  } catch (err) {
    res.status(500).json({ message: 'Reset failed' });
  }
});




// Get EMIs for user
router.get('/emis/:userName', async (req, res) => {
  try {
    const emis = await EMI.find({ userName: req.params.userName });
    res.json(emis);
  } catch (error) {
    console.error('Error fetching user EMIs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Pay EMI
router.put('/emis/:id/pay', async (req, res) => {
  try {
    const emi = await EMI.findById(req.params.id);
    if (!emi) {
      return res.status(404).json({ error: 'EMI not found' });
    }

    emi.isPaid = true;
    emi.paidDate = new Date();

    await emi.save();
    res.json({ message: 'EMI payment successful' });
  } catch (error) {
    console.error('Error paying EMI:', error);
    res.status(500).json({ error: 'Server error' });
  }
});




module.exports = router;
