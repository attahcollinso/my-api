// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String }, // Optional for GitHub OAuth users
  username: { type: String, unique: true }, // Optional unless required manually
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Only set for local signup
  githubId: { type: String }, // Optional for OAuth
  role: { type: String, default: 'user' },
  createdAt: { type: Date, default: Date.now }
});

// Hash password if modified
userSchema.pre('save', async function (next) {
  if (this.isModified('password') && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Password comparison
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
