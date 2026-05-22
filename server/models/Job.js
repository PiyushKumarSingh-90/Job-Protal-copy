// Import mongoose for database operations
const mongoose = require('mongoose');

// Define Job schema
const jobSchema = new mongoose.Schema({
  // Job title
  title: {
    type: String,
    required: true,
    trim: true
  },
  // Job description
  description: {
    type: String,
    required: true
  },
  // Job location
  location: {
    type: String,
    required: true,
    trim: true
  },
  // Job type (full-time, part-time, contract, etc.)
  type: {
    type: String,
    required: true,
    enum: ['full-time', 'part-time', 'contract', 'internship']
  },
  // Salary range (optional)
  salary: {
    type: String,
    trim: true
  },
  // Who posted this job (reference to User model)
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Company name
  company: {
    type: String,
    required: true,
    trim: true
  },
  // Job requirements (skills, qualifications, etc.)
  requirements: [{
    type: String,
    trim: true
  }],
  // When the job was posted
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Export the Job model
module.exports = mongoose.model('Job', jobSchema);
