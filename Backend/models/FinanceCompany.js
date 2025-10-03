const mongoose = require('mongoose');



const financeCompanySchema = new mongoose.Schema({
  firstName:{ type: String, required: true },
password: { type: String, required: true },
  name: { type: String, required: true },
  companyId: { type: String, required: true, unique: true },
  description: String,
  logo: String, // This will store filename or URL after upload
  details: String,
  contactNumber: String,
  email: String,
  financeCompany:String,
  website: String,
   branch: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('FinanceCompany', financeCompanySchema);
