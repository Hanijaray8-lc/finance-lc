const mongoose = require('mongoose');

const LoanEntrySchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  loanType: {
    type: String,
    required: true,
    enum: ['Home Loan', 'Car Loan', 'Personal Loan', 'Education Loan']
  },
  loanAmount: {
    type: Number,
    required: true,
    min: 0
  },
  emiAmount: {
    type: Number,
    required: true,
    min: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: {
    type: Date
  },
  companyId: {
    type: String,
    required: true
  },
  entryDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('LoanEntry', LoanEntrySchema);