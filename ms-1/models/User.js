const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  is_active: { type: Boolean, default: true },
  two_factor_secret: { type: String },
  two_factor_enabled: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);