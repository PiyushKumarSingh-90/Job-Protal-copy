// My jobs page for employers to view their posted jobs
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MyJobs.css';

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch employer's jobs when component mounts
  useEffect(() => {
    fetchMyJobs();
  }, []);

  // Function to fetch employer's jobs
  const fetchMyJobs = async () => {
    try {
      const response = await axios.get('/api/jobs/my/posted');
      setJobs(response.data);
    } catch (error) {
      console.error('Fetch my jobs error:', error);
      setError('Failed to load your jobs');
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a job
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/api/jobs/${jobId}`);
      
      // Remove the job from the list
      setJobs(jobs.filter(job => job._id !== jobId));
      
    } catch (error) {
      console.error('Delete job error:', error);
      setError('Failed to delete job');
    }
  };

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your jobs...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div style={{ padding: '2rem 0' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <h1 style={{ color: '#2c3e50', margin: 0 }}>
            My Job Posts
          </h1>
          <Link to="/post-job" className="btn btn-success">
            Post New Job
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Jobs count */}
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          You have posted {jobs.length} job{jobs.length !== 1 ? 's' : ''}
        </p>

        {/* Jobs list */}
        {jobs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>No Jobs Posted Yet</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              Start by posting your first job to attract talented candidates.
            </p>
            <Link to="/post-job" className="btn btn-success">
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <div key={job._id} className="card">
                {/* Job Header */}
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>
                    {job.title}
                  </h3>
                  
                  <p style={{ 
                    color: '#27ae60',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem'
                  }}>
                    {job.company}
                  </p>
                </div>

                {/* Job Details */}
                <div style={{ marginBottom: '1rem' }}>
                  <p style={{ 
                    color: '#666',
                    marginBottom: '0.3rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    📍 {job.location}
                  </p>
                  
                  <p style={{ 
                    color: '#666',
                    marginBottom: '0.3rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    💼 {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
                  </p>
                  
                  {job.salary && (
                    <p style={{ 
                      color: '#666',
                      marginBottom: '0.3rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      💰 {job.salary}
                    </p>
                  )}
                </div>

                {/* Description preview */}
                <p style={{ 
                  color: '#666',
                  marginBottom: '1rem',
                  lineHeight: '1.4'
                }}>
                  {job.description.length > 150 
                    ? `${job.description.substring(0, 150)}...`
                    : job.description
                  }
                </p>

                {/* Post date */}
                <p style={{ 
                  fontSize: '0.9rem',
                  color: '#999',
                  marginBottom: '1rem'
                }}>
                  Posted on {formatDate(job.createdAt)}
                </p>

                {/* Action buttons */}
                <div style={{ 
                  display: 'flex', 
                  gap: '0.5rem',
                  flexWrap: 'wrap'
                }}>
                  <Link 
                    to={`/jobs/${job._id}`}
                    className="btn btn-primary"
                    style={{ flex: '1', minWidth: '120px' }}
                  >
                    View Details
                  </Link>
                  
                  <Link 
                    to={`/applications/${job._id}`}
                    className="btn btn-success"
                    style={{ flex: '1', minWidth: '120px' }}
                  >
                    View Applications
                  </Link>
                  
                  <button
                    onClick={() => handleDeleteJob(job._id)}
                    className="btn btn-danger"
                    style={{ flex: '1', minWidth: '120px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;
