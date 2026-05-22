// Post job page for employers
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PostJob.css';

const PostJob = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    type: 'full-time',
    salary: '',
    company: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!formData.title || !formData.description || !formData.location || !formData.company) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/jobs', formData);
      setSuccess(true);
      
      // Redirect to my jobs page after 2 seconds
      setTimeout(() => {
        navigate('/my-jobs');
      }, 2000);
      
    } catch (error) {
      console.error('Post job error:', error);
      setError(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ padding: '2rem 0' }}>
        <h1 style={{ color: '#2c3e50', marginBottom: '2rem' }}>
          Post a New Job
        </h1>

        <div className="form-container" style={{ maxWidth: '800px' }}>
          {/* Success Message */}
          {success && (
            <div className="alert alert-success">
              <h4>Job Posted Successfully! 🎉</h4>
              <p>Your job posting is now live. Redirecting to your jobs...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit}>
              {/* Job Title */}
              <div className="form-group">
                <label htmlFor="title">Job Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Software Developer, Marketing Manager"
                  required
                />
              </div>

              {/* Company Name */}
              <div className="form-group">
                <label htmlFor="company">Company Name *</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  className="form-control"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                  required
                />
              </div>

              {/* Location and Job Type in a row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                {/* Location */}
                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    className="form-control"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., San Francisco, CA"
                    required
                  />
                </div>

                {/* Job Type */}
                <div className="form-group">
                  <label htmlFor="type">Job Type</label>
                  <select
                    id="type"
                    name="type"
                    className="form-control"
                    value={formData.type}
                    onChange={handleChange}
                    required
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>

              {/* Salary */}
              <div className="form-group">
                <label htmlFor="salary">Salary Range (Optional)</label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  className="form-control"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g., $50,000 - $70,000 per year"
                />
              </div>

              {/* Job Description */}
              <div className="form-group">
                <label htmlFor="description">Job Description *</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  rows="10"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the job responsibilities, requirements, qualifications, and benefits..."
                  required
                />
                <small style={{ color: '#666', fontSize: '0.9rem' }}>
                  Be detailed about the role, requirements, and what you offer
                </small>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-success"
                style={{ width: '100%', fontSize: '1.1rem' }}
                disabled={loading}
              >
                {loading ? 'Posting Job...' : 'Post Job'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostJob;
