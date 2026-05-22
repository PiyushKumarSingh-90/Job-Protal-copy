// Job details and application page
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './JobDetails.css';

const JobDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated, hasRole } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    coverLetter: '',
    resume: null
  });
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  // Fetch job details when component mounts
  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setApplicationData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  // Function to fetch job details
  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`/api/jobs/${id}`);
      setJob(response.data);
    } catch (error) {
      console.error('Fetch job details error:', error);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  // Handle application form input changes
  const handleApplicationChange = (e) => {
    if (e.target.name === 'resume') {
      setApplicationData({
        ...applicationData,
        resume: e.target.files[0]
      });
    } else {
      setApplicationData({
        ...applicationData,
        [e.target.name]: e.target.value
      });
    }
  };

  // Handle job application submission
  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    setApplicationLoading(true);
    setError('');

    try {
      // Ensure job is loaded
      if (!job || !job._id) {
        setError('Job information is not available. Please refresh the page.');
        setApplicationLoading(false);
        return;
      }

      // Additional validation - ensure job._id is a valid MongoDB ObjectId format
      const objectIdRegex = /^[0-9a-fA-F]{24}$/;
      if (!objectIdRegex.test(job._id)) {
        setError('Invalid job ID format. Please try refreshing the page.');
        setApplicationLoading(false);
        return;
      }

      // Validate resume file if provided
      if (applicationData.resume) {
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(applicationData.resume.type)) {
          setError('Please upload a PDF, DOC, or DOCX file for your resume.');
          setApplicationLoading(false);
          return;
        }
      }

      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append('jobId', job._id);
      formData.append('name', applicationData.name);
      formData.append('email', applicationData.email);
      formData.append('phone', applicationData.phone);
      formData.append('coverLetter', applicationData.coverLetter);
      
      // Debug logging
      console.log('=== Application Submission Debug ===');
      console.log('Job ID from URL params:', id);
      console.log('Job object loaded:', job);
      console.log('Job._id being sent:', job._id);
      console.log('Job._id type:', typeof job._id);
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? `FILE: ${value.name}` : value);
      }
      
      // Add resume file if selected
      if (applicationData.resume) {
        formData.append('resume', applicationData.resume);
        console.log('Resume file:', applicationData.resume.name);
      }

      // Get token from localStorage for authentication
      const token = localStorage.getItem('token');
      
      const response = await axios.post('/api/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      setApplicationSuccess(true);
      setShowApplicationForm(false);
    } catch (error) {
      console.error('Application error:', error);
      setError(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplicationLoading(false);
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading job details...</div>
      </div>
    );
  }

  // Error state
  if (error && !job) {
    return (
      <div className="container">
        <div className="alert alert-error" style={{ marginTop: '2rem' }}>
          {error}
        </div>
        <Link to="/jobs" className="btn btn-secondary">
          ← Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ padding: '2rem 0' }}>
        {/* Back Button */}
        <Link to="/jobs" className="btn btn-secondary" style={{ marginBottom: '2rem' }}>
          ← Back to Jobs
        </Link>

        {/* Job Details Card */}
        {job ? (
          <div className="card">
            {/* Job Header */}
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
                {job.title}
              </h1>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '1rem'
            }}>
              <div>
                <strong>Company:</strong>
                <p style={{ margin: '0.5rem 0', color: '#27ae60', fontWeight: 'bold' }}>
                  {job.company}
                </p>
              </div>
              
              <div>
                <strong>Location:</strong>
                <p style={{ margin: '0.5rem 0', color: '#666' }}>
                  📍 {job.location}
                </p>
              </div>
              
              <div>
                <strong>Job Type:</strong>
                <p style={{ margin: '0.5rem 0', color: '#666' }}>
                  💼 {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                </p>
              </div>
              
              {job.salary && (
                <div>
                  <strong>Salary:</strong>
                  <p style={{ margin: '0.5rem 0', color: '#666' }}>
                    💰 {job.salary}
                  </p>
                </div>
              )}
            </div>

            <p style={{ color: '#999', fontSize: '0.9rem' }}>
              Posted on {formatDate(job.createdAt)}
              {job.employer && (
                <span> by {job.employer.name}</span>
              )}
            </p>
          </div>

          {/* Job Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
              Job Description
            </h3>
            <div style={{ 
              lineHeight: '1.6', 
              color: '#444',
              whiteSpace: 'pre-wrap'
            }}>
              {job.description}
            </div>
          </div>

          {/* Application Section */}
          {isAuthenticated() ? (
            hasRole('jobseeker') ? (
              <div>
                {applicationSuccess ? (
                  <div className="alert alert-success">
                    <h4>Application Submitted Successfully! 🎉</h4>
                    <p>Your application has been sent to the employer. You can track its status in your applications page.</p>
                    <Link to="/my-applications" className="btn btn-primary">
                      View My Applications
                    </Link>
                  </div>
                ) : (
                  <>
                    {error && (
                      <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                        {error}
                      </div>
                    )}
                    
                    {!showApplicationForm ? (
                      <button
                        onClick={() => setShowApplicationForm(true)}
                        className="btn btn-success"
                        style={{ fontSize: '1.1rem' }}
                        disabled={!job || !job._id}
                      >
                        Apply for This Job
                      </button>
                    ) : (
                      <div>
                        <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>
                          Apply for {job.title}
                        </h3>
                        
                        <form onSubmit={handleApplicationSubmit}>
                          <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              className="form-control"
                              value={applicationData.name}
                              onChange={handleApplicationChange}
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              className="form-control"
                              value={applicationData.email}
                              onChange={handleApplicationChange}
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                              type="tel"
                              id="phone"
                              name="phone"
                              className="form-control"
                              value={applicationData.phone}
                              onChange={handleApplicationChange}
                              placeholder="Enter your phone number"
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="coverLetter">Cover Letter</label>
                            <textarea
                              id="coverLetter"
                              name="coverLetter"
                              className="form-control"
                              rows="6"
                              value={applicationData.coverLetter}
                              onChange={handleApplicationChange}
                              placeholder="Tell us why you're perfect for this job..."
                              required
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="resume">Resume (PDF, DOC, DOCX)</label>
                            <input
                              type="file"
                              id="resume"
                              name="resume"
                              className="form-control"
                              accept=".pdf,.doc,.docx"
                              onChange={handleApplicationChange}
                            />
                            <small style={{ color: '#666', fontSize: '0.875rem' }}>
                              Upload your resume in PDF, DOC, or DOCX format (max 5MB)
                            </small>
                          </div>

                          <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                              type="submit"
                              className="btn btn-success"
                              disabled={applicationLoading}
                            >
                              {applicationLoading ? 'Submitting...' : 'Submit Application'}
                            </button>
                            
                            <button
                              type="button"
                              onClick={() => setShowApplicationForm(false)}
                              className="btn btn-secondary"
                              disabled={applicationLoading}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="alert alert-error">
                <p>Only job seekers can apply for jobs. You are logged in as an employer.</p>
              </div>
            )
          ) : (
            <div>
              <Link to="/login" className="btn btn-primary">
                Login to Apply
              </Link>
            </div>
          )}
        </div>
        ) : (
          <div className="alert alert-error">
            <p>Job not found or still loading...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
