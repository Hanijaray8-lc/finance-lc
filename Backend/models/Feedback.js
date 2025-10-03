// models/Feedback.js

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  date: { type: Date, default: Date.now },
});

const feedbackSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FinanceCompany', // if your company model is named FinanceCompany
    required: true,
  },
  name: String,
    FinancecompanyName: String,
  rating: Number,
  comment: String,
likes: {
  type: [String],
  default: []
},
  replies: [
    {
      text: String,
      date: Date,
    },
  ],
    comments: [commentSchema],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Feedback', feedbackSchema);



