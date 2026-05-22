// Import mongoose for database operations
const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({
  // User's full name
  name: {
    type: String,
    required: true,
    trim: true
  },
  // User's email (must be unique)
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  // Encrypted password
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  // User role: 'jobseeker' or 'employer'
  role: {
    type: String,
    enum: ['jobseeker', 'employer'],
    required: true
  },
  // When the user was created
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export the User model
module.exports = mongoose.model('User', userSchema);
