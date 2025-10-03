const mongoose = require('mongoose');

const emiSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  loanType: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  companyName: {type:String,
    required:true},

  isPaid: {
    type: Boolean,
    default: false,
  },
  paidDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('EMI', emiSchema);

