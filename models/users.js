const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  securityQuestion: {
    type: String,
    required: true,
    enum: ['What is your birth place?', 'What code can you remember?', 'What is your childhood friend\'s name?']
  },
  securityAnswer: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);