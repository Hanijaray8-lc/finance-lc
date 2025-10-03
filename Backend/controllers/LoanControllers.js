const nodemailer = require('nodemailer');

// Configure email transporter (using Gmail as example)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Update status function with email notification
exports.updateStatus = async (req, res) => {
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

    res.json({ message: `Application ${status} and notification sent` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};