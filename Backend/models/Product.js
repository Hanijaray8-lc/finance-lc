const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  products: [
    {
      type: { type: String, required: true },
      interestRate: { type: String, required: true },
      minAmount: { type: String, required: true },
      maxAmount: { type: String, required: true },
      tenure: { type: String, required: true },
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
