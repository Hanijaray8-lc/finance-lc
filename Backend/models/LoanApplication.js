const mongoose = require('mongoose');

const loanApplicationSchema = new mongoose.Schema({
  name: String,
  fatherOrHusbandName: String,
  dob: Date,
  maritalStatus: String,
  address: String,
  phone: String,
  email: String,
  employmentType: String,
  companyName: String,
  companyAddress: String,
  monthlyIncome: Number,
  loanAmount: Number,
  loanType: String,
  loanTenure: Number,
  existingLoans: String,
  cibilScore: Number,
  emiNmiRatio: Number,
  FinancecompanyName: String,
  companyId: Number,
  idProof: String,
  addressProof: String,
  incomeProof: String,
  photo: String,

  // ✅ NEW FIELDS
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  statusUpdatedAt: {
    type: Date,
  },
  updatedBy: {
    type: String, // can be admin name or ID
  },

}, { timestamps: true });

module.exports = mongoose.model('LoanApplication', loanApplicationSchema);

