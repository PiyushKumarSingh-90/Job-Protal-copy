// Import mongoose for database operations
const mongoose = require('mongoose');

// Define Application schema
const applicationSchema = new mongoose.Schema({
  // Which job this application is for
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  // Who applied for the job
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Applicant's name
  name: {
    type: String,
    required: true,
    trim: true
  },
  // Applicant's email
  email: {
    type: String,
    required: true,
    trim: true
  },
  // Applicant's phone number
  phone: {
    type: String,
    required: true,
    trim: true
  },
  // Cover letter or message
  coverLetter: {
    type: String,
    required: true
  },
  // Resume file path
  resume: {
    type: String,
    required: false // Making it optional to avoid breaking existing applications
  },
  // Application status
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'accepted', 'rejected'],
    default: 'pending'
  },
  // When the application was submitted
  appliedAt: {
    type: Date,
    default: Date.now
  }
});

// Make sure a user can only apply once per job
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

// Export the Application model
module.exports = mongoose.model('Application', applicationSchema);
