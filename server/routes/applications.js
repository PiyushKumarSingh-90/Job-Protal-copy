// Import required packages
const express = require('express');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const Application = require('../models/Application');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to accept only PDF, DOC, and DOCX files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.pdf', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Create router
const router = express.Router();

// Test route for debugging authentication
router.get('/test', auth, async (req, res) => {
  try {
    res.json({
      message: 'Authentication working',
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Test failed', error: error.message });
  }
});

// Apply for a job (job seekers only)
router.post('/', auth, upload.single('resume'), async (req, res) => {
  try {
    // Check if user is a job seeker
    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({ message: 'Only job seekers can apply for jobs' });
    }

    const { jobId, name, email, phone, coverLetter } = req.body;
    
    // Debug logging
    console.log('=== Application Request Debug ===');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);
    console.log('User from token:', req.user ? { id: req.user._id, role: req.user.role } : 'No user');
    console.log('JobId received:', jobId, 'Type:', typeof jobId);
    console.log('JobId length:', jobId ? jobId.length : 'undefined');
    console.log('JobId as string:', JSON.stringify(jobId));

    // Validate jobId
    if (!jobId) {
      return res.status(400).json({ message: 'Job ID is required' });
    }

    // Check if jobId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({ message: 'Invalid Job ID format' });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    console.log('Job found:', job ? `Yes - ${job.title}` : 'No');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user already applied for this job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Create new application
    const applicationData = {
      job: jobId,
      applicant: req.user._id,
      name,
      email,
      phone,
      coverLetter
    };

    // Add resume path if file was uploaded
    if (req.file) {
      applicationData.resume = req.file.path;
      console.log('Resume uploaded:', req.file.path); // Log resume path
    }

    const application = new Application(applicationData);

    // Save application to database
    await application.save();

    // Get application with job details
    const populatedApplication = await Application.findById(application._id)
      .populate('job', 'title company')
      .populate('applicant', 'name email');

    res.status(201).json({
      message: 'Application submitted successfully',
      application: populatedApplication
    });

  } catch (error) {
    console.error('Apply for job error:', error);
    
    // Handle multer errors
    if (error.message === 'Only PDF, DOC, and DOCX files are allowed') {
      return res.status(400).json({ message: error.message });
    }
    
    // Handle mongoose CastError (invalid ObjectId)
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid Job ID format' });
    }
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ 
      message: 'Server error while applying for job',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get applications for a specific job (employers only)
router.get('/job/:jobId', auth, async (req, res) => {
  try {
    // Check if user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can view applications' });
    }

    const jobId = req.params.jobId;

    // Check if job exists and belongs to this employer
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only view applications for your own jobs' });
    }

    // Get all applications for this job
    const applications = await Application.find({ job: jobId })
      .populate('applicant', 'name email')
      .populate('job', 'title company')
      .sort({ appliedAt: -1 });

    res.json(applications);

  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Server error while fetching applications' });
  }
});

// Get all applications by current user (job seekers)
router.get('/my', auth, async (req, res) => {
  try {
    // Check if user is a job seeker
    if (req.user.role !== 'jobseeker') {
      return res.status(403).json({ message: 'Only job seekers can view their applications' });
    }

    // Get all applications by this user
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location type')
      .sort({ appliedAt: -1 });

    res.json(applications);

  } catch (error) {
    console.error('Get my applications error:', error);
    res.status(500).json({ message: 'Server error while fetching your applications' });
  }
});

// Update application status (employers only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    // Check if user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can update application status' });
    }

    const { status } = req.body;
    const applicationId = req.params.id;

    // Find the application
    const application = await Application.findById(applicationId)
      .populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if this employer owns the job
    if (application.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update applications for your own jobs' });
    }

    // Update status
    application.status = status;
    await application.save();

    // Get updated application with all details
    const updatedApplication = await Application.findById(applicationId)
      .populate('job', 'title company')
      .populate('applicant', 'name email');

    res.json({
      message: 'Application status updated successfully',
      application: updatedApplication
    });

  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error while updating application status' });
  }
});

// Get single application details
router.get('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job', 'title company location type')
      .populate('applicant', 'name email');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Check if user has permission to view this application
    const isApplicant = application.applicant._id.toString() === req.user._id.toString();
    const isJobOwner = req.user.role === 'employer' && 
                      application.job.employer && 
                      application.job.employer.toString() === req.user._id.toString();

    if (!isApplicant && !isJobOwner) {
      return res.status(403).json({ message: 'You do not have permission to view this application' });
    }

    res.json(application);

  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({ message: 'Server error while fetching application' });
  }
});

// Export router
module.exports = router;
