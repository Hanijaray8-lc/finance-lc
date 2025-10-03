// controllers/financeCompanyController.js

require('dotenv').config();
const twilio = require('twilio');
const FinanceCompany = require('../models/FinanceCompany'); // Adjust path if needed

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE;
const client = twilio(accountSid, authToken);

// Approve Company
exports.approveCompany = async (req, res) => {
  try {
    const company = await FinanceCompany.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true, runValidators: false }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Send approval SMS
    await client.messages.create({
      body: `Hi ${company.firstName}, your company "${company.name}" has been approved.`,
      from: twilioPhone,
      to: `+91${company.contactNumber}`
    });

    res.json({ message: 'Company approved successfully' });
  } catch (err) {
    console.error('Approval error:', err);
    res.status(500).json({ message: 'Approval failed' });
  }
};

// Reject Company
exports.rejectCompany = async (req, res) => {
  try {
    const company = await FinanceCompany.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true, runValidators: false }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Send rejection SMS
    await client.messages.create({
      body: `Hi ${company.firstName}, sorry! Your company "${company.name}" has been rejected.`,
      from: twilioPhone,
      to: `+91${company.contactNumber}`
    });

    res.json({ message: 'Company rejected successfully' });
  } catch (err) {
    console.error('Rejection error:', err);
    res.status(500).json({ message: 'Rejection failed' });
  }
};

