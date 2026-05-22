// My applications page for job seekers
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './MyApplications.css';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user's applications when component mounts
  useEffect(() => {
    fetchMyApplications();
  }, []);

  // Function to fetch user's applications
  const fetchMyApplications = async () => {
    try {
      const response = await axios.get('/api/applications/my');
      // Filter out any null or invalid applications
      const validApplications = (response.data || []).filter(app => app && app._id);
      setApplications(validApplications);
    } catch (error) {
      console.error('Fetch my applications error:', error);
      setError('Failed to load your applications');
    } finally {
      setLoading(false);
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

  // Get status style class
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'reviewed':
        return 'status-reviewed';
      case 'accepted':
        return 'status-accepted';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  // Get status display text
  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return '⏳ Pending Review';
      case 'reviewed':
        return '👀 Under Review';
      case 'accepted':
        return '✅ Accepted';
      case 'rejected':
        return '❌ Not Selected';
      default:
        return status;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading your applications...</div>
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
            My Applications
          </h1>
          <Link to="/jobs" className="btn btn-primary">
            Browse Jobs
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Applications count */}
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          You have submitted {applications?.length || 0} application{(applications?.length || 0) !== 1 ? 's' : ''}
        </p>

        {/* Applications list */}
        {!applications || applications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
            <h3>{!applications ? 'Loading...' : 'No Applications Yet'}</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              {!applications 
                ? 'Please wait while we load your applications...'
                : 'Start applying to jobs that match your skills and interests.'
              }
            </p>
            {applications && (
              <Link to="/jobs" className="btn btn-primary">
                Browse Available Jobs
              </Link>
            )}
          </div>
        ) : (
          <div className="jobs-grid">
            {applications?.map((application) => {
              // Safety check: skip if application or its _id is missing
              if (!application || !application._id) {
                return null;
              }

              // Safety check: skip if job data is missing
              if (!application.job || !application.job._id) {
                return null;
              }

              return (
                <div key={application._id} className="card">
                  {/* Job Info */}
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ marginBottom: '0.5rem', color: '#2c3e50' }}>
                      <Link 
                        to={`/jobs/${application.job._id}`}
                        style={{ color: '#2c3e50', textDecoration: 'none' }}
                      >
                        {application.job.title || 'Job Title Unavailable'}
                      </Link>
                    </h3>
                    
                    <p style={{ 
                      color: '#27ae60',
                      fontWeight: 'bold',
                      marginBottom: '0.5rem'
                    }}>
                      {application.job.company || 'Company Name Unavailable'}
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
                      📍 {application.job.location || 'Location not specified'}
                    </p>
                    
                    <p style={{ 
                      color: '#666',
                      marginBottom: '0.3rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}>
                      💼 {application.job.type ? (application.job.type.charAt(0).toUpperCase() + application.job.type.slice(1)) : 'Job type not specified'}
                    </p>
                  </div>

                  {/* Application Status */}
                  <div style={{ 
                    marginBottom: '1rem',
                    padding: '0.75rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px'
                  }}>
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <strong>Status:</strong>
                      <span className={getStatusClass(application.status)}>
                        {getStatusText(application.status)}
                      </span>
                    </div>
                    
                    <div style={{ 
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.9rem',
                      color: '#666'
                    }}>
                      <span>Applied on:</span>
                      <span>{application.appliedAt ? formatDate(application.appliedAt) : 'Unknown date'}</span>
                    </div>
                  </div>

                  {/* Cover Letter Preview */}
                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ color: '#2c3e50' }}>Your Cover Letter:</strong>
                    <p style={{ 
                      color: '#666',
                      marginTop: '0.5rem',
                      lineHeight: '1.4',
                      fontStyle: 'italic'
                    }}>
                      "{application.coverLetter ? (
                        application.coverLetter.length > 100 
                          ? `${application.coverLetter.substring(0, 100)}...`
                          : application.coverLetter
                      ) : 'No cover letter provided'}"
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div style={{ 
                    fontSize: '0.9rem',
                    color: '#666',
                    marginBottom: '1rem'
                  }}>
                    <div>📧 {application.email || 'Email not provided'}</div>
                    <div>📱 {application.phone || 'Phone not provided'}</div>
                  </div>

                  {/* Action Button */}
                  <Link 
                    to={`/jobs/${application.job._id}`}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    View Job Details
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer info */}
        {applications && applications.length > 0 && (
          <div style={{ 
            marginTop: '3rem',
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <h4 style={{ color: '#2c3e50', marginTop: 0 }}>📋 Application Status Guide</h4>
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              color: '#666'
            }}>
              <div>
                <span className="status-pending">⏳ Pending:</span><br />
                Your application is waiting to be reviewed
              </div>
              <div>
                <span className="status-reviewed">👀 Under Review:</span><br />
                The employer is reviewing your application
              </div>
              <div>
                <span className="status-accepted">✅ Accepted:</span><br />
                Congratulations! You've been selected
              </div>
              <div>
                <span className="status-rejected">❌ Not Selected:</span><br />
                Keep applying - the right job is waiting!
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
