// Import required packages
const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');

// Create router
const router = express.Router();

// Get all jobs (public route)
router.get('/', async (req, res) => {
  try {
    // Get all jobs and populate employer info
    const jobs = await Job.find()
      .populate('employer', 'name email')
      .sort({ createdAt: -1 }); // Show newest jobs first

    res.json(jobs);
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
});

// Get single job by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'name email');
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error while fetching job' });
  }
});

// Create new job (employers only)
router.post('/', auth, async (req, res) => {
  try {
    // Check if user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can post jobs' });
    }

    const { title, description, location, type, salary, company } = req.body;

    // Create new job
    const job = new Job({
      title,
      description,
      location,
      type,
      salary,
      company,
      employer: req.user._id
    });

    // Save job to database
    await job.save();

    // Get job with employer info
    const populatedJob = await Job.findById(job._id)
      .populate('employer', 'name email');

    res.status(201).json({
      message: 'Job posted successfully',
      job: populatedJob
    });

  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error while creating job' });
  }
});

// Get jobs posted by current employer
router.get('/my/posted', auth, async (req, res) => {
  try {
    // Check if user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can access this route' });
    }

    // Get jobs posted by this employer
    const jobs = await Job.find({ employer: req.user._id })
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({ message: 'Server error while fetching your jobs' });
  }
});

// Update job (employer only, for their own jobs)
router.put('/:id', auth, async (req, res) => {
  try {
    // Check if user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can update jobs' });
    }

    // Find the job
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if this employer owns the job
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own jobs' });
    }

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('employer', 'name email');

    res.json({
      message: 'Job updated successfully',
      job: updatedJob
    });

  } catch (error) {
    console.error('Update job error:', error);
    res.status(500).json({ message: 'Server error while updating job' });
  }
});

// Delete job (employer only, for their own jobs)
router.delete('/:id', auth, async (req, res) => {
  try {
    // Check if user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can delete jobs' });
    }

    // Find the job
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if this employer owns the job
    if (job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own jobs' });
    }

    // Delete job
    await Job.findByIdAndDelete(req.params.id);

    res.json({ message: 'Job deleted successfully' });

  } catch (error) {
    console.error('Delete job error:', error);
    res.status(500).json({ message: 'Server error while deleting job' });
  }
});

// Export router
module.exports = router;
