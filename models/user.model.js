const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  githubId: { type: String, unique: true, required: true },
  username: String,
  email: String,
  avatarUrl: String,
  accessToken: String,
  loginTime: Date,
  syncType: { type: String, enum: ['full', 'incremental'], default: 'full' },
  lastSyncTime: Date,
});

const User = mongoose.model('users', userSchema);

module.exports = User;



