const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
    profilePhoto: String, 
  isActive: { type: Boolean, default: true },
});



module.exports = mongoose.model('User', userSchema);

